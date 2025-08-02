export interface CompanySettings {
  id: string
  name: string
  logo: string
  domain: string
  industry: string
  employeeCount: number
  timezone: string
  language: string
  createdAt: Date
  updatedAt: Date
}

export interface SSOProvider {
  id: string
  name: string
  type: 'saml' | 'oauth' | 'ldap'
  enabled: boolean
  config: {
    clientId?: string
    clientSecret?: string
    domain?: string
    redirectUri?: string
    metadataUrl?: string
  }
}

export interface TrainingSchedule {
  id: string
  name: string
  type: 'mandatory' | 'optional' | 'recurring'
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually'
  startDate: Date
  endDate?: Date
  targetRoles: string[]
  modules: string[]
  reminderDays: number[]
  isActive: boolean
}

export interface CompliancePolicy {
  id: string
  name: string
  type: 'gdpr' | 'hipaa' | 'sox' | 'pci' | 'iso27001' | 'custom'
  description: string
  requirements: string[]
  enabled: boolean
  lastReview: Date
  nextReview: Date
  assignedTo: string[]
}

export interface UserManagement {
  totalUsers: number
  activeUsers: number
  pendingInvites: number
  roles: {
    [key: string]: number
  }
  departments: {
    [key: string]: number
  }
}

export const SSO_PROVIDERS = [
  { id: 'google', name: 'Google Workspace', type: 'oauth' as const, icon: '🔍' },
  { id: 'microsoft', name: 'Microsoft Azure AD', type: 'saml' as const, icon: '🏢' },
  { id: 'okta', name: 'Okta', type: 'saml' as const, icon: '🔐' },
  { id: 'auth0', name: 'Auth0', type: 'oauth' as const, icon: '🛡️' },
  { id: 'ldap', name: 'LDAP/Active Directory', type: 'ldap' as const, icon: '📁' }
]

export const COMPLIANCE_FRAMEWORKS = [
  { id: 'gdpr', name: 'GDPR', description: 'General Data Protection Regulation' },
  { id: 'hipaa', name: 'HIPAA', description: 'Health Insurance Portability and Accountability Act' },
  { id: 'sox', name: 'SOX', description: 'Sarbanes-Oxley Act' },
  { id: 'pci', name: 'PCI DSS', description: 'Payment Card Industry Data Security Standard' },
  { id: 'iso27001', name: 'ISO 27001', description: 'Information Security Management' }
]