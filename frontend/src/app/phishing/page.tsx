'use client'

import { useState, useEffect } from 'react'

interface Email {
  id: string
  subject: string
  sender: string
  content: string
  is_clicked: boolean
  is_reported: boolean
  created_at: string
}

export default function PhishingInbox() {
  const [emails, setEmails] = useState<Email[]>([])
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/phishing/inbox', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      setEmails(data)
    } catch (error) {
      console.error('Failed to fetch emails:', error)
    }
  }

  const generateEmail = async () => {
    try {
      await fetch('/api/phishing/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ difficulty: 'beginner' })
      })
      fetchEmails()
    } catch (error) {
      console.error('Failed to generate email:', error)
    }
  }

  const trackClick = async (emailId: string) => {
    try {
      await fetch('/api/phishing/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email_id: emailId })
      })
      fetchEmails()
    } catch (error) {
      console.error('Failed to track click:', error)
    }
  }

  const reportPhishing = async (emailId: string) => {
    try {
      await fetch('/api/phishing/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ email_id: emailId })
      })
      fetchEmails()
    } catch (error) {
      console.error('Failed to report phishing:', error)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Phishing Simulation Inbox</h1>
          <button
            onClick={generateEmail}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Generate Phishing Email
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Inbox ({emails.length})</h2>
            </div>
            <div className="divide-y">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedEmail?.id === email.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{email.subject}</p>
                      <p className="text-sm text-gray-600">{email.sender}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(email.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {email.is_clicked && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                          Clicked
                        </span>
                      )}
                      {email.is_reported && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                          Reported
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Content */}
          <div className="bg-white rounded-lg shadow">
            {selectedEmail ? (
              <div className="p-6">
                <div className="border-b pb-4 mb-4">
                  <h3 className="text-xl font-semibold">{selectedEmail.subject}</h3>
                  <p className="text-gray-600">From: {selectedEmail.sender}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedEmail.created_at).toLocaleString()}
                  </p>
                </div>
                
                <div className="mb-6">
                  <div dangerouslySetInnerHTML={{ __html: selectedEmail.content }} />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => trackClick(selectedEmail.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    disabled={selectedEmail.is_clicked}
                  >
                    {selectedEmail.is_clicked ? 'Already Clicked' : 'Click Link'}
                  </button>
                  <button
                    onClick={() => reportPhishing(selectedEmail.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    disabled={selectedEmail.is_reported}
                  >
                    {selectedEmail.is_reported ? 'Already Reported' : 'Report Phishing'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Select an email to view its content
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}