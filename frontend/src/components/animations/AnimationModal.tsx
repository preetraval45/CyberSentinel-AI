'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { modalVariants } from '@/lib/animations'
import FeedbackAnimation from './FeedbackAnimation'

interface AnimationModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'error' | 'unlock' | 'complete'
  title: string
  message: string
  autoClose?: boolean
  duration?: number
}

export default function AnimationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  autoClose = true,
  duration = 3000
}: AnimationModalProps) {
  const handleAnimationComplete = () => {
    if (autoClose) {
      setTimeout(onClose, duration)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="glass-card p-8 max-w-md w-full text-center">
              <FeedbackAnimation
                type={type}
                show={true}
                size="xl"
                onComplete={handleAnimationComplete}
              />
              <h2 className="text-2xl font-bold text-gray-100 mt-4 mb-2">
                {title}
              </h2>
              <p className="text-gray-400 mb-6">
                {message}
              </p>
              {!autoClose && (
                <button
                  onClick={onClose}
                  className="neon-button px-6 py-2"
                >
                  Continue
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}