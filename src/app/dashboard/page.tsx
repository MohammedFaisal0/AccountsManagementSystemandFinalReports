'use client';

import React from 'react';
import TaskList from './components/TaskList';
import NotificationList from './components/NotificationList';
import DateTimeDisplay from './components/DateTimeDisplay';
import Sidebar from '../../components/Sidebar';
import ActionButtons from './components/ActionButtons';
import NoSSR from '../../components/NoSSR';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar/>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
          <h1 className="text-xl font-bold text-gray-800">لوحة التحكم</h1>
          <p className="text-gray-600 text-xs mt-1">مرحباً بك في نظام إدارة الحسابات</p>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-6xl mx-auto">
            
            {/* Date/Time Section */}
            <div className="lg:col-span-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300">
              <DateTimeDisplay />
            </div>
            
            {/* Tasks Section */}
            <div className="lg:col-span-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300">
              <TaskList />
            </div>
            
            {/* Notifications Section */}
            <div className="lg:col-span-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300">
              <NotificationList />
            </div>

            {/* Action Buttons Section */}
            <div className="lg:col-span-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-all duration-300">
              <NoSSR fallback={
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-3">إجراءات سريعة</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              }>
                <ActionButtons />
              </NoSSR>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}