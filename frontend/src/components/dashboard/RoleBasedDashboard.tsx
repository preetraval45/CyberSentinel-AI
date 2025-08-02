'use client'

import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Users, BookOpen, FileCheck, BarChart3, AlertTriangle, Crown, GraduationCap, BarChart, User } from 'lucide-react'
import { cn } from '../../lib/utils'
import CyberMap from '../cybermap/CyberMap'
import { UserRole, getRoleConfig, hasPermission } from '../../types/roles'

interface DashboardProps {
  userRole: UserRole
  tenantId: string
  companyName?: string
}

const roleIcons = {
  superadmin: Crown,
  admin: Shield,
  securitytrainer: GraduationCap,
  analyst: BarChart,
  employee: User
}

export default function RoleBasedDashboard({ userRole, tenantId, companyName }: DashboardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const config = getRoleConfig(userRole)
  const IconComponent = roleIcons[userRole]

  const renderTabContent = (tabName: string) => {
    const roleSpecificContent = {
      // SuperAdmin Content
      Companies: (
        <div className="space-y-6">
          <div className="cyber-card">
            <h3 className="font-cyber font-bold text-cyber-primary mb-4">TENANT COMPANIES</h3>
            <div className="space-y-3">
              {['TechCorp Inc', 'SecureBank Ltd', 'MedHealth Systems'].map((company, i) => (
                <div key={i} className="flex justify-between items-center p-3 glass-dark rounded border border-cyber-primary/20">
                  <span className="text-cyber-primary">{company}</span>
                  <span className="text-cyber-green font-cyber font-bold">{150 + i * 50} Users</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      
      // Admin Content
      Users: (
        <div className="space-y-6">
          <div className="cyber-card">
            <h3 className="font-cyber font-bold text-cyber-primary mb-4">COMPANY USERS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { role: 'Admin', count: 3, color: 'text-cyber-accent' },
                { role: 'Trainer', count: 8, color: 'text-cyber-secondary' },
                { role: 'Analyst', count: 12, color: 'text-cyber-blue' },
                { role: 'Employee', count: 127, color: 'text-cyber-green' }
              ].map((item) => (
                <div key={item.role} className="cyber-card text-center">
                  <p className={`text-2xl font-cyber font-black ${item.color} mb-2`}>{item.count}</p>
                  <p className="text-cyber-primary/70 text-sm">{item.role}s</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      
      // Security Trainer Content
      Modules: (
        <div className="space-y-6">
          <div className="cyber-card">
            <h3 className="font-cyber font-bold text-cyber-primary mb-4">TRAINING MODULES</h3>
            <div className="space-y-3">
              {['Phishing Simulation', 'Social Engineering Defense', 'Incident Response'].map((module, i) => (
                <div key={i} className="flex justify-between items-center p-3 glass-dark rounded border border-cyber-primary/20">
                  <span className="text-cyber-primary">{module}</span>
                  <span className="text-cyber-secondary font-cyber font-bold">PUBLISHED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
      
      // Employee Content
      Training: (
        <div className="space-y-6">
          <div className="cyber-card">
            <h3 className="font-cyber font-bold text-cyber-primary mb-4">MY TRAINING</h3>
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
      ),
      
      // Common Overview
      Overview: (
        <div className="space-y-8">
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
          {config.canAccessCyberMap && <CyberMap />}
        </div>
      )
    }

    return roleSpecificContent[tabName as keyof typeof roleSpecificContent] || (
      <div className="cyber-card text-center">
        <h3 className="font-cyber font-bold text-cyber-primary mb-2">{tabName.toUpperCase()}</h3>
        <p className="text-cyber-primary/70">Content for {tabName} tab</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <IconComponent className={`w-8 h-8 ${config.color}`} />
          <div>
            <h1 className="text-3xl font-cyber font-black neon-text">
              {config.displayName.toUpperCase()} DASHBOARD
            </h1>
            <p className="text-cyber-primary/70 text-sm">{config.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-cyber-primary/50 font-mono text-sm">
            TENANT: {tenantId}
          </div>
          {companyName && (
            <div className="text-cyber-primary/70 font-mono text-xs">
              {companyName}
            </div>
          )}
        </div>
      </div>

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-lg glass-dark p-1 mb-8">
          {config.dashboardTabs.map((tab, index) => (
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
            {config.dashboardTabs.map((tab, index) => (
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