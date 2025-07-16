from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import os
from reading_Excel import read_accounts_from_excel
from dics_of_ExcelCells import reading_first_sheet
# from dics_of_ExcelCells import excel_to_json
import traceback

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

        try:
            # Process based on sheet number
            if sheet_number == 1:
                json_data = reading_first_sheet(
                     excel_file_path=file_path,
                     sheet_num=actual_sheet_index
                )
                result = {
                    "json_data": json_data,
                }
            else:
                result = read_accounts_from_excel(
                    file_path=file_path,
                    sheet_name=actual_sheet_index
                )

            return {
                "status": "success",
                "sheet_number": sheet_number,
                "month": month,
                "actual_sheet_index": actual_sheet_index,
                "data": result
            }

        finally:
            if os.path.exists(file_path):
                os.remove(file_path)

    except Exception as e:
        print("[EXCEPTION] Exception occurred in /process-excel endpoint:")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )

# Health check endpoint
@app.get("/")
def read_root():
    return {"status": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)