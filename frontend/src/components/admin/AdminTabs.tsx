'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, BarChart3, Settings } from 'lucide-react'

interface AdminTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'modules', label: 'Modules', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="bg-gray-800/30 rounded-lg p-1 mb-6 sm:mb-8 overflow-x-auto">
      <div className="flex space-x-1 min-w-max sm:min-w-0">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 bg-blue-500/20 rounded-md"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
              <span className="relative z-10 hidden sm:inline">{tab.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}