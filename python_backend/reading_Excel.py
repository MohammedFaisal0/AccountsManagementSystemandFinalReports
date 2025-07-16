import pandas as pd
import json
from dic_of_accounts import financial_accounts

# Dictionary mapping (row, col) to type_id
ROW_COL_TO_TYPE = {
    (6,7): '1_1111', (7,7): '1_1112', (8,7): '1_1113', (9,7): '1_1114', (10,7): '1_1115',
    (11,7): '1_1116', (12,7): '1_1117', (13,7): '1_1118', (14,7): '1_1119', (17,7): '1_1214',
    (18,7): '1_1215', (20,7): '1_1231', (21,7): '1_1232', (24,7): '1_1311', (27,7): '1_1431',
    (28,7): '1_1432', (29,7): '1_1433', (32,7): '1_1514', (34,7): '1_1531', (35,7): '1_1532',
    (36,7): '1_1534', (38,7): '1_1542', (39,7): '1_1543', (40,7): '1_1544', (41,7): '1_15410',
    (42,7): '1_15411', (43,7): '1_15412', (44,7): '1_15413', (45,7): '1_15415', (56,7): '1_2311',
    (57,7): '1_2312', (58,7): '1_2313', (60,7): '1_2321', (61,7): '1_2322', (62,7): '1_2323',
    (63,7): '1_2324', (64,7): '1_2325', (69,7): '1_31411', (70,7): '1_31412', (71,7): '1_31413',
    (72,7): '1_31414', (75,7): '1_3211', (76,7): '1_3216', (79,7): '1_3221', (80,7): '1_3222',
    (81,7): '1_3223', (82,7): '1_3225', (83,7): '1_3227', (84,7): '1_3228', (85,7): '1_3229',
    (86,7): '1_32211', (87,7): '1_32212', (88,7): '1_32213', (93,7): '1_32215', (94,7): '1_32216',
    (95,7): '1_32217', (96,7): '1_32218', (97,7): '1_32219', (98,7): '1_32220', (99,7): '1_32221',
    (101,7): '1_3231', (102,7): '1_3232', (103,7): '1_3235', (104,7): '1_3237', (105,7): '1_3238',
    (106,7): '1_32310', (107,7): '1_32311', (108,7): '1_32312', (109,7): '1_32313', (110,7): '1_32314',
    (111,7): '1_32315', (112,7): '1_32316', (113,7): '1_32317', (114,7): '1_32318', (115,7): '1_32319',
    (116,7): '1_32320', (117,7): '1_32321', (118,7): '1_32322', (119,7): '1_32323', (122,7): '1_3311',
    (124,7): '1_3321', (125,7): '1_3324', (128,7): '1_3411', (129,7): '1_3412', (131,7): '1_3421',
    (132,7): '1_3422', (135,7): '1_3512', (136,7): '1_3513', (137,7): '1_3514', (138,7): '1_3515',
    (146,7): '1_4111', (147,7): '1_4112', (148,7): '1_4113', (150,7): '1_4121', (151,7): '1_4122',
    (152,7): '1_4123', (154,7): '1_4131', (155,7): '1_4132', (156,7): '1_4133', (159,7): '1_4311',
    (160,7): '1_4312', (161,7): '1_4313', (162,7): '1_4314', (163,7): '1_4315',#مراجع وصحيح
    (179,7): '2_1111', (181,7): '2_1123', (183,7): '2_1131', (184,7): '2_1132', (186,7): '2_1141',
    (187,7): '2_1142', (188,7): '2_1143', (189,7): '2_1144', (190,7): '2_1145', (194,7): '2_1211',
    (195,7): '2_1212', (197,7): '2_1221', (198,7): '2_1222', (200,7): '2_1231', (201,7): '2_1232',
    (206,7): '2_2111', (207,7): '2_2112', (209,7): '2_2121', (211,7): '2_2131', (212,7): '2_2132',
    (214,7): '2_2141', (215,7): '2_2142', (216,7): '2_2143', (217,7): '2_2144', (223,7): '2_2151',
    (224,7): '2_2152', (225,7): '2_2153', (227,7): '2_2161', (228,7): '2_2162', (229,7): '2_2163',
    (231,7): '2_2171', (232,7): '2_2172', (233,7): '2_2173', (235,7): '2_2181', (236,7): '2_2182',
    (237,7): '2_2183', (240,7): '2_2211', (241,7): '2_2212', (242,7): '2_2213', (244,7): '2_2221',
    (245,7): '2_2222', (246,7): '2_2223', (248,7): '2_2231', (251,7): '2_2411', (252,7): '2_2412',
    (253,7): '2_2413', (255,7): '2_2421', (256,7): '2_2422', (258,7): '2_2431', (259,7): '2_2432',
    (260,7): '2_2433', (263,7): '2_2511', (264,7): '2_2512', (272,7): '2_3322', (273,7): '2_3323',
    (274,7): '2_3324', (275,7): '2_3325', (277,7): '2_3331', (278,7): '2_3332', (279,7): '2_3333',
    (280,7): '2_3334', (283,7): '2_3411', (284,7): '2_3412', (288,7): '2_3462', (297,7): '2_4111',
    (298,7): '2_4112', (299,7): '2_4113', (301,7): '2_4121', (302,7): '2_4122', (303,7): '2_4123',
    (305,7): '2_4131', (306,7): '2_4132', (307,7): '2_4133', (310,7): '2_4311', (311,7): '2_4312',
    (312,7): '2_4313', (313,7): '2_4314', (314,7): '2_4315'
}

