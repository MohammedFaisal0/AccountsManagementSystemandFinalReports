"use client";
import Sidebar from '@/components/Sidebar';
import { getFinancialData } from '@/app/operations/localDb/index';
import { useEffect, useState } from 'react';
import { OFFICES } from '../officesDictionary';

const months = [
  'يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو',
  'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر'
];

const DIRECTORATES = [
  'ماوية',
  'شرعب السلام',
  'شرعب الرونة',
  'مقبنة',
  'المخاء',
  'ذباب',
  'موزع',
  'جبل حبشي',
  'مشرعة وحدنان',
  'صبر الموادم',
  'المسراخ',
  'خدير',
  'الصلو',
  'الشمايتين',
  'الوازعيه',
  'حيفان',
  'المظفر',
  'القاهرة',
  'صالة',
  'التعزية',
  'المعافر',
  'المواسط',
  'سامع',
];

export default function ReportPreviewPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [offices, setOffices] = useState<string[]>([]);
  const [directorates, setDirectorates] = useState<string[]>([]);
  const [selectedOffice, setSelectedOffice] = useState('كل المكاتب');
  const [selectedDirectorate, setSelectedDirectorate] = useState('التعزية');
  const [selectedMonth, setSelectedMonth] = useState('يناير');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [years, setYears] = useState<string[]>(['2024', '2023']);
  const [selectedAccountName, setSelectedAccountName] = useState('كل الحسابات');
  const [accountNames, setAccountNames] = useState<string[]>([]);
  const [periodType, setPeriodType] = useState<'شهري' | 'ربع سنوي' | 'سنوي'>('شهري');
  const [selectedQuarter, setSelectedQuarter] = useState('المدة الأولى');
  const quarterOptions = [
    { label: 'المدة الأولى', months: ['يناير', 'فبراير', 'مارس'] },
    { label: 'المدة الثانية', months: ['ابريل', 'مايو', 'يونيو'] },
    { label: 'المدة الثالثة', months: ['يوليو', 'اغسطس', 'سبتمبر'] },
    { label: 'المدة الرابعة', months: ['اكتوبر', 'نوفمبر', 'ديسمبر'] },
  ];

  useEffect(() => {
    const { accounts } = getFinancialData();
    setAccounts(accounts);
    setOffices(Array.from(new Set(accounts.map(acc => acc.office_name).filter(Boolean))));
    setDirectorates(Array.from(new Set(accounts.map(acc => acc.directorate_name).filter(Boolean))));

    // استخراج أسماء الحسابات الفريدة
    const names = Array.from(new Set(accounts.map(acc => acc.account_name).filter(Boolean)));
    setAccountNames(names);

    // استخراج السنوات من بيانات الحسابات
    const yearsFromData = Array.from(new Set(accounts.map(acc => acc.date?.slice(0, 4)).filter(Boolean)));
    // دمجها مع السنوات الافتراضية وحذف التكرار وترتيبها تنازليًا
    const allYears = Array.from(new Set([...yearsFromData, '2024', '2023'])).sort((a, b) => Number(b) - Number(a));
    setYears(allYears);
  }, []);

  // Helper: month number from Arabic name
  const getMonthNumber = (month: string) => {
    const idx = months.indexOf(month);
    return idx === -1 ? '01' : String(idx + 1).padStart(2, '0');
  };

  // Helper: filter accounts by office/directorate/month/year
  const filteredAccounts = accounts.filter(acc => {
    const officeMatch = selectedOffice === 'كل المكاتب' || acc.office_name === selectedOffice;
    const dirMatch = selectedDirectorate === 'كل المديريات' || acc.directorate_name === selectedDirectorate;
    const yearMatch = acc.date.startsWith(selectedYear);
    const monthMatch = acc.date.slice(5, 7) === getMonthNumber(selectedMonth);
    return officeMatch && dirMatch && yearMatch && monthMatch;
  });

  // Helper: get all offices to show (filtered or all)
  const officesToShow = selectedOffice === 'كل المكاتب' ? OFFICES : [selectedOffice];

  // Helper: get value for a cell
  const getValue = (office: string, type: 'start' | 'jan' | 'sum' | 'end', field: 'debit' | 'credit'): any => {
    // Helper to check directorate
    const directorateMatch = (acc: any) => selectedDirectorate === 'كل المديريات' || acc.directorate_name === selectedDirectorate;
    // Helper to check account name
    const accountNameMatch = (acc: any) => selectedAccountName === 'كل الحسابات' || acc.account_name === selectedAccountName;
    // Helper to check if acc.date is in selected months
    let monthsToCheck: string[] = [];
    if (periodType === 'شهري') {
      monthsToCheck = [selectedMonth];
    } else if (periodType === 'ربع سنوي') {
      const found = quarterOptions.find(q => q.label === selectedQuarter);
      monthsToCheck = found ? found.months : [];
    } else if (periodType === 'سنوي') {
      monthsToCheck = months;
    }
    // الرصيد أول المدة: أول يوم في أول شهر من الفترة
    if (type === 'start') {
      const firstMonth = monthsToCheck[0];
      return accounts
        .filter(acc => acc.office_name === office && directorateMatch(acc) && accountNameMatch(acc) && acc.date.startsWith(`${selectedYear}-${getMonthNumber(firstMonth)}-01`))
        .reduce((sum, acc) => sum + (acc[field] || 0), 0);
    }
    // عمليات الفترة: كل الأيام عدا اليوم الأول من أول شهر
    if (type === 'jan') {
      // جميع العمليات في كل الشهور المختارة عدا اليوم الأول من أول شهر
      return accounts
        .filter(acc => acc.office_name === office && directorateMatch(acc) && accountNameMatch(acc)
          && monthsToCheck.some(m => acc.date.startsWith(`${selectedYear}-${getMonthNumber(m)}`))
          && !(acc.date.startsWith(`${selectedYear}-${getMonthNumber(monthsToCheck[0])}-01`)))
        .reduce((sum, acc) => sum + (acc[field] || 0), 0);
    }
    // الجملة = الرصيد + العمليات
    if (type === 'sum') {
      return getValue(office, 'start', field) + getValue(office, 'jan', field);
    }
    // الرصيد آخر المدة
    if (type === 'end') {
      const debtor: any = getValue(office, 'sum', 'debit');
      const creditor: any = getValue(office, 'sum', 'credit');
      if (field === 'debit') return debtor - creditor > 0 ? debtor - creditor : 0;
      if (field === 'credit') return creditor - debtor > 0 ? creditor - debtor : 0;
    }
    return 0;
  };

  // إضافة ستايل خاص للطباعة لضمان ظهور كل الجدول وعدم القطع
  // يمكن نقل هذا إلى globals.css إذا رغبت
  if (typeof window !== 'undefined') {
    const styleId = 'print-table-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @media print {
          table { page-break-inside: auto !important; width: 100% !important; }
          tr    { page-break-inside: avoid !important; page-break-after: auto !important; }
          thead { display: table-header-group !important; }
          tfoot { display: table-footer-group !important; }
          body, html { background: #fff !important; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ستايل خاص للطباعة لإزالة أي overflow نهائيًا عن الحاوي
  if (typeof window !== 'undefined') {
    const styleId = 'print-table-wrapper-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @media print {
          .print-table-wrapper {
            display: contents !important;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
          }
          table {
            page-break-inside: auto !important;
            width: 100% !important;
          }
          tr {
            break-inside: avoid !important;
            break-after: auto !important;
          }
          thead { display: table-header-group !important; }
          tfoot { display: table-footer-group !important; }
          body, html { background: #fff !important; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // منطق طباعة برمجي يضمن ظهور الجدول كاملًا
  const handlePrint = () => {
    const reportTitle = document.getElementById('report-title');
    const reportTable = document.getElementById('report-table');
    if (!reportTitle || !reportTable) {
      window.print();
      return;
    }
    // حفظ العناصر الأصلية
    const originalBody = document.body.innerHTML;
    // إنشاء محتوى الطباعة فقط
    document.body.innerHTML = `
      <div style="text-align:center; font-size:2rem; font-weight:bold; margin-bottom:2rem;">
        ${reportTitle.innerHTML}
      </div>
      <div>${reportTable.outerHTML}</div>
    `;
    window.print();
    // إعادة الصفحة كما كانت
    document.body.innerHTML = originalBody;
    window.location.reload(); // لإعادة تفعيل React
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-cairo">
      <div className="print:hidden"><Sidebar /></div>
      <div className="flex-1 overflow-auto">

        <div className="max-w-7xl mx-auto p-6">
          {/* الفلاتر */}
          <div className="flex flex-wrap gap-4 items-center justify-between bg-white/80 rounded-xl shadow p-4 mb-6 border border-gray-100 print:hidden">
            <div className="flex gap-2 items-center">
              <label className="font-bold text-blue-900">اسم الحساب</label>
              <select className="p-2 rounded-lg border border-gray-200 text-black" value={selectedAccountName} onChange={e => setSelectedAccountName(e.target.value)}>
                <option className="text-black">كل الحسابات</option>
                {accountNames.map(name => <option className="text-black" key={name}>{name}</option>)}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-bold text-blue-900">نوع الفترة</label>
              <select className="p-2 rounded-lg border border-gray-200 text-black" value={periodType} onChange={e => setPeriodType(e.target.value as any)}>
                <option className="text-black">شهري</option>
                <option className="text-black">ربع سنوي</option>
                <option className="text-black">سنوي</option>
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-bold text-blue-900">المكتب</label>
              <select className="p-2 rounded-lg border border-gray-200 text-black" value={selectedOffice} onChange={e => setSelectedOffice(e.target.value)}>
                <option className="text-black">كل المكاتب</option>
                {OFFICES.map(office => <option className="text-black" key={office}>{office}</option>)}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-bold text-blue-900">المديرية</label>
              <select className="p-2 rounded-lg border border-gray-200 text-black" value={selectedDirectorate} onChange={e => setSelectedDirectorate(e.target.value)}>
                <option className="text-black">كل المديريات</option>
                {DIRECTORATES.map(dir => <option className="text-black" key={dir}>{dir}</option>)}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-bold text-blue-900">الشهر</label>
              {periodType === 'شهري' && (
                <select className="p-2 rounded-lg border border-gray-200 text-black" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                  {months.map(month => <option className="text-black" key={month}>{month}</option>)}
                </select>
              )}
              {periodType === 'ربع سنوي' && (
                <select className="p-2 rounded-lg border border-gray-200 text-black" value={selectedQuarter} onChange={e => setSelectedQuarter(e.target.value)}>
                  {quarterOptions.map(q => <option className="text-black" key={q.label}>{q.label}</option>)}
                </select>
              )}
              {periodType === 'سنوي' && (
                <span className="px-2 text-blue-900 font-bold">كل الشهور</span>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-bold text-blue-900">السنة</label>
              <select className="p-2 rounded-lg border border-gray-200 text-black" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                {years.map(year => (
                  <option className="text-black" key={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <h1 id="report-title" className="sticky top-0 z-30 bg-white py-6 text-3xl font-bold text-blue-900 text-center shadow mb-8 print:static print:shadow-none print:mb-4 print:text-2xl print:bg-white print:text-black">
            حساب ختامي موازنة السلطة المحلية للسنة المالية {selectedYear}
          </h1>
          <div className="flex justify-end mb-4 print:hidden">
            <button
              className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow text-lg print:hidden"
              onClick={handlePrint}
            >
              طباعة التقرير PDF
            </button>
          </div>
          {/* الجدول */}
          <div className="print-table-wrapper bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 overflow-x-auto print:shadow-none print:border-0 print:bg-white print:h-auto print:max-h-none">
            <table id="report-table" className="w-full text-sm text-center font-cairo text-gray-900 rtl print:text-xs print:w-full print:break-all print:h-auto print:max-h-none">
              <thead>
                <tr>
                  <th className="bg-blue-900 text-white font-bold py-2 px-1 border border-gray-200 w-32" rowSpan={2}>المكتب</th>
                  <th colSpan={2} className="bg-blue-400 text-white font-bold border border-gray-200 w-20">الرصيد أول المدة</th>
                  <th colSpan={2} className="bg-blue-200 text-blue-900 font-bold border border-gray-200 w-20">عمليات الشهر</th>
                  <th colSpan={2} className="bg-yellow-200 text-yellow-900 font-bold border border-gray-200 w-20">الجملة</th>
                  <th colSpan={2} className="bg-green-200 text-green-900 font-bold border border-gray-200 w-20">رصيد آخر المدة</th>
                </tr>
                <tr>
                  <th className="bg-blue-50 text-blue-900 font-bold py-1 px-1 border border-gray-200 w-16">مدين</th>
                  <th className="bg-blue-50 text-blue-900 font-bold py-1 px-1 border border-gray-200 w-16">دائن</th>
                  <th className="bg-blue-100 text-blue-900 font-bold py-1 px-1 border border-gray-200 w-16">مدين</th>
                  <th className="bg-blue-100 text-blue-900 font-bold py-1 px-1 border border-gray-200 w-16">دائن</th>
                  <th className="bg-yellow-100 text-yellow-900 font-bold py-1 px-1 border border-gray-200 w-16">مدين</th>
                  <th className="bg-yellow-100 text-yellow-900 font-bold py-1 px-1 border border-gray-200 w-16">دائن</th>
                  <th className="bg-green-100 text-green-900 font-bold py-1 px-1 border border-gray-200 w-16">مدين</th>
                  <th className="bg-green-100 text-green-900 font-bold py-1 px-1 border border-gray-200 w-16">دائن</th>
                </tr>
              </thead>
              <tbody>
                {officesToShow.map((office, idx) => (
                  <tr key={office} className="print:break-inside-avoid print:break-after-auto">
                    <td className="bg-blue-50 text-blue-900 font-bold border border-gray-200 px-1 w-32">{office}</td>
                    {/* الرصيد أول المدة */}
                    <td className="bg-blue-50 border border-gray-200 px-1 w-16">{getValue(office, 'start', 'debit')}</td>
                    <td className="bg-blue-50 border border-gray-200 px-1 w-16">{getValue(office, 'start', 'credit')}</td>
                    {/* عمليات الشهر */}
                    <td className="bg-blue-100 border border-gray-200 px-1 w-16">{getValue(office, 'jan', 'debit')}</td>
                    <td className="bg-blue-100 border border-gray-200 px-1 w-16">{getValue(office, 'jan', 'credit')}</td>
                    {/* الجملة */}
                    <td className="bg-yellow-100 border border-gray-200 font-bold px-1 w-16">{getValue(office, 'sum', 'debit')}</td>
                    <td className="bg-yellow-100 border border-gray-200 font-bold px-1 w-16">{getValue(office, 'sum', 'credit')}</td>
                    {/* الرصيد آخر المدة */}
                    <td className="bg-green-100 border border-gray-200 font-bold px-1 w-16">{getValue(office, 'end', 'debit')}</td>
                    <td className="bg-green-100 border border-gray-200 font-bold px-1 w-16">{getValue(office, 'end', 'credit')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 