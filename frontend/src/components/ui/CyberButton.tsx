'use client'

import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { ReactNode } from 'react'

interface CyberButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

export default function CyberButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  onClick,
  disabled = false,
  loading = false
}: CyberButtonProps) {
  const variants = {
    primary: 'border-cyber-primary text-cyber-primary hover:bg-cyber-primary hover:text-cyber-dark',
    secondary: 'border-cyber-secondary text-cyber-secondary hover:bg-cyber-secondary hover:text-cyber-dark',
    danger: 'border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-cyber-dark'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'bg-transparent border-2 font-cyber font-bold uppercase tracking-wider transition-all duration-300 relative overflow-hidden group',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {loading && (
          <div className="loading-dots">
            <span style={{ '--i': 0 } as any} />
            <span style={{ '--i': 1 } as any} />
            <span style={{ '--i': 2 } as any} />
          </div>
        )}
        <span>{children}</span>
      </div>
      <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    </motion.button>
  )
}