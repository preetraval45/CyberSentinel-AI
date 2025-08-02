'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, Wifi, WifiOff, Shield, AlertTriangle, X, Minus, Square } from 'lucide-react'

interface FakeDesktopProps {
  isInfected: boolean
  onAction: (action: string) => void
  currentStep: any
  showRansomNote: boolean
}

export default function FakeDesktop({ isInfected, onAction, currentStep, showRansomNote }: FakeDesktopProps) {
  const [showTaskManager, setShowTaskManager] = useState(false)
  const [networkConnected, setNetworkConnected] = useState(true)
  const [processes] = useState([
    { name: 'explorer.exe', cpu: '2%', memory: '45MB', pid: '1234' },
    { name: 'chrome.exe', cpu: '15%', memory: '120MB', pid: '5678' },
    { name: 'CryptoLocker.exe', cpu: '85%', memory: '200MB', pid: '9999', malicious: true },
    { name: 'svchost.exe', cpu: '1%', memory: '25MB', pid: '2468' }
  ])

  const handleNetworkToggle = () => {
    setNetworkConnected(!networkConnected)
    onAction('disconnect_network')
  }

  const handleTaskManager = () => {
    setShowTaskManager(true)
    onAction('open_task_manager')
  }

  const handleEndProcess = (pid: string) => {
    if (pid === '9999') {
      onAction('end_process')
      setShowTaskManager(false)
    }
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden">
      {/* Desktop Background */}
      <div className="absolute inset-0 bg-[url('/desktop-bg.jpg')] bg-cover bg-center opacity-20" />
      
      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-800 border-t border-gray-600 flex items-center px-4">
        <button className="flex items-center space-x-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">
          <Monitor className="w-4 h-4 text-white" />
          <span className="text-white text-sm">Start</span>
        </button>
        
        <div className="flex-1" />
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleNetworkToggle}
            className={`p-1 rounded ${networkConnected ? 'text-green-400' : 'text-red-400'}`}
          >
            {networkConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          </button>
          <span className="text-white text-sm">3:45 PM</span>
        </div>
      </div>

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 space-y-4">
        <button 
          onClick={handleTaskManager}
          className="flex flex-col items-center space-y-1 p-2 rounded hover:bg-white/10"
        >
          <Monitor className="w-8 h-8 text-white" />
          <span className="text-white text-xs">Task Manager</span>
        </button>
        
        <button 
          onClick={() => onAction('run_antivirus')}
          className="flex flex-col items-center space-y-1 p-2 rounded hover:bg-white/10"
        >
          <Shield className="w-8 h-8 text-white" />
          <span className="text-white text-xs">Antivirus</span>
        </button>
      </div>

      {/* Ransomware Note */}
      <AnimatePresence>
        {showRansomNote && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 bg-red-900/95 flex items-center justify-center z-50"
          >
            <div className="bg-black border-4 border-red-500 p-8 max-w-2xl mx-4 rounded-lg">
              <div className="text-center mb-6">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-red-500 mb-2">YOUR FILES ARE ENCRYPTED!</h1>
                <p className="text-white">All your important files have been encrypted with military-grade encryption.</p>
              </div>
              
              <div className="text-white space-y-4">
                <p>🔒 Your documents, photos, videos, databases and other files are no longer accessible.</p>
                <p>💰 To decrypt your files, you need to pay 0.5 Bitcoin ($25,000) within 72 hours.</p>
                <p>⏰ After 72 hours, the decryption key will be permanently deleted.</p>
                <p>📧 Contact: decrypt@ransomware.evil</p>
              </div>
              
              <div className="mt-6 text-center">
                <button 
                  onClick={() => onAction('take_screenshot')}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded mr-4"
                >
                  Take Screenshot
                </button>
                <button 
                  onClick={() => onAction('close_ransom_note')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Manager */}
      <AnimatePresence>
        {showTaskManager && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute top-20 left-20 bg-gray-800 border border-gray-600 rounded-lg w-96 z-40"
          >
            <div className="bg-gray-700 px-4 py-2 rounded-t-lg flex items-center justify-between">
              <span className="text-white font-semibold">Task Manager</span>
              <button 
                onClick={() => setShowTaskManager(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="text-white text-sm mb-2 grid grid-cols-4 gap-2 font-semibold">
                <span>Process</span>
                <span>CPU</span>
                <span>Memory</span>
                <span>PID</span>
              </div>
              
              {processes.map((process) => (
                <div 
                  key={process.pid}
                  className={`grid grid-cols-4 gap-2 py-1 text-sm rounded hover:bg-gray-700 cursor-pointer ${
                    process.malicious ? 'text-red-400 bg-red-900/20' : 'text-white'
                  }`}
                  onClick={() => handleEndProcess(process.pid)}
                >
                  <span>{process.name}</span>
                  <span>{process.cpu}</span>
                  <span>{process.memory}</span>
                  <span>{process.pid}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Step Indicator */}
      {currentStep && (
        <div className="absolute top-4 right-4 bg-black/80 border border-cyan-500 rounded-lg p-4 max-w-sm">
          <h3 className="text-cyan-400 font-bold mb-2">STEP {currentStep.id}: {currentStep.title}</h3>
          <p className="text-white text-sm">{currentStep.description}</p>
        </div>
      )}

      {/* Infection Effects */}
      {isInfected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
          <div className="absolute bottom-12 left-0 right-0 text-center">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-red-500 font-bold text-lg"
            >
              ⚠️ SYSTEM COMPROMISED ⚠️
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}