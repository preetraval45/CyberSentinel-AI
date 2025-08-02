'use client'

import { motion } from 'framer-motion'
import { loadingSpinner } from '@/lib/animations'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export default function LoadingSpinner({ size = 'md', color = 'text-blue-500' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${color} border-2 border-current border-t-transparent rounded-full`}
      variants={loadingSpinner}
      animate="animate"
    />
  )
}