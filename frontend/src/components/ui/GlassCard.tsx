'use client'

import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function GlassCard({ children, className, hover = true, glow = false }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      className={cn(
        'glass-dark rounded-lg p-6 cyber-border transition-all duration-300',
        hover && 'hover:border-cyber-primary/50 hover:shadow-[0_0_30px_rgba(0,255,255,0.2)]',
        glow && 'cyber-glow',
        className
      )}
    >
      {children}
    </motion.div>
  )
}