import React from 'react';

const MONTHS = [
  { value: 1, label: 'يناير' }, { value: 2, label: 'فبراير' }, { value: 3, label: 'مارس' },
  { value: 4, label: 'أبريل' }, { value: 5, label: 'مايو' }, { value: 6, label: 'يونيو' },
  { value: 7, label: 'يوليو' }, { value: 8, label: 'أغسطس' }, { value: 9, label: 'سبتمبر' },
  { value: 10, label: 'أكتوبر' }, { value: 11, label: 'نوفمبر' }, { value: 12, label: 'ديسمبر' },
];

interface ConfigurationFormProps {
  month: number | null;
  pageNumber: number | null;
  setMonth: (month: number | null) => void;
  setPageNumber: (pageNumber: number | null) => void;
  isAnalyzing: boolean;
  loading: boolean;
}

export default function ConfigurationForm({
  month,
  pageNumber,
  setMonth,
  setPageNumber,
  isAnalyzing,
  loading
}: ConfigurationFormProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-right">إعدادات التحليل</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Month Selection */}
        <div className="space-y-3">
          <label className="block text-right font-semibold text-gray-700 text-base">
            الشهر <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={month ?? ''}
              onChange={e => setMonth(e.target.value ? Number(e.target.value) : null)}
              disabled={isAnalyzing || loading}
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-right bg-white shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-base appearance-none"
              required
            >
              <option value="">اختر الشهر</option>
              {MONTHS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Page Selection */}
        <div className="space-y-3">
          <label className="block text-right font-semibold text-gray-700 text-base">
            رقم الصفحة <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={pageNumber ?? ''}
              onChange={e => setPageNumber(e.target.value ? Number(e.target.value) : null)}
              disabled={isAnalyzing || loading}
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-right bg-white shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-base appearance-none"
              required
            >
              <option value="">اختر الصفحة</option>
              <option value={1}>صفحة 1 - الإيرادات والاستخدامات</option>
              <option value={2}>صفحة 2 - الحسابات المالية</option>
            </select>
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 