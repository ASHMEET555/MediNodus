# main.py (or router file)
from fastapi import UploadFile, File, Depends, HTTPException, APIRouter
from PIL import Image
import json, re, io
from datetime import datetime
from pydantic import ValidationError
from app.schemas import MedicineAIResponse, MedicalHistory
from app.services.auth_service import AuthService
from app.services.image_service import save_image
from app.services.ai_service import analyze_medicine_image, analyze_medicine_effects, analyze_report
from backend.app.models.history_entry import AppHistoryEntry
from backend.app.models.medical_record import MedicalHistoryRecord
from app.services.fda_service import FDAService
from pdf2image import convert_from_bytes
router = APIRouter(prefix="/med", tags=["Med"])


# ---- HELPER --------------
async def get_medical_history(user_id: str) -> str:
    """
    Fetches the user's medical profile (Allergies, Conditions, Meds) 
    to provide context for the AI.
    """
    record = await MedicalHistoryRecord.find_one(MedicalHistoryRecord.user_id == user_id)
    
    if not record:
        return "Patient has no known medical history."

    # Build a context string
    context_parts = []
    if record.allergy:
        context_parts.append(f"Allergies: {record.allergy}")
    if record.chronic_condition:
        context_parts.append(f"Chronic Conditions: {record.chronic_condition}")
    if record.current_medication:
        context_parts.append(f"Current Medications: {record.current_medication}")
    
    if not context_parts:
        return "Patient has no known medical history."
        
    return ". ".join(context_parts)


async def save_record(image_ref: str, current_user, response_data: dict, record_type: str):
    """
    Creates a history entry and links it to the user's MedicalHistoryRecord.
    """
    # 1. Create and Save the Entry Document
    new_entry = AppHistoryEntry(
        image_ref=image_ref,
        date=datetime.utcnow(),
        type=record_type,
        response=response_data
    )
    await new_entry.save()

    # 2. Find the User's Record (or create one if it doesn't exist)
    record = await MedicalHistoryRecord.find_one(MedicalHistoryRecord.user_id == str(current_user.id))
    
    if not record:
        record = MedicalHistoryRecord(
            user_id=str(current_user.id),
            email=current_user.email
        )
        await record.insert()

    # 3. Append the new entry to the history list
    # Beanie handles the linking if your list is defined correctly in the model
    if record.history is None:
        record.history = []
        
    record.history.append(new_entry)
    await record.save()

# ------------------ HELPER ---------------------
def convert_pdf_to_long_image(pdf_bytes: bytes) -> Image.Image:
    """
    Converts a multi-page PDF into a single vertical image.
    """
    # 1. Convert all pages to images (images is a list of PIL Images)
    images = convert_from_bytes(pdf_bytes)

    if not images:
        raise ValueError("PDF contains no pages")

    # 2. Calculate dimensions for the final stitched image
    #    Width = max width of any page
    #    Height = sum of all page heights
    max_width = max(img.width for img in images)
    total_height = sum(img.height for img in images)

    # 3. Create a blank canvas
    stitched_image = Image.new("RGB", (max_width, total_height), (255, 255, 255))

    # 4. Paste images one by one
    current_y = 0
    for img in images:
        # If page width is smaller than max, we center it or align left (default left)
        stitched_image.paste(img, (0, current_y))
        current_y += img.height

    return stitched_image

# ------------------- MEDICINE -------------------------

@router.post("/upload-medicine-image")
async def upload_medical_image(
    image: UploadFile = File(...),
    current_user = Depends(AuthService.get_current_user)
):

    # 1️⃣ Read & store image
    image_bytes = await image.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")


    def parse_medicine_ai_response(raw_text: str) -> dict:
        try:
            # 1. Regex to find the JSON block { ... }
            # This ignores everything before the first '{' (the thought process)
            # and everything after the last '}'
            match = re.search(r"(\{.*\})", raw_text, re.DOTALL)
    
            if match:
                data = json.loads(raw_text)
                validated = MedicineAIResponse(**data)
                print(raw_text)
                return validated.dict()

        except (json.JSONDecodeError, ValidationError):
            # Fallback (never crash backend)
            return {
                "drug_name" : "UNKNOWN",
                "strength" : "UNKNOWN",
                "indications" : "UNKNOWN",
                "prescription_drug" : "UNKNOWN"}
        
    # 2️⃣ Run AI pipeline
    medicine_details = await analyze_medicine_image(image)
    parsed_response = parse_medicine_ai_response(medicine_details)
    drug_name = parsed_response["drug_name"]

    if not drug_name or drug_name == "Unknown":
        return {
            "status": "failure",
            "message": "Could not read image",
        }

    fda_entry = {}
    print("    Querying OpenFDA...")
    fda_entry = await FDAService.get_drug_details(drug_name)

    medical_history = get_medical_history()
    medicine_full_info = str(fda_entry) + str(medicine_details)
    response = analyze_medicine_effects(medicine_full_info, medical_history)

    image_ref = await save_image(image_bytes, image.filename,str(current_user.id))
    await save_record(image_ref, current_user, response, "med")

    return {
        "status": "success",
        "message": response
    }


