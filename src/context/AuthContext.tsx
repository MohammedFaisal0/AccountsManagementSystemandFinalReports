'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation';

// Define the shape of the user object
interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
}

// Define the shape of the auth context
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is logged in on mount
  useEffect(() => {
    const token = Cookies.get('token');
    const userInfo = Cookies.get('userInfo');
    if (token && userInfo) {
      // Verify token and set user
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            Cookies.remove('token');
            Cookies.remove('userInfo');
          }
        })
        .catch(() => {
          Cookies.remove('token');
          Cookies.remove('userInfo');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [loading, user, pathname, router]);

  // Login function
  const login = async (email: string, password: string, role?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Set token and userInfo in cookies
        Cookies.set('token', data.token, { expires: 7 }); // 7 days
        Cookies.set('userInfo', JSON.stringify(data.user), { expires: 7 });
        // Set user data
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'فشل تسجيل الدخول' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove token and user data
      Cookies.remove('token');
      Cookies.remove('userInfo');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

