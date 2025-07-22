import React, { useState } from 'react';

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
  isEditMode = false
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Professional Header */}
      <div className="bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 px-6 py-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-xl font-bold mb-1">
        {isEditMode ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
            </h1>
            <p className="text-blue-100 text-xs">
              {isEditMode ? 'قم بتحديث معلومات المستخدم' : 'أدخل معلومات المستخدم الجديد'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
      {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-right text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4.1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
        </div>
      )}

      {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-right text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{successMessage}</span>
            </div>
        </div>
      )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Information Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 text-right border-b border-gray-200 pb-2">
              المعلومات الشخصية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-2 text-right">
                  الاسم الكامل <span className="text-red-500">*</span>
          </label>
                <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white shadow-sm text-sm text-gray-900 transition-all duration-200"
                    placeholder="أدخل الاسم الكامل"
            required
          />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
        </div>

        {/* Email */}
        <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-2 text-right">
                  البريد الإلكتروني <span className="text-red-500">*</span>
          </label>
                <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white shadow-sm text-sm text-gray-900 transition-all duration-200"
                    placeholder="أدخل البريد الإلكتروني"
            required
          />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                    </svg>
                  </div>
        </div>
        </div>

        {/* Phone */}
        <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-2 text-right">
            رقم الهاتف
          </label>
                <div className="relative">
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white shadow-sm text-sm text-gray-900 transition-all duration-200"
                    placeholder="أدخل رقم الهاتف"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
        </div>

        {/* Role */}
        <div>
                <label htmlFor="role" className="block text-xs font-semibold text-gray-700 mb-2 text-right">
                  الدور <span className="text-red-500">*</span>
          </label>
                <div className="relative">
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white shadow-sm appearance-none text-sm text-gray-900 transition-all duration-200"
            required
          >
            <option value="">اختر الدور</option>
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label} - {role.description}
              </option>
            ))}
          </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
        </div>

          {/* Security Information Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 text-right border-b border-gray-200 pb-2">
              معلومات الأمان
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-2 text-right">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white shadow-sm text-sm text-gray-900 transition-all duration-200"
                    placeholder="أدخل كلمة المرور"
                    required={!isEditMode}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              {!isEditMode && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-2 text-right">
                    تأكيد كلمة المرور <span className="text-red-500">*</span>
          </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-white shadow-sm text-sm text-gray-900 transition-all duration-200"
                      placeholder="أعد إدخال كلمة المرور"
                      required
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
        </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm"
            >
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              إلغاء
            </button>
            
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm"
          >
            {isSubmitting ? 'جاري الحفظ...' : isEditMode ? 'تحديث' : 'إضافة'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default UserForm; 