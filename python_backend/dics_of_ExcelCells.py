class HierarchicalDictionaries:
    def __init__(self):
        self.chapters = {}  # {chapter_id: {"id": str, "name": str, "value": str}}
        self.sections = {}  # {section_id: {"id": str, "name": str, "value": str}}
        self.items = {}     # {item_id: {"id": str, "name": str, "value": str}}
        self.types = {}     # {type_id: {"id": str, "name": str, "value": str}}
    
    def initialize_structure(self, 
                           chapter_data: dict, 
                           section_data: dict, 
                           item_data: dict, 
                           type_data: dict):
        """تهيئة القواميس بمعرفات وأسماء فارغة"""
        for type_id, type_name in type_data.items():
            self.types[type_id] = {"id": type_id, "name": type_name, "value": ""}
        
        for item_id, item_name in item_data.items():
            self.items[item_id] = {"id": item_id, "name": item_name, "value": "", "type_ids": []}
        
        for section_id, section_name in section_data.items():
            self.sections[section_id] = {"id": section_id, "name": section_name, "value": "", "item_ids": []}
        
        for chapter_id, chapter_name in chapter_data.items():
            self.chapters[chapter_id] = {"id": chapter_id, "name": chapter_name, "value": "", "section_ids": []}
    
    def link_hierarchy(self, 
                      type_to_item: dict, 
                      item_to_section: dict, 
                      section_to_chapter: dict):
        """ربط العناصر الهرمية ببعضها"""
        # 1. ربط الأنواع بالبنود
        for item_id, linked_type_ids in type_to_item.items():
            if item_id in self.items:
                self.items[item_id]["type_ids"] = linked_type_ids
        
        # 2. ربط البنود بالفصول
        for section_id, linked_item_ids in item_to_section.items():
            if section_id in self.sections:
                self.sections[section_id]["item_ids"] = linked_item_ids
        
        # 3. ربط الفصول بالأبواب
        for chapter_id, linked_section_ids in section_to_chapter.items():
            if chapter_id in self.chapters:
                self.chapters[chapter_id]["section_ids"] = linked_section_ids
    
    def calculate_item_value(self, item_id):
        """Calculate item value based on its types"""
        if item_id not in self.items:
            return 0
        
        type_ids = self.items[item_id]["type_ids"]
        total = 0
        for type_id in type_ids:
            if type_id in self.types:
                try:
                    value = float(self.types[type_id]["value"]) if self.types[type_id]["value"] else 0
                    total += value
                except ValueError:
                    # Handle non-numeric values
                    continue
        return total

    def calculate_section_value(self, section_id):
        """Calculate section value based on its items"""
        if section_id not in self.sections:
            return 0
        
        item_ids = self.sections[section_id]["item_ids"]
        total = 0
        for item_id in item_ids:
            if item_id in self.items:
                try:
                    value = float(self.items[item_id]["value"]) if self.items[item_id]["value"] else 0
                    total += value
                except ValueError:
                    continue
        return total

    def calculate_chapter_value(self, chapter_id):
        """Calculate chapter value based on its sections"""
        if chapter_id not in self.chapters:
            return 0
        
        section_ids = self.chapters[chapter_id]["section_ids"]
        total = 0
        for section_id in section_ids:
            if section_id in self.sections:
                try:
                    value = float(self.sections[section_id]["value"]) if self.sections[section_id]["value"] else 0
                    total += value
                except ValueError:
                    continue
        return total

    def propagate_values(self):
        """Propagate values up the hierarchy from types to chapters"""
        # Calculate items values from types
        for item_id in self.items:
            value = self.calculate_item_value(item_id)
            self.items[item_id]["value"] = str(value)
        
        # Calculate sections values from items
        for section_id in self.sections:
            value = self.calculate_section_value(section_id)
            self.sections[section_id]["value"] = str(value)
        
        # Calculate chapters values from sections
        for chapter_id in self.chapters:
            value = self.calculate_chapter_value(chapter_id)
            self.chapters[chapter_id]["value"] = str(value)

    def update_values(self, value_dict: dict, dict_type: str):
        """تحديث القيم في القاموس المحدد"""
        target_dict = getattr(self, dict_type, None)
        if not target_dict:
            raise ValueError(f"نوع القاموس غير صحيح: {dict_type}")
        
        for item_id, value in value_dict.items():
            if item_id in target_dict:
                target_dict[item_id]["value"] = value
        
        # Propagate values up the hierarchy after updating
        if dict_type == "types":
            self.propagate_values()
    
    def get_dict(self, dict_type: str) -> dict:
        """استرجاع قاموس محدد"""
        return getattr(self, dict_type, {})
    
    def print_structure(self):
        """طباعة الهيكل الهرمي للعناصر غير الصفرية مع ربط كل نوع بكامل الهيكل الهرمي"""
        result = {
            "chapters": [],
            "sections": [],
            "items": [],
            "types": [],
            "hierarchical_rows": []
        }
        # بناء عكس القواميس للربط
        type_to_item = {}
        for item_id, item in self.items.items():
            for type_id in item.get("type_ids", []):
                type_to_item[type_id] = item_id
        item_to_section = {}
        for section_id, section in self.sections.items():
            for item_id in section.get("item_ids", []):
                item_to_section[item_id] = section_id
        section_to_chapter = {}
        for chapter_id, chapter in self.chapters.items():
            for section_id in chapter.get("section_ids", []):
                section_to_chapter[section_id] = chapter_id
        # بناء hierarchical_rows
        for type_id, type_item in self.types.items():
            try:
                value = float(type_item["value"]) if type_item["value"] else 0
                if value != 0:
                    item_id = type_to_item.get(type_id, "")
                    section_id = item_to_section.get(item_id, "")
                    chapter_id = section_to_chapter.get(section_id, "")
                    result["hierarchical_rows"].append({
                        "chapter_id": chapter_id,
                        "section_id": section_id,
                        "item_id": item_id,
                        "type_id": type_id,
                        "name": type_item["name"],
                        "value": type_item["value"]
                    })
            except ValueError:
                continue
        # باقي النتائج كما هي
        for chapter in self.chapters.values():
            try:
                value = float(chapter["value"]) if chapter["value"] else 0
                if value != 0:
                    result["chapters"].append({
                        "id": chapter["id"],
                        "name": chapter["name"],
                        "value": chapter["value"]
                    })
            except ValueError:
                continue
        for section in self.sections.values():
            try:
                value = float(section["value"]) if section["value"] else 0
                if value != 0:
                    result["sections"].append({
                        "id": section["id"],
                        "name": section["name"],
                        "value": section["value"]
                    })
            except ValueError:
                continue
        for item in self.items.values():
            try:
                value = float(item["value"]) if item["value"] else 0
                if value != 0:
                    result["items"].append({
                        "id": item["id"],
                        "name": item["name"],
                        "value": item["value"]
                    })
            except ValueError:
                continue
        for type_item in self.types.values():
            try:
                value = float(type_item["value"]) if type_item["value"] else 0
                if value != 0:
                    result["types"].append({
                        "id": type_item["id"],
                        "name": type_item["name"],
                        "value": type_item["value"]
                    })
            except ValueError:
                continue
        return result

