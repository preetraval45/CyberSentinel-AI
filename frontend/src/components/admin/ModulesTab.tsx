'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, ToggleLeft, ToggleRight } from 'lucide-react'
import { staggerContainer, slideUp } from '@/lib/animations'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Module {
  id: string
  name: string
  description: string
  active: boolean
  completion_rate: number
}

export default function ModulesTab() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/admin/modules', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setModules(data)
      }
    } catch (error) {
      console.error('Failed to fetch modules:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleModule = async (moduleId: string, active: boolean) => {
    // Mock toggle - replace with actual API call
    setModules(prev => 
      prev.map(module => 
        module.id === moduleId ? { ...module, active } : module
      )
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.div 
        className="flex justify-between items-center mb-6"
        variants={slideUp}
      >
        <h2 className="text-2xl font-semibold text-gray-100">Training Modules</h2>
        <motion.button
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span>Add Module</span>
        </motion.button>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
      >
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            className="glass-card p-6"
            variants={slideUp}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-100">{module.name}</h3>
              <motion.button
                onClick={() => toggleModule(module.id, !module.active)}
                className={`p-1 rounded ${module.active ? 'text-green-400' : 'text-gray-500'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {module.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </motion.button>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">{module.description}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Completion Rate</span>
                <span className="text-gray-300">{module.completion_rate}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${module.completion_rate}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                module.active 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {module.active ? 'Active' : 'Inactive'}
              </span>
              
              <motion.button
                className="text-blue-400 hover:text-blue-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Edit className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}