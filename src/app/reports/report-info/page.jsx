'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';

const REPORT_TYPE_LABELS = {
  monthly: 'تقرير شهري',
  quarterly: 'تقرير ربع سنوي',
  annual: 'تقرير سنوي',
};

const MONTHS = {
  '1': 'يناير',
  '2': 'فبراير',
  '3': 'مارس',
  '4': 'أبريل',
  '5': 'مايو',
  '6': 'يونيو',
  '7': 'يوليو',
  '8': 'أغسطس',
  '9': 'سبتمبر',
  '10': 'أكتوبر',
  '11': 'نوفمبر',
  '12': 'ديسمبر',
};

const QUARTERS = {
  '1': 'الربع الأول (يناير - مارس)',
  '2': 'الربع الثاني (أبريل - يونيو)',
  '3': 'الربع الثالث (يوليو - سبتمبر)',
  '4': 'الربع الرابع (أكتوبر - ديسمبر)',
};

const DIRECTORATES = {
  '1': 'مديرية 1',
  '2': 'مديرية 2',
  '3': 'مديرية 3',
  '4': 'مديرية 4',
  '5': 'مديرية 5',
};

export default function ReportInfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = searchParams.get('data');
      if (data) {
        const parsedData = JSON.parse(data);
        setReportData(parsedData);
      }
    } catch (error) {
      console.error('Error parsing report data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    router.push('/reports');
  };

  const getDateDisplay = () => {
    if (!reportData) return '';
    
    switch (reportData.type) {
      case 'monthly':
        return `شهر ${MONTHS[reportData.date]}`;
      case 'quarterly':
        return QUARTERS[reportData.date];
      case 'annual':
        return `سنة ${reportData.date}`;
      default:
        return '';
    }
  };

  const getDirectoratesDisplay = () => {
    if (!reportData) return [];
    
    if (reportData.directorates.length === 5) {
      return ['جميع المديريات'];
    }
    
    return reportData.directorates.map(id => DIRECTORATES[id]);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-xl text-gray-600">جاري تحميل البيانات...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-xl text-red-600">حدث خطأ في تحميل البيانات</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 print:shadow-none print:p-0">
          {/* Header with Back Button */}
          <div className="flex justify-between items-center mb-8 print:hidden">
            <button
              onClick={handleBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              ← العودة لتعديل التقرير
            </button>
          </div>

          {/* Report Header */}
          <div className="text-center mb-8 print:mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{REPORT_TYPE_LABELS[reportData.type]}</h1>
            <p className="text-gray-600">تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}</p>
          </div>

          {/* Report Details */}
          <div className="space-y-6 mb-8 print:mb-4">
            {/* Directorate */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">المديريات</h2>
              <div className="space-y-2">
                {getDirectoratesDisplay().map((directorate, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">{directorate}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">الفترة الزمنية</h2>
              <p className="text-gray-700">{getDateDisplay()}</p>
            </div>
          </div>

          {/* Print Button */}
          <div className="flex justify-center print:hidden">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              طباعة التقرير
            </button>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:shadow-none {
            box-shadow: none;
          }
          .print\\:p-0 {
            padding: 0;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem;
          }
          .print\\:hidden {
            display: none;
          }
        }
      `}</style>
    </div>
  );
} 