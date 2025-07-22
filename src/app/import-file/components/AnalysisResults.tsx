import React from 'react';

interface HierarchicalItem {
  id: string;
  name: string;
  value: string;
}

interface HierarchicalData {
  chapters: HierarchicalItem[];
  sections: HierarchicalItem[];
  items: HierarchicalItem[];
  types: HierarchicalItem[];
}

interface AnalysisResultsProps {
  analysisResult: any;
  pageNumber: number | null;
  isSubmitting: boolean;
  onSubmitToDatabase: () => void;
  onReset: () => void;
  successMessage: string | null;
}

export default function AnalysisResults({
  analysisResult,
  pageNumber,
  isSubmitting,
  onSubmitToDatabase,
  onReset,
  successMessage
}: AnalysisResultsProps) {
  const renderHierarchicalTable = (data: HierarchicalData) => {
    const renderLevel = (level: string, items: HierarchicalItem[], depth: number = 0) => {
      if (!items || items.length === 0) return null;

      const paddingLeft = `${depth * 20}px`;

      return (
        <div key={level} className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3" style={{ paddingLeft }}>
            {level === 'chapters' ? 'الأبواب' : level === 'sections' ? 'الفصول' : level === 'items' ? 'البنود' : 'الأنواع'}
          </h4>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="py-4 px-6 text-right font-semibold text-gray-700 text-sm">المعرف (ID)</th>
                  <th className="py-4 px-6 text-right font-semibold text-gray-700 text-sm">الاسم</th>
                  <th className="py-4 px-6 text-center font-semibold text-gray-700 text-sm">القيمة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-4 px-6 text-right font-mono text-sm text-gray-600" style={{ paddingLeft }}>
                      {item.id}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-gray-800">{item.name}</td>
                    <td className="py-4 px-6 text-center font-semibold text-green-600">
                      {parseFloat(item.value).toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-8">
        {renderLevel('chapters', data.chapters, 0)}
        {renderLevel('sections', data.sections, 1)}
        {renderLevel('items', data.items, 2)}
        {renderLevel('types', data.types, 3)}
      </div>
    );
  };

  const renderAccountsTable = (accountsData: any) => {
    if (!accountsData || typeof accountsData !== 'object') {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">لا توجد بيانات حسابات متاحة</p>
        </div>
      );
    }

    let totalDebit = 0;
    let totalCredit = 0;

    return (
      <div className="space-y-8">
        {Object.entries(accountsData).map(([mainCategory, subCategories]: [string, any]) => {
          let categoryDebit = 0;
          let categoryCredit = 0;

          return (
            <div key={mainCategory} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white text-right">{mainCategory}</h3>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-4 px-6 text-right font-semibold text-gray-700 text-sm">اسم الحساب</th>
                      <th className="py-4 px-6 text-center font-semibold text-gray-700 text-sm">مدين</th>
                      <th className="py-4 px-6 text-center font-semibold text-gray-700 text-sm">دائن</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Object.entries(subCategories).map(([accountName, accountData]: [string, any], index: number) => {
                      const debit = accountData.debit || 0;
                      const credit = accountData.credit || 0;
                      
                      categoryDebit += debit;
                      categoryCredit += credit;
                      totalDebit += debit;
                      totalCredit += credit;

                      return (
                        <tr key={accountName} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="py-4 px-6 text-right font-medium text-gray-800">{accountName}</td>
                          <td className="py-4 px-6 text-center">
                            {debit > 0 ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                {debit.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {credit > 0 ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                                {credit.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    
                    {/* Category Totals */}
                    <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-t-2 border-blue-200">
                      <td className="py-4 px-6 text-right font-bold text-blue-800">إجمالي {mainCategory}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-blue-200 text-blue-800">
                          {categoryDebit.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold bg-blue-200 text-blue-800">
                          {categoryCredit.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
        
        {/* Grand Totals */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg border border-green-200 overflow-hidden">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white text-right">الإجمالي العام</h3>
            </div>
          </div>
          
          <div className="bg-white px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-800 font-semibold">إجمالي المدين</span>
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {totalDebit.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-800 font-semibold">إجمالي الدائن</span>
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-red-800">
                  {totalCredit.toLocaleString('ar-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
      {/* Success Message at the top */}
      {successMessage && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-100 border-b border-green-200 p-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-green-800 text-base mb-1">نجاح</h3>
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          </div>
        </div>
      )}
<<<<<<< HEAD
      {/* عرض اسم العمود للمكتب والمديرية في منتصف الصفحة أعلى النتائج */}
      {(analysisResult.directorate_name || analysisResult.office_name) && (
        <div className="mt-8 mb-6 flex flex-col items-center gap-2">
          {analysisResult.directorate_name && (
            <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-lg">
              المديرية: {analysisResult.directorate_name}
            </span>
          )}
          {analysisResult.office_name && (
            <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-bold text-lg">
              المكتب:  {analysisResult.office_name}
            </span>
          )}
        </div>
      )}
      {/* احذف عرض اسم المكتب والمديرية بالكامل */}
=======

>>>>>>> 26f7151a6157a6da86b03e552ea5e0f359171f6d
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-1">نتائج التحليل</h2>
<<<<<<< HEAD
        
=======
            <p className="text-green-100 text-sm">تم تحليل البيانات بنجاح</p>
>>>>>>> 26f7151a6157a6da86b03e552ea5e0f359171f6d
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {pageNumber === 1 && analysisResult.processed_data && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-right">البيانات الهرمية</h3>
            {renderHierarchicalTable(analysisResult.processed_data as HierarchicalData)}
          </div>
        )}

        {pageNumber === 2 && analysisResult.processed_data && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-right">بيانات الحسابات المالية</h3>
            {renderAccountsTable(analysisResult.processed_data)}
          </div>
        )}
        
        <div className="mt-8 flex justify-center space-x-4 space-x-reverse">
          <button
            className={`px-6 py-3 text-white rounded-lg transition-all duration-300 font-bold text-base ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg'
            }`}
            onClick={onSubmitToDatabase}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الحفظ...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                حفظ البيانات
              </>
            )}
          </button>
          <button
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-bold text-base shadow-lg"
            onClick={onReset}
          >
            تحليل ملف آخر
          </button>
        </div>
      </div>
    </div>
  );
} 