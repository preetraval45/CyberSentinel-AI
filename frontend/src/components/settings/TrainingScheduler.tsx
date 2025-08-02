'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Plus, Clock, Users, Play, Pause } from 'lucide-react'
import { TrainingSchedule } from '../../types/settings'
import toast from 'react-hot-toast'

interface TrainingSchedulerProps {
  schedules: TrainingSchedule[]
  onUpdate: (schedules: TrainingSchedule[]) => void
}

export default function TrainingScheduler({ schedules, onUpdate }: TrainingSchedulerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newSchedule, setNewSchedule] = useState<Partial<TrainingSchedule>>({
    name: '',
    type: 'mandatory',
    frequency: 'monthly',
    targetRoles: [],
    modules: [],
    reminderDays: [7, 3, 1],
    isActive: true
  })

  const createSchedule = () => {
    const schedule: TrainingSchedule = {
      id: `schedule_${Date.now()}`,
      name: newSchedule.name || 'New Schedule',
      type: newSchedule.type || 'mandatory',
      frequency: newSchedule.frequency || 'monthly',
      startDate: new Date(),
      targetRoles: newSchedule.targetRoles || [],
      modules: newSchedule.modules || [],
      reminderDays: newSchedule.reminderDays || [7, 3, 1],
      isActive: true
    }
    
    onUpdate([...schedules, schedule])
    setShowCreateForm(false)
    setNewSchedule({})
    toast.success('Training schedule created!')
  }

  const toggleSchedule = (scheduleId: string) => {
    const updatedSchedules = schedules.map(s => 
      s.id === scheduleId ? { ...s, isActive: !s.isActive } : s
    )
    onUpdate(updatedSchedules)
    toast.success('Schedule updated!')
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mandatory': return 'text-cyber-red'
      case 'optional': return 'text-cyber-accent'
      case 'recurring': return 'text-cyber-green'
      default: return 'text-cyber-primary'
    }
  }

  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-cyber-primary" />
          <h3 className="font-cyber font-bold text-cyber-primary">TRAINING SCHEDULER</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateForm(true)}
          className="cyber-button flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE SCHEDULE</span>
        </motion.button>
      </div>

      <div className="space-y-4">
        {schedules.map((schedule) => (
          <motion.div
            key={schedule.id}
            whileHover={{ scale: 1.01 }}
            className={`p-4 rounded-lg border transition-all ${
              schedule.isActive 
                ? 'border-cyber-green/30 bg-cyber-green/5' 
                : 'border-cyber-primary/30 bg-cyber-primary/5'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <Clock className="w-5 h-5 text-cyber-primary" />
                <div>
                  <h4 className="font-cyber font-bold text-cyber-primary">{schedule.name}</h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`font-cyber font-bold uppercase ${getTypeColor(schedule.type)}`}>
                      {schedule.type}
                    </span>
                    <span className="text-cyber-primary/70">
                      Every {schedule.frequency}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-cyber-primary/70" />
                  <span className="text-cyber-primary/70 text-sm">
                    {schedule.targetRoles.length} roles
                  </span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSchedule(schedule.id)}
                  className={`p-2 rounded transition-colors ${
                    schedule.isActive
                      ? 'bg-cyber-green/20 text-cyber-green hover:bg-cyber-green hover:text-cyber-dark'
                      : 'bg-cyber-red/20 text-cyber-red hover:bg-cyber-red hover:text-cyber-dark'
                  }`}
                >
                  {schedule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-cyber-primary/70">Start Date</p>
                <p className="text-cyber-primary font-mono">
                  {schedule.startDate.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-cyber-primary/70">Modules</p>
                <p className="text-cyber-primary">
                  {schedule.modules.length || 'All modules'}
                </p>
              </div>
              <div>
                <p className="text-cyber-primary/70">Reminders</p>
                <p className="text-cyber-primary">
                  {schedule.reminderDays.join(', ')} days before
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 glass-dark rounded-lg border border-cyber-primary/30"
        >
          <h4 className="font-cyber font-bold text-cyber-primary mb-4">CREATE TRAINING SCHEDULE</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-cyber-primary/70 text-sm mb-2">Schedule Name</label>
              <input
                type="text"
                value={newSchedule.name || ''}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                className="cyber-input w-full"
                placeholder="Monthly Security Training"
              />
            </div>
            
            <div>
              <label className="block text-cyber-primary/70 text-sm mb-2">Type</label>
              <select
                value={newSchedule.type || 'mandatory'}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, type: e.target.value as any }))}
                className="cyber-input w-full"
              >
                <option value="mandatory">Mandatory</option>
                <option value="optional">Optional</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
            
            <div>
              <label className="block text-cyber-primary/70 text-sm mb-2">Frequency</label>
              <select
                value={newSchedule.frequency || 'monthly'}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, frequency: e.target.value as any }))}
                className="cyber-input w-full"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={createSchedule}
              className="cyber-button"
            >
              CREATE
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(false)}
              className="cyber-button border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-cyber-dark"
            >
              CANCEL
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}