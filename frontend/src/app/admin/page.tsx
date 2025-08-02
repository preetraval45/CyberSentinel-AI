'use client'

import { useState } from 'react'
import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { slideUp } from '@/lib/animations'
import PageTransition from '@/components/ui/PageTransition'
import AdminTabs from '@/components/admin/AdminTabs'
import UsersTab from '@/components/admin/UsersTab'
import ModulesTab from '@/components/admin/ModulesTab'
import AnalyticsTab from '@/components/admin/AnalyticsTab'
import SettingsTab from '@/components/admin/SettingsTab'

export default function AdminPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('users')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersTab />
      case 'modules':
        return <ModulesTab />
      case 'analytics':
        return <AnalyticsTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <UsersTab />
    }
  }

  return (
    <RoleGuard requiredRole="SuperAdmin">
      <PageTransition>
        <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 dark-grid opacity-10" />
          
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div 
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold glow-text mb-2">SuperAdmin Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-400">Complete system administration and management</p>
            </motion.div>
            
            <motion.div 
              className="glass-card p-4 sm:p-6 mb-6 sm:mb-8"
              variants={slideUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-100 truncate">Welcome, {user?.email}</h2>
                  <p className="text-xs sm:text-sm text-blue-400">Role: {user?.role}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-400">Last login</p>
                  <p className="text-xs sm:text-sm text-gray-300">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
            
            <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </PageTransition>
    </RoleGuard>
  )
}