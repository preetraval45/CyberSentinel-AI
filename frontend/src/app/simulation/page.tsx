'use client'

import { useState, useEffect } from 'react'

interface MaliciousURL {
  id: string
  original_url: string
  shortened_url: string
  qr_code: string
  url_type: string
  is_clicked: boolean
  click_count: number
  created_at: string
}

interface PasswordResult {
  is_pwned: boolean
  breach_count: number
  strength_score: number
  feedback: {
    suggestions: string[]
    warnings: string[]
  }
}

export default function Simulation() {
  const [urls, setUrls] = useState<MaliciousURL[]>([])
  const [password, setPassword] = useState('')
  const [passwordResult, setPasswordResult] = useState<PasswordResult | null>(null)
  const [selectedUrlType, setSelectedUrlType] = useState('phishing')
  const [customUrl, setCustomUrl] = useState('')
  const [userInput, setUserInput] = useState('')

  useEffect(() => {
    fetchUrls()
  }, [])

  const fetchUrls = async () => {
    try {
      const response = await fetch('/api/simulation/url/list', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      setUrls(data)
    } catch (error) {
      console.error('Failed to fetch URLs:', error)
    }
  }

  const generateUrl = async () => {
    try {
      await fetch('/api/simulation/url/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          url_type: selectedUrlType,
          target_url: customUrl || null
        })
      })
      fetchUrls()
      setCustomUrl('')
    } catch (error) {
      console.error('Failed to generate URL:', error)
    }
  }

  const clickUrl = async (urlId: string) => {
    try {
      const response = await fetch('/api/simulation/url/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          url_id: urlId,
          user_input: { form_data: userInput }
        })
      })
      const result = await response.json()
      alert(result.warning)
      fetchUrls()
    } catch (error) {
      console.error('Failed to track click:', error)
    }
  }

  const checkPassword = async () => {
    if (!password) return
    
    try {
      const response = await fetch('/api/simulation/password/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ password })
      })
      const result = await response.json()
      setPasswordResult(result)
    } catch (error) {
      console.error('Failed to check password:', error)
    }
  }

  const getStrengthColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Security Simulation Lab</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* URL Simulation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Malicious URL & QR Code Simulation</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">URL Type</label>
              <select
                value={selectedUrlType}
                onChange={(e) => setSelectedUrlType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="phishing">Phishing</option>
                <option value="malware">Malware</option>
                <option value="scam">Scam</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Custom Target URL (Optional)</label>
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={generateUrl}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 mb-6"
            >
              Generate Malicious URL & QR Code
            </button>

            <div className="space-y-4">
              {urls.map((url) => (
                <div key={url.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{url.url_type.toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{url.shortened_url}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      url.is_clicked ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {url.is_clicked ? `Clicked ${url.click_count}x` : 'Not Clicked'}
                    </span>
                  </div>
                  
                  {url.qr_code && (
                    <div className="mb-3">
                      <img src={url.qr_code} alt="QR Code" className="w-24 h-24" />
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => clickUrl(url.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Simulate Click
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(url.shortened_url)}
                      className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Password Checker */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Password Security Checker</h2>
            <p className="text-sm text-gray-600 mb-4">
              Check if your password has been compromised in data breaches using HaveIBeenPwned API
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to test"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={checkPassword}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 mb-6"
            >
              Check Password Security
            </button>

            {passwordResult && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Security Analysis</h3>
                    <span className={`text-lg font-bold ${getStrengthColor(passwordResult.strength_score)}`}>
                      {passwordResult.strength_score}/100
                    </span>
                  </div>

                  {passwordResult.is_pwned && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                      <p className="text-red-800 font-semibold">
                        ⚠️ Password Compromised!
                      </p>
                      <p className="text-red-700 text-sm">
                        Found in {passwordResult.breach_count} data breaches
                      </p>
                    </div>
                  )}

                  {!passwordResult.is_pwned && (
                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                      <p className="text-green-800 font-semibold">
                        ✅ Password Not Found in Breaches
                      </p>
                    </div>
                  )}

                  {passwordResult.feedback.warnings.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-red-700 mb-2">Warnings:</h4>
                      <ul className="list-disc list-inside text-sm text-red-600">
                        {passwordResult.feedback.warnings.map((warning, index) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {passwordResult.feedback.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">Suggestions:</h4>
                      <ul className="list-disc list-inside text-sm text-blue-600">
                        {passwordResult.feedback.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}