'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/profile', label: 'Profile' },
    { href: '/personalization', label: 'Personalize' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/scenario-builder', label: 'Builder' },
    { href: '/cybermap', label: 'Cyber Map' },
    { href: '/threats', label: 'Threats' },
    { href: '/vulnerabilities', label: 'Vulnerabilities' },
    { href: '/phishing', label: 'Phishing' },
    { href: '/voice-calls', label: 'Voice Calls' },
    { href: '/ransomware', label: 'Ransomware' },
    { href: '/team-simulation', label: 'Team Sim' },
    { href: '/red-blue', label: 'Red vs Blue' },
    { href: '/chat', label: 'AI Chat' },
    { href: '/simulation', label: 'Simulation' },
    { href: '/training', label: 'Training' },
    { href: '/settings', label: 'Settings' },
    { href: '/admin', label: 'Admin' }
  ]

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-cyber-primary/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Shield className="w-8 h-8 text-cyber-primary" />
                <div className="absolute inset-0 w-8 h-8 border border-cyber-primary rounded-full animate-ping opacity-20" />
              </motion.div>
              <span className="text-xl font-cyber font-bold neon-text">
                CYBERSENTINEL
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-cyber-primary/70 hover:text-cyber-primary transition-all duration-300 hover:bg-cyber-primary/10 rounded-lg relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyber-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/login" className="ml-4 cyber-button text-xs px-4 py-2">
                LOGIN
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-cyber-primary hover:text-cyber-primary/80 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden glass-dark border-t border-cyber-primary/20"
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className="block px-3 py-2 text-cyber-primary/70 hover:text-cyber-primary hover:bg-cyber-primary/10 rounded-lg transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
            transition={{ delay: navItems.length * 0.05 }}
            className="pt-2"
          >
            <Link
              href="/login"
              className="block cyber-button text-center text-xs"
              onClick={() => setIsOpen(false)}
            >
              LOGIN
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.nav>
  )
}
