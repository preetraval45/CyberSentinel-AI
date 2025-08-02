'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, AlertCircle, CheckCircle } from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'
import { PageSkeleton } from '@/components/ui/LoadingSkeleton'
import { useAuth } from '@/contexts/AuthContext'
import { staggerContainer, slideUp } from '@/lib/animations'

export default function VulnerabilitiesPage() {
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [vulnerabilities, setVulnerabilities] = useState([])

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setVulnerabilities([
          { id: 1, title: 'Outdated SSL Certificate', severity: 'Medium', status: 'Open' },
          { id: 2, title: 'Weak Password Policy', severity: 'High', status: 'Fixed' },
          { id: 3, title: 'Unpatched Software', severity: 'Critical', status: 'Open' }
        ])
        setIsLoading(false)
      }, 800)
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
            Vulnerability Assessment
          </motion.h1>

          <motion.div
            className="glass-card p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-100">Scan Results</h2>
              <motion.button
                className="neon-button flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-4 h-4" />
                <span>New Scan</span>
              </motion.button>
            </div>

            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {vulnerabilities.map((vuln: any, index) => (
                <motion.div
                  key={vuln.id}
                  className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50"
                  variants={slideUp}
                >
                  <div className="flex items-center space-x-3">
                    {vuln.status === 'Fixed' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-100">{vuln.title}</h3>
                      <p className="text-sm text-gray-400">Vulnerability #{vuln.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      vuln.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                      vuln.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {vuln.severity}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      vuln.status === 'Fixed' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {vuln.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}