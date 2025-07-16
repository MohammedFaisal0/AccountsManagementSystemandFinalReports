class HierarchicalDictionaries:
    def __init__(self):
        self.chapters = {}  # {chapter_id: {'id': str, 'value': str}}
        self.sections = {}  # {section_id: {'id': str, 'value': str}}
        self.items = {}     # {item_id: {'id': str, 'value': str}}
        self.types = {}     # {type_id: {'id': str, 'value': str}}
    
    def initialize_structure(self, 
                           chapter_ids: list, 
                           section_ids: list, 
                           item_ids: list, 
                           type_ids: list):
        """تهيئة القواميس بمعرفات فارغة"""
        # 1. تهيئة قاموس الأنواع
        for type_id in type_ids:
            self.types[type_id] = {'id': type_id, 'value': ''}
        
        # 2. تهيئة قاموس البنود (مع ربطها بالأنواع)
        for item_id in item_ids:
            self.items[item_id] = {'id': item_id, 'value': '', 'type_ids': []}
        
        # 3. تهيئة قاموس الفصول (مع ربطها بالبنود)
        for section_id in section_ids:
            self.sections[section_id] = {'id': section_id, 'value': '', 'item_ids': []}
        
        # 4. تهيئة قاموس الأبواب (مع ربطها بالفصول)
        for chapter_id in chapter_ids:
            self.chapters[chapter_id] = {'id': chapter_id, 'value': '', 'section_ids': []}
    
    def link_hierarchy(self, 
                      type_to_item: dict, 
                      item_to_section: dict, 
                      section_to_chapter: dict):
        """ربط العناصر الهرمية ببعضها"""
        # 1. ربط الأنواع بالبنود
        for item_id, linked_type_ids in type_to_item.items():
            if item_id in self.items:
                self.items[item_id]['type_ids'] = linked_type_ids
        
        # 2. ربط البنود بالفصول
        for section_id, linked_item_ids in item_to_section.items():
            if section_id in self.sections:
                self.sections[section_id]['item_ids'] = linked_item_ids
        
        # 3. ربط الفصول بالأبواب
        for chapter_id, linked_section_ids in section_to_chapter.items():
            if chapter_id in self.chapters:
                self.chapters[chapter_id]['section_ids'] = linked_section_ids
    
    def calculate_item_value(self, item_id):
        """Calculate item value based on its types"""
        if item_id not in self.items:
            return 0
        
        type_ids = self.items[item_id]['type_ids']
        total = 0
        for type_id in type_ids:
            if type_id in self.types:
                try:
                    value = float(self.types[type_id]['value']) if self.types[type_id]['value'] else 0
                    total += value
                except ValueError:
                    # Handle non-numeric values
                    continue
        return total

    def calculate_section_value(self, section_id):
        """Calculate section value based on its items"""
        if section_id not in self.sections:
            return 0
        
        item_ids = self.sections[section_id]['item_ids']
        total = 0
        for item_id in item_ids:
            if item_id in self.items:
                try:
                    value = float(self.items[item_id]['value']) if self.items[item_id]['value'] else 0
                    total += value
                except ValueError:
                    continue
        return total

    def calculate_chapter_value(self, chapter_id):
        """Calculate chapter value based on its sections"""
        if chapter_id not in self.chapters:
            return 0
        
        section_ids = self.chapters[chapter_id]['section_ids']
        total = 0
        for section_id in section_ids:
            if section_id in self.sections:
                try:
                    value = float(self.sections[section_id]['value']) if self.sections[section_id]['value'] else 0
                    total += value
                except ValueError:
                    continue
        return total

    def propagate_values(self):
        """Propagate values up the hierarchy from types to chapters"""
        # Calculate items values from types
        for item_id in self.items:
            value = self.calculate_item_value(item_id)
            self.items[item_id]['value'] = str(value)
        
        # Calculate sections values from items
        for section_id in self.sections:
            value = self.calculate_section_value(section_id)
            self.sections[section_id]['value'] = str(value)
        
        # Calculate chapters values from sections
        for chapter_id in self.chapters:
            value = self.calculate_chapter_value(chapter_id)
            self.chapters[chapter_id]['value'] = str(value)

    def update_values(self, value_dict: dict, dict_type: str):
        """تحديث القيم في القاموس المحدد"""
        target_dict = getattr(self, dict_type, None)
        if not target_dict:
            raise ValueError(f"نوع القاموس غير صحيح: {dict_type}")
        
        for item_id, value in value_dict.items():
            if item_id in target_dict:
                target_dict[item_id]['value'] = value
        
        # Propagate values up the hierarchy after updating
        if dict_type == 'types':
            self.propagate_values()
    
    def get_dict(self, dict_type: str) -> dict:
        """استرجاع قاموس محدد"""
        return getattr(self, dict_type, {})
    
    def print_structure(self):
        """طباعة الهيكل الهرمي للعناصر غير الصفرية"""
        result = {
            "chapters": [],
            "sections": [],
            "items": [],
            "types": []
        }
        
        for chapter in self.chapters.values():
            try:
                value = float(chapter['value']) if chapter['value'] else 0
                if value != 0:
                    result["chapters"].append({
                        "id": chapter['id'],
                        "value": chapter['value']
                    })
            except ValueError:
                continue
        
        for section in self.sections.values():
            try:
                value = float(section['value']) if section['value'] else 0
                if value != 0:
                    result["sections"].append({
                        "id": section['id'],
                        "value": section['value']
                    })
            except ValueError:
                continue
        
        for item in self.items.values():
            try:
                value = float(item['value']) if item['value'] else 0
                if value != 0:
                    result["items"].append({
                        "id": item['id'],
                        "value": item['value']
                    })
            except ValueError:
                continue
        
        for type_item in self.types.values():
            try:
                value = float(type_item['value']) if type_item['value'] else 0
                if value != 0:
                    result["types"].append({
                        "id": type_item['id'],
                        "value": type_item['value']
                    })
            except ValueError:
                continue
        
        return result

