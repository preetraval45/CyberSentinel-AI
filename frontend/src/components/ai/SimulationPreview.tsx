'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Target, Award, Eye } from 'lucide-react'

interface SimulationData {
  email?: {
    subject: string
    sender: string
    sender_name: string
    content: string
  }
  psychological_triggers: string[]
  scoring: {
    base_click_likelihood: number
    success_points: number
    failure_penalty: number
  }
  learning_objectives: string[]
  attack_vector: string
  difficulty_level: number
}

interface SimulationPreviewProps {
  data: SimulationData
}

export default function SimulationPreview({ data }: SimulationPreviewProps) {
  const [showDetails, setShowDetails] = useState(false)

  const getTriggerColor = (trigger: string) => {
    const colors = {
      urgency: 'text-red-400 bg-red-400/10',
      authority: 'text-purple-400 bg-purple-400/10',
      fear: 'text-orange-400 bg-orange-400/10',
      curiosity: 'text-blue-400 bg-blue-400/10',
      greed: 'text-green-400 bg-green-400/10',
      trust: 'text-cyan-400 bg-cyan-400/10'
    }
    return colors[trigger as keyof typeof colors] || 'text-gray-400 bg-gray-400/10'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="cyber-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-cyber-accent" />
          <h3 className="font-cyber font-bold text-cyber-primary">AI-Generated Simulation</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="cyber-button-primary px-3 py-1 text-sm flex items-center space-x-1"
        >
          <Eye className="w-4 h-4" />
          <span>{showDetails ? 'Hide' : 'Show'} Details</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <Target className="w-6 h-6 text-cyber-accent mx-auto mb-1" />
          <div className="text-lg font-bold text-cyber-primary">
            {Math.round(data.scoring.base_click_likelihood * 100)}%
          </div>
          <div className="text-xs text-cyber-primary/70">Click Risk</div>
        </div>
        
        <div className="text-center">
          <Award className="w-6 h-6 text-cyber-green mx-auto mb-1" />
          <div className="text-lg font-bold text-cyber-green">
            {data.scoring.success_points}
          </div>
          <div className="text-xs text-cyber-primary/70">Success Points</div>
        </div>
        
        <div className="text-center">
          <div className="w-6 h-6 text-cyber-red mx-auto mb-1 flex items-center justify-center font-bold">
            {data.scoring.failure_penalty}
          </div>
          <div className="text-xs text-cyber-primary/70">Penalty</div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-cyber font-bold text-cyber-primary text-sm mb-2">
          Psychological Triggers
        </h4>
        <div className="flex flex-wrap gap-2">
          {data.psychological_triggers.map((trigger, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded text-xs font-medium ${getTriggerColor(trigger)}`}
            >
              {trigger.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {data.email && (
        <div className="mb-4">
          <h4 className="font-cyber font-bold text-cyber-primary text-sm mb-2">
            Email Preview
          </h4>
          <div className="bg-gray-900/50 border border-cyber-primary/20 rounded p-3">
            <div className="text-xs text-cyber-primary/70 mb-1">
              From: {data.email.sender_name} &lt;{data.email.sender}&gt;
            </div>
            <div className="font-bold text-cyber-primary mb-2">
              Subject: {data.email.subject}
            </div>
            <div className="text-sm text-cyber-primary/80">
              {data.email.content.substring(0, 150)}...
            </div>
          </div>
        </div>
      )}

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-cyber-primary/20 pt-4"
        >
          <h4 className="font-cyber font-bold text-cyber-primary text-sm mb-2">
            Learning Objectives
          </h4>
          <ul className="text-sm text-cyber-primary/80 space-y-1">
            {data.learning_objectives.map((objective, index) => (
              <li key={index} className="flex items-start">
                <span className="text-cyber-accent mr-2">•</span>
                {objective}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  )
}