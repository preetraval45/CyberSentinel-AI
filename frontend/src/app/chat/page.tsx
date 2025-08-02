'use client'

import { useState, useEffect, useRef } from 'react'

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

  const startSession = async (scenario: string, persona: string) => {
    try {
      const response = await fetch('/api/chat/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          scenario_type: scenario,
          ai_persona: persona
        })
      })
      const data = await response.json()
      setSessionId(data.session_id)
      setMessages([])
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }

  const sendMessage = async () => {
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

    try {
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage
        })
      })
      const data = await response.json()

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender_type: 'ai',
        message: data.ai_response,
        created_at: data.timestamp
      }
      setMessages(prev => [...prev.slice(0, -1), tempUserMessage, aiMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const endSession = async () => {
    if (!sessionId) return
    
    try {
      await fetch(`/api/chat/session/${sessionId}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      setSessionId(null)
      setMessages([])
    } catch (error) {
      console.error('Failed to end session:', error)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Social Engineering Chat Simulation</h1>

        {!sessionId ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Choose a Scenario</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => startSession('tech_support', 'fake_tech_support')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left"
              >
                <h3 className="font-semibold">Fake Tech Support</h3>
                <p className="text-sm text-gray-600">Scammer claiming to fix computer issues</p>
              </button>
              <button
                onClick={() => startSession('bank_fraud', 'phishing_caller')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left"
              >
                <h3 className="font-semibold">Bank Fraud Call</h3>
                <p className="text-sm text-gray-600">Fake bank representative about suspicious activity</p>
              </button>
              <button
                onClick={() => startSession('job_scam', 'fake_recruiter')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left"
              >
                <h3 className="font-semibold">Fake Recruiter</h3>
                <p className="text-sm text-gray-600">Scammer posing as job recruiter</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow flex flex-col h-96">
            {/* Chat Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Active Chat Session</h2>
              <button
                onClick={endSession}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                End Session
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p>{message.message}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                    <p>AI is typing...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !currentMessage.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}