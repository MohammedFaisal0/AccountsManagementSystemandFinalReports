
// src/app/import-file/components/DataValidationTable.tsx
import React from 'react';

// Define the shape of the validation data expected from the API
// Adjust this based on the actual structure returned by /api/files/[fileId]/validation
export interface ValidationResult {
  row_number: number; // Example: Row number from the Excel file
  column_name: string; // Example: Column where error occurred
  error_message: string; // Example: Description of the validation error
  value: string | number | null; // Example: The problematic value
  // Add other relevant fields returned by your validation API
}

interface DataValidationTableProps {
  validationResults: ValidationResult[];
  isLoading: boolean;
}

export default function DataValidationTable({ validationResults, isLoading }: DataValidationTableProps) {
  if (isLoading) {
    return <div className="text-center py-10 text-gray-500">جاري تحميل نتائج التحقق...</div>;
  }

  if (!validationResults || validationResults.length === 0) {
    return <div className="text-center py-10 text-gray-400">لا توجد نتائج تحقق لعرضها. قم برفع ملف أولاً.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            {/* Adjust headers based on the actual ValidationResult structure */}
            <th className="py-3 px-4 text-right font-medium text-gray-700 border-b">رقم الصف</th>
            <th className="py-3 px-4 text-right font-medium text-gray-700 border-b">اسم العمود</th>
            <th className="py-3 px-4 text-right font-medium text-gray-700 border-b">القيمة</th>
            <th className="py-3 px-4 text-right font-medium text-gray-700 border-b">رسالة الخطأ</th>
            {/* Add more headers if needed */}
          </tr>
        </thead>
        <tbody>
          {validationResults.map((row, index) => (
            // Using index as key is okay here if row_number isn't guaranteed unique across validations
            <tr key={index} className={'bg-red-50'}> {/* Assuming all results are errors for now */}
              {/* Adjust cell rendering based on ValidationResult structure */}
              <td className="py-3 px-4 text-right border-b text-gray-700">{row.row_number}</td>
              <td className="py-3 px-4 text-right border-b text-gray-700">{row.column_name}</td>
              <td className="py-3 px-4 text-right border-b text-gray-700 font-mono">{String(row.value)}</td>
              <td className="py-3 px-4 text-right border-b text-red-700">{row.error_message}</td>
              {/* Add more cells if needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

