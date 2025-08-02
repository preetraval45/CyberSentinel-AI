'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Trophy, Medal, Award } from 'lucide-react'
import { LeaderboardEntry as Entry } from '../../types/leaderboard'
import { AVATAR_OPTIONS } from '../../types/profile'

interface LeaderboardEntryProps {
  entry: Entry
  index: number
}

export default function LeaderboardEntry({ entry, index }: LeaderboardEntryProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />
    return <span className="w-6 h-6 flex items-center justify-center font-cyber font-bold text-cyber-primary">{rank}</span>
  }

  const getRankChangeIcon = () => {
    switch (entry.rankChange) {
      case 'up': return <TrendingUp className="w-4 h-4 text-cyber-green" />
      case 'down': return <TrendingDown className="w-4 h-4 text-cyber-red" />
      case 'same': return <Minus className="w-4 h-4 text-cyber-primary/50" />
      case 'new': return <span className="text-cyber-accent text-xs font-cyber font-bold">NEW</span>
      default: return null
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-cyber-green'
    if (score >= 80) return 'text-cyber-primary'
    if (score >= 70) return 'text-cyber-accent'
    return 'text-cyber-red'
  }

  const avatarData = AVATAR_OPTIONS.find(a => a.id === entry.avatar) || AVATAR_OPTIONS[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`cyber-card transition-all duration-300 ${
        entry.rank <= 3 ? 'border-cyber-accent cyber-glow' : 'border-cyber-primary/30'
      }`}
    >
      <div className="flex items-center space-x-4">
        {/* Rank */}
        <div className="flex flex-col items-center space-y-1">
          {getRankIcon(entry.rank)}
          <div className="flex items-center space-x-1">
            {getRankChangeIcon()}
            {entry.rankChange !== 'new' && entry.rankChange !== 'same' && (
              <span className="text-xs font-mono text-cyber-primary/70">
                {Math.abs(entry.rank - entry.previousRank)}
              </span>
            )}
          </div>
        </div>

        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full ${avatarData.color} flex items-center justify-center text-xl`}>
          {avatarData.emoji}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-cyber font-bold text-cyber-primary">{entry.name}</h4>
            <div className="flex items-center space-x-2">
              {entry.badges.map((badge, i) => (
                <span key={i} className="text-lg">{badge}</span>
              ))}
            </div>
          </div>
          <p className="text-cyber-primary/70 text-sm">{entry.department}</p>
          <p className="text-cyber-primary/50 text-xs">{entry.organization}</p>
        </div>

        {/* Stats */}
        <div className="text-right">
          <div className={`text-2xl font-cyber font-black ${getScoreColor(entry.securityScore)} mb-1`}>
            {entry.securityScore}
          </div>
          <div className="text-cyber-primary/70 text-xs">
            {entry.challengesCompleted} challenges
          </div>
          <div className="text-cyber-primary/50 text-xs font-mono">
            {entry.lastActive.toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  )
}