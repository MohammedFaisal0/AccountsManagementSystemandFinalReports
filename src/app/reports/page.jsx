
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import ReportTypeSelector, { ReportTypeOption } from './components/ReportTypeSelector'; // Assuming type export
import DirectorateSelector, { DirectorateOption } from './components/DirectorateSelector'; // Assuming type export
import DateSelector from './components/DateSelector';

export default function ReportsPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<ReportTypeOption | null>(null);
  const [selectedDirectorates, setSelectedDirectorates] = useState<DirectorateOption[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      directorateIds: selectedDirectorates.map(d => d.value).join(','), // Pass IDs as comma-separated string
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

    // --- Option A (Alternative - Fetch here, pass data via state): ---
    /*
    try {
      const token = localStorage.getItem('authToken');
      const queryParams = new URLSearchParams();
      if (selectedType) queryParams.append('reportType', selectedType.value);
      selectedDirectorates.forEach(dir => queryParams.append('directorateId', dir.value.toString()));
      if (selectedDate) queryParams.append('date', selectedDate); // Adjust key based on API (e.g., month, year)

      const response = await fetch(`/api/reports/financial-data?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch report data.');
      }

      // TODO: Store fetched 'data' in a shared state (Context, Zustand, Redux)
      // Example: reportStore.setReportData(data);

      // Navigate to the report display page
      router.push('/reports/report-info'); // report-info page would read from shared state

    } catch (err: any) {
      console.error("Error fetching report data:", err);
      setError(err.message || 'An error occurred while generating the report.');
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="w-full flex flex-col items-center justify-center mt-16">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-3xl w-full">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">نظام إنشاء التقارير</h1>
          <p className="text-lg text-gray-600 mb-10 text-center">اختر نوع التقرير الذي ترغب في إنشائه.</p>

          {error && (
            <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">خطأ!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Report Type Selection */}
            <div className="space-y-4">
              <label className="block text-right font-medium text-gray-700">
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
              <div className="space-y-4">
                <label className="block text-right font-medium text-gray-700">
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
              <div className="space-y-4">
                <DateSelector
                  reportType={selectedType.value}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  isDisabled={isLoading}
                />
              </div>
            )}

            {/* Submit Button - Only show if all selections are made */}
            {selectedType && selectedDirectorates.length > 0 && selectedDate && (
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white text-lg font-medium py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 flex items-center justify-center ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:ring-green-400'}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

// NOTE: Assumes ReportTypeSelector exports ReportTypeOption { value: string, label: string }
// NOTE: Assumes DirectorateSelector exports DirectorateOption { value: number, label: string }
// NOTE: Assumes DateSelector handles its own logic based on reportType
// NOTE: The target page /reports/report-info needs to be created and handle fetching data based on query parameters.

