import React, { useState } from 'react';
import ProfileAvatar from './ProfileAvatar';

const roles = [
  { label: 'مدير النظام', value: 'administrator', description: 'صلاحيات كاملة في النظام' },
  { label: 'موظف', value: 'employee', description: 'صلاحيات محدودة للموظفين' },
  { label: 'مراجع', value: 'reviewer', description: 'صلاحيات المراجعة والتحقق' },
];

const UserForm = ({ 
  form, 
  setForm, 
  handleSubmit, 
  isSubmitting, 
  error, 
  successMessage, 
  isEditMode = false,
  avatar,
  onAvatarChange,
  fileInputRef
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-1">
        {isEditMode ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
            </h1>
            <p className="text-blue-100 text-sm">
              {isEditMode ? 'قم بتحديث معلومات المستخدم' : 'أدخل معلومات المستخدم الجديد'}
            </p>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <ProfileAvatar
              avatar={avatar}
              onAvatarClick={handleAvatarClick}
              onAvatarChange={onAvatarChange}
              fileInputRef={fileInputRef}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
      {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-right">
            <div className="flex items-center">
              <svg className="w-5 h-5 ml-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
        </div>
      )}

      {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-right">
            <div className="flex items-center">
              <svg className="w-5 h-5 ml-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
        </div>
      )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right border-b border-gray-200 pb-2">
              المعلومات الشخصية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  الاسم الكامل <span className="text-red-500">*</span>
          </label>
                <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white shadow-sm text-gray-900 transition-all duration-200"
                    placeholder="أدخل الاسم الكامل"
            required
          />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
        </div>

        {/* Email */}
        <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  البريد الإلكتروني <span className="text-red-500">*</span>
          </label>
                <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white shadow-sm text-gray-900 transition-all duration-200"
                    placeholder="أدخل البريد الإلكتروني"
            required
          />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                    </svg>
                  </div>
        </div>
        </div>

        {/* Phone */}
        <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 text-right">
            رقم الهاتف
          </label>
                <div className="relative">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white shadow-sm text-gray-900 transition-all duration-200"
                    placeholder="أدخل رقم الهاتف"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
        </div>

        {/* Role */}
        <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  الدور <span className="text-red-500">*</span>
          </label>
                <div className="relative">
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white shadow-sm appearance-none text-gray-900 transition-all duration-200"
            required
          >
            <option value="">اختر الدور</option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label} - {role.description}
              </option>
            ))}
          </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
        </div>

          {/* Security Information Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right border-b border-gray-200 pb-2">
              معلومات الأمان
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                  كلمة المرور {isEditMode && <span className="text-gray-500 text-xs">(اختياري للتحديث)</span>}
                  {!isEditMode && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
          <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
            onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white shadow-sm text-gray-900 transition-all duration-200"
                    placeholder="أدخل كلمة المرور"
                    required={!isEditMode}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              {!isEditMode && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 text-right">
                    تأكيد كلمة المرور <span className="text-red-500">*</span>
          </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white shadow-sm text-gray-900 transition-all duration-200"
                      placeholder="أعد إدخال كلمة المرور"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 space-x-reverse pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              إلغاء
            </button>
            
          <button
            type="submit"
            disabled={isSubmitting}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {isEditMode ? 'تحديث المستخدم' : 'إضافة المستخدم'}
                </>
              )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default UserForm; 