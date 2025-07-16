// src/lib/permissionUtils.ts

import { verifyToken } from './authUtils';

export interface UserPermissions {
  role: string;
}

// Role constants
export const ROLES = {
  ADMINISTRATOR: 'administrator',
  EMPLOYEE: 'employee',
  REVIEWER: 'reviewer'
} as const;

// Permission constants for feature checking
export const PERMISSIONS = {
  // User Management
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  
  // File Management
  UPLOAD_FILES: 'upload_files',
  VIEW_FILES: 'view_files',
  DELETE_FILES: 'delete_files',
  VALIDATE_FILES: 'validate_files',
  
  // Reports
  VIEW_REPORTS: 'view_reports',
  CREATE_REPORTS: 'create_reports',
  EXPORT_REPORTS: 'export_reports',
  VIEW_FINANCIAL_DATA: 'view_financial_data',
  
  // Tasks
  VIEW_TASKS: 'view_tasks',
  CREATE_TASKS: 'create_tasks',
  EDIT_TASKS: 'edit_tasks',
  DELETE_TASKS: 'delete_tasks',
  ASSIGN_TASKS: 'assign_tasks',
  
  // Notifications
  VIEW_NOTIFICATIONS: 'view_notifications',
  SEND_NOTIFICATIONS: 'send_notifications',
  
  // System Administration
  SYSTEM_SETTINGS: 'system_settings',
  VIEW_LOGS: 'view_logs',
  BACKUP_DATA: 'backup_data'
} as const;

// Check if user has a specific permission based on role
export function hasPermission(userPermissions: UserPermissions, permission: string): boolean {
  const role = userPermissions.role;
  
  // Administrator has all permissions
  if (role === ROLES.ADMINISTRATOR) {
    return true;
  }
  
  // Employee has all permissions except user management
  if (role === ROLES.EMPLOYEE) {
    const userManagementPermissions = [
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.CREATE_USERS,
      PERMISSIONS.EDIT_USERS,
      PERMISSIONS.DELETE_USERS
    ];
    
    return !userManagementPermissions.includes(permission);
  }
  
  // Reviewer has only read permissions
  if (role === ROLES.REVIEWER) {
    const readOnlyPermissions = [
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.VIEW_FINANCIAL_DATA,
      PERMISSIONS.VIEW_TASKS,
      PERMISSIONS.VIEW_NOTIFICATIONS
    ];
    
    return readOnlyPermissions.includes(permission);
  }
  
  return false;
}

// Check if user has any of the specified permissions
export function hasAnyPermission(userPermissions: UserPermissions, permissions: string[]): boolean {
  return permissions.some(permission => hasPermission(userPermissions, permission));
}

// Check if user has all of the specified permissions
export function hasAllPermissions(userPermissions: UserPermissions, permissions: string[]): boolean {
  return permissions.every(permission => hasPermission(userPermissions, permission));
}

// Check if user has a specific role
export function hasRole(userPermissions: UserPermissions, role: string): boolean {
  return userPermissions.role === role;
}

// Check if user has any of the specified roles
export function hasAnyRole(userPermissions: UserPermissions, roles: string[]): boolean {
  return roles.includes(userPermissions.role);
}

// Get user permissions from token
export function getUserPermissionsFromToken(token: string): UserPermissions | null {
  try {
    const decoded = verifyToken(token);
    if (!decoded) return null;
    
    return {
      role: decoded.role || 'employee'
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Permission groups for different features
export const PERMISSION_GROUPS = {
  USER_MANAGEMENT: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.DELETE_USERS
  ],
  
  FILE_MANAGEMENT: [
    PERMISSIONS.UPLOAD_FILES,
    PERMISSIONS.VIEW_FILES,
    PERMISSIONS.DELETE_FILES,
    PERMISSIONS.VALIDATE_FILES
  ],
  
  REPORTS: [
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.CREATE_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_FINANCIAL_DATA
  ],
  
  TASKS: [
    PERMISSIONS.VIEW_TASKS,
    PERMISSIONS.CREATE_TASKS,
    PERMISSIONS.EDIT_TASKS,
    PERMISSIONS.DELETE_TASKS,
    PERMISSIONS.ASSIGN_TASKS
  ],
  
  NOTIFICATIONS: [
    PERMISSIONS.VIEW_NOTIFICATIONS,
    PERMISSIONS.SEND_NOTIFICATIONS
  ],
  
  SYSTEM_ADMIN: [
    PERMISSIONS.SYSTEM_SETTINGS,
    PERMISSIONS.VIEW_LOGS,
    PERMISSIONS.BACKUP_DATA
  ]
};

// Check if user has access to a feature group
export function hasFeatureAccess(userPermissions: UserPermissions, featureGroup: keyof typeof PERMISSION_GROUPS): boolean {
  const permissions = PERMISSION_GROUPS[featureGroup];
  return hasAnyPermission(userPermissions, permissions);
}

// Get readable permission names in Arabic
export const PERMISSION_LABELS: Record<string, string> = {
  [PERMISSIONS.VIEW_USERS]: 'عرض المستخدمين',
  [PERMISSIONS.CREATE_USERS]: 'إنشاء المستخدمين',
  [PERMISSIONS.EDIT_USERS]: 'تعديل المستخدمين',
  [PERMISSIONS.DELETE_USERS]: 'حذف المستخدمين',
  
  [PERMISSIONS.UPLOAD_FILES]: 'رفع الملفات',
  [PERMISSIONS.VIEW_FILES]: 'عرض الملفات',
  [PERMISSIONS.DELETE_FILES]: 'حذف الملفات',
  [PERMISSIONS.VALIDATE_FILES]: 'التحقق من الملفات',
  
  [PERMISSIONS.VIEW_REPORTS]: 'عرض التقارير',
  [PERMISSIONS.CREATE_REPORTS]: 'إنشاء التقارير',
  [PERMISSIONS.EXPORT_REPORTS]: 'تصدير التقارير',
  [PERMISSIONS.VIEW_FINANCIAL_DATA]: 'عرض البيانات المالية',
  
  [PERMISSIONS.VIEW_TASKS]: 'عرض المهام',
  [PERMISSIONS.CREATE_TASKS]: 'إنشاء المهام',
  [PERMISSIONS.EDIT_TASKS]: 'تعديل المهام',
  [PERMISSIONS.DELETE_TASKS]: 'حذف المهام',
  [PERMISSIONS.ASSIGN_TASKS]: 'تعيين المهام',
  
  [PERMISSIONS.VIEW_NOTIFICATIONS]: 'عرض الإشعارات',
  [PERMISSIONS.SEND_NOTIFICATIONS]: 'إرسال الإشعارات',
  
  [PERMISSIONS.SYSTEM_SETTINGS]: 'إعدادات النظام',
  [PERMISSIONS.VIEW_LOGS]: 'عرض السجلات',
  [PERMISSIONS.BACKUP_DATA]: 'نسخ احتياطي للبيانات'
};

// Get readable role names in Arabic
export const ROLE_LABELS: Record<string, string> = {
  [ROLES.ADMINISTRATOR]: 'مدير النظام',
  [ROLES.EMPLOYEE]: 'موظف',
  [ROLES.REVIEWER]: 'مراجع'
}; 