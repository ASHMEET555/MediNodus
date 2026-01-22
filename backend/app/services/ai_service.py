from transformers import pipeline
from PIL import Image
import torch


def initialize_model():
    model_id = "unsloth/medgemma-1.5-4b-it-unsloth-bnb-4bit"
    pipe = pipeline(
    "image-text-to-text",
    model=model_id,
    dtype=torch.bfloat16,
    )

    return pipe

def analyze_medicine_image(pipe, image)-> str:
    
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image", "image": image},
                {
                    "type": "text",
                    "text": """Analyze this medicine image.
                    Extract the following in JSON format:
                    - drug_name
                    - strength
                    - indications
                    - prescription_drug (Yes/No)
                    """
                }
            ]
        }
    ]
    print("Request sent...")
    output = pipe(text=messages, max_new_tokens=2000)
    print("Response received")
    return output[0]["generated_text"][-1]["content"]


def analyse_medicine_effects(pipe, medical_history, medicine_info) -> str:    
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": medical_history },
                {"type": "text", "text": medicine_info},
                {
                    "type": "text",
                    "text": """Analyze this medicine and patient history to tell any warings,precautions, or side effects that can happen
                    """
                }
            ]
        }
    ]
    print("Request sent...")
    output = pipe(text=messages, max_new_tokens=2000)
    print("Response received")
    return output[0]["generated_text"][-1]["content"]


def analyse_report(pipe, report):
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image", "image": report},
                {"type": "text", "text" :"""You are a helpful medical API. Analyze the image and return a valid JSON object.
    
    Rules:
    1. Extract 'patient_name' and 'report_date'.
    2. 'summary': Write a polite, 2-sentence summary for the patient (e.g., "Your blood count shows low iron levels.").
    3. 'abnormalities': List ONLY test results that are marked High or Low. Ignore normal results.
    4. 'recommendations': Provide 3 simple, patient-friendly health tips based on the abnormalities.
    5. ONLY return the json response nothing else
    
    Output Format (Strict JSON):
    {
      "patient_name": "string",
      "report_date": "string",
      "patient_summary": "string",
      "abnormalities": [
        {"test": "string", "value": "string", "status": "High/Low"}
      ],
      "recommendations": ["string", "string", "string"]
    }
    """
            }]}]


    print("Request sent...")
    output = pipe(text=messages, max_new_tokens=2000)
    print("Response received")
    return output[0]["generated_text"][-1]["content"]

import json
import re

def clean_and_parse_json(raw_text):
    # 1. Regex to find the JSON block { ... }
    # This ignores everything before the first '{' (the thought process)
    # and everything after the last '}'
    match = re.search(r"(\{.*\})", raw_text, re.DOTALL)
    
    if match:
        json_str = match.group(1)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            print("Found JSON brackets, but content was invalid.")
            return None
    else:
        print("No JSON object found in output.")
        return None

