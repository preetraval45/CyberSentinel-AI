'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Clock, Target, CheckCircle, XCircle } from 'lucide-react'
import FakeDesktop from './FakeDesktop'
import toast from 'react-hot-toast'

interface SimulationState {
  id: string
  scenario_type: string
  current_step: number
  total_steps: number
  steps_completed: number[]
  incorrect_actions: number
  time_taken: number
  is_completed: boolean
  final_score: number
  current_step_info: any
  all_steps: any[]
}

export default function RansomwareSimulator() {
  const [simulation, setSimulation] = useState<SimulationState | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [showRansomNote, setShowRansomNote] = useState(false)
  const [selectedScenario, setSelectedScenario] = useState('crypto_locker')

  const scenarios = {
    crypto_locker: 'CryptoLocker Ransomware',
    file_encrypt: 'File Encryption Attack'
  }

  const startSimulation = async () => {
    try {
      const response = await fetch('/api/ransomware/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_type: selectedScenario, difficulty_level: 1 })
      })
      
      const data = await response.json()
      setSimulation(data)
      setStartTime(Date.now())
      setShowRansomNote(true)
    } catch (error) {
      toast.error('Failed to start simulation')
    }
  }

  const executeAction = async (action: string) => {
    if (!simulation) return

    const timeTaken = (Date.now() - startTime) / 1000

    try {
      const response = await fetch(`/api/ransomware/action/${simulation.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, time_taken: timeTaken })
      })
      
      const result = await response.json()
      
      if (result.correct) {
        toast.success(`✅ Correct action! Step ${result.current_step}/${simulation.total_steps}`)
        if (action === 'take_screenshot') setShowRansomNote(false)
      } else {
        toast.error('❌ Incorrect action. Try again!')
      }

      // Refresh simulation state
      const stateResponse = await fetch(`/api/ransomware/state/${simulation.id}`)
      const newState = await stateResponse.json()
      setSimulation(newState)

      if (result.completed) {
        toast.success(`🎉 Simulation completed! Score: ${result.score}/100`)
      }
    } catch (error) {
      toast.error('Action failed')
    }
  }

  const getStepStatus = (stepId: number) => {
    if (!simulation) return 'pending'
    if (simulation.steps_completed.includes(stepId)) return 'completed'
    if (simulation.current_step_info?.id === stepId) return 'current'
    return 'pending'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'current': return <Target className="w-5 h-5 text-cyan-400 animate-pulse" />
      default: return <div className="w-5 h-5 rounded-full border-2 border-gray-600" />
    }
  }

  if (!simulation) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-cyber font-black neon-text mb-4">
              RANSOMWARE SIMULATOR
            </h1>
            <p className="text-cyber-primary/70 font-mono">
              Learn incident response through realistic ransomware scenarios
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cyber-card p-8 text-center"
          >
            <h2 className="text-2xl font-cyber font-bold text-cyber-primary mb-6">
              SELECT SCENARIO
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {Object.entries(scenarios).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedScenario(key)}
                  className={`cyber-card p-6 transition-all duration-300 ${
                    selectedScenario === key ? 'border-cyber-primary cyber-glow' : 'border-cyber-primary/30'
                  }`}
                >
                  <Shield className="w-12 h-12 text-cyber-primary mx-auto mb-4" />
                  <div className="font-cyber font-bold text-cyber-primary">{label}</div>
                </button>
              ))}
            </div>

            <button
              onClick={startSimulation}
              className="cyber-button-primary px-8 py-4 text-lg"
            >
              START SIMULATION
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Desktop Simulation */}
      <div className="flex-1">
        <FakeDesktop
          isInfected={true}
          onAction={executeAction}
          currentStep={simulation.current_step_info}
          showRansomNote={showRansomNote}
        />
      </div>

      {/* Progress Panel */}
      <div className="w-80 bg-black/90 border-l border-cyber-primary/30 p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-cyber font-bold text-cyber-primary mb-2">
            INCIDENT RESPONSE
          </h2>
          <div className="text-cyber-primary/70 text-sm">
            {scenarios[simulation.scenario_type as keyof typeof scenarios]}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="cyber-card p-3 text-center">
            <div className="text-cyber-accent font-bold text-lg">
              {simulation.steps_completed.length}/{simulation.total_steps}
            </div>
            <div className="text-xs text-cyber-primary/70">STEPS</div>
          </div>
          <div className="cyber-card p-3 text-center">
            <div className="text-cyber-red font-bold text-lg">
              {simulation.incorrect_actions}
            </div>
            <div className="text-xs text-cyber-primary/70">ERRORS</div>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="space-y-3">
          <h3 className="font-cyber font-bold text-cyber-primary text-sm">RESPONSE STEPS</h3>
          {simulation.all_steps.map((step: any) => {
            const status = getStepStatus(step.id)
            return (
              <div
                key={step.id}
                className={`flex items-start space-x-3 p-3 rounded border ${
                  status === 'current' ? 'border-cyan-500 bg-cyan-500/10' :
                  status === 'completed' ? 'border-green-500 bg-green-500/10' :
                  'border-gray-600 bg-gray-800/50'
                }`}
              >
                {getStatusIcon(status)}
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${
                    status === 'completed' ? 'text-green-400' :
                    status === 'current' ? 'text-cyan-400' :
                    'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Completion */}
        {simulation.is_completed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 cyber-card p-4 text-center border-green-500"
          >
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
            <div className="text-green-400 font-bold text-lg mb-1">
              SIMULATION COMPLETE
            </div>
            <div className="text-white text-2xl font-bold">
              {simulation.final_score}/100
            </div>
            <button
              onClick={() => setSimulation(null)}
              className="cyber-button-primary w-full mt-4"
            >
              NEW SIMULATION
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}