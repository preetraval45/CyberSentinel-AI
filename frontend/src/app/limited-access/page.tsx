'use client'

import RoleGuard from '@/components/auth/RoleGuard'
import { useAuth } from '@/contexts/AuthContext'

export default function LimitedAccessPage() {
  const { user } = useAuth()

  return (
    <RoleGuard requiredRole="LimitedUser">
      <div className="min-h-screen pt-20 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 dark-grid opacity-10" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold glow-text mb-8">Limited Access Area</h1>
          
          <div className="glass-card p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-100 mb-4">Basic Dashboard</h2>
            <p className="text-gray-300 mb-2">Welcome, {user?.email}</p>
            <p className="text-sm text-yellow-400 bg-yellow-500/10 rounded-lg px-3 py-1 inline-block">Role: {user?.role}</p>
          </div>
          
          <div className="dark-card neon-border">
            <h3 className="font-semibold text-gray-300 text-lg mb-2">Basic Information</h3>
            <p className="text-gray-400 text-sm">Limited access content available</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}