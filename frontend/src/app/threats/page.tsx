'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Activity } from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'
import { PageSkeleton, LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { useAuth } from '@/contexts/AuthContext'
import { staggerContainer, slideUp } from '@/lib/animations'

export default function ThreatsPage() {
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [threats, setThreats] = useState([])

  useEffect(() => {
    if (!loading) {
      // Simulate API call
      setTimeout(() => {
        setThreats([
          { id: 1, type: 'Malware', severity: 'High', status: 'Active', time: '2 min ago' },
          { id: 2, type: 'Phishing', severity: 'Medium', status: 'Resolved', time: '15 min ago' },
          { id: 3, type: 'DDoS', severity: 'Critical', status: 'Active', time: '1 hour ago' }
        ])
        setIsLoading(false)
      }, 1000)
    }
  }, [loading])

  if (loading || isLoading) {
    return <PageSkeleton />
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 dark-grid opacity-10" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.h1 
            className="text-4xl font-bold glow-text mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Threat Detection
          </motion.h1>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div className="glass-card p-6" variants={slideUp}>
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">Protected</h3>
                  <p className="text-green-400">System Secure</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="glass-card p-6" variants={slideUp}>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">Warnings</h3>
                  <p className="text-yellow-400">2 Active</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="glass-card p-6" variants={slideUp}>
              <div className="flex items-center space-x-3">
                <Activity className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">Monitoring</h3>
                  <p className="text-blue-400">Real-time</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold text-gray-100 mb-6">Recent Threats</h2>
            <div className="space-y-4">
              {threats.map((threat: any, index) => (
                <motion.div
                  key={threat.id}
                  className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <div>
                    <h3 className="font-semibold text-gray-100">{threat.type}</h3>
                    <p className="text-sm text-gray-400">{threat.time}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      threat.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                      threat.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {threat.severity}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      threat.status === 'Active' ? 'bg-red-500/20 text-red-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {threat.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}