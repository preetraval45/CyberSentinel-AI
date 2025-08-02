'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Send } from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'
import { PageSkeleton } from '@/components/ui/LoadingSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import { useAuth } from '@/contexts/AuthContext'

export default function ChatPage() {
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsLoading(false), 500)
    }
  }, [loading])

  if (loading || isLoading) {
    return <PageSkeleton />
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 dark-grid opacity-10" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl font-bold glow-text mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            AI Chat Assistant
          </motion.h1>

          <EmptyState
            icon={<MessageCircle className="w-16 h-16 mx-auto" />}
            title="Chat Coming Soon"
            description="AI-powered chat assistant is currently under development."
            action={
              <motion.button
                className="neon-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
              >
                Go Back
              </motion.button>
            }
          />
        </div>
      </div>
    </PageTransition>
  )
}