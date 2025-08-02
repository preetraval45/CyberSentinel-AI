'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Target, BookOpen, Award } from 'lucide-react'
import { staggerContainer, slideUp } from '@/lib/animations'

interface UserStatsProps {
  stats: {
    risk_score: number
    completion_rate: number
    total_simulations: number
    completed_simulations: number
    average_score: number
  }
}

export default function UserStats({ stats }: UserStatsProps) {
  const statCards = [
    {
      title: 'Risk Score',
      value: stats.risk_score,
      suffix: '/100',
      icon: Target,
      color: stats.risk_score >= 80 ? 'text-green-400' : stats.risk_score >= 60 ? 'text-yellow-400' : 'text-red-400',
      bgColor: stats.risk_score >= 80 ? 'bg-green-500/20' : stats.risk_score >= 60 ? 'bg-yellow-500/20' : 'bg-red-500/20'
    },
    {
      title: 'Completion Rate',
      value: stats.completion_rate,
      suffix: '%',
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Simulations',
      value: `${stats.completed_simulations}/${stats.total_simulations}`,
      suffix: '',
      icon: BookOpen,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Average Score',
      value: stats.average_score,
      suffix: '%',
      icon: Award,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    }
  ]

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            className="glass-card p-3 sm:p-4 lg:p-6"
            variants={slideUp}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} mb-2 sm:mb-0 sm:mr-3 lg:mr-4 self-start sm:self-auto`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-400 truncate">{stat.title}</p>
                <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${stat.color} truncate`}>
                  {typeof stat.value === 'number' && stat.suffix !== '' ? stat.value.toFixed(1) : stat.value}
                  {stat.suffix}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}