'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import ReportTypeSelector from './components/ReportTypeSelector';
import DirectorateSelector from './components/DirectorateSelector';
import DateSelector from './components/DateSelector';

interface ReportType {
  value: string;
  label: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [selectedDirectorates, setSelectedDirectorates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!selectedType || selectedDirectorates.length === 0 || !selectedDate) {
      setError("يرجى إكمال جميع الاختيارات المطلوبة.");
      setIsLoading(false);
      return;
    }

    // Prepare filter parameters for the API call and navigation
    const filters = {
      reportType: selectedType.value,
      directorateIds: selectedDirectorates.join(','), // Pass IDs as comma-separated string
      date: selectedDate, // Assuming date is already in a suitable string format (e.g., YYYY-MM)
      // Add other potential filters here based on reportType if needed
    };

    // --- Option B from Plan: Navigate with filters, let report-info fetch data ---
    try {
      // Construct query string from filters
      const queryString = new URLSearchParams(filters).toString();
      
      // Navigate to the report display page, passing the filters
      router.push(`/reports/report-info?${queryString}`);
      
      // No API call needed here in Option B
      // setIsLoading(false); // Loading stops implicitly on navigation

    } catch (err) {
      console.error("Navigation error:", err);
      setError("حدث خطأ أثناء محاولة الانتقال إلى صفحة التقرير.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />

      <div className="w-full flex flex-col items-center justify-center mt-16">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 max-w-2xl w-full">
          <h1 className="text-xl font-bold mb-2 text-gray-800 text-center">نظام إنشاء التقارير</h1>
          <p className="text-sm text-gray-600 mb-6 text-center">اختر نوع التقرير الذي ترغب في إنشائه.</p>

          {error && (
            <div className="w-full bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative mb-4 text-sm" role="alert">
              <strong className="font-bold">خطأ!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Report Type Selection */}
            <div className="space-y-2">
              <label className="block text-right font-medium text-gray-700 text-sm">
                نوع التقرير <span className="text-red-500">*</span>
              </label>
              <ReportTypeSelector
                selectedType={selectedType}
                onTypeSelect={setSelectedType}
                isDisabled={isLoading}
              />
            </div>

            {/* Directorate Selection - Only show if report type is selected */}
            {selectedType && (
              <div className="space-y-2">
                <label className="block text-right font-medium text-gray-700 text-sm">
                  اختيار المديرية <span className="text-red-500">*</span>
                </label>
                <DirectorateSelector
                  selectedDirectorates={selectedDirectorates}
                  onDirectorateChange={setSelectedDirectorates}
                  isDisabled={isLoading}
                />
              </div>
            )}

            {/* Date Selection - Only show if report type and directorate are selected */}
            {selectedType && selectedDirectorates.length > 0 && (
              <div className="space-y-2">
                <DateSelector
                  reportType={selectedType.value}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                />
              </div>
            )}

            {/* Submit Button - Only show if all selections are made */}
            {selectedType && selectedDirectorates.length > 0 && selectedDate && (
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white text-sm font-medium py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 flex items-center justify-center ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:ring-green-400'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري الإنشاء...
                  </>
                ) : (
                  'إنشاء التقرير'
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 