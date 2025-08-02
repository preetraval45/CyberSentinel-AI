'use client'

import { useState, useEffect } from 'react'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/contexts/AuthContext'
import { PageSkeleton } from '@/components/ui/LoadingSkeleton'
import PageTransition from '@/components/ui/PageTransition'
import LimitedProfile from '@/components/limited/LimitedProfile'
import CompletedSimulations from '@/components/limited/CompletedSimulations'
import { motion } from 'framer-motion'
import { slideUp } from '@/lib/animations'

export default function LimitedAccessPage() {
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState(null)
  const [completedSimulations, setCompletedSimulations] = useState([])

  useEffect(() => {
    if (!loading) {
      fetchLimitedData()
    }
  }, [loading])

  const fetchLimitedData = async () => {
    try {
      const [profileRes, simulationsRes] = await Promise.all([
        fetch('/api/limited/profile', { credentials: 'include' }),
        fetch('/api/limited/completed-simulations', { credentials: 'include' })
      ])

      if (profileRes.ok) setProfile(await profileRes.json())
      if (simulationsRes.ok) setCompletedSimulations(await simulationsRes.json())
    } catch (error) {
      console.error('Failed to fetch limited data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return <PageSkeleton />
  }

  return (
    <RoleGuard requiredRole="LimitedUser">
      <PageTransition>
        <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 dark-grid opacity-10" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <motion.div 
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold glow-text mb-2">My Overview</h1>
              <p className="text-sm sm:text-base text-gray-400">Basic access to your training information</p>
            </motion.div>
            
            <motion.div 
              className="glass-card p-6 mb-8"
              variants={slideUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-100">Welcome, {user?.email}</h2>
                  <p className="text-sm text-yellow-400">Role: {user?.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Access Level</p>
                  <p className="text-sm text-gray-300">Basic</p>
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="order-2 lg:order-1">
                {profile && <LimitedProfile profile={profile} />}
              </div>
              
              <div className="order-1 lg:order-2">
                <CompletedSimulations simulations={completedSimulations} />
              </div>
            </div>
            
            <motion.div 
              className="glass-card p-6 mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-gray-400 text-sm">
                Limited access account - Contact administrator for additional permissions
              </p>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    </RoleGuard>
  )
}