'use client'

import { motion } from 'framer-motion'
import { buttonHover } from '@/lib/animations'
import LoadingSpinner from './LoadingSpinner'
import { ReactNode } from 'react'

interface SubmitButtonProps {
  isLoading: boolean
  loadingText: string
  children: ReactNode
  disabled?: boolean
  className?: string
  icon?: ReactNode
}

export default function SubmitButton({ 
  isLoading, 
  loadingText, 
  children, 
  disabled = false,
  className = 'neon-button w-full',
  icon
}: SubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      disabled={isLoading || disabled}
      className={`${className} flex items-center justify-center space-x-2 disabled:opacity-50`}
      {...buttonHover}
      transition={{ type: 'spring', stiffness: 300 }}
      whileDisabled={{ scale: 1 }}
    >
      {isLoading ? (
        <LoadingSpinner size="sm" color="text-white" />
      ) : (
        icon
      )}
      <span>{isLoading ? loadingText : children}</span>
    </motion.button>
  )
}