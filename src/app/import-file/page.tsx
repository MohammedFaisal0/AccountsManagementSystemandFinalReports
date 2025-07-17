
// src/app/import-file/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ImportHeader from './components/ImportHeader';
import ConfigurationForm from './components/ConfigurationForm';
import FileUploadSection from './components/FileUploadSection';
import AnalyzeButton from './components/AnalyzeButton';
import AnalysisResults from './components/AnalysisResults';

export default function ImportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setAnalysisResult(null);
    setError(null);
    setSuccessMessage(null);
  };

  const handleAnalyze = async () => {
    setError(null);
    setSuccessMessage(null);
    setAnalysisResult(null);
    if (!uploadedFile || !month || !pageNumber) {
      setError('يرجى تعبئة جميع الحقول المطلوبة.');
      return;
    }
    if (typeof month !== 'number' || month < 1 || month > 12) {
      setError('يرجى اختيار شهر صحيح.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
     formData.append('file', uploadedFile);
      formData.append('sheet_number', String(pageNumber));
      formData.append('month', String(month));

      console.log('Sending to backend:', { 
        month: String(month), 
        sheet_number: String(pageNumber),
        fileName: uploadedFile.name 
      });
      
      const pythonApiUrl = 'http://localhost:8000/process-excel/';
      const response = await fetch(pythonApiUrl, {
        method: 'POST',
        body: formData,
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        let errorData: { detail?: string };
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { detail: errorText };
        }
        throw new Error(errorData.detail || `فشل تحليل الملف في الباكند بايثون. (Status: ${response.status})`);
      }
      
      const result = await response.json();
      console.log('Response result:', result);
      
      // The Python backend returns data in result.data_sent.processed_data
      setSuccessMessage('تم تحليل الملف بنجاح. راجع البيانات أدناه.');
      setAnalysisResult(result.data_sent);
    } catch (err: unknown) {
      console.error('Error details:', err);
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء تحليل الملف في الباكند بايثون.';
      setError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitToDatabase = async () => {
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    if (!analysisResult) {
      setError('لا توجد بيانات لتحويلها إلى قاعدة البيانات.');
      setIsSubmitting(false);
      return;
    }

    try {
      const nextJsApiUrl = 'http://localhost:3000/api/data/process';
      const payload = {
        file_name: uploadedFile?.name || 'unknown_file.xlsx',
        month: String(month),
        year: String(new Date().getFullYear()),
        directorate_name: analysisResult.directorate_name,
        sheet_number_processed: pageNumber,
        processed_data: analysisResult
      };

      const response = await fetch(nextJsApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'فشل حفظ البيانات في قاعدة البيانات.');
      }

      setSuccessMessage('تم حفظ البيانات في قاعدة البيانات بنجاح!');
      setAnalysisResult(null);
      setUploadedFile(null);
      setMonth(null);
      setPageNumber(null);

    } catch (err: unknown) {
      console.error('Error submitting to database:', err);
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ أثناء حفظ البيانات في قاعدة البيانات.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setUploadedFile(null);
    setMonth(null);
    setPageNumber(null);
    setError(null);
    setSuccessMessage(null);
  };

  const isReady = !!uploadedFile && !!month && !!pageNumber && !isAnalyzing && !loading;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="max-w-6xl mx-auto gap-4">
            <ImportHeader />
          {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-4">
            {/* Card Header */}
              <div className="bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 px-4 py-4">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white mb-1">رفع الملف</h2>
                    <p className="text-blue-100 text-sm">اختر ملف Excel وحدد المعايير المطلوبة</p>
                  </div>
                </div>
              </div>
              {/* Card Body */}
              <div className="p-4">
                <ConfigurationForm
                  month={month}
                  pageNumber={pageNumber}
                  setMonth={setMonth}
                  setPageNumber={setPageNumber}
                  isAnalyzing={isAnalyzing}
                  loading={loading}
                />

                <FileUploadSection
                  onFileUpload={handleFileUpload}
                  isAnalyzing={isAnalyzing}
                  loading={loading}
                />

                <AnalyzeButton
                  isReady={isReady}
                  isAnalyzing={isAnalyzing}
                  onAnalyze={handleAnalyze}
                />
            </div>
          </div>

            {/* Analysis Results */}
          {analysisResult && (
              <AnalysisResults
                analysisResult={analysisResult}
                pageNumber={pageNumber}
                isSubmitting={isSubmitting}
                onSubmitToDatabase={handleSubmitToDatabase}
                onReset={handleReset}
                successMessage={successMessage}
              />
            )}

            {/* Error Messages Only */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <h3 className="font-bold text-red-800 text-base mb-1">خطأ</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
            </div>
          )}
            </div>
        </div>
      </div>
    </div>
  );
}


