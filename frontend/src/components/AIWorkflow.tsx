'use client'

import { useState, useEffect } from 'react'

interface NextStep {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface WorkflowState {
  session_id: string
  context: string
  active_tasks: number
  completed_tasks: number
  next_steps: NextStep[]
  last_updated: string
}

export default function AIWorkflow() {
  const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedContext, setSelectedContext] = useState('security_analysis')

  useEffect(() => {
    resumeSession()
  }, [])

  const resumeSession = async () => {
    try {
      const response = await fetch('/api/ai-workflow/session/resume', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.session_id) {
          fetchWorkflowState()
        }
      }
    } catch (error) {
      console.error('Failed to resume session:', error)
    }
  }

  const startSession = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai-workflow/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ context: selectedContext })
      })
      
      if (response.ok) {
        fetchWorkflowState()
      }
    } catch (error) {
      console.error('Failed to start session:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkflowState = async () => {
    try {
      const response = await fetch('/api/ai-workflow/session/state', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setWorkflowState(data)
      }
    } catch (error) {
      console.error('Failed to fetch workflow state:', error)
    }
  }

  const executeTask = async (taskId: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai-workflow/task/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ task_id: taskId })
      })
      
      if (response.ok) {
        const result = await response.json()
        alert(`Task completed: ${result.result}`)
        fetchWorkflowState()
      }
    } catch (error) {
      console.error('Failed to execute task:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Security Workflow</h2>

        {!workflowState ? (
          <div className="text-center">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Analysis Context
              </label>
              <select
                value={selectedContext}
                onChange={(e) => setSelectedContext(e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="security_analysis">Security Analysis</option>
                <option value="incident_response">Incident Response</option>
                <option value="training_analysis">Training Analysis</option>
              </select>
            </div>
            
            <button
              onClick={startSession}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start AI Workflow'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Session Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Context:</span>
                  <p className="text-gray-900 capitalize">{workflowState.context.replace('_', ' ')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Active Tasks:</span>
                  <p className="text-gray-900">{workflowState.active_tasks}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Completed:</span>
                  <p className="text-gray-900">{workflowState.completed_tasks}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Last Updated:</span>
                  <p className="text-gray-900">
                    {new Date(workflowState.last_updated).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recommended Next Steps
              </h3>
              
              {workflowState.next_steps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No pending tasks. All workflow steps completed!</p>
                  <button
                    onClick={() => setWorkflowState(null)}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Start New Workflow
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {workflowState.next_steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(step.priority)}`}
                        >
                          {step.priority.toUpperCase()}
                        </span>
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                      </div>
                      
                      <button
                        onClick={() => executeTask(step.id)}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading ? 'Executing...' : 'Execute'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4 border-t">
              <button
                onClick={fetchWorkflowState}
                className="text-blue-600 hover:text-blue-800"
              >
                Refresh Status
              </button>
              
              <button
                onClick={() => setWorkflowState(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                End Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}