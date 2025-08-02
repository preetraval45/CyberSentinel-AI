'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, BookOpen, AlertTriangle } from 'lucide-react'
import { staggerContainer, slideUp } from '@/lib/animations'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Analytics {
  total_users: number
  active_users: number
  completed_trainings: number
  security_incidents: number
  user_growth: Array<{ month: string; users: number }>
}

export default function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!analytics) return null

  const stats = [
    {
      title: 'Total Users',
      value: analytics.total_users,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Active Users',
      value: analytics.active_users,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Completed Trainings',
      value: analytics.completed_trainings,
      icon: BookOpen,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      title: 'Security Incidents',
      value: analytics.security_incidents,
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    }
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h2 
        className="text-2xl font-semibold text-gray-100 mb-6"
        variants={slideUp}
      >
        Analytics Dashboard
      </motion.h2>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={staggerContainer}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              className="glass-card p-6"
              variants={slideUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div 
        className="glass-card p-6"
        variants={slideUp}
      >
        <h3 className="text-lg font-semibold text-gray-100 mb-4">User Growth</h3>
        <div className="flex items-end space-x-4 h-32">
          {analytics.user_growth.map((data, index) => (
            <motion.div
              key={data.month}
              className="flex flex-col items-center flex-1"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="bg-blue-500 w-full rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${(data.users / 200) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
              <span className="text-xs text-gray-400 mt-2">{data.month}</span>
              <span className="text-xs text-gray-300">{data.users}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}