'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Hash, Lock, Users, MoreVertical, Smile, Paperclip, Send, AlertTriangle, Flag } from 'lucide-react'
import toast from 'react-hot-toast'

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

interface SlackInterfaceProps {
  environment: any
  messages: Message[]
  onMessageAction: (messageId: string, action: string, response?: string) => void
  onGenerateAttack: () => void
}

export default function SlackInterface({ environment, messages, onMessageAction, onGenerateAttack }: SlackInterfaceProps) {
  const [selectedChannel, setSelectedChannel] = useState('general')
  const [messageInput, setMessageInput] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const channelMessages = messages.filter(msg => msg.channel === selectedChannel)

  const handleLinkClick = (messageId: string) => {
    onMessageAction(messageId, 'click')
    toast.error('⚠️ Malicious link clicked! This would compromise your system.')
  }

  const handleReport = (messageId: string) => {
    onMessageAction(messageId, 'report')
    toast.success('✅ Message reported to security team!')
  }

  const handleReply = (messageId: string) => {
    if (messageInput.trim()) {
      onMessageAction(messageId, 'respond', messageInput)
      setMessageInput('')
      setReplyingTo(null)
      toast.success('Response sent!')
    }
  }

  const getAttackIcon = (attackType: string) => {
    switch (attackType) {
      case 'credential_harvest': return '🎣'
      case 'malware_link': return '🦠'
      case 'urgent_request': return '⚡'
      default: return '⚠️'
    }
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-purple-900 text-white">
        <div className="p-4 border-b border-purple-800">
          <h2 className="font-bold text-lg">{environment.team_name}</h2>
          <div className="flex items-center mt-2">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm text-gray-300">You</span>
          </div>
        </div>

        {/* Channels */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Channels</h3>
          {environment.channels.map((channel: any) => (
            <button
              key={channel.name}
              onClick={() => setSelectedChannel(channel.name)}
              className={`flex items-center w-full p-2 rounded text-left hover:bg-purple-800 ${
                selectedChannel === channel.name ? 'bg-purple-800' : ''
              }`}
            >
              {channel.type === 'private' ? <Lock className="w-4 h-4 mr-2" /> : <Hash className="w-4 h-4 mr-2" />}
              <span className="text-sm">{channel.name}</span>
            </button>
          ))}
        </div>

        {/* Team Members */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Team Members</h3>
          {environment.colleagues.map((colleague: any, index: number) => (
            <div key={index} className="flex items-center p-2">
              <span className="text-lg mr-2">{colleague.avatar}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{colleague.name}</div>
                <div className="text-xs text-gray-400">{colleague.role}</div>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                colleague.status === 'online' ? 'bg-green-400' :
                colleague.status === 'away' ? 'bg-yellow-400' : 'bg-gray-400'
              }`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Hash className="w-5 h-5 text-gray-500 mr-2" />
            <h1 className="font-bold text-lg">#{selectedChannel}</h1>
            <span className="ml-2 text-sm text-gray-500">
              {environment.channels.find((c: any) => c.name === selectedChannel)?.members} members
            </span>
          </div>
          <button
            onClick={onGenerateAttack}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
          >
            Generate Attack
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {channelMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-l-4 ${
                message.attack_type === 'credential_harvest' ? 'border-yellow-500 bg-yellow-50' :
                message.attack_type === 'malware_link' ? 'border-red-500 bg-red-50' :
                message.attack_type === 'urgent_request' ? 'border-orange-500 bg-orange-50' :
                'border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">
                    {environment.colleagues.find((c: any) => c.name === message.sender_name)?.avatar || '👤'}
                  </span>
                  <div>
                    <span className="font-bold text-gray-900">{message.sender_name}</span>
                    <span className="text-sm text-gray-500 ml-2">{message.sender_role}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg" title={`Attack Type: ${message.attack_type}`}>
                    {getAttackIcon(message.attack_type)}
                  </span>
                  <button
                    onClick={() => handleReport(message.id)}
                    disabled={message.is_reported}
                    className={`p-1 rounded ${
                      message.is_reported ? 'text-green-600' : 'text-gray-400 hover:text-red-600'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-gray-800 mb-3">
                {message.message_content.split(/(http[s]?:\/\/[^\s]+)/).map((part, index) => {
                  if (part.match(/http[s]?:\/\/[^\s]+/)) {
                    return (
                      <button
                        key={index}
                        onClick={() => handleLinkClick(message.id)}
                        disabled={message.is_clicked}
                        className={`text-blue-600 underline hover:text-blue-800 ${
                          message.is_clicked ? 'line-through text-red-600' : ''
                        }`}
                      >
                        {part}
                      </button>
                    )
                  }
                  return part
                })}
              </div>

              {message.is_clicked && (
                <div className="bg-red-100 border border-red-300 rounded p-2 text-red-800 text-sm">
                  ⚠️ Malicious link clicked! This action would compromise security.
                </div>
              )}

              {message.is_reported && (
                <div className="bg-green-100 border border-green-300 rounded p-2 text-green-800 text-sm">
                  ✅ Message reported to security team.
                </div>
              )}

              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => setReplyingTo(message.id)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Reply
                </button>
              </div>

              {replyingTo === message.id && (
                <div className="mt-3 flex items-center space-x-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleReply(message.id)}
                  />
                  <button
                    onClick={() => handleReply(message.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder={`Message #${selectedChannel}`}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
              disabled
            />
            <button className="p-2 text-gray-400">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400">
              <Smile className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}