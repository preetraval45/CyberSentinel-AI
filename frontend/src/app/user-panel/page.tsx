'use client'

import { useState, useEffect } from 'react'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/contexts/AuthContext'
import { PageSkeleton } from '@/components/ui/LoadingSkeleton'
import PageTransition from '@/components/ui/PageTransition'
import UserStats from '@/components/user/UserStats'
import SimulationsList from '@/components/user/SimulationsList'
import ReportsSection from '@/components/user/ReportsSection'
import { motion } from 'framer-motion'
import { slideUp } from '@/lib/animations'

export default function UserPanelPage() {
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [simulations, setSimulations] = useState([])
  const [reports, setReports] = useState([])

  useEffect(() => {
    if (!loading) {
      fetchUserData()
    }
  }, [loading])

  const fetchUserData = async () => {
    try {
      const [statsRes, simulationsRes, reportsRes] = await Promise.all([
        fetch('/api/user/dashboard', { credentials: 'include' }),
        fetch('/api/user/simulations', { credentials: 'include' }),
        fetch('/api/user/reports', { credentials: 'include' })
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (simulationsRes.ok) setSimulations(await simulationsRes.json())
      if (reportsRes.ok) setReports(await reportsRes.json())
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartSimulation = async (id: string) => {
    try {
      const response = await fetch(`/api/user/simulations/${id}/start`, {
        method: 'POST',
        credentials: 'include'
      })
      if (response.ok) {
        // Navigate to simulation or show success message
        console.log('Simulation started')
      }
    } catch (error) {
      console.error('Failed to start simulation:', error)
    }
  }

  const handleReplaySimulation = async (id: string) => {
    try {
      const response = await fetch(`/api/user/simulations/${id}/replay`, {
        method: 'POST',
        credentials: 'include'
      })
      if (response.ok) {
        console.log('Simulation replay started')
      }
    } catch (error) {
      console.error('Failed to replay simulation:', error)
    }
  }

  if (loading || isLoading) {
    return <PageSkeleton />
  }

  return (
    <RoleGuard requiredRole="User">
      <PageTransition>
        <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 dark-grid opacity-10" />
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div 
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold glow-text mb-2">My Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-400">Track your progress and manage your training</p>
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
                  <h2 className="text-xl font-semibold text-gray-100">Welcome back, {user?.email}</h2>
                  <p className="text-sm text-green-400">Role: {user?.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Last activity</p>
                  <p className="text-sm text-gray-300">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
            
            {stats && <UserStats stats={stats} />}
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              <div className="order-2 xl:order-1">
                <SimulationsList 
                  simulations={simulations}
                  onStart={handleStartSimulation}
                  onReplay={handleReplaySimulation}
                />
              </div>
              
              <div className="order-1 xl:order-2">
                <ReportsSection reports={reports} />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </RoleGuard>
  )
}