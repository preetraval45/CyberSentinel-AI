export type UserRole = 'superadmin' | 'admin' | 'securitytrainer' | 'analyst' | 'employee'

export interface Permission {
  resource: string
  actions: string[]
}

export interface RoleConfig {
  name: string
  displayName: string
  description: string
  permissions: Permission[]
  color: string
  icon: string
  dashboardTabs: string[]
  canAccessCyberMap: boolean
  canManageUsers: boolean
  canCreateContent: boolean
  canViewAnalytics: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, RoleConfig> = {
  superadmin: {
    name: 'superadmin',
    displayName: 'Super Admin',
    description: 'Platform owner with full system access',
    permissions: [
      { resource: '*', actions: ['*'] }
    ],
    color: 'text-cyber-red',
    icon: '👑',
    dashboardTabs: ['Overview', 'Companies', 'Analytics', 'System', 'Billing'],
    canAccessCyberMap: true,
    canManageUsers: true,
    canCreateContent: true,
    canViewAnalytics: true
  },
  admin: {
    name: 'admin',
    displayName: 'Company Admin',
    description: 'Company-level administrator',
    permissions: [
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'scenarios', actions: ['read', 'assign'] },
      { resource: 'reports', actions: ['read', 'export'] },
      { resource: 'settings', actions: ['read', 'update'] }
    ],
    color: 'text-cyber-accent',
    icon: '🛡️',
    dashboardTabs: ['Overview', 'Users', 'Reports', 'Settings'],
    canAccessCyberMap: true,
    canManageUsers: true,
    canCreateContent: false,
    canViewAnalytics: true
  },
  securitytrainer: {
    name: 'securitytrainer',
    displayName: 'Security Trainer',
    description: 'Training module author and instructor',
    permissions: [
      { resource: 'scenarios', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'training', actions: ['create', 'read', 'update'] },
      { resource: 'students', actions: ['read', 'assign'] },
      { resource: 'progress', actions: ['read'] }
    ],
    color: 'text-cyber-secondary',
    icon: '🎓',
    dashboardTabs: ['Modules', 'Students', 'Progress', 'Content'],
    canAccessCyberMap: false,
    canManageUsers: false,
    canCreateContent: true,
    canViewAnalytics: true
  },
  analyst: {
    name: 'analyst',
    displayName: 'Security Analyst',
    description: 'View-only access to security data',
    permissions: [
      { resource: 'threats', actions: ['read'] },
      { resource: 'reports', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'incidents', actions: ['read'] }
    ],
    color: 'text-cyber-blue',
    icon: '📊',
    dashboardTabs: ['Threats', 'Analytics', 'Reports'],
    canAccessCyberMap: true,
    canManageUsers: false,
    canCreateContent: false,
    canViewAnalytics: true
  },
  employee: {
    name: 'employee',
    displayName: 'Employee',
    description: 'Trainee with learning access',
    permissions: [
      { resource: 'training', actions: ['read', 'participate'] },
      { resource: 'progress', actions: ['read'] },
      { resource: 'certificates', actions: ['read'] },
      { resource: 'profile', actions: ['read', 'update'] }
    ],
    color: 'text-cyber-green',
    icon: '👤',
    dashboardTabs: ['Training', 'Progress', 'Certificates'],
    canAccessCyberMap: false,
    canManageUsers: false,
    canCreateContent: false,
    canViewAnalytics: false
  }
}

export function hasPermission(userRole: UserRole, resource: string, action: string): boolean {
  const roleConfig = ROLE_PERMISSIONS[userRole]
  
  if (userRole === 'superadmin') return true
  
  return roleConfig.permissions.some(permission => 
    (permission.resource === resource || permission.resource === '*') &&
    (permission.actions.includes(action) || permission.actions.includes('*'))
  )
}

export function getRoleConfig(role: UserRole): RoleConfig {
  return ROLE_PERMISSIONS[role]
}