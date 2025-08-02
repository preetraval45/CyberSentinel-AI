'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Users, Shield, Calendar, FileCheck } from 'lucide-react'
import { Tab } from '@headlessui/react'
import { cn } from '../../lib/utils'
import CompanyProfile from '../../components/settings/CompanyProfile'
import SSOIntegrations from '../../components/settings/SSOIntegrations'
import TrainingScheduler from '../../components/settings/TrainingScheduler'
import CompliancePolicies from '../../components/settings/CompliancePolicies'
import { CompanySettings, SSOProvider, TrainingSchedule, CompliancePolicy } from '../../types/settings'
import { Toaster } from 'react-hot-toast'

export default function SettingsPage() {
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    id: 'company-1',
    name: 'TechCorp Industries',
    logo: '',
    domain: 'techcorp.com',
    industry: 'technology',
    employeeCount: 1250,
    timezone: 'America/New_York',
    language: 'en',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date()
  })

  const [ssoProviders, setSSOProviders] = useState<SSOProvider[]>([
    {
      id: 'google',
      name: 'Google Workspace',
      type: 'oauth',
      enabled: true,
      config: { clientId: 'google-client-id' }
    }
  ])

  const [trainingSchedules, setTrainingSchedules] = useState<TrainingSchedule[]>([
    {
      id: 'schedule-1',
      name: 'Monthly Security Awareness',
      type: 'mandatory',
      frequency: 'monthly',
      startDate: new Date(),
      targetRoles: ['employee', 'analyst'],
      modules: ['phishing', 'password-security'],
      reminderDays: [7, 3, 1],
      isActive: true
    }
  ])

  const [compliancePolicies, setCompliancePolicies] = useState<CompliancePolicy[]>([
    {
      id: 'policy-1',
      name: 'GDPR',
      type: 'gdpr',
      description: 'General Data Protection Regulation compliance',
      requirements: [
        'Data encryption at rest and in transit',
        'Regular security assessments'
      ],
      enabled: true,
      lastReview: new Date('2024-01-01'),
      nextReview: new Date('2025-01-01'),
      assignedTo: ['admin@techcorp.com']
    }
  ])

  const tabs = [
    { name: 'Company Profile', icon: SettingsIcon },
    { name: 'SSO Integration', icon: Shield },
    { name: 'Training Schedule', icon: Calendar },
    { name: 'Compliance', icon: FileCheck }
  ]

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-4 mb-4">
            <SettingsIcon className="w-8 h-8 text-cyber-primary" />
            <h1 className="text-4xl md:text-6xl font-cyber font-black neon-text">
              COMPANY SETTINGS
            </h1>
          </div>
        </motion.div>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-lg glass-dark p-1 mb-8">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  cn(
                    'w-full rounded-lg py-3 px-4 text-sm font-cyber font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2',
                    selected
                      ? 'text-cyber-primary bg-cyber-primary/10 border border-cyber-primary/30'
                      : 'text-cyber-primary/50 hover:text-cyber-primary/80'
                  )
                }
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <CompanyProfile 
                settings={companySettings}
                onUpdate={setCompanySettings}
              />
            </Tab.Panel>

            <Tab.Panel>
              <SSOIntegrations 
                providers={ssoProviders}
                onUpdate={setSSOProviders}
              />
            </Tab.Panel>

            <Tab.Panel>
              <TrainingScheduler 
                schedules={trainingSchedules}
                onUpdate={setTrainingSchedules}
              />
            </Tab.Panel>

            <Tab.Panel>
              <CompliancePolicies 
                policies={compliancePolicies}
                onUpdate={setCompliancePolicies}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      
      <Toaster />
    </div>
  )
}