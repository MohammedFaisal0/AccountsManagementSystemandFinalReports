import pandas as pd
import json

def get_excel_cell_value(file_path, sheet_name, cell_row, cell_col):
    """
    ترجع قيمة الخلية المطلوبة من ملف الإكسل (وليس اسم العمود)
    """
    try:
        df = pd.read_excel(
            file_path,
            engine='openpyxl',
            sheet_name=sheet_name,
            keep_default_na=False,
            dtype=str
        ).fillna('')
        if cell_row < df.shape[0] and cell_col < df.shape[1]:
            return df.iat[cell_row, cell_col]
        else:
            return ""
    except Exception as e:
        print(f"❌ خطأ: {str(e)}")
        return ""

def excel_to_json(file_path, sheet_name, orient='records', preview_rows=321,
                 cell_row=None, cell_col=None):
    try:
        df = pd.read_excel(
            file_path,
            engine='openpyxl',
            sheet_name=sheet_name,
            keep_default_na=False,
            dtype=str
        ).fillna('')
        json_data = df.to_json(orient=orient, force_ascii=False, indent=4)
        col_name = None
        cell_value = None
        if cell_row is not None and cell_col is not None:
            try:
                cell_value = df.iat[cell_row, cell_col]
                col_name = df.columns[cell_col]
                print(f"اسم العمود: '{col_name}'")
            except IndexError:
                print(f"❌ خطأ: المؤشر خارج النطاق")
        return cell_value, col_name
    except Exception as e:
        print(f"❌ خطأ: {str(e)}")
        return None, None 

def get_column_names(file_path):
    df = pd.read_excel(
        file_path,
        engine='openpyxl',
        sheet_name=2,  # الورقة الثانية (Sheet 2) لأن الترقيم يبدأ من 0
        keep_default_na=False,
        dtype=str
    )
    office_col_name = df.columns[0]   # اسم العمود الأول
    directorate_col_name = df.columns[7]  # اسم العمود الثامن
    return office_col_name, directorate_col_name 