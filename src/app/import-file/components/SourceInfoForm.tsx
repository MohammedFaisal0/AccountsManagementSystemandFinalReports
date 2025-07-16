
// src/app/import-file/components/SourceInfoForm.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // Import useAuth for token

// Define the shape of the directorate data from the API
interface Directorate {
  directorate_id: number;
  name: string;
}

// Define the shape of the information passed back to the parent
export interface SourceInfo {
  directorateId: number | null;
  month: number | null;
  year: number | null;
}

// Define the props for the component
interface SourceInfoFormProps {
  onInfoChange: (info: SourceInfo) => void; // Callback to parent
  isDisabled?: boolean; // Optional prop to disable inputs
}

export default function SourceInfoForm({ onInfoChange, isDisabled = false }: SourceInfoFormProps) {
  const { token } = useAuth();
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [selectedDirectorate, setSelectedDirectorate] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch directorates from API
  useEffect(() => {
    const fetchDirectorates = async () => {
      setIsLoading(true);
      setError(null);
      if (!token) {
        // Don't set error here, parent component might handle auth
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/directorates', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch directorates');
        }
        const data: Directorate[] = await response.json();
        setDirectorates(data);
      } catch (err: any) {
        setError(err.message || 'Error loading directorates.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDirectorates();
  }, [token]);

  // Effect to call onInfoChange when selections change
  useEffect(() => {
    const directorateId = selectedDirectorate ? parseInt(selectedDirectorate, 10) : null;
    const month = selectedMonth ? parseInt(selectedMonth, 10) : null;
    const year = selectedYear ? parseInt(selectedYear, 10) : null;

    onInfoChange({ directorateId, month, year });

  }, [selectedDirectorate, selectedMonth, selectedYear, onInfoChange]);

  // Generate year options (e.g., last 10 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Generate month options
  const months = [
    { value: 1, label: 'يناير' }, { value: 2, label: 'فبراير' }, { value: 3, label: 'مارس' },
    { value: 4, label: 'أبريل' }, { value: 5, label: 'مايو' }, { value: 6, label: 'يونيو' },
    { value: 7, label: 'يوليو' }, { value: 8, label: 'أغسطس' }, { value: 9, label: 'سبتمبر' },
    { value: 10, label: 'أكتوبر' }, { value: 11, label: 'نوفمبر' }, { value: 12, label: 'ديسمبر' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-right text-gray-700">معلومات المصدر</h2>
      {error && <p className="text-red-500 text-right mb-4">خطأ: {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Directorate Selection */}
        <div className="flex flex-col">
          <label className="mb-2 text-right font-medium text-gray-700">المديرية <span className="text-red-500">*</span></label>
          <select
            value={selectedDirectorate}
            onChange={(e) => setSelectedDirectorate(e.target.value)}
            disabled={isLoading || isDisabled}
            className="border border-gray-200 rounded-xl p-3 text-right bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            required
          >
            <option value="">اختر المديرية</option>
            {directorates.map((dir) => (
              <option key={dir.directorate_id} value={dir.directorate_id}>
                {dir.name}
              </option>
            ))}
          </select>
        </div>

        {/* Month Selection */}
        <div className="flex flex-col">
          <label className="mb-2 text-right font-medium text-gray-700">الشهر <span className="text-red-500">*</span></label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            disabled={isDisabled}
            className="border border-gray-200 rounded-xl p-3 text-right bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            required
          >
            <option value="">اختر الشهر</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Selection */}
        <div className="flex flex-col">
          <label className="mb-2 text-right font-medium text-gray-700">السنة <span className="text-red-500">*</span></label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={isDisabled}
            className="border border-gray-200 rounded-xl p-3 text-right bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            required
          >
            <option value="">اختر السنة</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Note: Office selection removed as per schema/workflow (file linked to directorate) */}
      </div>
    </div>
  );
}

