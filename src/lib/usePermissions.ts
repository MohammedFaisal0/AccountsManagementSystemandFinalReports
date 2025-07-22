// src/lib/usePermissions.ts
import { useAuth } from '@/context/AuthContext';
import { hasPermission, UserPermissions } from './permissionUtils';

export function usePermissions() {
  const { user, loading } = useAuth();

  const userPermissions: UserPermissions = {
    role: user?.role || 'employee'
  };

  return {
    hasPermission: (permission: string) => {
      // Return false during loading to prevent hydration mismatch
      if (loading) return false;
      return hasPermission(userPermissions, permission);
    },
    userRole: user?.role || 'employee',
    isAdmin: user?.role === 'administrator',
    isEmployee: user?.role === 'employee',
    isReviewer: user?.role === 'reviewer',
    isLoading: loading
  };
} 