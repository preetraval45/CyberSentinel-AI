'use client'

import { motion } from 'framer-motion'
import { User, Shield, Calendar } from 'lucide-react'
import { slideUp } from '@/lib/animations'

interface ProfileData {
  email: string
  role: string
  created_at: string
  risk_score: number
}

interface LimitedProfileProps {
  profile: ProfileData
}

export default function LimitedProfile({ profile }: LimitedProfileProps) {
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRiskBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20'
    if (score >= 60) return 'bg-yellow-500/20'
    return 'bg-red-500/20'
  }

  return (
    <motion.div
      className="glass-card p-6"
      variants={slideUp}
      initial="initial"
      animate="animate"
    >
      <h2 className="text-2xl font-semibold text-gray-100 mb-6">My Profile</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <p className="text-gray-100">{profile.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Role</p>
            <p className="text-gray-100">{profile.role}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-400">Member Since</p>
            <p className="text-gray-100">{new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-gray-800/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Risk Score</span>
            <span className={`text-2xl font-bold ${getRiskColor(profile.risk_score)}`}>
              {profile.risk_score}/100
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${getRiskBgColor(profile.risk_score).replace('bg-', 'bg-').replace('/20', '')}`}
              initial={{ width: 0 }}
              animate={{ width: `${profile.risk_score}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}