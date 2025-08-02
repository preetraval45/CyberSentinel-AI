'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Users, Shield } from 'lucide-react'
import SlackInterface from './SlackInterface'
import toast from 'react-hot-toast'

interface Environment {
  id: string
  platform: string
  team_name: string
  colleagues: any[]
  channels: any[]
}

interface Message {
  id: string
  sender_name: string
  sender_role: string
  channel: string
  message_content: string
  attack_type: string
  is_clicked: boolean
  is_reported: boolean
  created_at: string
}

export default function TeamSimulator() {
  const [environment, setEnvironment] = useState<Environment | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState('slack')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadEnvironment()
  }, [])

  const loadEnvironment = async () => {
    try {
      const response = await fetch('/api/team-simulation/environment')
      if (response.ok) {
        const data = await response.json()
        setEnvironment(data)
        loadMessages(data.id)
      }
    } catch (error) {
      console.error('Failed to load environment')
    }
  }

  const createEnvironment = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/team-simulation/environment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: selectedPlatform })
      })
      
      const data = await response.json()
      setEnvironment(data)
      setMessages([])
      toast.success('Team environment created!')
    } catch (error) {
      toast.error('Failed to create environment')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (environmentId: string) => {
    try {
      const response = await fetch(`/api/team-simulation/messages/${environmentId}`)
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Failed to load messages')
    }
  }

  const generateAttack = async () => {
    if (!environment) return

    try {
      const response = await fetch(`/api/team-simulation/attack/${environment.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      
      const newMessage = await response.json()
      setMessages(prev => [newMessage, ...prev])
      toast.success('New social engineering attack generated!')
    } catch (error) {
      toast.error('Failed to generate attack')
    }
  }

  const handleMessageAction = async (messageId: string, action: string, response?: string) => {
    try {
      await fetch(`/api/team-simulation/message/${messageId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, response_text: response })
      })
      
      // Refresh messages
      if (environment) {
        loadMessages(environment.id)
      }
    } catch (error) {
      toast.error('Failed to process action')
    }
  }

  if (!environment) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-cyber font-black neon-text mb-4">
              TEAM SIMULATOR
            </h1>
            <p className="text-cyber-primary/70 font-mono">
              Social engineering attacks from fake colleagues
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cyber-card p-8 text-center"
          >
            <h2 className="text-2xl font-cyber font-bold text-cyber-primary mb-6">
              SELECT PLATFORM
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setSelectedPlatform('slack')}
                className={`cyber-card p-6 transition-all duration-300 ${
                  selectedPlatform === 'slack' ? 'border-cyber-primary cyber-glow' : 'border-cyber-primary/30'
                }`}
              >
                <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <div className="font-cyber font-bold text-cyber-primary">Slack</div>
                <div className="text-sm text-cyber-primary/70 mt-2">Team messaging platform</div>
              </button>

              <button
                onClick={() => setSelectedPlatform('teams')}
                className={`cyber-card p-6 transition-all duration-300 ${
                  selectedPlatform === 'teams' ? 'border-cyber-primary cyber-glow' : 'border-cyber-primary/30'
                }`}
              >
                <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <div className="font-cyber font-bold text-cyber-primary">Microsoft Teams</div>
                <div className="text-sm text-cyber-primary/70 mt-2">Enterprise collaboration</div>
              </button>
            </div>

            <button
              onClick={createEnvironment}
              disabled={loading}
              className="cyber-button-primary px-8 py-4 text-lg"
            >
              {loading ? 'CREATING...' : 'CREATE ENVIRONMENT'}
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen">
      {environment.platform === 'slack' ? (
        <SlackInterface
          environment={environment}
          messages={messages}
          onMessageAction={handleMessageAction}
          onGenerateAttack={generateAttack}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Shield className="w-16 h-16 text-cyber-primary mx-auto mb-4" />
            <h2 className="text-2xl font-cyber font-bold text-cyber-primary">
              Teams Interface Coming Soon
            </h2>
            <p className="text-cyber-primary/70 mt-2">
              Microsoft Teams simulation is under development
            </p>
            <button
              onClick={() => setEnvironment(null)}
              className="cyber-button-primary mt-4"
            >
              Back to Selection
            </button>
          </div>
        </div>
      )}
    </div>
  )
}