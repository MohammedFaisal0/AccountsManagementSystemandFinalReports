
// src/app/reports/components/DirectorateSelector.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

export default function DirectorateSelector({ selectedDirectorates, onDirectorateChange, isDisabled = false }) {
  const { token } = useAuth(); // Get token for API call
  const [directorates, setDirectorates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectionType, setSelectionType] = useState('single'); // 'single' or 'all'

  // Fetch directorates from API
  useEffect(() => {
    const fetchDirectorates = async () => {
      setIsLoading(true);
      setError(null);
      if (!token) {
        // Don't set error, assume parent handles auth check
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
        const data = await response.json();
        setDirectorates(data);
      } catch (err) {
        setError(err.message || 'Error loading directorates.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDirectorates();
  }, [token]);

  const handleSelectionTypeChange = (type) => {
    setSelectionType(type);
    if (type === 'all') {
      // Select all fetched directorate IDs
      onDirectorateChange(directorates.map(d => d.directorate_id));
    } else {
      // Clear selection when switching to single
      onDirectorateChange([]);
    }
  };

  const handleDirectorateChange = (directorateId) => {
    if (selectionType === 'all') {
      return; // No individual selection in 'all' mode
    }
    // In single mode, always pass an array with one ID
    onDirectorateChange([directorateId]);
  };

  const effectiveDisabled = isDisabled || isLoading;

  return (
    <div className="space-y-3">
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => handleSelectionTypeChange('single')}
          disabled={effectiveDisabled}
          className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm ${
            selectionType === 'single'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${effectiveDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          مديرية واحدة
        </button>
        <button
          type="button"
          onClick={() => handleSelectionTypeChange('all')}
          disabled={effectiveDisabled}
          className={`px-3 py-1 rounded-lg transition-all duration-200 text-sm ${
            selectionType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${effectiveDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          جميع المديريات
        </button>
      </div>

      {error && <p className="text-red-500 text-xs text-right">خطأ: {error}</p>}

      {isLoading ? (
        <div className="text-center py-3 text-sm text-gray-500">جاري تحميل المديريات...</div>
      ) : selectionType === 'single' ? (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {directorates.length > 0 ? (
            directorates.map((directorate) => (
              <label
                key={directorate.directorate_id}
                className={`flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 ${effectiveDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-sm text-gray-700">{directorate.name}</span>
                <input
                  type="radio"
                  name="directorate"
                  value={directorate.directorate_id}
                  checked={selectedDirectorates.includes(directorate.directorate_id)}
                  onChange={() => handleDirectorateChange(directorate.directorate_id)}
                  disabled={effectiveDisabled}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </label>
            ))
          ) : (
            <div className="text-center py-3 text-sm text-gray-500">لا توجد مديريات متاحة.</div>
          )}
        </div>
      ) : (
        // selectionType === 'all'
        <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          تم اختيار جميع المديريات ({directorates.length} مديرية)
        </div>
      )}
    </div>
  );
}

