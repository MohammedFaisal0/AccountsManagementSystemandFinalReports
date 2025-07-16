'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/usePermissions';
import { PERMISSIONS } from '@/lib/permissionUtils';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Get user initials from name or email
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'م';
  };

  // Get user display name
  const getUserDisplayName = () => {
    return user?.name || user?.email || 'مستخدم النظام';
  };

  // Get user role display
  const getUserRole = () => {
    if (user?.role) {
      const roleMap: { [key: string]: string } = {
        'administrator': 'مدير النظام',
        'employee': 'موظف',
        'reviewer': 'مراجع'
      };
      return roleMap[user.role] || user.role;
    }
    return 'موظف';
  };

  // Menu items with permission checks
  const menuItems = [
    {
      label: 'لوحة التحكم',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      ),
      show: true // Dashboard is always accessible
    },
    {
      label: 'إدارة المستخدمين',
      href: '/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      show: hasPermission(PERMISSIONS.VIEW_USERS)
    },
    {
      label: 'إضافة مستخدم',
      href: '/add-users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      show: hasPermission(PERMISSIONS.CREATE_USERS)
    },
    {
      label: 'رفع الملفات',
      href: '/import-file',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      show: hasPermission(PERMISSIONS.UPLOAD_FILES)
    },
    {
      label: 'التقارير',
      href: '/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      show: hasPermission(PERMISSIONS.VIEW_REPORTS)
    }
  ];

  return (
    <div className="w-72 bg-gradient-to-b from-blue-600 to-blue-700 text-white p-6 flex flex-col shadow-xl">
      
      {/* User Profile Section */}
      <div className="mb-8 mt-4 flex items-start justify-start">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-xl border border-white/30">
          {getUserInitials()}
        </div>
        <div className="mr-3 text-right flex-1">
          <div className="font-bold text-lg text-white">{getUserDisplayName()}</div>
          <div className="text-sm text-blue-100">{getUserRole()}</div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="w-full flex flex-col items-end space-y-2 mt-6 flex-1">
        {menuItems.map((item) => 
          item.show ? (
            <Link 
              key={item.href}
              href={item.href} 
              className="flex items-start justify-start w-full p-3 hover:bg-white/10 rounded-lg text-base group transition-all duration-200"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-md group-hover:bg-white/30 transition-colors duration-200">
                {item.icon}
              </div>
              <span className="mr-3 font-medium">{item.label}</span>
            </Link>
          ) : null
        )}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-6 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-start justify-start w-full p-3 hover:bg-red-500/20 rounded-lg text-base group transition-all duration-200 text-red-100 hover:text-red-200"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-red-500/20 rounded-md group-hover:bg-red-500/30 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="mr-3 font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}

