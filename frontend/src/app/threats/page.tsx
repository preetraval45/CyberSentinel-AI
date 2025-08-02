'use client'

import { motion } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import { Shield, AlertTriangle, Zap, Eye, Play, Pause, RotateCcw } from 'lucide-react'
import { useState, useEffect } from 'react'
import { fadeInUp, staggerContainer, glowHover } from '../../lib/utils'
import GlassCard from '../../components/ui/GlassCard'
import CyberButton from '../../components/ui/CyberButton'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function Threats() {
  const [isScanning, setIsScanning] = useState(false)
  const [threats, setThreats] = useState([
    { id: 1, type: 'Advanced Persistent Threat', severity: 'CRITICAL', status: 'ACTIVE', time: '2 min ago', source: '192.168.1.100', icon: Shield },
    { id: 2, type: 'Ransomware Signature', severity: 'HIGH', status: 'QUARANTINED', time: '15 min ago', source: 'email.exe', icon: AlertTriangle },
    { id: 3, type: 'DDoS Attack Vector', severity: 'HIGH', status: 'MITIGATED', time: '1 hour ago', source: 'Multiple IPs', icon: Zap },
    { id: 4, type: 'SQL Injection Attempt', severity: 'MEDIUM', status: 'BLOCKED', time: '2 hours ago', source: 'web-app.com', icon: Eye },
  ])

  const startScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      // Add new threat
      const newThreat = {
        id: threats.length + 1,
        type: 'Zero-Day Exploit',
        severity: 'CRITICAL',
        status: 'DETECTED',
        time: 'Just now',
        source: 'unknown.bin',
        icon: Shield
      }
      setThreats(prev => [newThreat, ...prev])
    }, 3000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-cyber-red border-cyber-red bg-cyber-red/10'
      case 'HIGH': return 'text-cyber-accent border-cyber-accent bg-cyber-accent/10'
      case 'MEDIUM': return 'text-cyber-secondary border-cyber-secondary bg-cyber-secondary/10'
      default: return 'text-cyber-primary border-cyber-primary bg-cyber-primary/10'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-cyber-red animate-pulse'
      case 'QUARANTINED': return 'text-cyber-accent'
      case 'MITIGATED': return 'text-cyber-green'
      case 'BLOCKED': return 'text-cyber-blue'
      case 'DETECTED': return 'text-cyber-primary animate-pulse'
      default: return 'text-cyber-primary/70'
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-cyber font-black neon-text mb-2">
              THREAT MATRIX
            </h1>
            <p className="text-cyber-primary/70 font-mono">Real-time threat detection and analysis</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <CyberButton
              onClick={startScan}
              disabled={isScanning}
              loading={isScanning}
              variant="primary"
            >
              {isScanning ? 'SCANNING' : 'DEEP SCAN'}
            </CyberButton>
            
            <motion.div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-cyber-accent animate-pulse' : 'bg-cyber-green'}`} />
              <span className="text-cyber-primary/70 font-mono text-sm">
                {isScanning ? 'SCANNING...' : 'MONITORING'}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Scanning Animation */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-8"
          >
            <GlassCard className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6">
                <Player
                  autoplay
                  loop
                  src="https://lottie.host/scanning-animation.json"
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-2xl font-cyber font-bold text-cyber-primary mb-2">DEEP SCAN IN PROGRESS</h3>
              <p className="text-cyber-primary/70">Analyzing network traffic and system vulnerabilities...</p>
              <div className="mt-4 flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Threats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {threats.map((threat, index) => {
            const IconComponent = threat.icon
            return (
              <motion.div
                key={threat.id}
                variants={fadeInUp}
                {...glowHover}
                className="group"
              >
                <GlassCard className="hover:border-cyber-primary/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <IconComponent className={`w-8 h-8 ${getSeverityColor(threat.severity).split(' ')[0]} group-hover:animate-pulse`} />
                        <div className="absolute -inset-2 border border-current rounded-full opacity-20 animate-ping" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-cyber font-bold text-cyber-primary mb-1">
                          {threat.type}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-cyber-primary/70 font-mono">
                            Source: {threat.source}
                          </span>
                          <span className="text-cyber-primary/50 font-mono">
                            {threat.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className={`px-3 py-1 rounded border text-xs font-cyber font-bold ${getSeverityColor(threat.severity)}`}>
                          {threat.severity}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className={`font-cyber font-bold text-sm ${getStatusColor(threat.status)}`}>
                          {threat.status}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-cyber-primary/70 hover:text-cyber-primary transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-cyber-primary/70 hover:text-cyber-primary transition-colors"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <GlassCard>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { label: 'THREATS DETECTED', value: threats.length, color: 'text-cyber-red' },
                { label: 'ACTIVE THREATS', value: threats.filter(t => t.status === 'ACTIVE').length, color: 'text-cyber-accent' },
                { label: 'MITIGATED', value: threats.filter(t => t.status === 'MITIGATED').length, color: 'text-cyber-green' },
                { label: 'SCAN ACCURACY', value: '99.7%', color: 'text-cyber-primary' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <div className={`text-3xl font-cyber font-black ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-cyber-primary/70 font-mono text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}