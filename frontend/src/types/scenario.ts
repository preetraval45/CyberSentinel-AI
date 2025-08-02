export type ScenarioType = 'phishing' | 'email' | 'chat' | 'physical'

export interface ScenarioElement {
  id: string
  type: 'email' | 'message' | 'choice' | 'timer' | 'trigger' | 'outcome'
  position: { x: number; y: number }
  data: {
    title: string
    content: string
    options?: string[]
    delay?: number
    condition?: string
    score?: number
  }
  connections: string[]
}

export interface Scenario {
  id: string
  title: string
  description: string
  type: ScenarioType
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  elements: ScenarioElement[]
  createdBy: string
  createdAt: Date
  isPublished: boolean
  tags: string[]
}

export const ELEMENT_TYPES = {
  email: {
    name: 'Email',
    icon: '📧',
    color: 'bg-cyber-primary',
    description: 'Send an email to the user'
  },
  message: {
    name: 'Message',
    icon: '💬',
    color: 'bg-cyber-secondary',
    description: 'Display a message or notification'
  },
  choice: {
    name: 'Choice',
    icon: '🔀',
    color: 'bg-cyber-accent',
    description: 'Present multiple choice options'
  },
  timer: {
    name: 'Timer',
    icon: '⏱️',
    color: 'bg-cyber-green',
    description: 'Add time pressure element'
  },
  trigger: {
    name: 'Trigger',
    icon: '⚡',
    color: 'bg-cyber-red',
    description: 'Conditional logic trigger'
  },
  outcome: {
    name: 'Outcome',
    icon: '🎯',
    color: 'bg-cyber-blue',
    description: 'Define scenario result'
  }
}

export const SCENARIO_TEMPLATES = {
  phishing: {
    title: 'Phishing Email Campaign',
    elements: [
      {
        id: 'start',
        type: 'email' as const,
        position: { x: 100, y: 100 },
        data: {
          title: 'Suspicious Email',
          content: 'You received an urgent email from your bank...'
        },
        connections: ['choice1']
      },
      {
        id: 'choice1',
        type: 'choice' as const,
        position: { x: 300, y: 100 },
        data: {
          title: 'What do you do?',
          content: 'Choose your response:',
          options: ['Click the link', 'Report as phishing', 'Delete email']
        },
        connections: ['outcome1', 'outcome2', 'outcome3']
      }
    ]
  }
}