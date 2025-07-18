
// src/app/reports/components/ReportTypeSelector.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

export default function ReportTypeSelector({ selectedType, onTypeSelect, isDisabled = false }) {
  const { token } = useAuth(); // Get token for API call
  const [reportTypes, setReportTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch report types from API
  useEffect(() => {
    const fetchReportTypes = async () => {
      setIsLoading(true);
      setError(null);
      if (!token) {
        // Don't set error, assume parent handles auth check
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch('/api/report-types', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch report types');
        }
        const data = await response.json();
        setReportTypes(data);
      } catch (err) {
        setError(err.message || 'Error loading report types.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportTypes();
  }, [token]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative w-full max-w-xl" ref={dropdownRef}>
      <button
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-between px-4 ${isDisabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !isDisabled && !isLoading && setDropdownOpen((open) => !open)}
        type="button"
        disabled={isDisabled || isLoading}
      >
        <span>{isLoading ? 'جاري التحميل...' : (selectedType ? selectedType.label : 'اختر نوع التقرير')}</span>
        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {error && <p className="text-red-500 text-xs mt-1 text-right">خطأ: {error}</p>}
      {dropdownOpen && !isLoading && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg animate-fade-in flex flex-col overflow-hidden max-h-60 overflow-y-auto">
          {reportTypes.length > 0 ? (
            reportTypes.map((type) => (
              <button
                key={type.value}
                className={`text-right px-4 py-2 text-sm hover:bg-blue-50 focus:bg-blue-100 transition-colors duration-150 ${selectedType?.value === type.value ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-700'}`}
                onClick={() => {
                  onTypeSelect(type);
                  setDropdownOpen(false);
                }}
                type="button"
              >
                {type.label}
              </button>
            ))
          ) : (
            <div className="text-center px-4 py-2 text-sm text-gray-500">لا توجد أنواع تقارير متاحة.</div>
          )}
        </div>
      )}
    </div>
  );
}

