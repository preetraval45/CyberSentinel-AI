'use client'

import { useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

interface RoleGuardProps {
  children: ReactNode
  requiredRole: string
  fallback?: ReactNode
}

export default function RoleGuard({ children, requiredRole, fallback }: RoleGuardProps) {
  const { hasRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!hasRole(requiredRole)) {
    return fallback || (
      <div className="text-center p-8">
        <div className="text-red-500 text-lg font-semibold mb-2">Access Denied</div>
        <div className="text-gray-600">You don't have permission to view this content.</div>
      </div>
    )
  }

  return <>{children}</>
}