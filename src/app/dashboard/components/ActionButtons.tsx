'use client';

import React from 'react';
import Link from 'next/link';
import { usePermissions } from '@/lib/usePermissions';
import { PERMISSIONS } from '@/lib/permissionUtils';

export default function ActionButtons() {
  const { hasPermission } = usePermissions();

  const actionButtons = [
    {
      label: 'إضافة مستخدم جديد',
      href: '/add-users',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      color: 'bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800',
      show: hasPermission(PERMISSIONS.CREATE_USERS)
    },
    {
      label: 'إدارة المستخدمين',
      href: '/users',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'bg-green-500 hover:bg-green-600',
      show: hasPermission(PERMISSIONS.VIEW_USERS)
    },
    {
      label: 'رفع ملفات',
      href: '/import-file',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      color: 'bg-purple-500 hover:bg-purple-600',
      show: hasPermission(PERMISSIONS.UPLOAD_FILES)
    },
    {
      label: 'عرض التقارير',
      href: '/reports',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-orange-500 hover:bg-orange-600',
      show: hasPermission(PERMISSIONS.VIEW_REPORTS)
    }
  ];

  const visibleButtons = actionButtons.filter(button => button.show);

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-800 mb-3">إجراءات سريعة</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {visibleButtons.map((button, index) => (
          <Link
            key={index}
            href={button.href}
            className={`${button.color} text-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 space-x-reverse`}
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-4 h-4">
              {button.icon}
              </div>
              <span className="font-medium text-sm">{button.label}</span>
            </div>
          </Link>
        ))}
      </div>
      
      {visibleButtons.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm">لا توجد إجراءات متاحة لك في الوقت الحالي</p>
        </div>
      )}
    </div>
  );
}
