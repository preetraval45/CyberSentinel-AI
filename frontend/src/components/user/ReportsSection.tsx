'use client'

import { motion } from 'framer-motion'
import { FileText, Clock, Target } from 'lucide-react'
import { staggerContainer, slideUp } from '@/lib/animations'

interface SessionReport {
  id: string
  simulation_name: string
  score: number
  completion_date: string
  time_taken: number
  attempts: number
}

interface ReportsSectionProps {
  reports: SessionReport[]
}

export default function ReportsSection({ reports }: ReportsSectionProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

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
        Session Reports
      </motion.h2>

      {reports.length === 0 ? (
        <motion.div 
          className="glass-card p-8 text-center"
          variants={slideUp}
        >
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Reports Yet</h3>
          <p className="text-gray-400">Complete simulations to view your performance reports.</p>
        </motion.div>
      ) : (
        <motion.div 
          className="space-y-4"
          variants={staggerContainer}
        >
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              className="glass-card p-6"
              variants={slideUp}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    {report.simulation_name}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Score:</span>
                      <span className={`font-semibold ${getScoreColor(report.score)}`}>
                        {report.score}%
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Time:</span>
                      <span className="text-gray-300">{formatTime(report.time_taken)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Attempts:</span>
                      <span className="text-gray-300">{report.attempts}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Completed:</span>
                      <span className="text-gray-300">
                        {new Date(report.completion_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  className="ml-6 text-blue-400 hover:text-blue-300 text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}