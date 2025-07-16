
// src/app/import-file/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import FileUploader from './components/FileUploader';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const MONTHS = [
  { value: 1, label: 'يناير' }, { value: 2, label: 'فبراير' }, { value: 3, label: 'مارس' },
  { value: 4, label: 'أبريل' }, { value: 5, label: 'مايو' }, { value: 6, label: 'يونيو' },
  { value: 7, label: 'يوليو' }, { value: 8, label: 'أغسطس' }, { value: 9, label: 'سبتمبر' },
  { value: 10, label: 'أكتوبر' }, { value: 11, label: 'نوفمبر' }, { value: 12, label: 'ديسمبر' },
];

export default function ImportPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    // Defensive check for month
    if (typeof month !== 'number' || month < 1 || month > 12) {
      setError('يرجى اختيار شهر صحيح.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      // Send month and sheet_number as strings
      formData.append('sheet_number', String(pageNumber));
      formData.append('month', String(month));
      
      // Debug: log what is being sent
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
      
      // Log the response status and headers
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const result = await response.json();
      console.log('Response result:', result);
      
      if (!response.ok) {
        throw new Error(result.detail || 'فشل تحليل الملف في الباكند بايثون.');
      }
      setAnalysisResult(result.data);
      setSuccessMessage('تم تحليل الملف بنجاح. راجع البيانات أدناه.');
    } catch (err: any) {
      console.error('Error details:', err);
      setError(err.message || 'حدث خطأ أثناء تحليل الملف في الباكند بايثون.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isReady = !!uploadedFile && !!month && !!pageNumber && !isAnalyzing && !loading;

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">استيراد وتحليل البيانات</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              قم برفع ملف Excel الخاص بك واختر الشهر والصفحة المناسبة لتحليل البيانات المالية
            </p>
          </div>



          {/* Main Content Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">رفع الملف</h2>
                  <p className="text-blue-100">اختر ملف Excel وحدد المعايير المطلوبة</p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              {/* Configuration Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-right">إعدادات التحليل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Month Selection */}
                  <div className="space-y-3">
                    <label className="block text-right font-medium text-gray-700 text-lg">
                      الشهر <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={month ?? ''}
                        onChange={e => setMonth(e.target.value ? Number(e.target.value) : null)}
                        disabled={isAnalyzing || loading}
                        className="w-full border-2 border-gray-200 rounded-2xl p-4 text-right bg-white shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-base appearance-none"
                        required
                      >
                        <option value="">اختر الشهر</option>
                        {MONTHS.map(m => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Page Selection */}
                  <div className="space-y-3">
                    <label className="block text-right font-medium text-gray-700 text-lg">
                      رقم الصفحة <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={pageNumber ?? ''}
                        onChange={e => setPageNumber(e.target.value ? Number(e.target.value) : null)}
                        disabled={isAnalyzing || loading}
                        className="w-full border-2 border-gray-200 rounded-2xl p-4 text-right bg-white shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-base appearance-none"
                        required
                      >
                        <option value="">اختر الصفحة</option>
                        <option value={1}>صفحة 1</option>
                        <option value={2}>صفحة 2</option>
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-right">رفع الملف</h3>
                <FileUploader onFileUpload={handleFileUpload} isDisabled={isAnalyzing || loading} />
                {uploadedFile && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl text-right">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-green-800">تم اختيار الملف بنجاح</p>
                          <p className="text-sm text-green-600 font-mono">{uploadedFile.name}</p>
                        </div>
                      </div>
                      <div className="text-sm text-green-600">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-6">
                <button
                  className={`group relative px-12 py-4 rounded-2xl text-white flex items-center justify-center text-lg font-semibold transition-all duration-300 transform ${
                    isReady 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  onClick={handleAnalyze}
                  disabled={!isReady}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      بدء التحليل
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Result Section */}
          {analysisResult && (
            <div className="mt-12 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">نتائج التحليل</h2>
                    <p className="text-green-100">تم تحليل البيانات بنجاح</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="bg-gray-50 rounded-2xl p-6 overflow-x-auto border border-gray-200">
                  <div className="text-sm text-gray-800 whitespace-pre-wrap text-left" style={{direction: 'ltr'}}>
                    <pre className="font-mono text-xs">{JSON.stringify(analysisResult, null, 2)}</pre>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center space-x-4 space-x-reverse">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                    حفظ البيانات
                  </button>
                  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium">
                    تحليل ملف آخر
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

