import { UserRole } from './roles'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department: string
  organization: string
  avatar: string
  securityScore: number
  isActive: boolean
  lastLogin: Date
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
}

export const FAKE_USERS: User[] = [
  {
    id: '1',
    email: 'admin@techcorp.com',
    name: 'Sarah Johnson',
    role: 'admin',
    department: 'IT Security',
    organization: 'TechCorp Industries',
    avatar: 'cyber-guardian',
    securityScore: 95,
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    email: 'trainer@techcorp.com',
    name: 'Mike Chen',
    role: 'securitytrainer',
    department: 'Training',
    organization: 'TechCorp Industries',
    avatar: 'security-analyst',
    securityScore: 88,
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2023-02-20')
  },
  {
    id: '3',
    email: 'analyst@techcorp.com',
    name: 'Emma Davis',
    role: 'analyst',
    department: 'SOC',
    organization: 'TechCorp Industries',
    avatar: 'threat-hunter',
    securityScore: 92,
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2023-03-10')
  },
  {
    id: '4',
    email: 'employee1@techcorp.com',
    name: 'Alex Rodriguez',
    role: 'employee',
    department: 'Engineering',
    organization: 'TechCorp Industries',
    avatar: 'digital-defender',
    securityScore: 76,
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2023-04-05')
  },
  {
    id: '5',
    email: 'employee2@techcorp.com',
    name: 'Lisa Wang',
    role: 'employee',
    department: 'Marketing',
    organization: 'TechCorp Industries',
    avatar: 'crypto-knight',
    securityScore: 82,
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date('2023-05-12')
  }
]

export function authenticateUser(email: string, password: string): User | null {
  if (password !== 'demo123') return null
  return FAKE_USERS.find(user => user.email === email) || null
}

export function generateToken(user: User): string {
  return btoa(JSON.stringify({ id: user.id, email: user.email, role: user.role }))
}

export function validateToken(token: string): User | null {
  try {
    const decoded = JSON.parse(atob(token))
    return FAKE_USERS.find(user => user.id === decoded.id) || null
  } catch {
    return null
  }
}