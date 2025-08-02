'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Building, Save, Edit3 } from 'lucide-react'
import { CompanySettings } from '../../types/settings'
import toast from 'react-hot-toast'

interface CompanyProfileProps {
  settings: CompanySettings
  onUpdate: (settings: CompanySettings) => void
}

export default function CompanyProfile({ settings, onUpdate }: CompanyProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedSettings, setEditedSettings] = useState(settings)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string
        setEditedSettings(prev => ({ ...prev, logo: logoUrl }))
        toast.success('Logo uploaded successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onUpdate(editedSettings)
    setIsEditing(false)
    toast.success('Company profile updated!')
  }

  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Building className="w-6 h-6 text-cyber-primary" />
          <h3 className="font-cyber font-bold text-cyber-primary">COMPANY PROFILE</h3>
        </div>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="cyber-button flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>EDIT</span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-lg border-2 border-cyber-primary/30 flex items-center justify-center overflow-hidden">
              {editedSettings.logo ? (
                <img src={editedSettings.logo} alt="Company Logo" className="w-full h-full object-cover" />
              ) : (
                <Building className="w-16 h-16 text-cyber-primary/50" />
              )}
            </div>
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="cyber-button inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>UPLOAD LOGO</span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-cyber-primary/70 text-sm mb-2">Company Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedSettings.name}
                  onChange={(e) => setEditedSettings(prev => ({ ...prev, name: e.target.value }))}
                  className="cyber-input w-full"
                />
              ) : (
                <p className="text-cyber-primary font-cyber font-bold">{settings.name}</p>
              )}
            </div>

            <div>
              <label className="block text-cyber-primary/70 text-sm mb-2">Industry</label>
              {isEditing ? (
                <select
                  value={editedSettings.industry}
                  onChange={(e) => setEditedSettings(prev => ({ ...prev, industry: e.target.value }))}
                  className="cyber-input w-full"
                >
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                </select>
              ) : (
                <p className="text-cyber-primary capitalize">{settings.industry}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex space-x-4 pt-4">
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
          )}
        </div>
      </div>
    </div>
  )
}