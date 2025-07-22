from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import requests # Import requests library for HTTP calls
from reading_Excel import read_accounts_from_excel, excel_to_json
from dics_of_ExcelCells import reading_first_sheet
import traceback
import datetime
import pandas as pd # Import pandas for get_directorate_name
<<<<<<< HEAD
from dotenv import load_dotenv
from excel_names_demo import excel_to_json, get_column_names

load_dotenv()  # تحميل متغيرات البيئة من ملف .env إذا كان موجودًا
=======
>>>>>>> 26f7151a6157a6da86b03e552ea5e0f359171f6d

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
<<<<<<< HEAD
        # First, validate that the file exists and is readable
        if not os.path.exists(file_path):
            print(f"Error: File does not exist: {file_path}")
            return None
            
        # Check file size
        file_size = os.path.getsize(file_path)
        if file_size == 0:
            print(f"Error: File is empty: {file_path}")
            return None
            
        # Try to read the Excel file with better error handling
        try:
            # Read the first sheet of the Excel file
            df = pd.read_excel(file_path, sheet_name=0, header=None, engine='openpyxl')
            
            # Check if dataframe is empty
            if df.empty:
                print(f"Error: Excel file is empty or has no data: {file_path}")
                return None
                
            # Assuming directorate name is in cell (1, 2) based on 10.xlsx
            # Adjust row and column for 0-based indexing
            if len(df) > 1 and len(df.columns) > 2:
                directorate = df.iloc[1, 2] # Row 2, Column 3 (C2)
                if pd.notna(directorate) and str(directorate).strip():
                    return str(directorate).replace('مديرية:', '').strip()
                else:
                    print(f"Warning: Directorate cell is empty or NaN")
                    return "مديرية غير محددة"
            else:
                print(f"Error: Excel file doesn't have enough rows/columns: {file_path}")
                return None
                
        except Exception as excel_error:
            print(f"Error reading Excel file with openpyxl: {excel_error}")
            
            # Try alternative approach with xlrd for older Excel files
            try:
                df = pd.read_excel(file_path, sheet_name=0, header=None, engine='xlrd')
                if len(df) > 1 and len(df.columns) > 2:
                    directorate = df.iloc[1, 2]
                    if pd.notna(directorate) and str(directorate).strip():
                        return str(directorate).replace('مديرية:', '').strip()
            except Exception as xlrd_error:
                print(f"Error reading Excel file with xlrd: {xlrd_error}")
                
            return "مديرية غير محددة"
            
    except Exception as e:
        print(f"Error extracting directorate name: {e}")
        return "مديرية غير محددة"
=======
        # Read the first sheet of the Excel file
        df = pd.read_excel(file_path, sheet_name=0, header=None, engine='openpyxl')
        # Assuming directorate name is in cell (1, 2) based on 10.xlsx
        # Adjust row and column for 0-based indexing
        directorate = df.iloc[1, 2] # Row 2, Column 3 (C2)
        return str(directorate).replace('مديرية:', '').strip()
    except Exception as e:
        print(f"Error extracting directorate name: {e}")
        return None
>>>>>>> 26f7151a6157a6da86b03e552ea5e0f359171f6d

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
        print(f"[DEBUG] File name: {file.filename}")
        print(f"[DEBUG] File content type: {file.content_type}")
        
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
        
        # Read file content first to validate
        file_content = await file.read()
        
        # Check if file is empty
        if len(file_content) == 0:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty"
            )
            
        # Save file to disk
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
            
        print(f"[DEBUG] File saved to: {file_path}")
        print(f"[DEBUG] File size: {len(file_content)} bytes")

<<<<<<< HEAD
        # Validate Excel file integrity before processing
        try:
            import pandas as pd
            # Try to read the file to check if it's valid
            test_df = pd.read_excel(file_path, sheet_name=0, header=None, engine='openpyxl')
            print(f"[DEBUG] File validation successful. Shape: {test_df.shape}")
        except Exception as validation_error:
            print(f"[ERROR] File validation failed: {validation_error}")
            # Clean up the invalid file
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(
                status_code=400,
                detail=f"Invalid Excel file. The file appears to be corrupted or not a valid Excel file. Error: {str(validation_error)}"
            )

        # Extract directorate name and year from the Excel file
        directorate_name = get_directorate_name(file_path)
        current_year = datetime.datetime.now().year # Assuming current year for now
        
        processed_data = None
        office_col = None
        directorate_col = None
        if sheet_number == 1:
            result = reading_first_sheet(
                 excel_file_path=file_path,
                 sheet_num=actual_sheet_index
            )
            processed_data = result
        else: # sheet_number == 2
            processed_data = read_accounts_from_excel(
                file_path=file_path,
                sheet_name=actual_sheet_index
            )
        # استخراج اسم العمود للمكتب والمديرية من الورقة الثانية (Sheet 2)
        office_col, directorate_col = get_column_names(file_path)
        # Validate processed data
        if processed_data is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to process Excel file. Please check if the file format is correct."
            )
        # Prepare data to send to Next.js API
        payload = {
            "file_name": file.filename,
            "month": month,
            "year": str(current_year),
            "office_name": office_col,
            "directorate_name": directorate_col,
            "sheet_number_processed": sheet_number,
            "processed_data": processed_data
        }
        # Send data to Next.js API
        response = requests.post(NEXTJS_API_URL, json=payload)
        response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)
=======
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

>>>>>>> 26f7151a6157a6da86b03e552ea5e0f359171f6d
        return {
            "status": "success",
            "message": "File processed and data sent to Next.js API successfully",
            "sheet_number": sheet_number,
            "month": month,
            "actual_sheet_index": actual_sheet_index,
<<<<<<< HEAD
            "office_name": office_col,
            "directorate_name": directorate_col,
=======
>>>>>>> 26f7151a6157a6da86b03e552ea5e0f359171f6d
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
<<<<<<< HEAD
    finally:
        # Clean up temporary file
        if 'file_path' in locals() and os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"[DEBUG] Temporary file removed: {file_path}")
            except Exception as cleanup_error:
                print(f"[WARNING] Failed to remove temporary file: {cleanup_error}")
=======
    # finally:
    #     if os.path.exists(file_path):
    #         os.remove(file_path)
>>>>>>> 26f7151a6157a6da86b03e552ea5e0f359171f6d

# Health check endpoint
@app.get("/")
def read_root():
    return {"status": "API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


