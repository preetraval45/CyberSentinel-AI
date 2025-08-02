'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const [glitchActive, setGlitchActive] = useState(false)
  const [errorCode] = useState(() => Math.floor(Math.random() * 900) + 500)

  useEffect(() => {
    console.error('Application error:', error)
    
    const glitchInterval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }, 3000)

    return () => clearInterval(glitchInterval)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-cyber-red/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 100 + 50}px`,
            }}
            animate={{
              opacity: [0, 0.5, 0],
              scaleY: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-8"
        >
          <div className="relative mx-auto w-32 h-32">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: glitchActive ? [1, 1.2, 0.8, 1] : 1
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 0.2 }
              }}
              className="absolute inset-0 border-4 border-cyber-red/50 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertTriangle className="w-16 h-16 text-cyber-red" />
            </div>
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-4 border border-cyber-red/30 rounded-full"
            />
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative">
            <h1 className={`text-7xl md:text-8xl font-cyber font-black text-cyber-red mb-4 ${
              glitchActive ? 'animate-pulse' : ''
            }`}>
              {errorCode}
              {glitchActive && (
                <>
                  <motion.div
                    className="absolute inset-0 text-cyber-primary"
                    animate={{ x: [-3, 3, -3], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.2 }}
                  >
                    {errorCode}
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 text-cyber-accent"
                    animate={{ x: [3, -3, 3], opacity: [0, 1, 0] }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    {errorCode}
                  </motion.div>\n                </>\n              )}\n            </h1>\n          </div>\n        </motion.div>\n\n        {/* Error Message */}\n        <motion.div\n          initial={{ opacity: 0 }}\n          animate={{ opacity: 1 }}\n          transition={{ delay: 0.6 }}\n          className=\"mb-8\"\n        >\n          <h2 className=\"text-2xl md:text-3xl font-cyber font-bold text-cyber-red mb-4\">\n            SYSTEM MALFUNCTION\n          </h2>\n          <p className=\"text-cyber-primary/70 text-lg mb-4\">\n            A critical error has occurred in the security matrix.\n          </p>\n          <div className=\"glass-dark p-4 rounded-lg border border-cyber-red/30 mb-4\">\n            <div className=\"flex items-center space-x-2 mb-2\">\n              <Bug className=\"w-4 h-4 text-cyber-red\" />\n              <span className=\"font-cyber font-bold text-cyber-red text-sm\">ERROR DETAILS</span>\n            </div>\n            <p className=\"text-cyber-primary/60 font-mono text-xs break-all\">\n              {error.message || 'Unknown system error'}\n            </p>\n            {error.digest && (\n              <p className=\"text-cyber-primary/40 font-mono text-xs mt-2\">\n                DIGEST: {error.digest}\n              </p>\n            )}\n          </div>\n        </motion.div>\n\n        {/* Action Buttons */}\n        <motion.div\n          initial={{ opacity: 0, y: 30 }}\n          animate={{ opacity: 1, y: 0 }}\n          transition={{ delay: 0.9 }}\n          className=\"flex flex-col sm:flex-row gap-4 justify-center items-center\"\n        >\n          <motion.button\n            onClick={reset}\n            whileHover={{ scale: 1.05 }}\n            whileTap={{ scale: 0.95 }}\n            className=\"cyber-button flex items-center space-x-2 px-8 py-4 border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-cyber-dark\"\n          >\n            <RefreshCw className=\"w-5 h-5\" />\n            <span>RETRY OPERATION</span>\n          </motion.button>\n          \n          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>\n            <Link\n              href=\"/\"\n              className=\"cyber-button flex items-center space-x-2 px-8 py-4\"\n            >\n              <Home className=\"w-5 h-5\" />\n              <span>RETURN TO BASE</span>\n            </Link>\n          </motion.div>\n        </motion.div>\n\n        {/* System Status */}\n        <motion.div\n          initial={{ opacity: 0 }}\n          animate={{ opacity: 1 }}\n          transition={{ delay: 1.2 }}\n          className=\"mt-12 glass-dark p-6 rounded-lg border border-cyber-red/20\"\n        >\n          <div className=\"flex items-center justify-center space-x-4 mb-4\">\n            <motion.div\n              animate={{ rotate: 360 }}\n              transition={{ duration: 2, repeat: Infinity, ease: \"linear\" }}\n            >\n              <RefreshCw className=\"w-6 h-6 text-cyber-accent\" />\n            </motion.div>\n            <span className=\"font-cyber font-bold text-cyber-accent\">DIAGNOSTIC MODE</span>\n          </div>\n          <p className=\"text-cyber-primary/60 text-sm\">\n            AI Sentinel is analyzing the error. Security protocols remain active.\n          </p>\n        </motion.div>\n      </div>\n    </div>\n  )\n}"