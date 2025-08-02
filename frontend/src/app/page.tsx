'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Shield } from 'lucide-react'
import dynamic from 'next/dynamic'

const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), { ssr: false })
const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), { ssr: false })

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 dark-grid opacity-20" />
        <div className="relative z-10 text-center">
          <div className="w-32 h-32 mx-auto mb-8">
            <Suspense fallback={
              <div className="w-full h-full border-2 border-blue-500/50 rounded-full flex items-center justify-center bg-blue-500/10">
                <Shield className="w-16 h-16 text-blue-400" />
              </div>
            }>
              <Scene3D className="w-full h-full">
                <HeroScene />
              </Scene3D>
            </Suspense>
          </div>
          <h1 className="text-4xl font-bold glow-text mb-4">CyberSentinel AI</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return null
}