'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sword, Shield, Clock, Target, Zap, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface CompetitionState {
  competition: {
    id: string
    name: string
    status: string
    current_round: number
    total_rounds: number
    red_team_score: number
    blue_team_score: number
    time_remaining: number
  }
  red_team: Array<{ user_id: string; score: number }>
  blue_team: Array<{ user_id: string; score: number }>
  current_actions: Array<{
    user_id: string
    action_type: string
    target: string
    description: string
    points_awarded: number
    is_successful: boolean
    timestamp: string
  }>
}

interface CompetitionArenaProps {
  competitionId: string
  userTeam: string
}

export default function CompetitionArena({ competitionId, userTeam }: CompetitionArenaProps) {
  const [state, setState] = useState<CompetitionState | null>(null)
  const [availableActions, setAvailableActions] = useState<any[]>([])
  const [selectedAction, setSelectedAction] = useState('')
  const [target, setTarget] = useState('')
  const [description, setDescription] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    loadCompetitionState()
    loadAvailableActions()
    const interval = setInterval(loadCompetitionState, 2000)
    return () => clearInterval(interval)
  }, [competitionId])

  useEffect(() => {
    if (state) {
      setTimeRemaining(state.competition.time_remaining)
      const timer = setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [state?.competition.time_remaining])

  const loadCompetitionState = async () => {
    try {
      const response = await fetch(`/api/red-blue/competition/${competitionId}/state`)
      const data = await response.json()
      setState(data)
    } catch (error) {
      console.error('Failed to load competition state')
    }
  }

  const loadAvailableActions = async () => {
    try {
      const response = await fetch(`/api/red-blue/actions/${userTeam}`)
      const data = await response.json()
      setAvailableActions(data)
    } catch (error) {
      console.error('Failed to load actions')
    }
  }

  const submitAction = async () => {
    if (!selectedAction || !description) {
      toast.error('Please select an action and provide description')
      return
    }

    try {
      const response = await fetch(`/api/red-blue/competition/${competitionId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: selectedAction,
          target,
          description
        })
      })

      const result = await response.json()
      
      if (result.is_successful) {
        toast.success(`✅ Action successful! +${result.points_awarded} points`)
      } else {
        toast.error('❌ Action failed!')
      }

      setSelectedAction('')
      setTarget('')
      setDescription('')
      loadCompetitionState()
    } catch (error) {
      toast.error('Failed to submit action')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!state) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{state.competition.name}</h1>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <Clock className="w-6 h-6 mx-auto mb-1" />
              <div className="text-2xl font-mono">{formatTime(timeRemaining)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Round</div>
              <div className="text-xl font-bold">
                {state.competition.current_round}/{state.competition.total_rounds}
              </div>
            </div>
          </div>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-center">
            <Sword className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-400">{state.competition.red_team_score}</div>
            <div className="text-sm text-gray-300">Red Team</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 text-center">
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{state.competition.blue_team_score}</div>
            <div className="text-sm text-gray-300">Blue Team</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Action Panel */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            {userTeam === 'red' ? <Sword className="w-5 h-5 mr-2 text-red-400" /> : <Shield className="w-5 h-5 mr-2 text-blue-400" />}
            {userTeam === 'red' ? 'Attack Actions' : 'Defense Actions'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Action Type</label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="">Select action...</option>
                {availableActions.map((action) => (
                  <option key={action.id} value={action.id}>
                    {action.name} ({action.points} pts)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target (optional)</label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g., web server, database, user account"
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your action in detail..."
                rows={3}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              />
            </div>

            <button
              onClick={submitAction}
              disabled={state.competition.status !== 'active'}
              className={`w-full py-3 rounded font-bold ${
                userTeam === 'red'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Execute Action
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Live Activity Feed
          </h2>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {state.current_actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded border-l-4 ${
                  action.is_successful
                    ? 'border-green-500 bg-green-900/20'
                    : 'border-red-500 bg-red-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">
                    {action.action_type.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {action.is_successful ? (
                      <span className="text-green-400 text-sm">+{action.points_awarded} pts</span>
                    ) : (
                      <span className="text-red-400 text-sm">Failed</span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{action.description}</p>
                {action.target && (
                  <p className="text-xs text-gray-400 mt-1">Target: {action.target}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Competition Status */}
      {state.competition.status === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <div className="bg-gray-800 rounded-lg p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Competition Complete!</h2>
            <div className="text-4xl font-bold mb-4">
              {state.competition.red_team_score > state.competition.blue_team_score ? (
                <span className="text-red-400">🔴 Red Team Wins!</span>
              ) : state.competition.blue_team_score > state.competition.red_team_score ? (
                <span className="text-blue-400">🔵 Blue Team Wins!</span>
              ) : (
                <span className="text-yellow-400">🤝 It's a Tie!</span>
              )}
            </div>
            <div className="text-lg">
              Final Score: {state.competition.red_team_score} - {state.competition.blue_team_score}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}