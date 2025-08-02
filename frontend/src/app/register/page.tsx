'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '@/lib/validations'
import { slideUp, buttonHover, inputFocus, staggerContainer } from '@/lib/animations'
import PageTransition from '@/components/ui/PageTransition'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import AnimationModal from '@/components/animations/AnimationModal'
import dynamic from 'next/dynamic'

const Scene3D = dynamic(() => import('@/components/3d/Scene3D'), { ssr: false })
const SecurityShield = dynamic(() => import('@/components/3d/SecurityShield'), { ssr: false })

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { register: registerUser, user, loading } = useAuth()
  const router = useRouter()
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const success = await registerUser(data.email, data.password)
      if (success) {
        setShowSuccessModal(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError('root', { message: 'Registration failed. Please try again.' })
      }
    } catch (error) {
      setError('root', { message: 'Registration failed. Please try again.' })
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 dark-grid opacity-20" />
        
        <motion.div 
          className="relative z-10 w-full max-w-md"
          variants={slideUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="glass-card p-8">
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div 
                className="w-24 h-24 mx-auto mb-4 relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Suspense fallback={
                  <div className="w-full h-full border-2 border-purple-500/50 rounded-full flex items-center justify-center bg-purple-500/10">
                    <Shield className="w-8 h-8 text-purple-400" />
                  </div>
                }>
                  <Scene3D className="w-full h-full">
                    <SecurityShield />
                  </Scene3D>
                </Suspense>
              </motion.div>
              <h2 className="text-3xl font-bold glow-text mb-2">
                Create Account
              </h2>
              <p className="text-gray-400">Join CyberSentinel AI</p>
            </motion.div>
            
            <motion.form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={slideUp}>
                <label className="flex items-center space-x-2 text-gray-300 text-sm mb-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                </label>
                <motion.input
                  type="email"
                  {...register('email')}
                  className={`glass-input w-full ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                  {...inputFocus}
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
              
              <motion.div variants={slideUp}>
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
              
              <motion.div variants={slideUp}>
                <label className="flex items-center space-x-2 text-gray-300 text-sm mb-2">
                  <Lock className="w-4 h-4" />
                  <span>Confirm Password</span>
                </label>
                <motion.input
                  type="password"
                  {...register('confirmPassword')}
                  className={`glass-input w-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirm your password"
                  {...inputFocus}
                />
                {errors.confirmPassword && (
                  <motion.p 
                    className="text-red-400 text-sm mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.confirmPassword.message}
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
                variants={slideUp}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" color="text-white" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'CREATING ACCOUNT...' : 'SIGN UP'}</span>
              </motion.button>
              
              <motion.div className="text-center" variants={slideUp}>
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <motion.a 
                    href="/login" 
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Sign in
                  </motion.a>
                </p>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
      
      <AnimationModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Account Created!"
        message="Welcome to CyberSentinel AI"
        autoClose={true}
        duration={1500}
      />
    </PageTransition>
  )
}