# ------------------ REPORT ---------------------

@router.post("/upload-medical-report-image")
async def upload_medical_image(
image: UploadFile = File(...),
    current_user = Depends(AuthService.get_current_user)
):
    # 1️⃣ Read & store image
    image_bytes = await image.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")


    def parse_response(raw_text: str) -> dict:
        try:
            # 1. Regex to find the JSON block { ... }
            # This ignores everything before the first '{' (the thought process)
            # and everything after the last '}'
            match = re.search(r"(\{.*\})", raw_text, re.DOTALL)
    
            if match:
                data = json.loads(raw_text)
                validated = MedicineAIResponse(**data)
                print(raw_text) 
                return {
                    "status": "success",
                    "message": validated.dict()
                    }

        except (json.JSONDecodeError, ValidationError):
            # Fallback (never crash backend)
            return {
            "status": "failure",
            "message": "Could not read image",
            }

        
    # 2️⃣ Run AI pipeline
    response = await analyze_report(image)
    cleaned_response = parse_response(response)
    image_ref = await save_image(image_bytes, image.filename,str(current_user.id))
    await save_record(image_ref, current_user, response, "med")    
    return cleaned_response

   
@router.post("/upload-medical-report-pdf")
# ------------------ ENDPOINT ---------------------
@router.post("/upload-medical-report-pdf")
async def upload_medical_report_pdf(
    file: UploadFile = File(...),
    current_user = Depends(AuthService.get_current_user)
):
    # 1. Validation
    if file.content_type != "application/pdf":
        return {"status": "failure", "message": "File must be a PDF"}

    # 2. Read bytes & Convert to Image
    file_bytes = await file.read()
    
    try:
        # Stitch pages into one long image
        image = convert_pdf_to_long_image(file_bytes)
    except Exception as e:
        print(f"PDF Conversion Failed: {e}")
        return {"status": "failure", "message": "Could not process PDF file."}

    # 3. Define the Parsing Logic (Same as your Image Endpoint)
    def parse_response(raw_text: str) -> dict:
        try:
            match = re.search(r"(\{.*\})", raw_text, re.DOTALL)
            if match:
                data = json.loads(match.group(1))
                validated = MedicineAIResponse(**data)
                return {
                    "status": "success",
                    "message": validated.dict()
                }
        except (json.JSONDecodeError, ValidationError):
            return {
                "status": "failure", 
                "message": "AI could not structure the PDF data"
            }

    # 4. Run existing AI pipeline with the converted image
    #    (Reusing the logic from your image endpoint)
    response_text = await analyze_report(image)
    cleaned_response = parse_response(response_text)
    
    # 5. Save Record
    #    Note: We save the *original* PDF bytes if you want to keep the file,
    #    but usually, we save the image ref. 
    #    To keep it simple, we save the converted image to storage so it can be displayed.
    
    # Convert PIL image back to bytes for storage
    output_buffer = io.BytesIO()
    image.save(output_buffer, format="JPEG")
    image_bytes = output_buffer.getvalue()
    
    image_ref = await save_image(image_bytes, file.filename.replace(".pdf", ".jpg"), str(current_user.id))
    
    # Use the save helper we created earlier
    await save_record(image_ref, current_user, cleaned_response, "report")
    
    return cleaned_response

# -------------------- CONTEXT -------------------
@router.post("/infoupdate", response_model=MedicalHistory)
async def upsert_medical_report(
    data: MedicalHistory,
    current_user = Depends(AuthService.get_current_user)
):
    report = await MedicalHistoryRecord.find_one(
        MedicalHistoryRecord.user_id == str(current_user.id)
    )

    if report:
        if data.allergy is not None:
            report.allergy = data.allergy
        if data.current_medication is not None:
            report.current_medication = data.current_medication
        if data.chronic_condition is not None:
            report.chronic_condition = data.chronic_condition

        await report.save()
    else:
        report = MedicalHistoryRecord(
            user_id=str(current_user.id),
            email=current_user.email,
            allergy=data.allergy,
            current_medication=data.current_medication,
            chronic_condition=data.chronic_condition

        )
        await report.insert()

    return {"result" : "updated medical info"}


@router.get("/infoget", response_model=MedicalHistory)
async def get_medical_report(
    current_user = Depends(AuthService.get_current_user)
):
    report = await MedicalHistoryRecord.find_one(
        MedicalHistoryRecord.user_id == str(current_user.id)
    )

    if not report:
        raise HTTPException(status_code=404, detail="Medical report not found")

    return {
        "allergy": report.allergy,
        "current_medication": report.current_medication,
        "chronic_condition" : report.chronic_condition
    }
