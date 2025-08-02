export interface LeaderboardEntry {
  id: string
  name: string
  email: string
  department: string
  organization: string
  avatar: string
  securityScore: number
  rank: number
  previousRank: number
  rankChange: 'up' | 'down' | 'same' | 'new'
  challengesCompleted: number
  lastActive: Date
  badges: string[]
}

export interface LeaderboardFilters {
  department: string
  organization: string
  timeframe: 'week' | 'month' | 'quarter' | 'all'
  minScore: number
}

export const DEPARTMENTS = [
  'All Departments',
  'IT Security',
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Training',
  'SOC'
]

export const ORGANIZATIONS = [
  'All Organizations',
  'TechCorp Industries',
  'SecureBank Ltd',
  'MedHealth Systems',
  'EduTech Solutions'
]

export function generateLeaderboardData(): LeaderboardEntry[] {
  const names = [
    'Sarah Johnson', 'Mike Chen', 'Emma Davis', 'Alex Rodriguez', 'Lisa Wang',
    'David Kim', 'Rachel Green', 'Tom Wilson', 'Amy Zhang', 'Chris Brown',
    'Jessica Lee', 'Ryan Taylor', 'Maria Garcia', 'Kevin Liu', 'Sophie Turner',
    'James Anderson', 'Nina Patel', 'Mark Thompson', 'Laura Martinez', 'Ben Foster'
  ]

  return names.map((name, index) => ({
    id: `user-${index + 1}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@company.com`,
    department: DEPARTMENTS[Math.floor(Math.random() * (DEPARTMENTS.length - 1)) + 1],
    organization: ORGANIZATIONS[Math.floor(Math.random() * (ORGANIZATIONS.length - 1)) + 1],
    avatar: ['cyber-guardian', 'security-analyst', 'threat-hunter', 'digital-defender', 'crypto-knight', 'firewall-warrior'][Math.floor(Math.random() * 6)],
    securityScore: Math.floor(Math.random() * 40) + 60, // 60-100
    rank: index + 1,
    previousRank: Math.max(1, index + 1 + Math.floor(Math.random() * 6) - 3),
    rankChange: ['up', 'down', 'same', 'new'][Math.floor(Math.random() * 4)] as any,
    challengesCompleted: Math.floor(Math.random() * 50) + 10,
    lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    badges: ['🏆', '🛡️', '🎯', '⚡', '🔥'].slice(0, Math.floor(Math.random() * 3) + 1)
  })).sort((a, b) => b.securityScore - a.securityScore)
}