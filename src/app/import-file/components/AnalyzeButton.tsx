import React from 'react';

interface AnalyzeButtonProps {
  isReady: boolean;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

export default function AnalyzeButton({ isReady, isAnalyzing, onAnalyze }: AnalyzeButtonProps) {
  return (
    <div className="flex justify-center pt-6">
      <button
        className={`group relative px-12 py-4 rounded-xl text-white flex items-center justify-center text-lg font-bold transition-all duration-300 transform ${
          isReady 
            ? 'bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg hover:shadow-xl' 
            : 'bg-gray-300 cursor-not-allowed'
        }`}
        onClick={onAnalyze}
        disabled={!isReady}
      >
        {isAnalyzing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  );
} 