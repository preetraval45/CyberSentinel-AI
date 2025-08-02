'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { staggerContainer, slideUp } from '@/lib/animations'

interface Simulation {
  id: string
  name: string
  type: string
  status: string
  completion_rate: number
  assigned_date: string
  due_date: string
  last_attempt?: string
}

interface SimulationsListProps {
  simulations: Simulation[]
  onStart: (id: string) => void
  onReplay: (id: string) => void
}

export default function SimulationsList({ simulations, onStart, onReplay }: SimulationsListProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (id: string, action: 'start' | 'replay') => {
    setLoading(id)
    try {
      if (action === 'start') {
        await onStart(id)
      } else {
        await onReplay(id)
      }
    } finally {
      setLoading(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20'
      case 'in_progress':
        return 'text-yellow-400 bg-yellow-500/20'
      default:
        return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h2 
        className="text-2xl font-semibold text-gray-100 mb-6"
        variants={slideUp}
      >
        Assigned Simulations
      </motion.h2>

      <motion.div 
        className="space-y-4"
        variants={staggerContainer}
      >
        {simulations.map((simulation, index) => (
          <motion.div
            key={simulation.id}
            className="glass-card p-6"
            variants={slideUp}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getStatusIcon(simulation.status)}
                  <h3 className="text-lg font-semibold text-gray-100">{simulation.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(simulation.status)}`}>
                    {simulation.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm mb-3">{simulation.type}</p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <span>Due: {new Date(simulation.due_date).toLocaleDateString()}</span>
                  {simulation.last_attempt && (
                    <span>Last attempt: {new Date(simulation.last_attempt).toLocaleDateString()}</span>
                  )}
                </div>
                
                {simulation.completion_rate > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gray-300">{simulation.completion_rate}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${simulation.completion_rate}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 ml-6">
                {simulation.status === 'completed' ? (
                  <motion.button
                    onClick={() => handleAction(simulation.id, 'replay')}
                    disabled={loading === simulation.id}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Replay</span>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => handleAction(simulation.id, 'start')}
                    disabled={loading === simulation.id}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-4 h-4" />
                    <span>{simulation.status === 'in_progress' ? 'Continue' : 'Start'}</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}