'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'
import { fadeInUp, glowHover } from '../../lib/utils'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login process
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Logo and Header */}
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative mx-auto w-20 h-20 mb-6"
          >
            <Shield className="w-full h-full text-cyber-primary" />
            <div className="absolute inset-0 w-20 h-20 border border-cyber-primary rounded-full animate-ping opacity-20" />
          </motion.div>
          
          <h2 className="text-4xl font-cyber font-black neon-text mb-2">
            ACCESS TERMINAL
          </h2>
          <p className="text-cyber-primary/70 font-mono text-sm">
            AUTHENTICATE TO CONTINUE
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="cyber-card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-cyber font-bold text-cyber-primary/70 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyber-primary/50" />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  placeholder="user@cybersentinel.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cyber-input pl-12 w-full"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-cyber font-bold text-cyber-primary/70 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyber-primary/50" />
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cyber-input pl-12 pr-12 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-primary/50 hover:text-cyber-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              {...glowHover}
              className="w-full cyber-button py-4 relative overflow-hidden group"
            >
              <div className="flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="loading-dots">
                      <span style={{ '--i': 0 } as any} />
                      <span style={{ '--i': 1 } as any} />
                      <span style={{ '--i': 2 } as any} />
                    </div>
                    <span>AUTHENTICATING</span>
                  </>
                ) : (
                  <>
                    <span>INITIALIZE ACCESS</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </motion.button>

            {/* Additional Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-4 h-4 border-2 border-cyber-primary/30 rounded bg-transparent" />
                  <span className="text-cyber-primary/70">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-cyber-primary/70 hover:text-cyber-primary transition-colors">
                  Forgot password?
                </Link>
              </div>
              
              <div className="text-center pt-4 border-t border-cyber-primary/20">
                <p className="text-cyber-primary/70 text-sm mb-2">New to CyberSentinel?</p>
                <Link 
                  href="/register" 
                  className="text-cyber-secondary hover:text-cyber-secondary/80 font-cyber font-bold uppercase tracking-wider transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="glass-dark rounded-lg p-4 border border-cyber-primary/20">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Lock className="w-4 h-4 text-cyber-green" />
              <span className="text-cyber-green text-sm font-cyber font-bold">SECURE CONNECTION</span>
            </div>
            <p className="text-cyber-primary/50 text-xs font-mono">
              256-bit encryption • Multi-factor authentication • Zero-trust architecture
            </p>
          </div>
        </motion.div>

        {/* Background Animation */}
        <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
          <Player
            autoplay
            loop
            src="https://lottie.host/cyber-background.json"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  )
}