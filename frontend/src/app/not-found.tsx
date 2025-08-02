'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { slideUp, buttonHover } from '@/lib/animations'
import PageTransition from '@/components/ui/PageTransition'
import FeedbackAnimation from '@/components/animations/FeedbackAnimation'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function NotFound() {
  const router = useRouter()
  const [isGoingBack, setIsGoingBack] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const handleGoBack = async () => {
    setIsGoingBack(true)
    try {
      router.back()
    } finally {
      setTimeout(() => setIsGoingBack(false), 1000)
    }
  }

  const handleGoToDashboard = async () => {
    setIsNavigating(true)
    try {
      router.push('/dashboard')
    } finally {
      setTimeout(() => setIsNavigating(false), 1000)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 dark-grid opacity-20" />
        
        <motion.div 
          className="relative z-10 text-center max-w-md w-full"
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="glass-card p-8">
            <FeedbackAnimation
              type="error"
              show={true}
              size="xl"
              message="Page Not Found"
            />
            
            <motion.h1 
              className="text-6xl font-bold glow-text mb-4 mt-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              404
            </motion.h1>
            
            <motion.p 
              className="text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              The page you're looking for doesn't exist or has been moved.
            </motion.p>
            
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <motion.button
                onClick={handleGoBack}
                disabled={isGoingBack}
                className="neon-button w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                {...buttonHover}
              >
                {isGoingBack && <LoadingSpinner size="sm" color="text-white" />}
                <span>Go Back</span>
              </motion.button>
              
              <motion.button
                onClick={handleGoToDashboard}
                disabled={isNavigating}
                className="w-full bg-gray-700/50 text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50 flex items-center justify-center space-x-2 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isNavigating && <LoadingSpinner size="sm" color="text-gray-300" />}
                <span>Go to Dashboard</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}