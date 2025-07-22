'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/lib/usePermissions';
import { PERMISSIONS } from '@/lib/permissionUtils';

export default function Sidebar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Get user initials from name or email
  const getUserInitials = () => {
    if (!mounted || !user) return 'م';
    
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
    if (!mounted || !user) return 'جاري التحميل...';
    return user?.name || user?.email || 'مستخدم النظام';
  };

  // Get user role display
  const getUserRole = () => {
    if (!mounted || !user) return 'جاري التحميل...';
    
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
      show: mounted && hasPermission(PERMISSIONS.VIEW_USERS)
    },
    {
      label: 'رفع الملفات',
      href: '/import-file',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      show: mounted && hasPermission(PERMISSIONS.UPLOAD_FILES)
    },
    {
      label: 'التقارير',
      href: '/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      show: mounted && hasPermission(PERMISSIONS.VIEW_REPORTS)
    }
  ];

  // Show loading state until mounted
  if (!mounted || loading) {
    return (
      <aside className="w-72 min-h-screen bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 rounded-xl shadow-2xl p-6 flex flex-col items-stretch transition-all duration-300">
        <div className="flex flex-col items-center justify-center mt-6 mb-12">
          <div className="text-center">
            <div className="font-extrabold text-xl text-white tracking-tight mb-1">جاري التحميل...</div>
            <div className="text-sm text-blue-200 font-medium">يرجى الانتظار</div>
          </div>
        </div>
        <nav className="flex flex-col items-end gap-1 flex-1">
          <div className="w-full h-8 bg-blue-800/40 rounded-lg animate-pulse"></div>
          <div className="w-full h-8 bg-blue-800/40 rounded-lg animate-pulse"></div>
          <div className="w-full h-8 bg-blue-800/40 rounded-lg animate-pulse"></div>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 rounded-xl shadow-2xl p-6 flex flex-col items-stretch transition-all duration-300">
      {/* User Info */}
      <div className="flex flex-col items-center justify-center mt-6 mb-12">
        <div className="text-center">
          <div className="font-extrabold text-xl text-white tracking-tight mb-1">{getUserDisplayName()}</div>
          <div className="text-sm text-blue-200 font-medium">{getUserRole()}</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col items-end gap-1 flex-1">
        {menuItems.map((item) =>
          item.show ? (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-800/60 focus:bg-blue-900/70 active:bg-blue-900/90 text-base font-medium text-blue-100 hover:text-white focus:text-white mb-1"
            >
              <span className="ml-3 flex items-center justify-center w-9 h-9 bg-blue-900/40 rounded-md group-hover:bg-blue-800/70 transition-colors duration-200">
                {item.icon}
              </span>
              <span className="mr-2">{item.label}</span>
            </Link>
          ) : null
        )}
      </nav>

      {/* Logout Button */}
      <div className="mt-8 pt-6 border-t border-blue-800/60">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-600/20 focus:bg-red-700/30 active:bg-red-800/40 text-base font-semibold text-red-200 hover:text-white focus:text-white"
        >
          <span className="ml-3 flex items-center justify-center w-9 h-9 bg-red-900/30 rounded-md group-hover:bg-red-700/40 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="mr-2">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}

