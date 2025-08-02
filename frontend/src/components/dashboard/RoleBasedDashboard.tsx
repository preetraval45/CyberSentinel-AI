'use client'

import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Users, BookOpen, FileCheck, BarChart3, AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'

interface DashboardProps {
  userRole: 'admin' | 'user' | 'trainer' | 'compliance'
  tenantId: string
}

const roleConfigs = {
  admin: {
    tabs: ['Overview', 'Users', 'Analytics', 'Settings'],
    color: 'text-cyber-red',
    icon: Shield
  },
  user: {
    tabs: ['Training', 'Progress', 'Certificates'],
    color: 'text-cyber-primary',
    icon: Users
  },
  trainer: {
    tabs: ['Courses', 'Students', 'Reports'],
    color: 'text-cyber-secondary',
    icon: BookOpen
  },
  compliance: {
    tabs: ['Audits', 'Reports', 'Violations'],
    color: 'text-cyber-accent',
    icon: FileCheck
  }
}

export default function RoleBasedDashboard({ userRole, tenantId }: DashboardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const config = roleConfigs[userRole]
  const IconComponent = config.icon

  const renderTabContent = (tabName: string) => {
    const baseContent = {
      Overview: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cyber-card">
            <BarChart3 className="w-8 h-8 text-cyber-primary mb-4" />
            <h3 className="font-cyber font-bold text-cyber-primary mb-2">SYSTEM STATUS</h3>
            <p className="text-2xl font-cyber font-black text-cyber-green">OPERATIONAL</p>
          </div>
          <div className="cyber-card">
            <AlertTriangle className="w-8 h-8 text-cyber-accent mb-4" />
            <h3 className="font-cyber font-bold text-cyber-primary mb-2">ACTIVE THREATS</h3>
            <p className="text-2xl font-cyber font-black text-cyber-accent">7</p>
          </div>
          <div className="cyber-card">
            <Users className="w-8 h-8 text-cyber-secondary mb-4" />
            <h3 className="font-cyber font-bold text-cyber-primary mb-2">ACTIVE USERS</h3>
            <p className="text-2xl font-cyber font-black text-cyber-secondary">142</p>
          </div>
        </div>
      ),
      Training: (
        <div className="space-y-6">
          <div className="cyber-card">
            <h3 className="font-cyber font-bold text-cyber-primary mb-4">CURRENT MODULES</h3>
            <div className="space-y-3">
              {['Phishing Detection', 'Social Engineering', 'Password Security'].map((module, i) => (
                <div key={i} className="flex justify-between items-center p-3 glass-dark rounded border border-cyber-primary/20">
                  <span className="text-cyber-primary">{module}</span>
                  <span className="text-cyber-green font-cyber font-bold">{85 + i * 5}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return baseContent[tabName as keyof typeof baseContent] || (
      <div className="cyber-card text-center">
        <h3 className="font-cyber font-bold text-cyber-primary mb-2">{tabName.toUpperCase()}</h3>
        <p className="text-cyber-primary/70">Content for {tabName} tab</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center space-x-4 mb-8">
        <IconComponent className={`w-8 h-8 ${config.color}`} />
        <h1 className="text-3xl font-cyber font-black neon-text">
          {userRole.toUpperCase()} DASHBOARD
        </h1>
        <div className="text-cyber-primary/50 font-mono text-sm">
          TENANT: {tenantId}
        </div>
      </div>

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-lg glass-dark p-1 mb-8">
          {config.tabs.map((tab, index) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                cn(
                  'w-full rounded-lg py-3 px-4 text-sm font-cyber font-bold uppercase tracking-wider transition-all duration-300',
                  selected
                    ? `${config.color} bg-current/10 border border-current/30`
                    : 'text-cyber-primary/50 hover:text-cyber-primary/80'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          <AnimatePresence mode="wait">
            {config.tabs.map((tab, index) => (
              <Tab.Panel key={tab}>
                {selectedIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderTabContent(tab)}
                  </motion.div>
                )}
              </Tab.Panel>
            ))}
          </AnimatePresence>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}