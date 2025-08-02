'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'
import ProgressSteps from '../../components/onboarding/ProgressSteps'
import AvatarSelection from '../../components/onboarding/AvatarSelection'
import CompanyAssignment from '../../components/onboarding/CompanyAssignment'
import Scene3D from '../../components/3d/Scene3D'
import PhishingHook from '../../components/3d/PhishingHook'
import FakeWebsite from '../../components/3d/FakeWebsite'
import ChatBubble from '../../components/3d/ChatBubble'
import AIBrain from '../../components/3d/AIBrain'
import CyberButton from '../../components/ui/CyberButton'

const steps = [
  { id: 1, name: 'Welcome', description: 'Introduction' },
  { id: 2, name: 'Avatar', description: 'Choose Role' },
  { id: 3, name: 'Company', description: 'Assignment' },
  { id: 4, name: 'Complete', description: 'Finish Setup' },
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAvatar, setSelectedAvatar] = useState('')
  const [selectedCompany, setSelectedCompany] = useState(null)

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedAvatar !== ''
      case 2: return selectedCompany !== null
      default: return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div>
              <h2 className="text-4xl font-cyber font-black neon-text mb-4">
                WELCOME TO CYBERSENTINEL
              </h2>
              <p className="text-xl text-cyber-primary/70 max-w-2xl mx-auto">
                Experience next-generation cybersecurity training with immersive 3D threat visualization
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Scene3D className="h-32">
                  <PhishingHook />
                </Scene3D>
                <p className="text-sm font-cyber text-cyber-red">Phishing Threats</p>
              </div>
              <div className="space-y-2">
                <Scene3D className="h-32">
                  <FakeWebsite />
                </Scene3D>
                <p className="text-sm font-cyber text-cyber-accent">Fake Websites</p>
              </div>
              <div className="space-y-2">
                <Scene3D className="h-32">
                  <ChatBubble />
                </Scene3D>
                <p className="text-sm font-cyber text-cyber-primary">Social Engineering</p>
              </div>
              <div className="space-y-2">
                <Scene3D className="h-32">
                  <AIBrain />
                </Scene3D>
                <p className="text-sm font-cyber text-cyber-secondary">AI Analysis</p>
              </div>
            </div>
          </motion.div>
        )
      
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <AvatarSelection selected={selectedAvatar} onChange={setSelectedAvatar} />
          </motion.div>
        )
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <CompanyAssignment selected={selectedCompany} onChange={setSelectedCompany} />
          </motion.div>
        )
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div>
              <h2 className="text-4xl font-cyber font-black neon-text mb-4">
                SETUP COMPLETE
              </h2>
              <p className="text-xl text-cyber-primary/70">
                Welcome to the future of cybersecurity training
              </p>
            </div>
            
            <div className="cyber-card max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-cyber-primary/70">Role:</span>
                  <span className="font-cyber font-bold text-cyber-primary">{selectedAvatar}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyber-primary/70">Company:</span>
                  <span className="font-cyber font-bold text-cyber-primary">
                    {selectedCompany?.name}
                  </span>
                </div>
              </div>
            </div>
            
            <CyberButton onClick={() => window.location.href = '/dashboard'}>
              ENTER CYBERSENTINEL
            </CyberButton>
          </motion.div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ProgressSteps steps={steps} currentStep={currentStep} />
        
        <div className="cyber-card min-h-[500px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex justify-between mt-8">
          <CyberButton
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="secondary"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            PREVIOUS
          </CyberButton>
          
          <CyberButton
            onClick={nextStep}
            disabled={currentStep === steps.length - 1 || !canProceed()}
          >
            {currentStep === steps.length - 1 ? 'COMPLETE' : 'NEXT'}
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </CyberButton>
        </div>
      </div>
    </div>
  )
}