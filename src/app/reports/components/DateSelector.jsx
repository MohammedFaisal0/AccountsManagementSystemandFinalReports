import React from 'react';

const MONTHS = [
  { value: '1', label: 'يناير' },
  { value: '2', label: 'فبراير' },
  { value: '3', label: 'مارس' },
  { value: '4', label: 'أبريل' },
  { value: '5', label: 'مايو' },
  { value: '6', label: 'يونيو' },
  { value: '7', label: 'يوليو' },
  { value: '8', label: 'أغسطس' },
  { value: '9', label: 'سبتمبر' },
  { value: '10', label: 'أكتوبر' },
  { value: '11', label: 'نوفمبر' },
  { value: '12', label: 'ديسمبر' },
];

const QUARTERS = [
  { value: '1', label: 'الربع الأول (يناير - مارس)' },
  { value: '2', label: 'الربع الثاني (أبريل - يونيو)' },
  { value: '3', label: 'الربع الثالث (يوليو - سبتمبر)' },
  { value: '4', label: 'الربع الرابع (أكتوبر - ديسمبر)' },
];

export default function DateSelector({ reportType, selectedDate, onDateChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const renderDateSelector = () => {
    switch (reportType) {
      case 'monthly':
        return (
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-right bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm text-gray-700"
          >
            <option value="">اختر الشهر</option>
            {MONTHS.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        );

      case 'quarterly':
        return (
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-right bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm text-gray-700"
          >
            <option value="">اختر الربع</option>
            {QUARTERS.map((quarter) => (
              <option key={quarter.value} value={quarter.value}>
                {quarter.label}
              </option>
            ))}
          </select>
        );

      case 'annual':
        return (
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2 text-right bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm text-gray-700"
          >
            <option value="">اختر السنة</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-right font-medium text-gray-700 text-sm">
        {reportType === 'monthly' && 'اختر الشهر'}
        {reportType === 'quarterly' && 'اختر الربع'}
        {reportType === 'annual' && 'اختر السنة'}
      </label>
      {renderDateSelector()}
    </div>
  );
} 