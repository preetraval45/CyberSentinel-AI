'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Wand2 } from 'lucide-react'
import { ScenarioElement, ELEMENT_TYPES } from '../../types/scenario'
import toast from 'react-hot-toast'

interface ElementEditorProps {
  element: ScenarioElement | null
  onSave: (element: ScenarioElement) => void
  onClose: () => void
}

export default function ElementEditor({ element, onSave, onClose }: ElementEditorProps) {
  const [editedElement, setEditedElement] = useState<ScenarioElement | null>(element)

  if (!element || !editedElement) return null

  const elementType = ELEMENT_TYPES[element.type as keyof typeof ELEMENT_TYPES]

  const updateElement = (field: string, value: any) => {
    setEditedElement(prev => prev ? {
      ...prev,
      data: { ...prev.data, [field]: value }
    } : null)
  }

  const generateWithAI = async () => {
    toast.loading('Generating content with AI...', { id: 'ai-content' })
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const aiContent = {
      email: {
        title: 'Urgent: Account Security Alert',
        content: 'We have detected suspicious activity on your account. Please verify your identity immediately by clicking the link below to avoid account suspension.'
      },
      message: {
        title: 'System Notification',
        content: 'Your security certificate has expired. Please update your credentials to maintain access to company resources.'
      },
      choice: {
        title: 'What is your response?',
        content: 'You received a suspicious email. What do you do?',
        options: ['Click the link immediately', 'Verify sender through official channels', 'Report as phishing', 'Delete without action']
      },
      outcome: {
        title: 'Security Assessment',
        content: 'Your response has been evaluated. This scenario tests your ability to identify social engineering tactics.',
        score: Math.floor(Math.random() * 20) - 10
      }
    }

    const content = aiContent[element.type as keyof typeof aiContent] || aiContent.email
    
    setEditedElement(prev => prev ? {
      ...prev,
      data: { ...prev.data, ...content }
    } : null)
    
    toast.success('AI content generated!', { id: 'ai-content' })
  }

  const handleSave = () => {
    if (editedElement) {
      onSave(editedElement)
      onClose()
      toast.success('Element updated successfully!')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="cyber-card w-full max-w-2xl m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{elementType.icon}</span>
              <h2 className="text-2xl font-cyber font-bold text-cyber-primary">
                EDIT {elementType.name.toUpperCase()}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-cyber-primary/50 hover:text-cyber-primary"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-cyber-primary/70 text-sm mb-2">Title</label>
              <input
                type="text"
                value={editedElement.data.title}
                onChange={(e) => updateElement('title', e.target.value)}
                className="cyber-input w-full"
                placeholder="Enter element title"
              />
            </div>

            <div>
              <label className="block text-cyber-primary/70 text-sm mb-2">Content</label>
              <textarea
                value={editedElement.data.content}
                onChange={(e) => updateElement('content', e.target.value)}
                className="cyber-input w-full h-32 resize-none"
                placeholder="Enter element content"
              />
            </div>

            {element.type === 'choice' && (
              <div>
                <label className="block text-cyber-primary/70 text-sm mb-2">Options</label>
                <div className="space-y-2">
                  {(editedElement.data.options || []).map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(editedElement.data.options || [])]
                        newOptions[index] = e.target.value
                        updateElement('options', newOptions)
                      }}
                      className="cyber-input w-full"
                      placeholder={`Option ${index + 1}`}
                    />
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [...(editedElement.data.options || []), '']
                      updateElement('options', newOptions)
                    }}
                    className="text-cyber-accent hover:text-cyber-accent/80 text-sm"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}

            {element.type === 'outcome' && (
              <div>
                <label className="block text-cyber-primary/70 text-sm mb-2">Score Impact</label>
                <input
                  type="number"
                  value={editedElement.data.score || 0}
                  onChange={(e) => updateElement('score', parseInt(e.target.value))}
                  className="cyber-input w-full"
                  placeholder="Score change (-10 to +10)"
                  min="-10"
                  max="10"
                />
              </div>
            )}

            {element.type === 'timer' && (
              <div>
                <label className="block text-cyber-primary/70 text-sm mb-2">Delay (seconds)</label>
                <input
                  type="number"
                  value={editedElement.data.delay || 0}
                  onChange={(e) => updateElement('delay', parseInt(e.target.value))}
                  className="cyber-input w-full"
                  placeholder="Delay in seconds"
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateWithAI}
              className="cyber-button flex items-center space-x-2 border-cyber-secondary text-cyber-secondary hover:bg-cyber-secondary hover:text-cyber-dark"
            >
              <Wand2 className="w-4 h-4" />
              <span>AI ENHANCE</span>
            </motion.button>

            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="cyber-button border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-cyber-dark"
              >
                CANCEL
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="cyber-button flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>SAVE</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}