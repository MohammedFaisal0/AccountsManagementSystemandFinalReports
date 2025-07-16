// src/lib/usePermissions.ts
import { useAuth } from '@/context/AuthContext';
import { hasPermission, UserPermissions } from './permissionUtils';

export function usePermissions() {
  const { user } = useAuth();

  const userPermissions: UserPermissions = {
    role: user?.role || 'employee'
  };

  return {
    hasPermission: (permission: string) => hasPermission(userPermissions, permission),
    userRole: user?.role || 'employee',
    isAdmin: user?.role === 'administrator',
    isEmployee: user?.role === 'employee',
    isReviewer: user?.role === 'reviewer'
  };
} 