'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/lib/validations'
import { pageVariants, slideUp, buttonHover, inputFocus } from '@/lib/animations'
import PageTransition from '@/components/ui/PageTransition'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

import { LazyCyberBrain, LazyAnimationModal, useViewportOptimization } from '@/components/lazy/LazyComponents'
import Scene3D from '@/components/3d/Scene3D'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { login, user, loading } = useAuth()
  const router = useRouter()
  const { shouldRender3D } = useViewportOptimization()
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const onSubmit = async (data: LoginFormData) => {
    try {
      const success = await login(data.email, data.password)
      if (success) {
        setShowSuccessModal(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError('root', { message: 'Invalid email or password' })
      }
    } catch (error) {
      setError('root', { message: 'Login failed. Please try again.' })
    }
  }



  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 dark-grid opacity-20" />
        
        <motion.div 
          className="relative z-10 w-full max-w-sm sm:max-w-md"
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="glass-card p-6 sm:p-8">
            <motion.div 
              className="text-center mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div 
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
{shouldRender3D ? (
                  <Scene3D className="w-full h-full">
                    <LazyCyberBrain />
                  </Scene3D>
                ) : (
                  <div className="w-full h-full border-2 border-blue-500/50 rounded-full flex items-center justify-center bg-blue-500/10">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                  </div>
                )}
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-bold glow-text mb-2">
                CyberSentinel Login
              </h1>
              <p className="text-sm sm:text-base text-gray-400">Secure access to your dashboard</p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <label className="flex items-center space-x-2 text-gray-300 text-xs sm:text-sm mb-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Email Address</span>
                </label>
                <motion.input
                  type="email"
                  {...register('email')}
                  className={`glass-input w-full text-sm sm:text-base ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                  {...inputFocus}
                  transition={{ type: 'spring', stiffness: 300 }}
                />
                {errors.email && (
                  <motion.p 
                    className="text-red-400 text-sm mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <label className="flex items-center space-x-2 text-gray-300 text-sm mb-2">
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </label>
                <div className="relative">
                  <motion.input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`glass-input w-full pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                    {...inputFocus}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </motion.button>
                </div>
                {errors.password && (
                  <motion.p 
                    className="text-red-400 text-sm mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </motion.div>

              {errors.root && (
                <motion.div 
                  className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {errors.root.message}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="neon-button w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                {...buttonHover}
                transition={{ type: 'spring', stiffness: 300 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileDisabled={{ scale: 1 }}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" color="text-white" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'AUTHENTICATING...' : 'LOGIN'}</span>
              </motion.button>
            </motion.form>

            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <p className="text-gray-400">
                Don't have an account?{' '}
                <motion.a 
                  href="/register" 
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  Sign up
                </motion.a>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <LazyAnimationModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Login Successful!"
        message="Welcome back to CyberSentinel AI"
        autoClose={true}
        duration={1500}
      />
    </PageTransition>
  )
}