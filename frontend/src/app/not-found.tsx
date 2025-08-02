'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Home, ArrowLeft, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('404')

  useEffect(() => {
    const glitchChars = ['4', '0', '4', '█', '▓', '▒', '░', '◆', '◇', '◈']
    const interval = setInterval(() => {
      const randomText = Array.from({ length: 3 }, () => 
        glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ).join('')
      setGlitchText(randomText)
      
      setTimeout(() => setGlitchText('404'), 100)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 cyber-grid opacity-10" />
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 bg-cyber-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              height: '100%',
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* AI Sentinel Bot */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="mb-8"
        >
          <div className="relative mx-auto w-32 h-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-cyber-primary/30 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-2 border-cyber-secondary/50 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-16 h-16 text-cyber-primary" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-4 border border-cyber-primary/20 rounded-full"
            />
          </div>
        </motion.div>

        {/* Glitch Error Code */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-cyber font-black neon-text mb-4 relative">
              {glitchText}
              <motion.div
                className="absolute inset-0 text-cyber-red"
                animate={{
                  x: [0, -2, 2, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                {glitchText}
              </motion.div>
              <motion.div
                className="absolute inset-0 text-cyber-secondary"
                animate={{
                  x: [0, 2, -2, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  delay: 0.1,
                }}
              >
                {glitchText}
              </motion.div>
            </h1>
          </div>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 1 }}
            className="h-1 bg-gradient-to-r from-cyber-primary via-cyber-secondary to-cyber-accent mx-auto mb-6"
          />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-cyber font-bold text-cyber-primary mb-4">
            SECURITY BREACH DETECTED
          </h2>
          <p className="text-cyber-primary/70 text-lg mb-2">
            The requested resource has been quarantined by our AI Sentinel.
          </p>
          <p className="text-cyber-primary/50 font-mono text-sm">
            ERROR_CODE: PAGE_NOT_FOUND | TIMESTAMP: {new Date().toISOString()}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="cyber-button flex items-center space-x-2 px-8 py-4"
            >
              <Home className="w-5 h-5" />
              <span>RETURN TO BASE</span>
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => window.history.back()}
              className="cyber-button flex items-center space-x-2 px-8 py-4 border-cyber-secondary text-cyber-secondary hover:bg-cyber-secondary hover:text-cyber-dark"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>GO BACK</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Security Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-12 glass-dark p-6 rounded-lg border border-cyber-primary/20"
        >
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Zap className="w-6 h-6 text-cyber-green animate-pulse" />
            <span className="font-cyber font-bold text-cyber-green">SYSTEM SECURE</span>
          </div>
          <p className="text-cyber-primary/60 text-sm">
            All security protocols are active. Your session remains protected.
          </p>
        </motion.div>
      </div>
    </div>
  )
}