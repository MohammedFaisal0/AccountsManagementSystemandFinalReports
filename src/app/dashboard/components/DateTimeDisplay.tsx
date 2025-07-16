'use client';

import React, { useState, useEffect } from 'react';

export default function DateTimeDisplay() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time as HH:MM:SS
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
      
      // Format date in Arabic
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setDate(now.toLocaleDateString('ar-EG', options));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-1">الوقت والتاريخ</h3>
        <p className="text-xs text-gray-500">التوقيت الحالي للنظام</p>
      </div>

      {/* Time Display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 w-full text-center shadow-lg">
          <div className="text-2xl font-bold text-white font-mono tracking-wider mb-2">
            {time}
          </div>
          <div className="text-xs text-blue-100 font-medium">
            {date}
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <div className="text-xs text-blue-600 mb-1">اليوم</div>
          <div className="text-xs font-semibold text-blue-800">
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long' })}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-2 text-center">
          <div className="text-xs text-green-600 mb-1">الحالة</div>
          <div className="text-xs font-semibold text-green-800">متصل</div>
        </div>
      </div>
    </div>
  );
}