'use client';

import React, { useRef, useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import UserForm from './components/UserForm';
import { useRouter } from 'next/navigation';

export default function AddUserPage() {
  const router = useRouter();
  const [avatar, setAvatar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: '',
  });
  const fileInputRef = useRef();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    } else {
      setAvatar(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');

    // Validate password confirmation
    if (form.password !== form.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setIsSubmitting(false);
      return;
    }

    // Validate role selection
    if (!form.role) {
      setError('يرجى اختيار دور للمستخدم');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('phone', form.phone);
      formData.append('role', form.role);

      if (fileInputRef.current?.files[0]) {
        formData.append('avatar', fileInputRef.current.files[0]);
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('تم إضافة المستخدم بنجاح');
        // Redirect to users page after a short delay
        setTimeout(() => {
          router.push('/users');
        }, 1500);
      } else {
        setError(data.message || 'حدث خطأ أثناء إضافة المستخدم');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">إضافة مستخدم جديد</h1>
                  <p className="text-sm text-gray-600">أضف مستخدم جديد إلى النظام مع تحديد الدور المناسب</p>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button
                    onClick={() => router.push('/users')}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    العودة إلى المستخدمين
                  </button>
            </div>
              </div>
              </div>

            {/* Main Content */}
                <UserForm
                  form={form}
                  setForm={setForm}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  error={error}
                  successMessage={successMessage}
              avatar={avatar}
              onAvatarChange={handleAvatarChange}
              fileInputRef={fileInputRef}
                />
          </div>
        </div>
      </div>
    </div>
  );
} 