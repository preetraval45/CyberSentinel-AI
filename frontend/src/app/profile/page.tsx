'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Calendar, Clock, Target } from 'lucide-react'
import AvatarEditor from '../../components/profile/AvatarEditor'
import RiskScoreCard from '../../components/profile/RiskScoreCard'
import SecurityBehaviorHistory from '../../components/profile/SecurityBehaviorHistory'
import CoachingTips from '../../components/profile/CoachingTips'
import { UserProfile } from '../../types/profile'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'Alex Chen',
    email: 'alex.chen@techcorp.com',
    role: 'Security Analyst',
    avatar: 'cyber-guardian',
    joinDate: new Date('2023-06-15'),
    lastActive: new Date(),
    riskScore: 25,
    securityLevel: 'LOW',
    totalChallenges: 47,
    completedChallenges: 42,
    lastChallenge: {
      id: '1',
      name: 'Advanced Phishing Detection',
      type: 'phishing',
      difficulty: 'advanced',
      score: 92,
      completedAt: new Date('2024-01-15'),
      timeSpent: 480
    },
    behaviorHistory: [
      {
        id: '1',
        action: 'Reported Suspicious Email',
        type: 'positive',
        description: 'Successfully identified and reported a phishing attempt',
        timestamp: new Date('2024-01-15T10:30:00'),
        riskImpact: -5
      },
      {
        id: '2',
        action: 'Password Policy Violation',
        type: 'negative',
        description: 'Used weak password for secondary account',
        timestamp: new Date('2024-01-10T14:20:00'),
        riskImpact: 8
      }
    ],
    coachingTips: [
      {
        id: '1',
        category: 'passwords',
        title: 'Strengthen Your Password Strategy',
        message: 'Consider using a password manager to generate and store unique passwords for all your accounts.',
        priority: 'high',
        isRead: false,
        createdAt: new Date('2024-01-16')
      }
    ],
    achievements: []
  })

  const handleAvatarChange = (avatarId: string) => {
    setProfile(prev => ({ ...prev, avatar: avatarId }))
    toast.success('Avatar updated successfully!')
  }

  const handleMarkTipAsRead = (tipId: string) => {
    setProfile(prev => ({
      ...prev,
      coachingTips: prev.coachingTips.map(tip =>
        tip.id === tipId ? { ...tip, isRead: true } : tip
      )
    }))
    toast.success('Tip marked as read')
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-4 mb-4">
            <User className="w-8 h-8 text-cyber-primary" />
            <h1 className="text-4xl md:text-6xl font-cyber font-black neon-text">
              USER PROFILE
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="cyber-card"
            >
              <AvatarEditor 
                currentAvatar={profile.avatar}
                onAvatarChange={handleAvatarChange}
              />
              
              <div className="mt-6 space-y-3">
                <div>
                  <h2 className="text-2xl font-cyber font-bold text-cyber-primary">
                    {profile.name}
                  </h2>
                  <p className="text-cyber-primary/70">{profile.role}</p>
                  <p className="text-cyber-primary/50 text-sm font-mono">{profile.email}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cyber-primary/20">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-cyber-primary/70" />
                    <div>
                      <p className="text-cyber-primary/70 text-xs">Joined</p>
                      <p className="text-cyber-primary font-mono text-sm">
                        {profile.joinDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-cyber-primary/70" />
                    <div>
                      <p className="text-cyber-primary/70 text-xs">Last Active</p>
                      <p className="text-cyber-primary font-mono text-sm">
                        {profile.lastActive.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <RiskScoreCard
              riskScore={profile.riskScore}
              securityLevel={profile.securityLevel}
              trend="down"
              lastUpdated={new Date()}
            />

            {profile.lastChallenge && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="cyber-card"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-cyber-accent" />
                  <h3 className="font-cyber font-bold text-cyber-primary">LAST CHALLENGE</h3>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-cyber font-bold text-cyber-primary text-sm">
                    {profile.lastChallenge.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-cyber-primary/70 text-xs">Score</p>
                      <p className="text-cyber-accent font-cyber font-bold text-lg">
                        {profile.lastChallenge.score}%
                      </p>
                    </div>
                    <div>
                      <p className="text-cyber-primary/70 text-xs">Time</p>
                      <p className="text-cyber-primary font-mono text-sm">
                        {Math.floor(profile.lastChallenge.timeSpent / 60)}m
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <SecurityBehaviorHistory behaviors={profile.behaviorHistory} />

          <CoachingTips 
            tips={profile.coachingTips}
            onMarkAsRead={handleMarkTipAsRead}
          />
        </div>
      </div>
    </div>
  )
}