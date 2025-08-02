'use client'

import { motion } from 'framer-motion'
import { inputFocus } from '@/lib/animations'
import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  icon?: ReactNode
  error?: string
  children: ReactNode
}

export default function FormField({ label, icon, error, children }: FormFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label className="flex items-center space-x-2 text-gray-300 text-sm mb-2">
        {icon}
        <span>{label}</span>
      </label>
      {children}
      {error && (
        <motion.p 
          className="text-red-400 text-sm mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}