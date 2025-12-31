from typing import Optional, Dict, Any
from beanie import Document
from pydantic import BaseModel
from datetime import datetime

class MedicalReport(Document):
    user_id: str
    filename: str
    upload_date: datetime = datetime.now()
    
    # Stores the raw text extracted by PaddleOCR
    raw_ocr_text: Optional[str] = None
    
    # Stores the clean JSON explanation from Gemini
    analysis_result: Optional[Dict[str, Any]] = None

    class Settings:
        name = "medical_reports"