def excel_to_json(file_path, sheet_name, orient='records', preview_rows=321, 
                 start_row=None, end_row=None, start_col=6, end_col=7,
                 cell_row=None, cell_col=None, find_spaces=False):
    """
    نسخة معدلة للعمل خارج Jupyter (بدون استخدام display و Markdown)
    """
    try:
        # قراءة ملف الإكسل
        df = pd.read_excel(
            file_path,
            engine='openpyxl',
            sheet_name=sheet_name,
            keep_default_na=False,
            dtype=str
        ).fillna('')
        
        # Extract type values from column 6
        type_values = {}
        for (row, col), type_id in ROW_COL_TO_TYPE.items():
            # Adjust for 0-based indexing in pandas
            row_idx = row - 1
            col_idx = col - 1
            if row_idx < len(df) and col_idx < len(df.columns):
                value = df.iat[row_idx, col_idx]
                if value:  # Only add non-empty values
                    type_values[type_id] = value

        # التحويل إلى JSON
        json_data = df.to_json(orient=orient, force_ascii=False, indent=4)
        
        print("🎉 تم التحويل بنجاح!")
        
        # Print extracted values in a consistent format
        print("\n=== القيم المستخرجة ===")
        for type_id, value in type_values.items():
            print(f"{type_id}: {value}")

        # #البحث عن المسافات
        # if find_spaces:
        #     space_cells = []
        #     for row_idx in range(len(df)):
        #         for col_idx in range(len(df.columns)):
        #             cell_value = str(df.iat[row_idx, col_idx])
        #             if any(char.isspace() for char in cell_value):
        #                 space_cells.append({
        #                     'row': row_idx,
        #                     'col': col_idx,
        #                     'col_name': df.columns[col_idx],
        #                     'value': repr(cell_value)
        #                 })
            
        #     if space_cells:
        #         print("\n🔍 الخلايا التي تحتوي على مسافات:")
        #         print(pd.DataFrame(space_cells).to_string(index=False))
        #     else:
        #         print("\n✅ لا توجد خلايا تحتوي على مسافات")
        
        # # عرض خلية محددة
        # elif cell_row is not None and cell_col is not None:
        #     try:
        #         cell_value = df.iat[cell_row, cell_col]
        #         print(f"""
        #         🎯 الخلية المحددة:
        #         - الموقع: الصف {cell_row+1} (الفهرس {cell_row})، العمود {cell_col+1} (الفهرس {cell_col})
        #         - اسم العمود: '{df.columns[cell_col]}'
        #         - القيمة: '{cell_value}'
        #         """)
        #     except IndexError:
        #         print(f"❌ خطأ: مؤشر خارج النطاق (الحد الأقصى: {len(df)-1} صفوف، {len(df.columns)-1} أعمدة)")
        
        # # عرض نطاق محدد
        # elif any(param is not None for param in [start_row, end_row, start_col, end_col]):
        #     start_row = 0 if start_row is None else start_row
        #     end_row = len(df) if end_row is None else end_row
        #     start_col = 0 if start_col is None else start_col
        #     end_col = len(df.columns) if end_col is None else end_col
            
        #     subset = df.iloc[start_row:end_row, start_col:end_col]
        #     print(f"\n🔍 الجزء المحدد (الصفوف {start_row}-{end_row-1}, الأعمدة {start_col}-{end_col-1}):")
        #     print(subset.to_string())
        
        # # العرض العادي
        # else:
        #     print(f"\n📊 عرض أول {preview_rows} صفوف:")
        #     print(df.head(preview_rows).to_string())
        
        return json_data, df, type_values
    
    except Exception as e:
        print(f"❌ خطأ: {str(e)}")
        return None, None, None

