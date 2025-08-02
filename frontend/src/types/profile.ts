export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  joinDate: Date
  lastActive: Date
  riskScore: number
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  totalChallenges: number
  completedChallenges: number
  lastChallenge?: Challenge
  behaviorHistory: SecurityBehavior[]
  coachingTips: CoachingTip[]
  achievements: Achievement[]
}

export interface Challenge {
  id: string
  name: string
  type: 'phishing' | 'social_engineering' | 'password' | 'malware'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  score: number
  completedAt: Date
  timeSpent: number
}

export interface SecurityBehavior {
  id: string
  action: string
  type: 'positive' | 'negative' | 'neutral'
  description: string
  timestamp: Date
  riskImpact: number
}

export interface CoachingTip {
  id: string
  category: 'phishing' | 'passwords' | 'social_engineering' | 'general'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high'
  isRead: boolean
  createdAt: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const AVATAR_OPTIONS = [
  { id: 'cyber-guardian', name: 'Cyber Guardian', emoji: '🛡️', color: 'bg-cyber-primary' },
  { id: 'security-analyst', name: 'Security Analyst', emoji: '🔍', color: 'bg-cyber-secondary' },
  { id: 'threat-hunter', name: 'Threat Hunter', emoji: '🎯', color: 'bg-cyber-accent' },
  { id: 'digital-defender', name: 'Digital Defender', emoji: '⚔️', color: 'bg-cyber-green' },
  { id: 'crypto-knight', name: 'Crypto Knight', emoji: '🔐', color: 'bg-cyber-blue' },
  { id: 'firewall-warrior', name: 'Firewall Warrior', emoji: '🔥', color: 'bg-cyber-red' }
]