def reading_first_sheet(excel_file_path, sheet_num):
    try:
        from reading_Excel import excel_to_json
        
        print(f"[DEBUG] Starting reading_first_sheet with file: {excel_file_path}, sheet: {sheet_num}")
        
        dict_system = HierarchicalDictionaries()
        
        # Define the hierarchical data with names
        chapter_data = {
            '1_1': 'الإيرادات الضريبية',
            '1_2': 'المنـــــــــــــــــــــــــــح',
            '1_3': 'إيرادات دخل الملكية ومبيعات السلع والخدمات والتحويلات والمتنوعة',
            '1_4': 'التصرف في الأصول غير المالية',
            '2_1': 'أجور وتعويضات العاملين',
            '2_2': 'نفقات على السلع والخدمات والممتلكات',
            '2_3': 'الإعانات والمنح والمنافع الإجتماعية',
            '2_4': 'التصرف في الأصول غير المالية'
        }

        section_data = {
            '1_11': 'الإيرادات الضريبية',
            '1_12': 'الضرائب على الدخل والأرباح والمكاسب الرأسمالية',
            '1_13': 'الضرائب على رواتب وأجور القوى العاملة',
            '1_14': 'الضرائب على الملكية',
            '1_15': 'الضرائب على السلع والخدمات',
            '1_23': 'الحصة من الموارد العامة المشتركة',
            '1_31': 'دخل الملكية',
            '1_32': 'الرسوم الإدارية',
            '1_33': 'إيرادات البطاقات الشخصية والعائلية',
            '1_34': 'الغرامات والجزاءات والمصادرات',
            '1_35': 'إيرادات أخرى متنوعة',
            '1_41': 'التصرف في الأصول الثابتة',
            '1_43': 'التصرف في الأصول غير المنتجة',
            '2_11': 'المرتبات والأجور وما في حكمها',
            '2_12': 'المساهمات الإجتماعية',
            '2_21': 'السلع والخدمات',
            '2_22': 'نفقات سلعية وخدمية أخرى',
            '2_24': 'استهلاك رأس المال الثابت',
            '2_25': 'نفقات على الممتلكات بخلاف الفوائد',
            '2_33': 'المنافع الإجتماعية',
            '2_34': 'تحويلات وإعانات مالية أخرى',
            '2_41': 'التصرف في الأصول الثابتة',
            '2_43': 'التصرف في الأصول غير المنتجة'
        }

        item_data = {
            '1_111': 'ايرادات الزكاة',
            '1_121': 'الضرائب على دخل الأفراد',
            '1_123': 'ضرائب دخل أخرى',
            '1_131': 'الضرائب على رواتب وأجور القوى العاملة',
            '1_143': 'الضرائب المعاملات المالية والرأسمالية',
            '1_151': 'الضريبة العامة على مبيعات السلع والخدمات',
            '1_153': 'الضرائب على الخدمات النوعية',
            '1_154': 'الضرائب على استخدام السلع والتراخيص باستخدامها وتأدية الأنشطة',
            '1_231': 'الحصة من الموارد المشتركة',
            '1_232': 'منح عينية رأسمالية من مستويات حكومية أخرى',
            '1_314': 'مبيعات السلع والخدامات',
            '1_321': 'رسوم تخطيط واستشارات',
            '1_322': 'رسوم تراخيص البناء وتجديدها',
            '1_323': 'إيرادات السجل التجاري والصناعي',
            '1_331': 'رسوم النوادي والجمعيات',
            '1_332': 'رسوم رخص حيازة الأسلحة',
            '1_341': 'ايرادات الجزاءات',
            '1_342': 'الغرامات والمصادرات',
            '1_351': 'التحويلات الطوعية بخلاف المنح',
            '1_411': 'مبيعات المباني والإنشاءات',
            '1_412': 'مبيعات الماكينات والمعدات',
            '1_413': 'مبيعات أصول ثابتة أخرى',
            '1_431': 'مبيعات الأراضي',
            '2_111': 'المرتبات الأساسية',
            '2_112': 'المرتبات والأجور التعاقدية والمؤقتة',
            '2_113': 'المكافآت وأجور العمل الإضافي',
            '2_114': 'البدلات',
            '2_115': 'المزايا العينية',
            '2_121': 'مساهمات الضمان الإجتماعي',
            '2_122': 'مساهمة الحكومة في نظم الرعاية الإجتماعية',
            '2_123': 'المساهمات الإجتماعية المحتسبة',
            '2_211': 'خدمات المرافق',
            '2_212': 'مستلزمات المكاتب',
            '2_213': 'الإتصالات',
            '2_214': 'الضيافة',
            '2_215': 'نفقات ذات طابع خاص',
            '2_216': 'نفقات النظافة',
            '2_217': 'نفقات أخرى',
            '2_218': 'نقل وانتقالات عامة',
            '2_221': 'إيجارات الأصول المُنتجة',
            '2_222': 'نفقات البحوث والتطوير والتدريب',
            '2_223': 'أدوية ومستلزمات طبية ومواد أولية ومساندة',
            '2_241': 'استهلاك المباني والإنشاءات',
            '2_242': 'استهلاك الماكينات والمعدات',
            '2_243': 'استهلاك أصول رأسمالية أخرى',
            '2_251': 'ايجارات الأصول غير المُنتجة',
            '2_332': 'المساعدات الإجتماعية لغير الموظفين',
            '2_333': 'المنافع الإجتماعية للموظفين',
            '2_341': 'تحويلات وإعانات مالية أخرى',
            '2_345': 'التعويضات والغرامات والنفقات الطارئة',
            '2_346': 'جملة الباب الأول والثاني والثالث ( الإستخدامات التشغيلية )',
            '2_411': 'مبيعات المباني والإنشاءات',
            '2_412': 'مبيعات الماكينات والمعدات',
            '2_413': 'مبيعات أصول ثابتة أخرى',
            '2_431': 'مبيعات الأراضي'
        }

        type_data = {
            '1_1111': 'زكاة الحبوب',
            '1_1112': 'زكاة القات',
            '1_1113': 'زكاة المخضرات',
            '1_1114': 'زكاة المواشي',
            '1_1115': 'زكاة الباطن على مؤسسات وشركات القطاع العام والمختلط',
            '1_1116': 'زكاة الباطن على شركات القطاع الخاص',
            '1_1117': 'زكاة الباطن على الأفراد',
            '1_1118': 'زكاة الفطرة',
            '1_1119': 'أخرى',
            '1_1214': 'الضرائب على دخل الأفراد',
            '1_1215': 'ضرائب أرباح المهن الحرة',
            '1_1231': 'الضريبة على ريع العقارات والأراضي',
            '1_1232': 'ضرائب دخل أخرى',
            '1_1311': 'الضرائب على رواتب وأجور القوى العاملة',
            '1_1431': 'الضرائب المعاملات المالية والرأسمالية',
            '1_1432': 'رسوم نقل ملكية الأراضي',
            '1_1433': 'رسوم نقل ملكية العقارات',
            '1_1514': 'الضريبة العامة على مبيعات السلع والخدمات',
            '1_1531': 'ضريبة مبيعات القات',
            '1_1532': 'الضرائب على الخدمات النوعية',
            '1_1534': 'ضرائب مبيعات تذاكر السينما والفيديو والكاسيت والمهرجانات والفعاليات الرياضية',
            '1_1542': 'الرسم المضاف على فواتير الكهرباء والمياه والتلفون',
            '1_1543': 'الضرائب على استخدام السلع والتراخيص باستخدامها وتأدية الأنشطة',
            '1_1544': 'رخص وسائل النقل',
            '1_15410': 'رسوم فتح المحلات التجارية',
            '1_15411': 'رسوم تراخيص مزاولة المهن المختلفة',
            '1_15412': 'رسوم الدعاية والإعلان',
            '1_15413': 'رسوم رخص الأعمال الفنية',
            '1_15415': 'ايرادات رخص مزاولة مهنة الاستيراد',
            '1_2311': 'الحصة من الموارد المشتركة',
            '1_2312': 'منح عينية رأسمالية من مستويات حكومية أخرى',
            '1_2313': 'منح فنية واستشارية',
            '1_2321': 'مبيعات السلع والخدامات',
            '1_2322': 'مبيعات المنشآت السوقية',
            '1_2323': 'مبيعات الحاصلات الزراعية',
            '1_2324': 'مبيعات منشآت سوقية أخرى',
            '1_2325': 'الرسوم الإدارية',
            '1_31411': 'رسوم تخطيط واستشارات',
            '1_31412': 'رسوم تراخيص البناء وتجديدها',
            '1_31413': 'إيرادات السجل التجاري والصناعي',
            '1_31414': 'رسوم توثيق العقود',
            '1_3211': 'رسوم النوادي والجمعيات',
            '1_3216': 'رسوم رخص حيازة الأسلحة',
            '1_3221': 'رسوم ريّ وحفر الآبار',
            '1_3222': 'ايرادات جوازات السفر',
            '1_3223': 'رسوم تصاريح العمل والإقامة لغير اليمنين وتمديداتها',
            '1_3225': 'رسوم سياحية',
            '1_3227': 'إيرادات البطاقات الشخصية والعائلية',
            '1_3228': 'رسوم شهادات المواليد والوفيات',
            '1_3229': 'رسوم رخص القيادة',
            '1_32211': 'رسوم حفر البيارات',
            '1_32212': 'رسوم إستخدام أرضية الأسواق العامة والأرضية',
            '1_32213': 'الرسم المضاف على رسوم خدمات المسالخ وأسواق اللحوم والأسماك',
            '1_32215': 'رسوم إدارية أخرى',
            '1_32216': 'مبيعات عرضية للمنشآت غير السوقية',
            '1_32217': 'إيجارات المباني الحكومية',
            '1_32218': 'إيجارات الالآت والمعدات',
            '1_32219': 'ايرادات الطرقات',
            '1_32220': 'رسوم استمارات وتسجيل',
            '1_32221': 'رسوم امتحانات وشهادات',
            '1_3231': 'رسوم مبيدات ولقاحات وأسمدة',
            '1_3232': 'إيرادات تذاكر المعاينة',
            '1_3235': 'إيرادات مخابر وأشعة',
            '1_3237': 'إيرادات رقود وعمليات',
            '1_3238': 'إيرادات شهادات صحية',
            '1_32310': 'إيرادات الحجر الصحي',
            '1_32311': 'رسوم النظافة',
            '1_32312': 'رسوم الطرود الواردة',
            '1_32313': 'رسوم المتاحف',
            '1_32314': 'رسوم الإنتفاع بمواقف سيارات نقل الركاب والبضائع',
            '1_32315': 'الرسم المقرر على حمولات وسائل نقل الأحجار والحصى والرمل',
            '1_32316': 'الرسم المقرر على سيارات نقل الركاب براً',
            '1_32317': 'الرسم المضاف على الرسوم المقررة على الطرود البريدية',
            '1_32318': 'مببعات عرضية أخرى للمنشآت غير السوقية',
            '1_32319': 'الغرامات والجزاءات والمصادرات',
            '1_32320': 'ايرادات الجزاءات',
            '1_32321': 'الغرامات والمصادرات',
            '1_32322': 'الغرامات والمصادرات (محلية)',
            '1_32323': 'الغرامات والمصادرات المشتركة الأخرى',
            '1_3311': 'التحويلات الطوعية بخلاف المنح',
            '1_3321': 'التحويلات الطوعية الجارية بخلاف المنح',
            '1_3324': 'التحويلات الطوعية الرأسمالية بخلاف المنح',
            '1_3411': 'إيرادات أخرى متنوعة',
            '1_3412': 'الخردة والنفايات',
            '1_3421': 'تعويضات إتلاف ممتلكات حكومية بخلاف المتحصلات الناشئة عن دعاوي قضائية',
            '1_3422': 'المسترد من نفقات الموازنة عن سنين سابقة',
            '1_3512': 'إيرادات متنوعة أخرى',
            '1_3513': 'التصرف في الأصول غير المالية',
            '1_3514': 'التصرف في الأصول الثابتة',
            '1_3515': 'مبيعات المباني والإنشاءات',
            '1_4111': 'مبيعات المباني السكنية',
            '1_4112': 'مبيعات المباني غير السكنية',
            '1_4113': 'مبيعات الإنشاءات الأخرى',
            '1_4121': 'مبيعات الماكينات والمعدات',
            '1_4122': 'مبيعات المركبات ووسائل النقل',
            '1_4123': 'مبيعات أثاث ومعدات وأجهزة المكاتب',
            '1_4131': 'مبيعات ماكينات ومعدات أخرى',
            '1_4132': 'مبيعات أصول ثابتة أخرى',
            '1_4133': 'مبيعات الأصول الحيوانية والنباتية',
            '1_4311': 'مبيعات الأصول الثابتة غير المنظورة',
            '1_4312': 'أخرى',
            '1_4313': 'التصرف في الأصول غير المنتجة',
            '1_4314': 'مبيعات الأراضي',
            '1_4315': 'مبيعات أراضي زراعية',
            '2_1111': 'المرتبات الأساسية',
            '2_1123': 'أجور تعاقدية ومؤقتة',
            '2_1131': 'أجور العمل الإضافي',
            '2_1132': 'المكافآت',
            '2_1141': 'بدل طبيعة العمل',
            '2_1142': 'بدل مظهر',
            '2_1143': 'بدل ريف',
            '2_1144': 'بدل سكن',
            '2_1145': 'بدل تحديث',
            '2_1151': 'المزايا العينية',
            '2_1211': 'مساهمات الضمان الإجتماعي',
            '2_1212': 'مساهمات الحكومة في نظم الضمان الإجتماعي',
            '2_1221': 'مساهمة الحكومة في نظم الرعاية الإجتماعية',
            '2_1222': 'المساهمات الإجتماعية المحتسبة',
            '2_1231': 'المساهمات الإجتماعية المحتسبة في نظم الضمان الأجتماعي',
            '2_1232': 'المساهمات الإجتماعية المحتسبة في نظم الرعاية الإجتماعية',
            '2_2111': 'مياه',
            '2_2112': 'إنارة',
            '2_2121': 'أدوات كتابية ومكتبية وكتب ومطبوعات',
            '2_2131': 'نشر وإعلان ومجلات وجرائد',
            '2_2132': 'البريد والإتصالات',
            '2_2141': 'مؤتمرات واحتفالات وضيافة',
            '2_2142': 'نفقات ذات طابع خاص',
            '2_2143': 'نفقات النظافة',
            '2_2144': 'نفقات أخرى',
            '2_2151': 'نقل مهمات',
            '2_2152': 'انتقالات داخلية',
            '2_2153': 'حضور مؤتمرات وانتقالات خارجية',
            '2_2161': 'إيجار المباني',
            '2_2162': 'إيجار الآلآت والمعدات والأجهزة',
            '2_2163': 'إيجارات أخرى',
            '2_2171': 'نفقات البحوث والتطوير',
            '2_2172': 'نفقات التدريب المحلي',
            '2_2173': 'نفقات التدريب الخارجي',
            '2_2181': 'أدوية ومستلزمات طبية ومواد أولية ومساندة',
            '2_2182': 'أغذية وملبوسات',
            '2_2183': 'نفقات أخرى',
            '2_2211': 'صيانة البنية الأساسية',
            '2_2212': 'صيانة الطرق والجسور',
            '2_2213': 'صيانة المرافق العامة',
            '2_2221': 'صيانة مباني وتحسينات صغيرة',
            '2_2222': 'صيانة المركبات والمعدات والأثاث',
            '2_2223': 'وقود وزيوت',
            '2_2231': 'قطع غيار وصيانة وسائل النقل',
            '2_2411': 'استهلاك المباني السكنية',
            '2_2412': 'استهلاك المباني غير السكنية',
            '2_2413': 'استهلاك الإنشاءات الأخرى',
            '2_2421': 'استهلاك الماكينات والمعدات',
            '2_2422': 'استهلاك المركبات ووسائل النقل',
            '2_2431': 'استهلاك الماكينات والمعدات والأجهزة الأخرى',
            '2_2432': 'استهلاك أصول رأسمالية أخرى',
            '2_2433': 'استهلاك الأصول الثابتة غير المنظورة',
            '2_2511': 'استهلاك التحسينات الكبيرة للأراضي',
            '2_2512': 'استهلاك أصول رأسمالية أخرى',
            '2_3322': 'المساعدات الإجتماعية لغير الموظفين',
            '2_3323': 'إعاشات لغير الموظفين',
            '2_3324': 'إعانات ومساعدات لغير الموظفين',
            '2_3325': 'الإعانات الشهرية لغير الموظفين',
            '2_3331': 'المساعدات الإجتماعية العينية لغير الموظفين',
            '2_3332': 'المنافع الإجتماعية للموظفين',
            '2_3333': 'تعويضات إنهاء الخدمة',
            '2_3334': 'التعويضات التي تدفع للموظف أو أسرته عند التقاعد أو الوفاة أو الميلاد',
            '2_3411': 'المنافع الإجتماعية العينية للموظفين',
            '2_3412': 'منافع إجتماعية أخرى للموظفين',
            '2_3451': 'تحويلات وإعانات مالية أخرى',
            '2_3462': 'التعويضات والغرامات والنفقات الطارئة',
            '2_4111': 'مبيعات المباني السكنية',
            '2_4112': 'مبيعات المباني غير السكنية',
            '2_4113': 'مبيعات الإنشاءات الأخرى',
            '2_4121': 'مبيعات الماكينات والمعدات',
            '2_4122': 'مبيعات المركبات ووسائل النقل',
            '2_4123': 'مبيعات أثاث ومعدات وأجهزة المكاتب',
            '2_4131': 'مبيعات ماكينات ومعدات أخرى',
            '2_4132': 'مبيعات أصول ثابتة أخرى',
            '2_4133': 'مبيعات الأصول الحيوانية والنباتية',
            '2_4311': 'مبيعات الأصول الثابتة غير المنظورة',
            '2_4312': 'أخرى',
            '2_4313': 'التصرف في الأصول غير المنتجة',
            '2_4314': 'مبيعات الأراضي',
            '2_4315': 'مبيعات أراضي زراعية'
        }

        print("[DEBUG] Initializing hierarchical structure...")
        dict_system.initialize_structure(chapter_data, section_data, item_data, type_data)
        
        print("[DEBUG] Linking hierarchy...")
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
        
        print(f"[DEBUG] Reading Excel file: {excel_file_path}, sheet: {sheet_num}")
        file_path = excel_file_path
        json_result, df_result, type_values = excel_to_json(file_path, sheet_name=sheet_num)
        
        if type_values:
            print("\n📊 تحديث القيم من ملف Excel...")
            dict_system.update_values(type_values, 'types')
            print("✅ تم التحديث بنجاح!")
            
            result = dict_system.print_structure()
            print(f"[DEBUG] Processing completed successfully. Result keys: {list(result.keys())}")
            return result
        else:
            print("❌ فشل في استخراج القيم من ملف Excel")
            return {
                "chapters": [],
                "sections": [],
                "items": [],
                "types": []
            }
            
    except Exception as e:
        print(f"❌ خطأ في reading_first_sheet: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "chapters": [],
            "sections": [],
            "items": [],
            "types": [],
            "error": str(e)
        }
