'use client'

import { useState, useEffect } from 'react'

interface Analytics {
  user_performance: {
    total_users: number
    active_users: number
    completion_rate: number
    average_score: number
  }
  attack_success: {
    phishing_success_rate: number
    malicious_url_success_rate: number
    password_compromise_rate: number
  }
  risk_scoring: {
    high_risk: number
    medium_risk: number
    low_risk: number
    total_assessed: number
  }
  compliance: {
    gdpr: { passed: number; total: number; rate: number }
    hipaa: { passed: number; total: number; rate: number }
  }
}

interface Activity {
  type: string
  user_id: string
  description: string
  timestamp: string
  severity: string
}

interface User {
  id: string
  email: string
  role: string
  is_active: boolean
  is_admin: boolean
  created_at: string
  last_login: string
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAnalytics()
    fetchActivities()
    fetchUsers()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics/overview', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/analytics/activities', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      setActivities(data)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users/management', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const updateUserRole = async (userId: string, role: string) => {
    try {
      await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role })
      })
      fetchUsers()
    } catch (error) {
      console.error('Failed to update user role:', error)
    }
  }

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ is_active: !isActive })
      })
      fetchUsers()
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  const exportComplianceReport = async () => {
    try {
      const response = await fetch('/api/admin/reports/compliance', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `compliance_report_${new Date().toISOString().split('T')[0]}.json`
      a.click()
    } catch (error) {
      console.error('Failed to export report:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!analytics) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={exportComplianceReport}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Export Compliance Report
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'users', 'activities'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{analytics.user_performance.total_users}</p>
                <p className="text-sm text-gray-500">Active: {analytics.user_performance.active_users}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900">Training Completion</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">{analytics.user_performance.completion_rate}%</p>
                <p className="text-sm text-gray-500">Avg Score: {analytics.user_performance.average_score}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900">Phishing Success</h3>
                <p className="text-3xl font-bold text-red-600 mt-2">{analytics.attack_success.phishing_success_rate}%</p>
                <p className="text-sm text-gray-500">Users clicked malicious emails</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900">High Risk Users</h3>
                <p className="text-3xl font-bold text-orange-600 mt-2">{analytics.risk_scoring.high_risk}</p>
                <p className="text-sm text-gray-500">Require immediate attention</p>
              </div>
            </div>

            {/* Risk Distribution */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Risk Distribution</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{analytics.risk_scoring.high_risk}</div>
                  <div className="text-sm text-gray-600">High Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{analytics.risk_scoring.medium_risk}</div>
                  <div className="text-sm text-gray-600">Medium Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{analytics.risk_scoring.low_risk}</div>
                  <div className="text-sm text-gray-600">Low Risk</div>
                </div>
              </div>
            </div>

            {/* Compliance Status */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Compliance Status</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900">GDPR Compliance</h4>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Passed: {analytics.compliance.gdpr.passed}/{analytics.compliance.gdpr.total}</span>
                      <span>{analytics.compliance.gdpr.rate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${analytics.compliance.gdpr.rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">HIPAA Compliance</h4>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm">
                      <span>Passed: {analytics.compliance.hipaa.passed}/{analytics.compliance.hipaa.total}</span>
                      <span>{analytics.compliance.hipaa.rate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${analytics.compliance.hipaa.rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className={`px-3 py-1 rounded text-xs ${
                          user.is_active 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Recent Security Activities</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {activities.map((activity, index) => (
                <div key={index} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">User ID: {activity.user_id}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(activity.severity)}`}>
                        {activity.severity}
                      </span>
                      <span className="text-xs text-gray-500">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}