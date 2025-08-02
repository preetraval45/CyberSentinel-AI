'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sword, Shield, Users, Play, Plus } from 'lucide-react'
import CompetitionArena from './CompetitionArena'
import toast from 'react-hot-toast'

interface Competition {
  id: string
  name: string
  status: string
  total_rounds: number
  round_duration: number
}

export default function RedBlueCompetition() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [activeCompetition, setActiveCompetition] = useState<string | null>(null)
  const [userTeam, setUserTeam] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCompetitionName, setNewCompetitionName] = useState('')

  useEffect(() => {
    // In a real app, load available competitions
  }, [])

  const createCompetition = async () => {
    if (!newCompetitionName.trim()) {
      toast.error('Please enter a competition name')
      return
    }

    try {
      const response = await fetch('/api/red-blue/competition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCompetitionName,
          rounds: 3,
          duration: 300
        })
      })

      const competition = await response.json()
      setCompetitions(prev => [...prev, competition])
      setNewCompetitionName('')
      setShowCreateForm(false)
      toast.success('Competition created!')
    } catch (error) {
      toast.error('Failed to create competition')
    }
  }

  const joinTeam = async (competitionId: string, team: string) => {
    try {
      await fetch(`/api/red-blue/competition/${competitionId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team })
      })

      setUserTeam(team)
      setActiveCompetition(competitionId)
      toast.success(`Joined ${team} team!`)
    } catch (error) {
      toast.error('Failed to join team')
    }
  }

  const startCompetition = async (competitionId: string) => {
    try {
      await fetch(`/api/red-blue/competition/${competitionId}/start`, {
        method: 'POST'
      })
      toast.success('Competition started!')
    } catch (error) {
      toast.error('Failed to start competition')
    }
  }

  if (activeCompetition && userTeam) {
    return (
      <CompetitionArena
        competitionId={activeCompetition}
        userTeam={userTeam}
      />
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-cyber font-black neon-text mb-4">
            RED vs BLUE TEAM
          </h1>
          <p className="text-cyber-primary/70 font-mono">
            Competitive cybersecurity simulation with timed rounds
          </p>
        </motion.div>

        {/* Create Competition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="cyber-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-cyber font-bold text-cyber-primary">
              COMPETITIONS
            </h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="cyber-button-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>CREATE</span>
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-6 p-4 border border-cyber-primary/30 rounded">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newCompetitionName}
                  onChange={(e) => setNewCompetitionName(e.target.value)}
                  placeholder="Competition name..."
                  className="flex-1 bg-transparent border border-cyber-primary/30 text-cyber-primary px-3 py-2 rounded"
                />
                <button
                  onClick={createCompetition}
                  className="cyber-button-primary px-6"
                >
                  CREATE
                </button>
              </div>
            </div>
          )}

          {/* Demo Competition */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="cyber-card p-4 border-cyber-primary/50">
              <h3 className="font-cyber font-bold text-cyber-primary mb-2">
                Cyber Defense Challenge
              </h3>
              <div className="text-sm text-cyber-primary/70 mb-4">
                3 rounds • 5 minutes each
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => joinTeam('demo', 'red')}
                  className="flex-1 bg-red-600/20 border border-red-500 text-red-400 px-3 py-2 rounded text-sm hover:bg-red-600/30"
                >
                  <Sword className="w-4 h-4 inline mr-1" />
                  Red Team
                </button>
                <button
                  onClick={() => joinTeam('demo', 'blue')}
                  className="flex-1 bg-blue-600/20 border border-blue-500 text-blue-400 px-3 py-2 rounded text-sm hover:bg-blue-600/30"
                >
                  <Shield className="w-4 h-4 inline mr-1" />
                  Blue Team
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="cyber-card p-6"
        >
          <h2 className="text-xl font-cyber font-bold text-cyber-primary mb-6">
            HOW IT WORKS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Sword className="w-8 h-8 text-red-400 mr-3" />
                <h3 className="text-lg font-cyber font-bold text-red-400">RED TEAM (ATTACKERS)</h3>
              </div>
              <ul className="space-y-2 text-cyber-primary/80">
                <li>• Launch phishing attacks (15 pts)</li>
                <li>• Deploy malware (20 pts)</li>
                <li>• Escalate privileges (25 pts)</li>
                <li>• Exfiltrate data (30 pts)</li>
                <li>• Move laterally (20 pts)</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-lg font-cyber font-bold text-blue-400">BLUE TEAM (DEFENDERS)</h3>
              </div>
              <ul className="space-y-2 text-cyber-primary/80">
                <li>• Detect threats (15 pts)</li>
                <li>• Respond to incidents (20 pts)</li>
                <li>• Analyze malware (25 pts)</li>
                <li>• Monitor networks (15 pts)</li>
                <li>• Perform forensics (30 pts)</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-4 border border-cyber-primary/30 rounded">
            <h4 className="font-cyber font-bold text-cyber-primary mb-2">RULES</h4>
            <ul className="text-sm text-cyber-primary/70 space-y-1">
              <li>• Each round lasts 5 minutes</li>
              <li>• Submit actions with detailed descriptions</li>
              <li>• Points awarded based on action complexity and success</li>
              <li>• Team with highest score after all rounds wins</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}