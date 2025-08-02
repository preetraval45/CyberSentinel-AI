'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { scaleIn, buttonHover } from '@/lib/animations'
import PageTransition from '@/components/ui/PageTransition'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function UnauthorizedPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const handleGoBack = async () => {
    setIsNavigating(true)
    try {
      router.push('/dashboard')
    } finally {
      setTimeout(() => setIsNavigating(false), 1000)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 dark-grid opacity-20" />
        
        <motion.div 
          className="relative z-10 max-w-md w-full text-center"
          variants={scaleIn}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="glass-card p-8">
            <motion.div 
              className="text-red-400 text-6xl mb-4"
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              🚫
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold text-gray-100 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Access Denied
            </motion.h1>
            <motion.p 
              className="text-gray-400 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              You don't have permission to access this page.
            </motion.p>
            <motion.p 
              className="text-sm text-gray-500 mb-6 bg-gray-800/50 rounded-lg p-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Current role: {user?.role}
            </motion.p>
            
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <motion.button
                onClick={handleGoBack}
                disabled={isNavigating}
                className="neon-button w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                {...buttonHover}
              >
                {isNavigating && <LoadingSpinner size="sm" color="text-white" />}
                <span>Go to Dashboard</span>
              </motion.button>
              <motion.button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full bg-gray-700/50 text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50 flex items-center justify-center space-x-2 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoggingOut && <LoadingSpinner size="sm" color="text-gray-300" />}
                <span>Logout</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}