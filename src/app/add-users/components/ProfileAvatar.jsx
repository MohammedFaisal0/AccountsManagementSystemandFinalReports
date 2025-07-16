import React from 'react';

export default function ProfileAvatar({ avatar, onAvatarClick, onAvatarChange, fileInputRef }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group cursor-pointer" onClick={onAvatarClick}>
        <div className="w-16 h-16 rounded-full border-3 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:border-blue-200 transition-all duration-300">
          {avatar ? (
            <img
              src={avatar}
              alt="صورة المستخدم"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={onAvatarChange}
        />
      </div>
      
      <div className="space-y-1">
      <button
        type="button"
        onClick={onAvatarClick}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1.5 rounded-md font-medium transition-all duration-300 text-xs border border-white border-opacity-30 hover:border-opacity-50"
      >
        تحميل صورة
      </button>
      
      {avatar && (
        <button
          type="button"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            // Trigger avatar change with null to clear the avatar
            const event = { target: { files: [] } };
            onAvatarChange(event);
          }}
            className="text-red-200 hover:text-red-100 text-xs font-medium transition-colors duration-200"
        >
            إزالة
        </button>
      )}
      </div>
    </div>
  );
} 