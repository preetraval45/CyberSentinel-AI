'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 dark-grid opacity-20" />
      
      <motion.div 
        className="relative z-10 text-center max-w-md w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass-card p-8">
          <motion.div
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
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            Application Error
          </h2>
          
          <p className="text-gray-400 mb-6">
            Something went wrong while loading this page. Please try again.
          </p>
          
          <div className="space-y-3">
            <motion.button
              onClick={reset}
              className="neon-button w-full flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </motion.button>
            
            <motion.button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-700/50 text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}