'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit3, Check, X } from 'lucide-react'
import { AVATAR_OPTIONS } from '../../types/profile'

interface AvatarEditorProps {
  currentAvatar: string
  onAvatarChange: (avatarId: string) => void
}

export default function AvatarEditor({ currentAvatar, onAvatarChange }: AvatarEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)

  const currentAvatarData = AVATAR_OPTIONS.find(a => a.id === currentAvatar) || AVATAR_OPTIONS[0]

  const handleSave = () => {
    onAvatarChange(selectedAvatar)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setSelectedAvatar(currentAvatar)
    setIsEditing(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-4">
        <div className={`w-20 h-20 rounded-full ${currentAvatarData.color} flex items-center justify-center text-3xl relative group`}>
          {currentAvatarData.emoji}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsEditing(true)}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyber-primary rounded-full flex items-center justify-center border-2 border-cyber-dark opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit3 className="w-4 h-4 text-cyber-dark" />
          </motion.button>
        </div>
        <div>
          <h3 className="font-cyber font-bold text-cyber-primary">{currentAvatarData.name}</h3>
          <p className="text-cyber-primary/70 text-sm">Click to customize</p>
        </div>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-0 left-0 z-50 glass-dark p-6 rounded-lg border border-cyber-primary/30 min-w-80"
          >
            <h4 className="font-cyber font-bold text-cyber-primary mb-4">CHOOSE AVATAR</h4>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {AVATAR_OPTIONS.map((avatar) => (
                <motion.button
                  key={avatar.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`w-16 h-16 rounded-full ${avatar.color} flex items-center justify-center text-2xl border-2 transition-all ${
                    selectedAvatar === avatar.id 
                      ? 'border-cyber-primary cyber-glow' 
                      : 'border-cyber-primary/30'
                  }`}
                >
                  {avatar.emoji}
                </motion.button>
              ))}
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex-1 cyber-button flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>SAVE</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex-1 cyber-button border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-cyber-dark flex items-center justify-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>CANCEL</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}