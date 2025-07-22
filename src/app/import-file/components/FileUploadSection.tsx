import React from 'react';
import FileUploader from './FileUploader';

interface FileUploadSectionProps {
  onFileUpload: (file: File) => void;
  isAnalyzing: boolean;
  loading: boolean;
}

export default function FileUploadSection({
  onFileUpload,
  isAnalyzing,
  loading
}: FileUploadSectionProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-right">رفع الملف</h3>
      <FileUploader onFileUpload={onFileUpload} isDisabled={isAnalyzing || loading} />
    </div>
  );
} 