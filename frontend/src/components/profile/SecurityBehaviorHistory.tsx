'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'
import { SecurityBehavior } from '../../types/profile'

interface SecurityBehaviorHistoryProps {
  behaviors: SecurityBehavior[]
}

export default function SecurityBehaviorHistory({ behaviors }: SecurityBehaviorHistoryProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-5 h-5 text-cyber-green" />
      case 'negative': return <XCircle className="w-5 h-5 text-cyber-red" />
      case 'neutral': return <AlertCircle className="w-5 h-5 text-cyber-accent" />
      default: return <Clock className="w-5 h-5 text-cyber-primary" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-cyber-green/30 bg-cyber-green/5'
      case 'negative': return 'border-cyber-red/30 bg-cyber-red/5'
      case 'neutral': return 'border-cyber-accent/30 bg-cyber-accent/5'
      default: return 'border-cyber-primary/30 bg-cyber-primary/5'
    }
  }

  const getRiskImpactText = (impact: number) => {
    if (impact > 0) return `+${impact} risk`
    if (impact < 0) return `${impact} risk`
    return 'No impact'
  }

  return (
    <div className="cyber-card">
      <h3 className="font-cyber font-bold text-cyber-primary mb-6">SECURITY BEHAVIOR HISTORY</h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {behaviors.map((behavior, index) => (
          <motion.div
            key={behavior.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border ${getTypeColor(behavior.type)}`}
          >
            <div className="flex items-start space-x-3">
              {getTypeIcon(behavior.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-cyber font-bold text-cyber-primary text-sm">
                    {behavior.action}
                  </h4>
                  <span className="text-cyber-primary/50 text-xs font-mono">
                    {behavior.timestamp.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-cyber-primary/80 text-sm mb-2">
                  {behavior.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-cyber font-bold ${
                    behavior.riskImpact > 0 ? 'text-cyber-red' : 
                    behavior.riskImpact < 0 ? 'text-cyber-green' : 
                    'text-cyber-primary/70'
                  }`}>
                    {getRiskImpactText(behavior.riskImpact)}
                  </span>
                  <span className="text-cyber-primary/50 text-xs">
                    {behavior.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {behaviors.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-cyber-primary/30 mx-auto mb-4" />
          <p className="text-cyber-primary/70">No security behaviors recorded yet</p>
        </div>
      )}
    </div>
  )
}