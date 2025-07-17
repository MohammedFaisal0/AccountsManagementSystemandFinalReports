from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import requests # Import requests library for HTTP calls
from reading_Excel import read_accounts_from_excel, excel_to_json
from dics_of_ExcelCells import reading_first_sheet
import traceback
import datetime
import pandas as pd # Import pandas for get_directorate_name

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create temporary upload directory
UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# URL for the Next.js API endpoint to receive processed data
NEXTJS_API_URL = os.getenv("NEXTJS_API_URL", "http://localhost:3000/api/data/process") # Default for local development

# Sheet mapping dictionary
MONTHS_SHEET_MAPPING = {
    "1": {
        1: 2,
        2: 3
    },
    "2": {
        1: 5,
        2: 6
    },
    "3": {
        1: 8,
        2: 9
    },
    "4": {
        1: 11,
        2: 12
    },
    "5": {
        1: 14,
        2: 15
    },
    "6": {
        1: 17,
        2: 18
    },
    "7": {
        1: 20,
        2: 21
    },
    "8": {
        1: 23,
        2: 24
    },
    "9": {
        1: 26,
        2: 27
    },
    "10": {
        1: 29,
        2: 30
    },
    "11": {
        1: 32,
        2: 33
    },
    "12": {
        1: 35,
        2: 36
    }
}

# Helper function to get directorate name from Excel file
def get_directorate_name(file_path):
    try:
        # Read the first sheet of the Excel file
        df = pd.read_excel(file_path, sheet_name=0, header=None, engine='openpyxl')
        # Assuming directorate name is in cell (1, 2) based on 10.xlsx
        # Adjust row and column for 0-based indexing
        directorate = df.iloc[1, 2] # Row 2, Column 3 (C2)
        return str(directorate).replace('مديرية:', '').strip()
    except Exception as e:
        print(f"Error extracting directorate name: {e}")
        return None

@app.post("/process-excel/")
async def process_excel(
    file: UploadFile = File(...),
    sheet_number: int = Form(1),
    month: str = Form(None)
):
    try:
        print(f"[DEBUG] Received month: {month} (type: {type(month)}) sheet_number: {sheet_number} (type: {type(sheet_number)})")
        print(f"[DEBUG] Available month keys: {list(MONTHS_SHEET_MAPPING.keys())}")
        print(f"[DEBUG] Month in mapping: {month in MONTHS_SHEET_MAPPING}")
        
        # Validate file extension
        if not file.filename.endswith((".xlsx", ".xls")):
            raise HTTPException(
                status_code=400,
                detail="File must be an Excel file (.xlsx or .xls)"
            )

        # Validate month and sheet number
        if not month or month not in MONTHS_SHEET_MAPPING:
            print(f"[ERROR] Invalid month received: {month}")
            print(f"[ERROR] Month type: {type(month)}")
            print(f"[ERROR] Available months: {list(MONTHS_SHEET_MAPPING.keys())}")
            raise HTTPException(
                status_code=400,
                detail="Invalid month. Must be between 1 and 12"
            )

        if sheet_number not in [1, 2]:
            print(f"[ERROR] Invalid sheet_number received: {sheet_number}")
            raise HTTPException(
                status_code=400,
                detail="Invalid sheet number. Must be 1 or 2"
            )

        # Get the actual sheet index from the mapping
        actual_sheet_index = MONTHS_SHEET_MAPPING[month][sheet_number]

        # Save file temporarily
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        # Extract directorate name and year from the Excel file
        directorate_name = get_directorate_name(file_path)
        current_year = datetime.datetime.now().year # Assuming current year for now
        
        processed_data = None
        if sheet_number == 1:
            # For sheet 1, reading_first_sheet returns the hierarchical structure
            processed_data = reading_first_sheet(
                 excel_file_path=file_path,
                 sheet_num=actual_sheet_index
            )
        else: # sheet_number == 2
            # For sheet 2, read_accounts_from_excel returns financial accounts data
            processed_data = read_accounts_from_excel(
                file_path=file_path,
                sheet_name=actual_sheet_index
            )

        # Prepare data to send to Next.js API
        payload = {
            "file_name": file.filename,
            "month": month,
            "year": str(current_year),
            "directorate_name": directorate_name,
            "sheet_number_processed": sheet_number,
            "processed_data": processed_data
        }

        # Send data to Next.js API
        response = requests.post(NEXTJS_API_URL, json=payload)
        response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)

        return {
            "status": "success",
            "message": "File processed and data sent to Next.js API successfully",
            "sheet_number": sheet_number,
            "month": month,
            "actual_sheet_index": actual_sheet_index,
            "data_sent": payload # Optionally return the payload sent
        }

    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Failed to send data to Next.js API: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send data to Next.js API: {str(e)}"
        )
    except Exception as e:
        print("[EXCEPTION] Exception occurred in /process-excel endpoint:")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )
    # finally:
    #     if os.path.exists(file_path):
    #         os.remove(file_path)

# Health check endpoint
@app.get("/")
def read_root():
    return {"status": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


