'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Shield, Zap, Target, Award } from 'lucide-react'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'

interface Badge {
  id: string
  name: string
  icon: any
  description: string
  unlocked: boolean
  progress: number
  maxProgress: number
}

interface Skill {
  name: string
  level: number
  xp: number
  maxXp: number
  color: string
}

interface ProgressTrackerProps {
  onSuccess?: () => void
}

export default function ProgressTracker({ onSuccess }: ProgressTrackerProps) {
  const [totalXP, setTotalXP] = useState(1250)
  const [level, setLevel] = useState(8)
  const [skills, setSkills] = useState<Skill[]>([
    { name: 'Phishing Detection', level: 12, xp: 850, maxXp: 1000, color: 'text-cyber-red' },
    { name: 'Social Engineering', level: 9, xp: 650, maxXp: 800, color: 'text-cyber-accent' },
    { name: 'Password Security', level: 15, xp: 1200, maxXp: 1200, color: 'text-cyber-green' },
    { name: 'Threat Analysis', level: 6, xp: 320, maxXp: 500, color: 'text-cyber-secondary' }
  ])

  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: 'First Detection', icon: Shield, description: 'Detected your first phishing email', unlocked: true, progress: 1, maxProgress: 1 },
    { id: '2', name: 'Eagle Eye', icon: Target, description: 'Identify 10 threats correctly', unlocked: true, progress: 10, maxProgress: 10 },
    { id: '3', name: 'Security Expert', icon: Trophy, description: 'Reach level 10 in any skill', unlocked: false, progress: 8, maxProgress: 10 },
    { id: '4', name: 'Master Guardian', icon: Award, description: 'Complete all training modules', unlocked: false, progress: 3, maxProgress: 5 }
  ])

  const triggerSuccess = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00ffff', '#ff00ff', '#ffff00']
    })
    
    toast.success('🎉 Great job! +50 XP earned!', {
      style: {
        background: 'rgba(0, 255, 255, 0.1)',
        color: '#00ffff',
        border: '1px solid rgba(0, 255, 255, 0.3)'
      }
    })

    setTotalXP(prev => prev + 50)
    onSuccess?.()
  }

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <div className="cyber-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-cyber-primary/20 flex items-center justify-center border border-cyber-primary/30">
              <Star className="w-6 h-6 text-cyber-primary" />
            </div>
            <div>
              <h3 className="font-cyber font-bold text-cyber-primary">LEVEL {level}</h3>
              <p className="text-cyber-primary/70 text-sm">Security Analyst</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-cyber font-bold text-cyber-accent">{totalXP.toLocaleString()} XP</p>
            <p className="text-cyber-primary/70 text-sm">Total Experience</p>
          </div>
        </div>
        
        <div className="relative">
          <div className="h-3 bg-cyber-dark rounded-full border border-cyber-primary/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(totalXP % 200) / 2}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-full"
            />
          </div>
          <p className="text-cyber-primary/70 text-xs mt-2">
            {totalXP % 200}/200 XP to next level
          </p>
        </div>
      </div>

      {/* Skills */}
      <div className="cyber-card">
        <h3 className="font-cyber font-bold text-cyber-primary mb-4">SKILL LEVELS</h3>
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-cyber font-bold ${skill.color}`}>{skill.name}</span>
                  <span className="text-cyber-primary/70 text-sm">LVL {skill.level}</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-cyber-dark rounded-full border border-cyber-primary/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(skill.xp / skill.maxXp) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r from-current to-current/70 ${skill.color}`}
                    />
                  </div>
                  <p className="text-cyber-primary/50 text-xs mt-1">
                    {skill.xp}/{skill.maxXp} XP
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="cyber-card">
        <h3 className="font-cyber font-bold text-cyber-primary mb-4">ACHIEVEMENTS</h3>
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  badge.unlocked 
                    ? 'bg-cyber-primary/10 border-cyber-primary/30 cyber-glow' 
                    : 'bg-cyber-dark/50 border-cyber-primary/10'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <IconComponent className={`w-6 h-6 ${badge.unlocked ? 'text-cyber-accent' : 'text-cyber-primary/30'}`} />
                  <div className="flex-1">
                    <h4 className={`font-cyber font-bold text-sm ${badge.unlocked ? 'text-cyber-primary' : 'text-cyber-primary/50'}`}>
                      {badge.name}
                    </h4>
                  </div>
                </div>
                <p className={`text-xs mb-2 ${badge.unlocked ? 'text-cyber-primary/70' : 'text-cyber-primary/30'}`}>
                  {badge.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className={badge.unlocked ? 'text-cyber-green' : 'text-cyber-primary/50'}>
                    {badge.progress}/{badge.maxProgress}
                  </span>
                  {badge.unlocked && <span className="text-cyber-accent">✓ UNLOCKED</span>}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Test Success Button */}
      <motion.button
        onClick={triggerSuccess}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cyber-button w-full"
      >
        <Zap className="w-4 h-4 mr-2" />
        TRIGGER SUCCESS ANIMATION
      </motion.button>
    </div>
  )
}