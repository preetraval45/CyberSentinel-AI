'use client'

import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { pageVariants, slideUp, cardHover, staggerContainer } from '@/lib/animations'
import PageTransition from '@/components/ui/PageTransition'

export default function AdminPage() {
  const { user } = useAuth()

  return (
    <RoleGuard requiredRole="SuperAdmin">
      <PageTransition>
        <div className="min-h-screen pt-20 pb-12 px-4 relative overflow-hidden">
          <div className="absolute inset-0 dark-grid opacity-10" />
          
          <div className="relative z-10 max-w-6xl mx-auto">
            <motion.h1 
              className="text-4xl font-bold glow-text mb-8"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              Admin Dashboard
            </motion.h1>
            
            <motion.div 
              className="glass-card p-8 mb-8"
              variants={slideUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">SuperAdmin Panel</h2>
              <p className="text-gray-300 mb-2">Welcome, {user?.email}</p>
              <motion.p 
                className="text-sm text-blue-400 bg-blue-500/10 rounded-lg px-3 py-1 inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Role: {user?.role}
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div 
                className="dark-card neon-border group cursor-pointer"
                variants={slideUp}
                {...cardHover}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="font-semibold text-blue-400 text-lg mb-2 group-hover:text-blue-300 transition-colors">User Management</h3>
                <p className="text-gray-400 text-sm">Manage all users and roles</p>
              </motion.div>
              <motion.div 
                className="dark-card neon-border group cursor-pointer"
                variants={slideUp}
                {...cardHover}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="font-semibold text-green-400 text-lg mb-2 group-hover:text-green-300 transition-colors">System Settings</h3>
                <p className="text-gray-400 text-sm">Configure system parameters</p>
              </motion.div>
              <motion.div 
                className="dark-card neon-border group cursor-pointer"
                variants={slideUp}
                {...cardHover}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="font-semibold text-purple-400 text-lg mb-2 group-hover:text-purple-300 transition-colors">Analytics</h3>
                <p className="text-gray-400 text-sm">View system analytics</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    </RoleGuard>
  )
}