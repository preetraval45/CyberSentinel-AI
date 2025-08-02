'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, Database, Shield } from 'lucide-react'
import { staggerContainer, slideUp } from '@/lib/animations'

export default function SettingsTab() {
  const [isExporting, setIsExporting] = useState(false)

  const exportData = async (type: string) => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/admin/export/${type}`, {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        // Simulate download
        console.log(`Exporting ${type}:`, data.download_url)
      }
    } catch (error) {
      console.error(`Failed to export ${type}:`, error)
    } finally {
      setIsExporting(false)
    }
  }

  const settings = [
    {
      title: 'System Configuration',
      description: 'Manage system-wide settings and preferences',
      icon: Shield,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      title: 'Database Management',
      description: 'Backup and restore database operations',
      icon: Database,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      title: 'Export Reports',
      description: 'Generate and download system reports',
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ]

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h2 
        className="text-2xl font-semibold text-gray-100 mb-6"
        variants={slideUp}
      >
        System Settings
      </motion.h2>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={staggerContainer}
      >
        {settings.map((setting, index) => {
          const Icon = setting.icon
          return (
            <motion.div
              key={setting.title}
              className="glass-card p-6 cursor-pointer"
              variants={slideUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`p-3 rounded-lg ${setting.bgColor} w-fit mb-4`}>
                <Icon className={`w-6 h-6 ${setting.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">{setting.title}</h3>
              <p className="text-gray-400 text-sm">{setting.description}</p>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div 
        className="glass-card p-6"
        variants={slideUp}
      >
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Export Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            onClick={() => exportData('users')}
            disabled={isExporting}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            <span>Export Users</span>
          </motion.button>
          
          <motion.button
            onClick={() => exportData('logs')}
            disabled={isExporting}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            <span>Export Logs</span>
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        className="glass-card p-6 mt-6"
        variants={slideUp}
      >
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Access Logs</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[
            { user: 'admin@example.com', action: 'LOGIN', time: '2 min ago', ip: '192.168.1.100' },
            { user: 'user@example.com', action: 'ROLE_UPDATE', time: '5 min ago', ip: '192.168.1.101' },
            { user: 'test@example.com', action: 'MODULE_COMPLETE', time: '10 min ago', ip: '192.168.1.102' }
          ].map((log, index) => (
            <motion.div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div>
                <span className="text-gray-100 font-medium">{log.user}</span>
                <span className="text-gray-400 ml-2">{log.action}</span>
              </div>
              <div className="text-right">
                <div className="text-gray-300">{log.time}</div>
                <div className="text-gray-500 text-xs">{log.ip}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}