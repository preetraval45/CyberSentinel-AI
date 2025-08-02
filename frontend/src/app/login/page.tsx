'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react'
import { authenticateUser, generateToken, FAKE_USERS } from '../../types/auth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 1000))

    const user = authenticateUser(email, password)
    if (user) {
      const token = generateToken(user)
      localStorage.setItem('auth_token', token)
      localStorage.setItem('current_user', JSON.stringify(user))
      toast.success(`Welcome back, ${user.name}!`)
      window.location.href = '/dashboard'
    } else {
      toast.error('Invalid credentials. Use demo123 as password.')
    }
    
    setIsLoading(false)
  }

  const handleDemoLogin = (userEmail: string) => {
    setEmail(userEmail)
    setPassword('demo123')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="cyber-card">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4 border-2 border-cyber-primary rounded-full flex items-center justify-center"
            >
              <Shield className="w-8 h-8 text-cyber-primary" />
            </motion.div>
            <h1 className="text-3xl font-cyber font-black neon-text mb-2">
              CYBERSENTINEL LOGIN
            </h1>
            <p className="text-cyber-primary/70">Secure access to your security dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="flex items-center space-x-2 text-cyber-primary/70 text-sm mb-2">
                <Mail className="w-4 h-4" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cyber-input w-full"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-cyber-primary/70 text-sm mb-2">
                <Lock className="w-4 h-4" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cyber-input w-full pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-primary/50 hover:text-cyber-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="cyber-button w-full flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'AUTHENTICATING...' : 'LOGIN'}</span>
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-cyber-primary/20">
            <h3 className="font-cyber font-bold text-cyber-primary text-sm mb-4">DEMO ACCOUNTS</h3>
            <div className="space-y-2">
              {FAKE_USERS.slice(0, 3).map((user) => (
                <motion.button
                  key={user.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleDemoLogin(user.email)}
                  className="w-full text-left p-3 glass-dark rounded border border-cyber-primary/20 hover:border-cyber-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-cyber font-bold text-cyber-primary text-sm">{user.name}</p>
                      <p className="text-cyber-primary/70 text-xs">{user.role} • {user.email}</p>
                    </div>
                    <div className="text-cyber-accent font-cyber font-bold text-sm">
                      {user.securityScore}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
            <p className="text-cyber-primary/50 text-xs mt-4 text-center">
              Password: demo123 for all accounts
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}