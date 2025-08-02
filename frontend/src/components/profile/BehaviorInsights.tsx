'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, Target, Clock, Shield, AlertTriangle } from 'lucide-react'

interface BehaviorProfile {
  urgency_susceptibility: number
  authority_susceptibility: number
  curiosity_susceptibility: number
  fear_susceptibility: number
  trust_susceptibility: number
  click_rate: number
  report_rate: number
  avg_response_time: number
  improvement_rate: number
}

interface BehaviorInsights {
  primary_vulnerability: string
  vulnerability_score: number
  recommended_difficulty: number
  improvement_trend: string
  risk_level: string
  response_speed: string
}

interface TrainingPlan {
  focus_triggers: string[]
  recommended_frequency: string
  difficulty_progression: number
  scenario_types: string[]
  estimated_improvement_time: string
}

export default function BehaviorInsights() {
  const [profile, setProfile] = useState<BehaviorProfile | null>(null)
  const [insights, setInsights] = useState<BehaviorInsights | null>(null)
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null)

  useEffect(() => {
    loadBehaviorData()
  }, [])

  const loadBehaviorData = async () => {
    try {
      const [profileRes, insightsRes, planRes] = await Promise.all([
        fetch('/api/behavior/profile'),
        fetch('/api/behavior/insights'),
        fetch('/api/behavior/training-plan')
      ])
      
      setProfile(await profileRes.json())
      setInsights(await insightsRes.json())
      setTrainingPlan(await planRes.json())
    } catch (error) {
      console.error('Failed to load behavior data')
    }
  }

  const getSusceptibilityColor = (score: number) => {
    if (score > 0.7) return 'text-red-400 bg-red-400/10'
    if (score > 0.4) return 'text-yellow-400 bg-yellow-400/10'
    return 'text-green-400 bg-green-400/10'
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  if (!profile || !insights || !trainingPlan) {
    return <div className="cyber-card p-6">Loading behavior analysis...</div>
  }

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-cyber font-bold text-cyber-primary flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Security Behavior Profile
          </h2>
          <div className={`px-3 py-1 rounded text-sm font-bold ${getRiskColor(insights.risk_level)}`}>
            {insights.risk_level.toUpperCase()} RISK
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyber-primary">
              {Math.round(profile.click_rate * 100)}%
            </div>
            <div className="text-sm text-cyber-primary/70">Click Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-cyber-green">
              {Math.round(profile.report_rate * 100)}%
            </div>
            <div className="text-sm text-cyber-primary/70">Report Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-cyber-secondary">
              {Math.round(profile.avg_response_time)}s
            </div>
            <div className="text-sm text-cyber-primary/70">Avg Response</div>
          </div>
          
          <div className="text-center">
            <TrendingUp className={`w-6 h-6 mx-auto mb-1 ${
              profile.improvement_rate > 0 ? 'text-green-400' : 
              profile.improvement_rate < 0 ? 'text-red-400' : 'text-gray-400'
            }`} />
            <div className="text-sm text-cyber-primary/70">
              {insights.improvement_trend}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vulnerability Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="cyber-card p-6"
      >
        <h3 className="text-lg font-cyber font-bold text-cyber-primary mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Vulnerability Triggers
        </h3>

        <div className="space-y-3">
          {[
            { name: 'Urgency', score: profile.urgency_susceptibility },
            { name: 'Authority', score: profile.authority_susceptibility },
            { name: 'Curiosity', score: profile.curiosity_susceptibility },
            { name: 'Fear', score: profile.fear_susceptibility },
            { name: 'Trust', score: profile.trust_susceptibility }
          ].map((trigger) => (
            <div key={trigger.name} className="flex items-center justify-between">
              <span className="font-medium text-cyber-primary">{trigger.name}</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      trigger.score > 0.7 ? 'bg-red-400' :
                      trigger.score > 0.4 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${trigger.score * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-bold px-2 py-1 rounded ${getSusceptibilityColor(trigger.score)}`}>
                  {Math.round(trigger.score * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-cyber-primary/5 rounded border border-cyber-primary/20">
          <div className="flex items-center text-cyber-accent mb-1">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <span className="font-bold">Primary Vulnerability</span>
          </div>
          <p className="text-sm text-cyber-primary/80">
            You are most susceptible to <strong>{insights.primary_vulnerability}</strong> triggers 
            ({Math.round(insights.vulnerability_score * 100)}% susceptibility)
          </p>
        </div>
      </motion.div>

      {/* Adaptive Training Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="cyber-card p-6"
      >
        <h3 className="text-lg font-cyber font-bold text-cyber-primary mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          Adaptive Training Plan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-cyber-primary mb-2">Focus Areas</h4>
            <div className="space-y-2">
              {trainingPlan.focus_triggers.map((trigger, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-cyber-accent rounded-full mr-2" />
                  <span className="text-sm text-cyber-primary/80 capitalize">
                    {trigger.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-cyber-primary mb-2">Recommendations</h4>
            <div className="space-y-2 text-sm text-cyber-primary/80">
              <div>
                <Clock className="w-4 h-4 inline mr-2" />
                Training frequency: <strong>{trainingPlan.recommended_frequency}</strong>
              </div>
              <div>
                <Target className="w-4 h-4 inline mr-2" />
                Difficulty level: <strong>{trainingPlan.difficulty_progression}/5</strong>
              </div>
              <div>
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Estimated improvement: <strong>{trainingPlan.estimated_improvement_time}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-400/5 rounded border border-green-400/20">
          <p className="text-sm text-green-400">
            <strong>AI Recommendation:</strong> Based on your behavior patterns, focus on 
            {trainingPlan.focus_triggers.length > 0 ? ` ${trainingPlan.focus_triggers.join(', ')} scenarios` : ' general awareness training'} 
            with {trainingPlan.recommended_frequency} practice sessions.
          </p>
        </div>
      </motion.div>
    </div>
  )
}