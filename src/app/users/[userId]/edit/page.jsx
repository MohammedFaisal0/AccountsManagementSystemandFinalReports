'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import UserForm from '../../add/components/UserForm';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.userId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '',
  });

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setForm({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
          phone: userData.phone || '',
          role: userData.role || '',
        });
      } else {
        setError('فشل في تحميل بيانات المستخدم');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');

    // Validate role selection
    if (!form.role) {
      setError('يرجى اختيار دور للمستخدم');
      setIsSubmitting(false);
      return;
    }

    try {
      const updateData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
      };

      // Only include password if it's provided
      if (form.password) {
        updateData.password = form.password;
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('تم تحديث المستخدم بنجاح');
        // Redirect to users page after a short delay
        setTimeout(() => {
          router.push('/users');
        }, 1500);
      } else {
        setError(data.message || 'حدث خطأ أثناء تحديث المستخدم');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-sm">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
              <h1 className="text-xl font-bold text-gray-800 mb-1">
                تعديل المستخدم
              </h1>
              <p className="text-xs text-gray-600">
                تعديل بيانات المستخدم في النظام
              </p>
            </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <button
                    onClick={() => router.push('/users')}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 border-none rounded-lg hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
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
                  isEditMode={true}
                />
          </div>
        </div>
      </div>
    </div>
  );
} 