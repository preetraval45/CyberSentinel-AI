'use client'

import { motion } from 'framer-motion'
import { RadioGroup } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/solid'

interface Avatar {
  id: string
  name: string
  color: string
  icon: string
}

interface AvatarSelectionProps {
  selected: string
  onChange: (value: string) => void
}

const avatars: Avatar[] = [
  { id: 'cyber-guardian', name: 'Cyber Guardian', color: 'bg-cyber-primary', icon: '🛡️' },
  { id: 'data-analyst', name: 'Data Analyst', color: 'bg-cyber-secondary', icon: '📊' },
  { id: 'threat-hunter', name: 'Threat Hunter', color: 'bg-cyber-accent', icon: '🎯' },
  { id: 'security-admin', name: 'Security Admin', color: 'bg-cyber-green', icon: '⚙️' },
  { id: 'incident-responder', name: 'Incident Responder', color: 'bg-cyber-red', icon: '🚨' },
  { id: 'ai-specialist', name: 'AI Specialist', color: 'bg-cyber-blue', icon: '🤖' },
]

export default function AvatarSelection({ selected, onChange }: AvatarSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-cyber font-bold neon-text mb-2">Choose Your Avatar</h3>
        <p className="text-cyber-primary/70">Select your cybersecurity role</p>
      </div>
      
      <RadioGroup value={selected} onChange={onChange}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {avatars.map((avatar) => (
            <RadioGroup.Option key={avatar.id} value={avatar.id}>
              {({ checked }) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative cursor-pointer rounded-lg p-4 cyber-card ${
                    checked ? 'border-cyber-primary cyber-glow' : 'border-cyber-primary/30'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`w-16 h-16 rounded-full ${avatar.color} flex items-center justify-center text-2xl`}>
                      {avatar.icon}
                    </div>
                    <div className="text-center">
                      <p className="font-cyber font-bold text-cyber-primary text-sm">{avatar.name}</p>
                    </div>
                    {checked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-cyber-primary rounded-full flex items-center justify-center"
                      >
                        <CheckIcon className="w-4 h-4 text-cyber-dark" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}