import React from 'react';

export default function ImportHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 rounded-2xl mb-6 shadow-lg">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">استيراد وتحليل البيانات</h1>
      <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
        قم برفع ملف Excel الخاص بك واختر الشهر والصفحة المناسبة لتحليل البيانات المالية
      </p>
    </div>
  );
} 