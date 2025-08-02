'use client'

import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export default function LoadingSpinner({ size = 'md', color = 'text-cyber-primary' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizeClasses[size]} ${color} relative`}
    >
      <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full" />
      <div className="absolute inset-1 border border-current border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
    </motion.div>
  )
}