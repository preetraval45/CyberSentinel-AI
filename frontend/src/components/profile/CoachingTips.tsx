'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Lightbulb, X, CheckCircle } from 'lucide-react'
import { CoachingTip } from '../../types/profile'

interface CoachingTipsProps {
  tips: CoachingTip[]
  onMarkAsRead: (tipId: string) => void
}

export default function CoachingTips({ tips, onMarkAsRead }: CoachingTipsProps) {
  const [expandedTip, setExpandedTip] = useState<string | null>(null)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-cyber-red text-cyber-red'
      case 'medium': return 'border-cyber-accent text-cyber-accent'
      case 'low': return 'border-cyber-green text-cyber-green'
      default: return 'border-cyber-primary text-cyber-primary'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'phishing': return '🎣'
      case 'passwords': return '🔐'
      case 'social_engineering': return '🎭'
      case 'general': return '🛡️'
      default: return '💡'
    }
  }

  const unreadTips = tips.filter(tip => !tip.isRead)
  const readTips = tips.filter(tip => tip.isRead)

  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-6 h-6 text-cyber-secondary animate-pulse" />
          <div>
            <h3 className="font-cyber font-bold text-cyber-primary">AI COACHING TIPS</h3>
            <p className="text-cyber-primary/70 text-sm">Personalized security guidance</p>
          </div>
        </div>
        {unreadTips.length > 0 && (
          <div className="px-3 py-1 bg-cyber-secondary/20 border border-cyber-secondary/30 rounded-full">
            <span className="text-cyber-secondary font-cyber font-bold text-sm">
              {unreadTips.length} NEW
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {/* Unread Tips */}
        {unreadTips.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 ${getPriorityColor(tip.priority)} bg-current/5 cursor-pointer`}
            onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <span className="text-2xl">{getCategoryIcon(tip.category)}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-cyber font-bold text-cyber-primary text-sm">
                      {tip.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-cyber font-bold rounded ${getPriorityColor(tip.priority)} bg-current/20`}>
                      {tip.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <AnimatePresence>
                    {expandedTip === tip.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-3"
                      >
                        <p className="text-cyber-primary/80 text-sm leading-relaxed">
                          {tip.message}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-cyber-primary/50 text-xs font-mono">
                      {tip.createdAt.toLocaleDateString()}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onMarkAsRead(tip.id)
                      }}
                      className="flex items-center space-x-1 text-cyber-green hover:text-cyber-green/80 text-xs"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Mark as read</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Read Tips */}
        {readTips.length > 0 && (
          <div className="border-t border-cyber-primary/20 pt-4">
            <h4 className="font-cyber font-bold text-cyber-primary/70 text-sm mb-3">PREVIOUS TIPS</h4>
            {readTips.slice(0, 3).map((tip) => (
              <div key={tip.id} className="p-3 glass-dark rounded border border-cyber-primary/10 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(tip.category)}</span>
                  <span className="text-cyber-primary/70 text-sm">{tip.title}</span>
                  <CheckCircle className="w-4 h-4 text-cyber-green ml-auto" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {tips.length === 0 && (
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-cyber-primary/30 mx-auto mb-4" />
          <p className="text-cyber-primary/70">No coaching tips available yet</p>
          <p className="text-cyber-primary/50 text-sm mt-2">Complete more challenges to receive personalized tips</p>
        </div>
      )}
    </div>
  )
}