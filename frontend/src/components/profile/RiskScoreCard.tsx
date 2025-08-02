'use client'

import { motion } from 'framer-motion'
import { Shield, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

interface RiskScoreCardProps {
  riskScore: number
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  trend: 'up' | 'down' | 'stable'
  lastUpdated: Date
}

export default function RiskScoreCard({ riskScore, securityLevel, trend, lastUpdated }: RiskScoreCardProps) {
  const getRiskColor = () => {
    switch (securityLevel) {
      case 'LOW': return '#00ff66'
      case 'MEDIUM': return '#ffff00'
      case 'HIGH': return '#ff00ff'
      case 'CRITICAL': return '#ff0066'
      default: return '#00ffff'
    }
  }

  const getRiskIcon = () => {
    switch (securityLevel) {
      case 'LOW': return <Shield className="w-6 h-6 text-cyber-green" />
      case 'MEDIUM': return <AlertTriangle className="w-6 h-6 text-cyber-accent" />
      case 'HIGH': return <AlertTriangle className="w-6 h-6 text-cyber-secondary" />
      case 'CRITICAL': return <AlertTriangle className="w-6 h-6 text-cyber-red animate-pulse" />
      default: return <Shield className="w-6 h-6 text-cyber-primary" />
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-cyber-red" />
      case 'down': return <TrendingDown className="w-4 h-4 text-cyber-green" />
      default: return <div className="w-4 h-4 bg-cyber-primary/50 rounded-full" />
    }
  }

  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {getRiskIcon()}
          <div>
            <h3 className="font-cyber font-bold text-cyber-primary">RISK SCORE</h3>
            <p className="text-cyber-primary/70 text-sm">Current security level</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          <span className="text-cyber-primary/70 text-xs font-mono">
            {trend === 'up' ? 'INCREASING' : trend === 'down' ? 'DECREASING' : 'STABLE'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="w-24 h-24">
          <CircularProgressbar
            value={riskScore}
            text={`${riskScore}`}
            styles={buildStyles({
              textSize: '20px',
              pathColor: getRiskColor(),
              textColor: getRiskColor(),
              trailColor: 'rgba(255,255,255,0.1)',
              pathTransitionDuration: 1.5,
            })}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-cyber font-bold text-cyber-primary text-lg">
              {securityLevel} RISK
            </span>
            <span className="text-cyber-primary/70 text-sm font-mono">
              {riskScore}/100
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-cyber-primary/70">Last Updated:</span>
              <span className="text-cyber-primary font-mono">
                {lastUpdated.toLocaleDateString()}
              </span>
            </div>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${riskScore}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-2 rounded-full"
              style={{ backgroundColor: getRiskColor() }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 glass-dark rounded border border-cyber-primary/20">
        <p className="text-cyber-primary/80 text-sm">
          {securityLevel === 'LOW' && "Excellent security posture! Keep up the good work."}
          {securityLevel === 'MEDIUM' && "Good security awareness. Room for improvement in some areas."}
          {securityLevel === 'HIGH' && "Security concerns detected. Additional training recommended."}
          {securityLevel === 'CRITICAL' && "Immediate attention required! High-risk behaviors identified."}
        </p>
      </div>
    </div>
  )
}