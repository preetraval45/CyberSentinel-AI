'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import { Shield, Zap, Brain, Eye, Lock, Cpu, Search, Users } from 'lucide-react'
import { fadeInUp, staggerContainer, glowHover } from '../lib/utils'

export default function Home() {
  const features = [
    {
      href: '/threats',
      icon: Shield,
      title: 'Threat Detection',
      description: 'Real-time AI-powered threat monitoring and analysis',
      color: 'text-cyber-red',
      gradient: 'from-cyber-red/20 to-transparent'
    },
    {
      href: '/phishing',
      icon: Zap,
      title: 'Phishing Simulation',
      description: 'Advanced phishing attack simulations for training',
      color: 'text-cyber-secondary',
      gradient: 'from-cyber-secondary/20 to-transparent'
    },
    {
      href: '/chat',
      icon: Brain,
      title: 'AI Social Engineering',
      description: 'Interactive AI-driven social engineering scenarios',
      color: 'text-cyber-purple',
      gradient: 'from-cyber-purple/20 to-transparent'
    },
    {
      href: '/training',
      icon: Users,
      title: 'Advanced Training',
      description: 'Adaptive cybersecurity training with AI insights',
      color: 'text-cyber-green',
      gradient: 'from-cyber-green/20 to-transparent'
    },
    {
      href: '/simulation',
      icon: Lock,
      title: 'Security Lab',
      description: 'Comprehensive security testing environment',
      color: 'text-cyber-blue',
      gradient: 'from-cyber-blue/20 to-transparent'
    },
    {
      href: '/dashboard',
      icon: Cpu,
      title: 'AI Analysis',
      description: 'Intelligent security analytics and recommendations',
      color: 'text-cyber-primary',
      gradient: 'from-cyber-primary/20 to-transparent'
    },
    {
      href: '/vulnerabilities',
      icon: Search,
      title: 'Vulnerability Scan',
      description: 'Automated security assessment and reporting',
      color: 'text-cyber-accent',
      gradient: 'from-cyber-accent/20 to-transparent'
    }
  ]

  return (
    <main className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center mb-20"
        >
          <motion.div 
            variants={fadeInUp}
            className="relative mb-8 flex justify-center"
          >
            <div className="relative w-32 h-32">
              <Player
                autoplay
                loop
                src="https://lottie.host/4d5e7f8c-8b4a-4c8e-9f2a-1b3c4d5e6f7g/abcdefghij.json"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-cyber-gradient opacity-20 rounded-full blur-xl animate-pulse" />
            </div>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-cyber font-black mb-6 neon-text"
          >
            CYBER<span className="text-cyber-secondary">SENTINEL</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-cyber-primary/70 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Next-generation AI-powered cybersecurity platform delivering
            <span className="text-cyber-primary font-semibold"> real-time threat detection</span>,
            <span className="text-cyber-secondary font-semibold"> intelligent analysis</span>, and
            <span className="text-cyber-accent font-semibold"> automated response</span>
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            {...glowHover}
          >
            <Link href="/dashboard" className="cyber-button text-lg px-12 py-4 inline-block">
              INITIALIZE SYSTEM
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.href}
                variants={fadeInUp}
                {...glowHover}
                className="group"
              >
                <Link href={feature.href} className="block h-full">
                  <div className="cyber-card h-full relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <IconComponent className={`w-12 h-12 ${feature.color} group-hover:animate-pulse`} />
                        <div className="w-16 h-16 opacity-30">
                          <Player
                            autoplay
                            loop
                            src={`https://lottie.host/embed-${index + 1}.json`}
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-cyber font-bold mb-4 text-cyber-primary group-hover:neon-text transition-all duration-300">
                        {feature.title}
                      </h3>
                      
                      <p className="text-cyber-primary/70 leading-relaxed group-hover:text-cyber-primary/90 transition-colors duration-300">
                        {feature.description}
                      </p>
                      
                      <div className="mt-6 flex items-center text-sm font-semibold text-cyber-primary/50 group-hover:text-cyber-primary transition-colors duration-300">
                        <span>EXPLORE MODULE</span>
                        <motion.div 
                          className="ml-2"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 glass-dark rounded-2xl p-8 cyber-border"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '99.9%', label: 'Threat Detection' },
              { value: '<1ms', label: 'Response Time' },
              { value: '24/7', label: 'AI Monitoring' },
              { value: '∞', label: 'Scalability' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="group"
              >
                <div className="text-3xl md:text-4xl font-cyber font-black text-cyber-primary mb-2 group-hover:neon-text transition-all duration-300">
                  {stat.value}
                </div>
                <div className="text-cyber-primary/70 font-medium uppercase tracking-wider text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}