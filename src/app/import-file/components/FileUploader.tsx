'use client';

import React, { useState, useRef } from 'react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isDisabled?: boolean;
}

export default function FileUploader({ onFileUpload, isDisabled = false }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileUpload(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-500 ${
        isDragging 
          ? 'border-blue-500 bg-blue-50 shadow-2xl scale-[1.02] ring-4 ring-blue-100' 
          : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
      } ${isDisabled ? 'opacity-50 pointer-events-none' : ''}`}
      onDragOver={isDisabled ? undefined : handleDragOver}
      onDragLeave={isDisabled ? undefined : handleDragLeave}
      onDrop={isDisabled ? undefined : handleDrop}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative flex flex-col items-center justify-center">
        {/* Icon Container */}
        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 ${
          isDragging 
            ? 'bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 shadow-2xl scale-110' 
            : 'bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 shadow-lg'
        }`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-12 w-12 transition-all duration-500 ${
              isDragging ? 'text-white scale-110' : 'text-gray-400'
            }`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
        </div>
        
        {/* Text Content */}
        <div className="space-y-4">
          <h3 className={`text-2xl font-bold transition-colors duration-300 ${
            isDragging ? 'text-blue-600' : 'text-gray-700'
          }`}>
            {isDragging ? 'أفلت الملف هنا' : 'اسحب ملف Excel هنا'}
          </h3>
          
          <p className={`text-lg transition-colors duration-300 ${
            isDragging ? 'text-blue-500' : 'text-gray-500'
          }`}>
            أو انقر للاختيار من جهازك
          </p>
          
          <p className="text-sm text-gray-400">
            يدعم الملفات: .xlsx, .xls
          </p>
        </div>
        
        {/* File Info */}
        {fileName && (
          <div className="mt-8 w-full max-w-md">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 text-right">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">تم اختيار الملف</p>
                    <p className="text-sm text-green-600 font-mono truncate">{fileName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls"
          className="hidden"
          disabled={isDisabled}
        />
        
        {/* Upload Button */}
        <button
          onClick={handleButtonClick}
          className={`mt-8 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            isDragging
              ? 'bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 text-white shadow-xl'
              : 'bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg hover:shadow-xl'
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isDisabled}
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>اختر ملف Excel</span>
          </div>
        </button>
      </div>
    </div>
  );
}