def read_accounts_from_excel(file_path, sheet_name=0):
    """
    Read Excel file and extract values based on the coordinates in financial_accounts dictionary
    """
    try:
        # Read Excel file using pandas
        df = pd.read_excel(file_path, sheet_name=sheet_name, header=None, engine='openpyxl')
        
        # Create a new dictionary with the same structure but with actual values
        result_dict = {}
        
        # Iterate through the dictionary structure
        for main_category, sub_categories in financial_accounts.items():
            result_dict[main_category] = {}
            
            for sub_category, accounts in sub_categories.items():
                result_dict[main_category][sub_category] = {}
                
                # Get debit and credit values from Excel using the coordinates
                debit_col, debit_row = accounts['debit']
                credit_col, credit_row = accounts['credit']
                
                # Excel coordinates are 0-based, so we subtract 1 from the provided coordinates
                debit_value = df.iloc[debit_row - 1, debit_col - 1]
                credit_value = df.iloc[credit_row - 1, credit_col - 1]
                
                # Store the actual values
                result_dict[main_category][sub_category] = {
                    'debit': float(debit_value) if pd.notna(debit_value) else 0.0,
                    'credit': float(credit_value) if pd.notna(credit_value) else 0.0
                }
        
        return result_dict
    
    except Exception as e:
        print(f"Error reading accounts from Excel file: {str(e)}")
        return None

def test_accounts_extraction(excel_path, sheet_name=0):
    """
    Test function to demonstrate accounts data extraction and print formatted results
    """
    print("\n📊 Testing Accounts Data Extraction...")
    print(f"📑 Excel File: {excel_path}")
    print(f"📋 Sheet Name: {sheet_name}")
    print("-" * 80)

    accounts_result = read_accounts_from_excel(excel_path, sheet_name=sheet_name)
    
    if accounts_result:
        total_debit = 0
        total_credit = 0
        
        for main_category, sub_categories in accounts_result.items():
            print(f"\n🔷 {main_category}")
            category_debit = 0
            category_credit = 0
            
            for sub_category, values in sub_categories.items():
                debit = values['debit']
                credit = values['credit']
                category_debit += debit
                category_credit += credit
                
                print(f"  └─ {sub_category}")
                print(f"     ├─ Debit:  {debit:,.2f}")
                print(f"     └─ Credit: {credit:,.2f}")
            
            print(f"  📊 Category Totals:")
            print(f"     ├─ Total Debit:  {category_debit:,.2f}")
            print(f"     └─ Total Credit: {category_credit:,.2f}")
            
            total_debit += category_debit
            total_credit += category_credit
        
        print("\n" + "=" * 80)
        print("📈 Grand Totals:")
        print(f"   ├─ Total Debit:  {total_debit:,.2f}")
        print(f"   └─ Total Credit: {total_credit:,.2f}")
        print("=" * 80)
        
        return accounts_result
    else:
        print("❌ Failed to extract accounts data")
        return None

# def main():
#     # Example usage
#     excel_path = r'C:\Users\AHMD\Desktop\3_3.xlsx'  # Can be either .xls or .xlsx
    
#     # Test accounts extraction
#     # test_accounts_extraction(excel_path, sheet_name=3)
#     excel_to_json(file_path=excel_path,sheet_name=2)

# if __name__ == "__main__":
#     main()