
// src/app/report-info/page.tsx

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar'; // Adjust path as needed
import { useAuth } from '@/context/AuthContext'; // Adjust path as needed
import { useRouter } from 'next/navigation';

// Define the expected structure of the report data
// This should match the response from /api/reports/financial-data
interface ReportData {
  // Example structure - adjust based on actual API response
  title: string;
  period: string;
  directorateInfo: string;
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netResult: number;
  };
  details: Array<{ category: string; amount: number; notes?: string }>;
  generatedAt: string;
}

function ReportInfoContent() {
  const { token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract parameters from URL
  const reportType = searchParams.get('type');
  const directorateIds = searchParams.get('directorates'); // Comma-separated IDs or 'all'
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  useEffect(() => {
    if (authLoading) return; // Wait for auth state
    if (!token) {
      router.push('/login');
      return;
    }

    if (!reportType || !directorateIds || !startDate || !endDate) {
      setError('المعلمات المطلوبة للتقرير غير متوفرة.');
      setIsLoading(false);
      return;
    }

    const fetchReportData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Construct query parameters for the API call
        const query = new URLSearchParams({
          reportType,
          directorateIds,
          startDate,
          endDate,
        }).toString();

        const response = await fetch(`/api/reports/financial-data?${query}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'فشل في جلب بيانات التقرير.');
        }

        const data: ReportData = await response.json();
        setReportData(data);
      } catch (err: any) {
        console.error("Error fetching report data:", err);
        setError(err.message || 'حدث خطأ أثناء جلب بيانات التقرير.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();

  }, [token, authLoading, reportType, directorateIds, startDate, endDate, router]);

  const formatCurrency = (amount: number) => {
    // Basic currency formatting (adjust as needed)
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'YER' }).format(amount);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 p-4 overflow-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 max-w-7xl mx-auto">
          <h1 className="text-xl font-bold text-gray-800 mb-6 text-center">عرض التقرير</h1>

          {isLoading || authLoading ? (
            <div className="text-center py-12 text-sm text-gray-500">جاري تحميل بيانات التقرير...</div>
          ) : error ? (
            <div className="w-full bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative mb-4" role="alert">
              <strong className="font-bold">خطأ!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          ) : reportData ? (
            <div className="space-y-6 text-right">
              {/* Report Header */}
              <div className="border-b pb-3 mb-4">
                <h2 className="text-lg font-bold text-blue-700">{reportData.title}</h2>
                <p className="text-sm text-gray-600">الفترة: {reportData.period}</p>
                <p className="text-sm text-gray-600">المديرية/المديريات: {reportData.directorateInfo}</p>
                <p className="text-xs text-gray-500 mt-1">تاريخ الإنشاء: {new Date(reportData.generatedAt).toLocaleString('ar-EG')}</p>
              </div>

              {/* Report Summary */}
              <div className="bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-sm font-semibold mb-3 text-gray-800">ملخص التقرير</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-green-100 p-3 rounded">
                    <p className="text-green-800 font-medium text-xs">إجمالي الإيرادات</p>
                    <p className="text-lg font-bold text-green-900">{formatCurrency(reportData.summary.totalRevenue)}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded">
                    <p className="text-red-800 font-medium text-xs">إجمالي المصروفات</p>
                    <p className="text-lg font-bold text-red-900">{formatCurrency(reportData.summary.totalExpenses)}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded">
                    <p className="text-blue-800 font-medium text-xs">النتيجة الصافية</p>
                    <p className={`text-lg font-bold ${reportData.summary.netResult >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                      {formatCurrency(reportData.summary.netResult)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Report Details Table */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-800">تفاصيل التقرير</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full text-right text-sm bg-white">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-3 font-bold text-gray-700 text-xs">الفئة/البند</th>
                        <th className="py-2 px-3 font-bold text-gray-700 text-xs">المبلغ</th>
                        <th className="py-2 px-3 font-bold text-gray-700 text-xs">ملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.details.map((item, index) => (
                        <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3 text-gray-800 font-medium">{item.category}</td>
                          <td className="py-2 px-3 text-gray-900 font-mono">{formatCurrency(item.amount)}</td>
                          <td className="py-2 px-3 text-gray-600">{item.notes || '-'}</td>
                        </tr>
                      ))}
                      {reportData.details.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-6 text-sm text-gray-500">لا توجد تفاصيل لعرضها.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Print/Export Buttons if needed */}
              <div className="flex justify-end gap-3 pt-4">
                  <button onClick={() => window.print()} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-200">طباعة</button>
                  {/* Add Export functionality if required */}
              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-sm text-gray-500">لم يتم العثور على بيانات للتقرير المحدد.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Use Suspense to handle client-side data fetching with searchParams
export default function ReportInfoPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-sm">Loading Report...</div>}>
      <ReportInfoContent />
    </Suspense>
  );
}

