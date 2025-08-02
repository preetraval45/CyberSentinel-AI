'use client'

import { motion } from 'framer-motion'
import { Player } from '@lottiefiles/react-lottie-player'
import { Shield, AlertTriangle, TrendingUp, Brain, Activity, Zap, Eye, Lock } from 'lucide-react'
import { fadeInUp, staggerContainer, glowHover, cyberPulse } from '../../lib/utils'
import { useState, useEffect } from 'react'
import RoleBasedDashboard from '../../components/dashboard/RoleBasedDashboard'
import ProgressTracker from '../../components/gamification/ProgressTracker'
import RoleSelector from '../../components/auth/RoleSelector'
import toast, { Toaster } from 'react-hot-toast'
import { UserRole } from '../../types/roles'

export default function Dashboard() {
  const [userRole, setUserRole] = useState<UserRole>('admin')
  const [tenantId] = useState('CORP-001')
  const [companyName] = useState('TechCorp Industries')
  const [showRoleSelector, setShowRoleSelector] = useState(false)
  const [threats, setThreats] = useState(12)
  const [vulnerabilities, setVulnerabilities] = useState(8)
  const [securityScore, setSecurityScore] = useState(85)
  const [aiAlerts, setAiAlerts] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(prev => prev + Math.floor(Math.random() * 3) - 1)
      setVulnerabilities(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
      setSecurityScore(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 5) - 2)))
      setAiAlerts(prev => Math.max(0, prev + Math.floor(Math.random() * 2) - 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      title: 'ACTIVE THREATS',
      value: threats,
      icon: Shield,
      color: 'text-cyber-red',
      bgColor: 'from-cyber-red/20',
      pulse: true
    },
    {
      title: 'VULNERABILITIES',
      value: vulnerabilities,
      icon: AlertTriangle,
      color: 'text-cyber-accent',
      bgColor: 'from-cyber-accent/20'
    },
    {
      title: 'SECURITY SCORE',
      value: `${securityScore}%`,
      icon: TrendingUp,
      color: 'text-cyber-green',
      bgColor: 'from-cyber-green/20'
    },
    {
      title: 'AI ALERTS',
      value: aiAlerts,
      icon: Brain,
      color: 'text-cyber-primary',
      bgColor: 'from-cyber-primary/20'
    }
  ]

  const threats_data = [
    { type: 'Malware Detection', severity: 'CRITICAL', color: 'text-cyber-red', time: '2m ago' },
    { type: 'Suspicious Network Activity', severity: 'HIGH', color: 'text-cyber-accent', time: '5m ago' },
    { type: 'Unauthorized Access Attempt', severity: 'MEDIUM', color: 'text-cyber-secondary', time: '12m ago' },
    { type: 'Data Exfiltration Alert', severity: 'HIGH', color: 'text-cyber-accent', time: '18m ago' }
  ]

  const insights = [
    { message: 'Unusual login patterns detected from IP 192.168.1.100', type: 'warning', icon: Eye },
    { message: 'Security posture improved by 15% this week', type: 'success', icon: TrendingUp },
    { message: 'New threat signatures updated in AI model', type: 'info', icon: Brain },
    { message: 'Firewall rules optimized automatically', type: 'success', icon: Lock }
  ]

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-cyber font-black neon-text mb-4">
            SECURITY COMMAND CENTER
          </h1>
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse" />
            <span className="text-cyber-primary/70 font-mono">SYSTEM STATUS: OPERATIONAL</span>
          </div>
        </motion.div>
        
        {/* Role Selector Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 flex justify-center"
        >
          <button
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="cyber-button text-sm px-6 py-2"
          >
            {showRoleSelector ? 'HIDE' : 'SWITCH'} ROLE
          </button>
        </motion.div>

        {/* Role Selector */}
        {showRoleSelector && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="cyber-card">
              <RoleSelector 
                selectedRole={userRole} 
                onRoleChange={(role) => {
                  setUserRole(role)
                  setShowRoleSelector(false)
                  toast.success(`Switched to ${role} role`)
                }}
                availableRoles={['superadmin', 'admin', 'securitytrainer', 'analyst', 'employee']}
              />
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.title}
                variants={fadeInUp}
                {...glowHover}
                className="cyber-card relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className={`w-8 h-8 ${stat.color} ${stat.pulse ? 'animate-pulse' : ''}`} />
                    <div className="w-12 h-12 opacity-30">
                      <Player
                        autoplay
                        loop
                        src={`https://lottie.host/stat-${index + 1}.json`}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-cyber font-bold text-cyber-primary/70 mb-2 tracking-wider">
                    {stat.title}
                  </h3>
                  
                  <motion.p 
                    key={stat.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-4xl font-cyber font-black ${stat.color} group-hover:neon-text transition-all duration-300`}
                  >
                    {stat.value}
                  </motion.p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Threats Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="cyber-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-cyber font-bold neon-text">THREAT MATRIX</h2>
              <Activity className="w-6 h-6 text-cyber-red animate-pulse" />
            </div>
            
            <div className="space-y-4">
              {threats_data.map((threat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="glass-dark p-4 rounded-lg border border-cyber-primary/20 hover:border-cyber-primary/40 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-cyber-primary font-medium mb-1">{threat.type}</p>
                      <p className="text-cyber-primary/50 text-sm font-mono">{threat.time}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-cyber font-bold px-2 py-1 rounded ${threat.color} bg-current/10 border border-current/30`}>
                        {threat.severity}
                      </span>
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ color: threat.color.replace('text-', '') }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* AI Insights Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="cyber-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-cyber font-bold neon-text">AI NEURAL INSIGHTS</h2>
              <Brain className="w-6 h-6 text-cyber-primary animate-pulse" />
            </div>
            
            <div className="space-y-4">
              {insights.map((insight, index) => {
                const IconComponent = insight.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="glass-dark p-4 rounded-lg border border-cyber-primary/20 hover:border-cyber-primary/40 transition-all duration-300 group"
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent className="w-5 h-5 text-cyber-primary mt-0.5 group-hover:animate-pulse" />
                      <p className="text-cyber-primary/80 text-sm leading-relaxed group-hover:text-cyber-primary transition-colors duration-300">
                        {insight.message}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Role-Based Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2"
          >
            <RoleBasedDashboard userRole={userRole} tenantId={tenantId} companyName={companyName} />
          </motion.div>

          {/* Progress Tracker */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <ProgressTracker onSuccess={() => toast.success('Achievement unlocked!')} />
          </motion.div>
        </div>

        {/* Real-time Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-12 cyber-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-cyber font-bold neon-text">LIVE ACTIVITY STREAM</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
              <span className="text-cyber-primary/70 text-sm font-mono">STREAMING</span>
            </div>
          </div>
          
          <div className="h-32 overflow-hidden relative">
            <motion.div
              animate={{ y: [-100, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="space-y-2 font-mono text-sm"
            >
              <div className="text-cyber-primary/60">[12:34:56] Network scan initiated from 10.0.0.1</div>
              <div className="text-cyber-green/60">[12:34:58] Firewall rule updated: ALLOW port 443</div>
              <div className="text-cyber-accent/60">[12:35:01] Suspicious file quarantined: malware.exe</div>
              <div className="text-cyber-primary/60">[12:35:03] AI model updated with new threat signatures</div>
              <div className="text-cyber-red/60">[12:35:05] ALERT: Brute force attempt detected</div>
            </motion.div>
          </div>
        </motion.div>
        
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(0, 255, 255, 0.1)',
              color: '#00ffff',
              border: '1px solid rgba(0, 255, 255, 0.3)'
            }
          }}
        />
      </div>
    </div>
  )
}