# مثال الاستخدام
# def reading_first_sheet(excel_file_path,sheet_num):
def reading_first_sheet(excel_file_path,sheet_num):
    from reading_Excel import excel_to_json
    
    # 1. إنشاء كائن القواميس
    dict_system = HierarchicalDictionaries()
    
    # 2. تهيئة الهيكل بمعرفاتك
    chapter_ids = ['1_1', '1_2', '1_3', '1_4','2_1', '2_2', '2_3', '2_4']
    
    section_ids = ['2_11', '2_12', '2_21', '2_22', '2_24','2_25', '2_33', '2_34', '2_41', '2_43','1_11', '1_12', '1_13', '1_14',
    '1_15','1_23','1_31','1_32','1_33','1_34','1_35','1_41','1_43']
    
    item_ids = ['2_111','2_112','2_113','2_114','2_115','2_121','2_122','2_123','2_211','2_212','2_213','2_214','2_215','2_216','2_217','2_218',
    '2_221','2_222','2_223','2_241','2_242','2_243','2_251','2_332','2_333','2_341','2_345','2_346','2_411','2_412','2_413','2_431','2_434','1_111',
    '1_121','1_123', '1_131', '1_143','1_151','1_153','1_154','1_231','1_232','1_314','1_321','1_322','1_323','1_331','1_332','1_341','1_342','1_351',
    '1_411','1_412','1_413','1_431']
    
    type_ids = ['2_1111','2_1123','2_1131','2_1132','2_1141','2_1142','2_1143','2_1144','2_1145','2_1151','2_1211','2_1212','2_1221','2_1222','2_1231',
    '2_1232','2_2111','2_2112','2_2121','2_2131','2_2132','2_2141','2_2142','2_2143','2_2144','2_2151','2_2152','2_2153','2_2161','2_2162','2_2163','2_2171',
    '2_2172','2_2173','2_2181','2_2182','2_2183','2_2211','2_2212','2_2213','2_2221','2_2222','2_2223','2_2231','2_2411','2_2412','2_2413','2_2421','2_2422',
    '2_2431','2_2432','2_2433','2_2511','2_2512','2_3322','2_3323','2_3324','2_3325','2_3331','2_3332','2_3333','2_3334','2_3411','2_3412','2_3451','2_3462',
    '2_4111','2_4112','2_4113','2_4121','2_4122','2_4123','2_4131','2_4132','2_4133','2_4311','2_4312','2_4313','2_4314','2_4315','2_4341',
    '1_1111','1_1112','1_1113','1_1114','1_1115','1_1116','1_1117','1_1118','1_1119','1_1214','1_1215','1_1231','1_1232','1_1311','1_1431','1_1432',
    '1_1433','1_1514','1_1531','1_1532','1_1534','1_1542','1_1543','1_1544','1_15410','1_15411','1_15412','1_15413','1_15415','1_2311','1_2312','1_2313',
    '1_2321','1_2322','1_2323','1_2324','1_2325','1_31411','1_31412','1_31413','1_31414','1_3211','1_3216','1_3221','1_3222','1_3223','1_3225','1_3227',
    '1_3228','1_3229','1_32211','1_32212','1_32213','1_32215','1_32216','1_32217','1_32218','1_32219','1_32220','1_32221','1_3231','1_3232','1_3235',
    '1_3237','1_3238','1_32310','1_32311','1_32312','1_32313','1_32314','1_32315','1_32316','1_32317','1_32318','1_32319','1_32320','1_32321','1_32322',
    '1_32323','1_3311','1_3321','1_3324','1_3411','1_3412','1_3421','1_3422','1_3512','1_3513','1_3514','1_3515','1_4111','1_4112','1_4113',
    '1_4121','1_4122','1_4123','1_4131','1_4132','1_4133','1_4311','1_4312','1_4313','1_4314','1_4315']
    
    dict_system.initialize_structure(chapter_ids, section_ids, item_ids, type_ids)
    
    # 3. ربط العناصر
    dict_system.link_hierarchy(
        type_to_item={
            '2_111': ['2_1111'],
            '2_112': ['2_1123'],
            '2_113': ['2_1131', '2_1132'],
            '2_114': ['2_1141', '2_1142', '2_1143', '2_1144', '2_1145'],
            '2_115': ['2_1151'],
            '2_121': ['2_1211', '2_1212'],
            '2_122': ['2_1221', '2_1222'],
            '2_123': ['2_1231', '2_1232'],
            '2_211': ['2_2111', '2_2112'],
            '2_212': ['2_2121'],
            '2_213': ['2_2131', '2_2132'],
            '2_214': ['2_2141', '2_2142', '2_2143', '2_2144'],
            '2_215': ['2_2151', '2_2152', '2_2153'],
            '2_216': ['2_2161', '2_2162', '2_2163'],
            '2_217': ['2_2171', '2_2172', '2_2173'],
            '2_218': ['2_2181', '2_2182', '2_2183'],
            '2_221': ['2_2211', '2_2212', '2_2213'],
            '2_222': ['2_2221', '2_2222', '2_2223'],
            '2_223': ['2_2231'],
            '2_241': ['2_2411', '2_2412', '2_2413'],
            '2_242': ['2_2421', '2_2422'],
            '2_243': ['2_2431', '2_2432', '2_2433'],
            '2_251': ['2_2511', '2_2512'],
            '2_332': ['2_3322', '2_3323', '2_3324', '2_3325'],
            '2_333': ['2_3331', '2_3332', '2_3333', '2_3334'],
            '2_341': ['2_3411', '2_3412'],
            '2_345': ['2_3451'],
            '2_346': ['2_3462'],
            '2_411': ['2_4111', '2_4112', '2_4113'],
            '2_412': ['2_4121', '2_4122', '2_4123'],
            '2_413': ['2_4131', '2_4132', '2_4133'],
            '2_431': ['2_4311', '2_4312', '2_4313', '2_4314', '2_4315'],
            '2_434': ['2_4341'],
            '1_111': ['1_1111', '1_1112', '1_1113', '1_1114', '1_1115', '1_1116', '1_1117', '1_1118', '1_1119'],
            '1_121': ['1_1214', '1_1215'],
            '1_123': ['1_1231', '1_1232'],
            '1_131': ['1_1311'],
            '1_143': ['1_1431', '1_1432', '1_1433'],
            '1_151': ['1_1514'],
            '1_153': ['1_1531', '1_1532', '1_1534'],
            '1_154': ['1_1542', '1_1543', '1_1544', '1_15410', '1_15411', '1_15412', '1_15413', '1_15415'],
            '1_231': ['1_2311', '1_2312', '1_2313'],
            '1_232': ['1_2321', '1_2322', '1_2323', '1_2324', '1_2325'],
            '1_314': ['1_31411', '1_31412', '1_31413', '1_31414'],
            '1_321': ['1_3211', '1_3216'],
            '1_322': ['1_3221', '1_3222', '1_3223', '1_3225', '1_3227', '1_3228', '1_3229', '1_32211', '1_32212', '1_32213', '1_32215', '1_32216', '1_32217', '1_32218', '1_32219', '1_32220', '1_32221'],
            '1_323': ['1_3231', '1_3232', '1_3235', '1_3237', '1_3238', '1_32310', '1_32311', '1_32312', '1_32313', '1_32314', '1_32315', '1_32316', '1_32317', '1_32318', '1_32319', '1_32320', '1_32321', '1_32322', '1_32323'],
            '1_331': ['1_3311'],
            '1_332': ['1_3321', '1_3324'],
            '1_341': ['1_3411', '1_3412'],
            '1_342': ['1_3421', '1_3422'],
            '1_351': ['1_3512', '1_3513', '1_3514', '1_3515'],
            '1_411': ['1_4111', '1_4112', '1_4113'],
            '1_412': ['1_4121', '1_4122', '1_4123'],
            '1_413': ['1_4131', '1_4132', '1_4133'],
            '1_431': ['1_4311', '1_4312', '1_4313', '1_4314', '1_4315']
        },
        item_to_section={
            '2_11': ['2_111', '2_112', '2_113', '2_114', '2_115'],
            '2_12': ['2_121', '2_122', '2_123'],
            '2_21': ['2_211', '2_212', '2_213', '2_214', '2_215', '2_216', '2_217', '2_218'],
            '2_22': ['2_221', '2_222', '2_223'],
            '2_24': ['2_241', '2_242', '2_243'],
            '2_25': ['2_251'],
            '2_33': ['2_332', '2_333'],
            '2_34': ['2_341', '2_345', '2_346'],
            '2_41': ['2_411', '2_412', '2_413'],
            '2_43': ['2_431', '2_434'],
            '1_11': ['1_111'],
            '1_12': ['1_121', '1_123'],
            '1_13': ['1_131'],
            '1_14': ['1_143'],
            '1_15': ['1_151', '1_153', '1_154'],
            '1_23': ['1_231', '1_232'],
            '1_31': ['1_314'],
            '1_32': ['1_321', '1_322', '1_323'],
            '1_33': ['1_331', '1_332'],
            '1_34': ['1_341', '1_342'],
            '1_35': ['1_351'],
            '1_41': ['1_411', '1_412', '1_413'],
            '1_43': ['1_431']
        },
        section_to_chapter={
            '1_1': ['1_11', '1_12', '1_13', '1_14', '1_15'],
            '1_2': ['1_23'],
            '1_3': ['1_31', '1_32', '1_33', '1_34', '1_35'],
            '1_4': ['1_41', '1_43'],
            '2_1': ['2_11', '2_12'],
            '2_2': ['2_21', '2_22', '2_24', '2_25'],
            '2_3': ['2_33', '2_34'],
            '2_4': ['2_41', '2_43']
        }
    )
    
    # 4. قراءة البيانات من Excel وتحديث القيم
    # r'C:\Users\AHMD\Desktop\3_3.xlsx'
    file_path = excel_file_path
    json_result, df_result, type_values = excel_to_json(file_path, sheet_name=sheet_num)
    
    if type_values:
        print("\n📊 تحديث القيم من ملف Excel...")
        dict_system.update_values(type_values, 'types')
        print("✅ تم التحديث بنجاح!")
        
        # طباعة الهيكل لمشاهدة النتائج
        # ppp = dict_system.print_structure()
        return dict_system.print_structure()
        # print(ppp)

# if __name__ == '__main__':
#     reading_first_sheet()