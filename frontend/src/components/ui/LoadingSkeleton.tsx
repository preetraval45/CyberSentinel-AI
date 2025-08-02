'use client'

import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'avatar' | 'button'
}

const variants = {
  text: 'h-4 bg-gray-700/50 rounded',
  card: 'h-32 bg-gray-700/30 rounded-xl',
  avatar: 'w-12 h-12 bg-gray-700/50 rounded-full',
  button: 'h-10 bg-gray-700/40 rounded-lg'
}

export default function LoadingSkeleton({ className = '', variant = 'text' }: LoadingSkeletonProps) {
  return (
    <motion.div
      className={`${variants[variant]} ${className} animate-pulse`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <LoadingSkeleton variant="text" className="w-1/3 h-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} variant="card" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <LoadingSkeleton key={i} variant="text" className="w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}