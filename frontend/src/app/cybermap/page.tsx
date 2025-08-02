'use client'

import { motion } from 'framer-motion'
import CyberMap from '../../components/cybermap/CyberMap'
import { Globe, Activity } from 'lucide-react'

export default function CyberMapPage() {
  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Globe className="w-8 h-8 text-cyber-primary" />
            <h1 className="text-4xl md:text-6xl font-cyber font-black neon-text">
              GLOBAL CYBER MAP
            </h1>
          </div>
          <p className="text-cyber-primary/70 font-mono">
            Real-time visualization of global cyber threats and attack patterns
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <CyberMap />
          </div>
          
          <div className="space-y-6">
            <div className="cyber-card">
              <h3 className="font-cyber font-bold text-cyber-primary mb-4">THREAT STATISTICS</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cyber-red rounded-full" />
                    <span className="text-cyber-primary/70 text-sm">Critical</span>
                  </div>
                  <span className="font-cyber font-bold text-cyber-red">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-cyber-accent rounded-full" />
                    <span className="text-cyber-primary/70 text-sm">High</span>
                  </div>
                  <span className="font-cyber font-bold text-cyber-accent">67</span>
                </div>
              </div>
            </div>

            <div className="cyber-card">
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="w-5 h-5 text-cyber-green animate-pulse" />
                <h3 className="font-cyber font-bold text-cyber-primary">SYSTEM STATUS</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-cyber-primary/70">Monitoring:</span>
                  <span className="text-cyber-green font-cyber font-bold">ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-primary/70">AI Analysis:</span>
                  <span className="text-cyber-green font-cyber font-bold">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}