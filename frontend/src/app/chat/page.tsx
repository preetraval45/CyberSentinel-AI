'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, MessageCircle, Zap, Shield, Brain } from 'lucide-react'
import Scene3D from '../../components/3d/Scene3D'
import ChatBubble from '../../components/3d/ChatBubble'
import AIBrain from '../../components/3d/AIBrain'
import CyberButton from '../../components/ui/CyberButton'
import GlassCard from '../../components/ui/GlassCard'
import { fadeInUp, staggerContainer } from '../../lib/utils'

interface Message {
  id: string
  sender_type: 'user' | 'ai'
  message: string
  created_at: string
}

export default function SocialEngineeringChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startSession = (scenario: string, persona: string) => {
    const sessionId = `session_${Date.now()}`
    setSessionId(sessionId)
    setMessages([
      {
        id: '1',
        sender_type: 'ai',
        message: getInitialMessage(scenario),
        created_at: new Date().toISOString()
      }
    ])
  }

  const getInitialMessage = (scenario: string) => {
    const messages = {
      tech_support: "Hi! This is Microsoft Support. We've detected suspicious activity on your computer. Can you help me fix this issue?",
      bank_fraud: "Hello, this is your bank's security department. We've noticed unusual transactions on your account. I need to verify your identity.",
      job_scam: "Congratulations! You've been selected for a high-paying remote position. We just need some personal information to process your application."
    }
    return messages[scenario as keyof typeof messages] || "Hello! How can I help you today?"
  }

  const sendMessage = () => {
    if (!currentMessage.trim() || !sessionId || isLoading) return

    const userMessage = currentMessage
    setCurrentMessage('')
    setIsLoading(true)

    // Add user message immediately
    const tempUserMessage: Message = {
      id: Date.now().toString(),
      sender_type: 'user',
      message: userMessage,
      created_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMessage])

    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponses = [
        "I understand your concern. Can you please provide your account details so I can help you better?",
        "That's exactly what a scammer would say! Let me verify this with additional questions.",
        "I need you to download this software to fix the issue. It's completely safe, I promise.",
        "For security purposes, can you confirm your social security number?",
        "Time is running out! You need to act quickly to secure your account."
      ]
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender_type: 'ai',
        message: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        created_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  const endSession = () => {
    setSessionId(null)
    setMessages([])
    setCurrentMessage('')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-cyber font-black neon-text mb-2">
                AI SOCIAL ENGINEERING
              </h1>
              <p className="text-cyber-primary/70 font-mono">Advanced conversation simulation</p>
            </div>
            <div className="hidden md:block">
              <Scene3D className="w-32 h-32">
                <AIBrain />
              </Scene3D>
            </div>
          </div>
        </motion.div>

        {!sessionId ? (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <GlassCard>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-cyber font-bold neon-text mb-4">SELECT ATTACK SCENARIO</h2>
                <p className="text-cyber-primary/70">Choose your social engineering simulation</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    scenario: 'tech_support',
                    persona: 'fake_tech_support',
                    title: 'FAKE TECH SUPPORT',
                    description: 'Scammer claiming to fix computer issues',
                    icon: '🔧',
                    color: 'text-cyber-accent'
                  },
                  {
                    scenario: 'bank_fraud',
                    persona: 'phishing_caller',
                    title: 'BANK FRAUD CALL',
                    description: 'Fake bank representative about suspicious activity',
                    icon: '🏦',
                    color: 'text-cyber-red'
                  },
                  {
                    scenario: 'job_scam',
                    persona: 'fake_recruiter',
                    title: 'FAKE RECRUITER',
                    description: 'Scammer posing as job recruiter',
                    icon: '💼',
                    color: 'text-cyber-secondary'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.scenario}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="cyber-card cursor-pointer group"
                    onClick={() => startSession(item.scenario, item.persona)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">{item.icon}</div>
                      <h3 className={`font-cyber font-bold mb-2 ${item.color} group-hover:neon-text transition-all duration-300`}>
                        {item.title}
                      </h3>
                      <p className="text-cyber-primary/70 text-sm leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-4">
                        <Scene3D className="h-16">
                          <ChatBubble />
                        </Scene3D>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GlassCard className="h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="flex justify-between items-center p-4 border-b border-cyber-primary/20">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-cyber-primary animate-pulse" />
                  <h2 className="text-xl font-cyber font-bold neon-text">ACTIVE SIMULATION</h2>
                </div>
                <CyberButton onClick={endSession} variant="danger" size="sm">
                  TERMINATE
                </CyberButton>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-3"
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {message.sender_type === 'ai' ? (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-red to-cyber-accent flex items-center justify-center border border-cyber-red/30">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-primary to-cyber-secondary flex items-center justify-center border border-cyber-primary/30">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Message Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`font-cyber font-bold text-sm ${
                          message.sender_type === 'ai' ? 'text-cyber-red' : 'text-cyber-primary'
                        }`}>
                          {message.sender_type === 'ai' ? 'Social Engineer' : 'You'}
                        </span>
                        <span className="text-cyber-primary/50 text-xs font-mono">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                        {message.sender_type === 'ai' && (
                          <span className="px-2 py-0.5 text-xs bg-cyber-red/20 text-cyber-red rounded border border-cyber-red/30">
                            THREAT
                          </span>
                        )}
                      </div>
                      
                      <div className={`p-3 rounded-lg border max-w-2xl ${
                        message.sender_type === 'user'
                          ? 'bg-cyber-primary/10 border-cyber-primary/20 text-cyber-primary'
                          : 'bg-cyber-red/10 border-cyber-red/20 text-cyber-red'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.message}</p>
                      </div>
                      
                      {/* Security Hints for AI messages */}
                      {message.sender_type === 'ai' && (
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="w-4 h-4 bg-cyber-accent/20 rounded-full flex items-center justify-center">
                            <span className="text-cyber-accent text-xs">!</span>
                          </div>
                          <span className="text-cyber-accent text-xs">
                            🚨 Red flag: Requesting personal information
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-red to-cyber-accent flex items-center justify-center border border-cyber-red/30">
                      <Bot className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-cyber font-bold text-sm text-cyber-red">Social Engineer</span>
                        <span className="text-cyber-primary/50 text-xs font-mono">typing...</span>
                      </div>
                      <div className="bg-cyber-red/10 border border-cyber-red/20 p-3 rounded-lg max-w-xs">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyber-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-cyber-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-cyber-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-cyber-primary/20">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your response..."
                    className="flex-1 cyber-input"
                    disabled={isLoading}
                  />
                  <CyberButton
                    onClick={sendMessage}
                    disabled={isLoading || !currentMessage.trim()}
                    variant="primary"
                  >
                    <Send className="w-4 h-4" />
                  </CyberButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}