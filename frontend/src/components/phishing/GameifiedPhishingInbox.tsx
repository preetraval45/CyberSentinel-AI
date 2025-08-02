'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Shield, Zap, Target, TrendingUp, Clock } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { phishingAPI } from '../../lib/phishing-api'
import SimulationPreview from '../ai/SimulationPreview'

interface Email {
  id: string
  subject: string
  sender: string
  content: string
  difficulty_level: string
  ai_click_likelihood: number
  is_clicked: boolean
  is_reported: boolean
  created_at: string
}

interface GameSession {
  score: number
  difficulty_level: number
  emails_processed: number
  correct_identifications: number
  clicks_on_malicious: number
  accuracy: number
}

interface Alert {
  id: string
  alert_type: string
  feedback_message: string
  xp_awarded: number
  response_time: number
  created_at: string
}

interface SimulationData {
  psychological_triggers: string[]
  scoring: {
    base_click_likelihood: number
    success_points: number
    failure_penalty: number
  }
  learning_objectives: string[]
  attack_vector: string
  difficulty_level: number
  email?: {
    subject: string
    sender: string
    sender_name: string
    content: string
  }
}

export default function GameifiedPhishingInbox() {
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [gameSession, setGameSession] = useState<GameSession>({
    score: 0,
    difficulty_level: 1,
    emails_processed: 0,
    correct_identifications: 0,
    clicks_on_malicious: 0,
    accuracy: 0
  })
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [lastSimulationData, setLastSimulationData] = useState<SimulationData | null>(null)

  useEffect(() => {
    fetchGameSession()
    fetchEmails()
    fetchAlerts()
  }, [])

  const fetchGameSession = async () => {
    try {
      const data = await phishingAPI.getGameSession()
      setGameSession(data)
    } catch (error) {
      console.error('Failed to fetch game session:', error)
    }
  }

  const fetchEmails = async () => {
    try {
      const data = await phishingAPI.getInbox()
      setEmails(data)
      if (data.length > 0 && !selectedEmail) {
        setSelectedEmail(data[0])
        setStartTime(Date.now())
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error)
    }
  }

  const fetchAlerts = async () => {
    try {
      const data = await phishingAPI.getAlerts()
      setAlerts(data)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  }

  const generateEmail = async () => {
    try {
      const newEmail = await phishingAPI.generateEmail(gameSession.difficulty_level)
      setEmails(prev => [newEmail, ...prev])
      if (!selectedEmail) {
        setSelectedEmail(newEmail)
        setStartTime(Date.now())
      }
      
      // Store AI simulation data
      if (newEmail.psychological_triggers) {
        setLastSimulationData({
          psychological_triggers: newEmail.psychological_triggers,
          scoring: newEmail.scoring,
          learning_objectives: newEmail.learning_objectives || [],
          attack_vector: newEmail.type,
          difficulty_level: parseInt(newEmail.difficulty_level),
          email: {
            subject: newEmail.subject,
            sender: newEmail.sender,
            sender_name: newEmail.sender_name || newEmail.sender,
            content: newEmail.content
          }
        })
        
        const triggers = newEmail.psychological_triggers.join(', ')
        toast.success(`🎯 AI-generated attack! Triggers: ${triggers}`)
      }
    } catch (error) {
      console.error('Failed to generate email:', error)
    }
  }

  const trackClick = async (emailId: string) => {
    const responseTime = (Date.now() - startTime) / 1000
    try {
      const result = await phishingAPI.trackClick(emailId, responseTime)
      
      setEmails(prev => prev.map(email => 
        email.id === emailId ? { ...email, is_clicked: true } : email
      ))
      
      // Real-time alert
      showAlert(result.feedback, 'danger')
      fetchGameSession()
      fetchAlerts()
    } catch (error) {
      console.error('Failed to track click:', error)
    }
  }

  const reportPhishing = async (emailId: string) => {
    const responseTime = (Date.now() - startTime) / 1000
    try {
      const result = await phishingAPI.reportPhishing(emailId, responseTime)
      
      setEmails(prev => prev.map(email => 
        email.id === emailId ? { ...email, is_reported: true } : email
      ))
      
      // Real-time alert with confetti
      showAlert(result.feedback, 'success')
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00ffff', '#00ff66']
      })
      fetchGameSession()
      fetchAlerts()
    } catch (error) {
      console.error('Failed to report phishing:', error)
    }
  }

  const updateDifficulty = async (level: number) => {
    try {
      await phishingAPI.updateDifficulty(level)
      setGameSession(prev => ({ ...prev, difficulty_level: level }))
    } catch (error) {
      console.error('Failed to update difficulty:', error)
    }
  }

  const showAlert = (feedback: any, type: string) => {
    const toastStyle = {
      background: type === 'success' ? 'rgba(0, 255, 102, 0.1)' : 'rgba(255, 0, 102, 0.1)',
      color: type === 'success' ? '#00ff66' : '#ff0066',
      border: `1px solid ${type === 'success' ? 'rgba(0, 255, 102, 0.3)' : 'rgba(255, 0, 102, 0.3)'}`
    }

    if (type === 'success') {
      toast.success(`${feedback.message} (+${feedback.xp} XP)`, { style: toastStyle })
    } else {
      toast.error(`${feedback.message} (${feedback.xp} XP)`, { style: toastStyle })
    }
  }

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return 'text-cyber-green'
      case 2: return 'text-cyber-secondary'
      case 3: return 'text-cyber-red'
      default: return 'text-cyber-primary'
    }
  }

  const getLikelihoodColor = (likelihood: number) => {
    if (likelihood >= 80) return 'text-cyber-red'
    if (likelihood >= 60) return 'text-cyber-accent'
    if (likelihood >= 40) return 'text-cyber-secondary'
    return 'text-cyber-green'
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Game Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-4xl md:text-6xl font-cyber font-black neon-text mb-2">
                PHISHING GAME
              </h1>
              <p className="text-cyber-primary/70 font-mono">Real-time threat simulation with AI prediction</p>
            </div>
            
            {/* Game Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="cyber-card p-4">
                <div className="text-cyber-accent font-cyber font-bold text-lg">{gameSession.score}</div>
                <div className="text-cyber-primary/70 text-sm">XP SCORE</div>
              </div>
              <div className="cyber-card p-4">
                <div className="text-cyber-green font-cyber font-bold text-lg">{gameSession.accuracy}%</div>
                <div className="text-cyber-primary/70 text-sm">ACCURACY</div>
              </div>
              <div className="cyber-card p-4">
                <div className="text-cyber-secondary font-cyber font-bold text-lg">{gameSession.emails_processed}</div>
                <div className="text-cyber-primary/70 text-sm">PROCESSED</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Difficulty Slider */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="cyber-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-cyber font-bold text-cyber-primary">DIFFICULTY LEVEL</h3>
            <button
              onClick={generateEmail}
              className="cyber-button-primary px-6 py-2"
            >
              GENERATE THREAT
            </button>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex-1">
              <input
                type="range"
                min="1"
                max="3"
                value={gameSession.difficulty_level}
                onChange={(e) => updateDifficulty(parseInt(e.target.value))}
                className="w-full h-2 bg-cyber-primary/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-sm mt-2">
                <span className="text-cyber-green">BEGINNER</span>
                <span className="text-cyber-secondary">INTERMEDIATE</span>
                <span className="text-cyber-red">ADVANCED</span>
              </div>
            </div>
            <div className={`font-cyber font-bold text-lg ${getDifficultyColor(gameSession.difficulty_level)}`}>
              LEVEL {gameSession.difficulty_level}
            </div>
          </div>
        </motion.div>

        {/* AI Simulation Preview */}
        {lastSimulationData && (
          <div className="mb-8">
            <SimulationPreview data={lastSimulationData} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Email List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="cyber-card p-6"
          >
            <h3 className="text-xl font-cyber font-bold neon-text mb-4">INBOX</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {emails.map((email) => (
                <motion.div
                  key={email.id}
                  whileHover={{ scale: 1.02 }}
                  className={`cyber-card cursor-pointer transition-all duration-300 ${
                    selectedEmail?.id === email.id ? 'border-cyber-primary cyber-glow' : 'border-cyber-primary/30'
                  }`}
                  onClick={() => {
                    setSelectedEmail(email)
                    setStartTime(Date.now())
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-cyber font-bold text-cyber-primary text-sm truncate">
                      {email.subject}
                    </h4>
                    <div className={`text-xs font-cyber font-bold ${getLikelihoodColor(email.ai_click_likelihood)}`}>
                      {email.ai_click_likelihood}%
                    </div>
                  </div>
                  <p className="text-cyber-primary/70 text-xs font-mono mb-1">{email.sender}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(parseInt(email.difficulty_level))}`}>
                      LVL {email.difficulty_level}
                    </span>
                    {email.is_clicked && <span className="text-cyber-red text-xs">CLICKED</span>}
                    {email.is_reported && <span className="text-cyber-green text-xs">REPORTED</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Email Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cyber-card p-6"
          >
            {selectedEmail ? (
              <div>
                <div className="border-b border-cyber-primary/20 pb-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-cyber font-bold text-cyber-primary">
                      {selectedEmail.subject}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Target className={`w-4 h-4 ${getLikelihoodColor(selectedEmail.ai_click_likelihood)}`} />
                      <span className={`text-sm font-cyber font-bold ${getLikelihoodColor(selectedEmail.ai_click_likelihood)}`}>
                        {selectedEmail.ai_click_likelihood}%
                      </span>
                    </div>
                  </div>
                  <p className="text-cyber-primary/70 font-mono text-sm mb-1">
                    From: {selectedEmail.sender}
                  </p>
                  <p className="text-cyber-primary/50 font-mono text-xs">
                    AI Prediction: {selectedEmail.ai_click_likelihood}% click likelihood
                  </p>
                </div>
                
                <div className="mb-8">
                  <div className="glass-dark p-4 rounded-lg border border-cyber-primary/20">
                    <p className="text-cyber-primary/80 leading-relaxed">
                      {selectedEmail.content}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => trackClick(selectedEmail.id)}
                    disabled={selectedEmail.is_clicked}
                    className={`cyber-button-danger flex items-center justify-center space-x-2 ${
                      selectedEmail.is_clicked ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>{selectedEmail.is_clicked ? 'LINK CLICKED' : 'CLICK MALICIOUS LINK'}</span>
                  </button>
                  
                  <button
                    onClick={() => reportPhishing(selectedEmail.id)}
                    disabled={selectedEmail.is_reported}
                    className={`cyber-button-primary flex items-center justify-center space-x-2 ${
                      selectedEmail.is_reported ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>{selectedEmail.is_reported ? 'ALREADY REPORTED' : 'REPORT PHISHING'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertTriangle className="w-16 h-16 text-cyber-primary/30 mb-4" />
                <p className="text-cyber-primary/70 font-cyber font-bold">
                  SELECT EMAIL TO ANALYZE
                </p>
              </div>
            )}
          </motion.div>

          {/* Real-time Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="cyber-card p-6"
          >
            <h3 className="text-xl font-cyber font-bold neon-text mb-4">LIVE ALERTS</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`cyber-card p-3 border-l-4 ${
                      alert.alert_type === 'report' ? 'border-cyber-green' : 'border-cyber-red'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-cyber font-bold ${
                        alert.alert_type === 'report' ? 'text-cyber-green' : 'text-cyber-red'
                      }`}>
                        {alert.alert_type.toUpperCase()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 text-cyber-primary/50" />
                        <span className="text-xs text-cyber-primary/50">
                          {alert.response_time?.toFixed(1)}s
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-cyber-primary/80 mb-2">
                      {alert.feedback_message}
                    </p>
                    <div className={`text-xs font-cyber font-bold ${
                      alert.xp_awarded > 0 ? 'text-cyber-green' : 'text-cyber-red'
                    }`}>
                      {alert.xp_awarded > 0 ? '+' : ''}{alert.xp_awarded} XP
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 255, 0.3)'
          }
        }}
      />
    </div>
  )
}