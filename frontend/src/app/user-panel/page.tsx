'use client'

import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/contexts/AuthContext'

export default function UserPanelPage() {
  const { user } = useAuth()

  return (
    <RoleGuard requiredRole="User">
      <div className="min-h-screen pt-20 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 dark-grid opacity-10" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold glow-text mb-8">User Panel</h1>
          
          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">User Dashboard</h2>
            <p className="text-gray-300 mb-2">Welcome, {user?.email}</p>
            <p className="text-sm text-green-400 bg-green-500/10 rounded-lg px-3 py-1 inline-block">Role: {user?.role}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="dark-card neon-border group">
              <h3 className="font-semibold text-blue-400 text-lg mb-2 group-hover:text-blue-300 transition-colors">My Profile</h3>
              <p className="text-gray-400 text-sm">Manage your profile settings</p>
            </div>
            <div className="dark-card neon-border group">
              <h3 className="font-semibold text-green-400 text-lg mb-2 group-hover:text-green-300 transition-colors">My Data</h3>
              <p className="text-gray-400 text-sm">View and manage your data</p>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}