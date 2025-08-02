'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Calendar, Target } from 'lucide-react'
import { staggerContainer, slideUp } from '@/lib/animations'

interface CompletedSimulation {
  id: string
  name: string
  completion_date: string
  score: number
}

interface CompletedSimulationsProps {
  simulations: CompletedSimulation[]
}

export default function CompletedSimulations({ simulations }: CompletedSimulationsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
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
        Completed Training
      </motion.h2>

      {simulations.length === 0 ? (
        <motion.div 
          className="glass-card p-8 text-center"
          variants={slideUp}
        >
          <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Completed Training</h3>
          <p className="text-gray-400">Complete training simulations to see them here.</p>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-4"
          variants={staggerContainer}
        >
          {simulations.map((simulation, index) => (
            <motion.div
              key={simulation.id}
              className="glass-card p-6"
              variants={slideUp}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      {simulation.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(simulation.completion_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span className={`font-semibold ${getScoreColor(simulation.score)}`}>
                          {simulation.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}