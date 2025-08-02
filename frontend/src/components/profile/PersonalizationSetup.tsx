'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Building, MapPin, Globe, MessageSquare, Save } from 'lucide-react'
import toast from 'react-hot-toast'

interface UserProfile {
  job_role: string
  department: string
  company_size: string
  industry: string
  location: string
  language_preference: string
  communication_style: string
}

export default function PersonalizationSetup() {
  const [profile, setProfile] = useState<UserProfile>({
    job_role: '',
    department: '',
    company_size: '',
    industry: '',
    location: '',
    language_preference: 'en',
    communication_style: 'professional'
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error('Failed to load profile')
    }
  }

  const saveProfile = async () => {
    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      toast.success('Profile updated! Phishing scenarios will now be personalized.')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-cyber font-black neon-text mb-4">
            PERSONALIZATION SETUP
          </h1>
          <p className="text-cyber-primary/70 font-mono">
            Configure your profile for tailored phishing scenarios
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cyber-card p-8"
        >
          <div className="space-y-6">
            {/* Job Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-cyber-primary font-cyber font-bold mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Job Role
                </label>
                <input
                  type="text"
                  value={profile.job_role}
                  onChange={(e) => handleChange('job_role', e.target.value)}
                  placeholder="e.g., Software Engineer, Manager"
                  className="w-full bg-transparent border border-cyber-primary/30 text-cyber-primary px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-cyber-primary font-cyber font-bold mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="e.g., IT, Finance, HR"
                  className="w-full bg-transparent border border-cyber-primary/30 text-cyber-primary px-3 py-2 rounded"
                />
              </div>
            </div>

            {/* Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-cyber-primary font-cyber font-bold mb-2">
                  <Building className="w-4 h-4 inline mr-2" />
                  Company Size
                </label>
                <select
                  value={profile.company_size}
                  onChange={(e) => handleChange('company_size', e.target.value)}
                  className="w-full bg-transparent border border-cyber-primary/30 text-cyber-primary px-3 py-2 rounded"
                >
                  <option value="">Select size...</option>
                  <option value="startup">Startup (1-50)</option>
                  <option value="small">Small (51-200)</option>
                  <option value="medium">Medium (201-1000)</option>
                  <option value="large">Large (1000+)</option>
                </select>
              </div>

              <div>
                <label className="block text-cyber-primary font-cyber font-bold mb-2">
                  Industry
                </label>
                <select
                  value={profile.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  className="w-full bg-transparent border border-cyber-primary/30 text-cyber-primary px-3 py-2 rounded"
                >
                  <option value="">Select industry...</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="government">Government</option>
                </select>
              </div>
            </div>

            {/* Location and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-cyber-primary font-cyber font-bold mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., New York, London, Tokyo"
                  className="w-full bg-transparent border border-cyber-primary/30 text-cyber-primary px-3 py-2 rounded"
                />
              </div>

              <div>
                <label className="block text-cyber-primary font-cyber font-bold mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Language
                </label>
                <select
                  value={profile.language_preference}
                  onChange={(e) => handleChange('language_preference', e.target.value)}
                  className="w-full bg-transparent border border-cyber-primary/30 text-cyber-primary px-3 py-2 rounded"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>

            {/* Communication Style */}
            <div>
              <label className="block text-cyber-primary font-cyber font-bold mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Communication Style
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['formal', 'professional', 'casual'].map((style) => (
                  <button
                    key={style}
                    onClick={() => handleChange('communication_style', style)}
                    className={`p-3 rounded border transition-all ${
                      profile.communication_style === style
                        ? 'border-cyber-primary bg-cyber-primary/20 text-cyber-primary'
                        : 'border-cyber-primary/30 text-cyber-primary/70 hover:border-cyber-primary/50'
                    }`}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={saveProfile}
              className="w-full cyber-button-primary py-3 flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>SAVE PROFILE</span>
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 border border-cyber-primary/30 rounded bg-cyber-primary/5">
            <h3 className="font-cyber font-bold text-cyber-primary mb-2">
              How Personalization Works
            </h3>
            <ul className="text-sm text-cyber-primary/70 space-y-1">
              <li>• Phishing emails tailored to your job role and industry</li>
              <li>• Location-specific companies and services referenced</li>
              <li>• Communication style matches your preferences</li>
              <li>• AI learns from your responses to improve targeting</li>
              <li>• Difficulty adapts based on your vulnerability patterns</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}