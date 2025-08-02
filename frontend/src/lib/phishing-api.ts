// Phishing API Client
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Email {
  id: string
  subject: string
  sender: string
  content: string
  difficulty_level: string
  ai_click_likelihood: number
  is_clicked: boolean
  is_reported: boolean
  created_at: string
}

export interface GameSession {
  id: string
  difficulty_level: number
  score: number
  emails_processed: number
  correct_identifications: number
  false_positives: number
  clicks_on_malicious: number
  accuracy: number
  created_at: string
}

export interface Alert {
  id: string
  alert_type: string
  feedback_message: string
  xp_awarded: number
  response_time: number
  created_at: string
}

export interface Feedback {
  message: string
  xp: number
  type: string
}

class PhishingAPI {
  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE}/api/phishing${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async generateEmail(difficultyLevel: number = 1): Promise<Email> {
    return this.request('/generate', {
      method: 'POST',
      body: JSON.stringify({ difficulty_level: difficultyLevel }),
    })
  }

  async getInbox(): Promise<Email[]> {
    return this.request('/inbox')
  }

  async trackClick(emailId: string, responseTime?: number) {
    return this.request('/click', {
      method: 'POST',
      body: JSON.stringify({ email_id: emailId, response_time: responseTime }),
    })
  }

  async reportPhishing(emailId: string, responseTime?: number) {
    return this.request('/report', {
      method: 'POST',
      body: JSON.stringify({ email_id: emailId, response_time: responseTime }),
    })
  }

  async getGameSession(): Promise<GameSession> {
    return this.request('/game-session')
  }

  async updateDifficulty(difficultyLevel: number) {
    return this.request('/update-difficulty', {
      method: 'POST',
      body: JSON.stringify({ difficulty_level: difficultyLevel }),
    })
  }

  async getAlerts(): Promise<Alert[]> {
    return this.request('/alerts')
  }
}

export const phishingAPI = new PhishingAPI()