'use client'

import { useState, useEffect } from 'react'

interface Scenario {
  id: string
  title: string
  category: string
  difficulty: string
  ai_adaptive: boolean
  description: string
}

interface ScenarioState {
  progress_id: string
  current_step: string
  content: string
  decisions: string[]
  score: number
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
}

export default function Training() {
  const [selectedCategory, setSelectedCategory] = useState('physical')
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [currentScenario, setCurrentScenario] = useState<ScenarioState | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({})
  const [quizResult, setQuizResult] = useState<any>(null)

  const categories = [
    { id: 'physical', name: 'Physical Security', icon: '🏢' },
    { id: 'insider', name: 'Insider Threats', icon: '👤' },
    { id: 'malware', name: 'Malware Defense', icon: '🦠' },
    { id: 'ransomware', name: 'Ransomware Response', icon: '🔒' },
    { id: 'wifi', name: 'WiFi Security', icon: '📶' }
  ]

  const complianceTypes = [
    { id: 'gdpr', name: 'GDPR Compliance' },
    { id: 'hipaa', name: 'HIPAA Compliance' }
  ]

  useEffect(() => {
    fetchScenarios()
  }, [selectedCategory])

  const fetchScenarios = async () => {
    try {
      const response = await fetch(`/api/training/scenarios/${selectedCategory}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      setScenarios(data)
    } catch (error) {
      console.error('Failed to fetch scenarios:', error)
    }
  }

  const startScenario = async (scenarioId: string) => {
    try {
      const response = await fetch('/api/training/scenario/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ scenario_id: scenarioId })
      })
      const data = await response.json()
      setCurrentScenario(data)
    } catch (error) {
      console.error('Failed to start scenario:', error)
    }
  }

  const makeDecision = async (decision: string) => {
    if (!currentScenario) return

    try {
      const response = await fetch('/api/training/scenario/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          progress_id: currentScenario.progress_id,
          step_id: currentScenario.current_step,
          decision: decision
        })
      })
      const result = await response.json()
      
      // Show outcome
      alert(`${result.outcome}\nPoints: ${result.points}\nTotal Score: ${result.total_score}${result.ai_feedback ? `\n\nAI Feedback: ${result.ai_feedback}` : ''}`)
      
      if (result.next_step === 'end') {
        setCurrentScenario(null)
        alert(`Scenario completed! Final score: ${result.total_score}`)
      } else {
        setCurrentScenario({
          ...currentScenario,
          current_step: result.next_step,
          content: result.next_content,
          decisions: result.next_decisions,
          score: result.total_score
        })
      }
    } catch (error) {
      console.error('Failed to make decision:', error)
    }
  }

  const loadQuiz = async (quizType: string) => {
    try {
      const response = await fetch(`/api/training/compliance/questions/${quizType}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      setQuizQuestions(data.questions)
      setQuizAnswers({})
      setQuizResult(null)
    } catch (error) {
      console.error('Failed to load quiz:', error)
    }
  }

  const submitQuiz = async (quizType: string) => {
    try {
      const response = await fetch('/api/training/compliance/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          quiz_type: quizType,
          answers: quizAnswers
        })
      })
      const result = await response.json()
      setQuizResult(result)
    } catch (error) {
      console.error('Failed to submit quiz:', error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Advanced Security Training</h1>

        {!currentScenario ? (
          <div className="space-y-8">
            {/* Scenario Categories */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Interactive Scenarios</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-lg border text-center transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.name}</div>
                  </button>
                ))}
              </div>

              {/* Scenarios List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenarios.map((scenario) => (
                  <div key={scenario.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold">{scenario.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(scenario.difficulty)}`}>
                        {scenario.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        {scenario.ai_adaptive && (
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                            AI Adaptive
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => startScenario(scenario.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Quizzes */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Compliance Certification</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complianceTypes.map((quiz) => (
                  <div key={quiz.id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">{quiz.name}</h3>
                    
                    {quizQuestions.length === 0 ? (
                      <button
                        onClick={() => loadQuiz(quiz.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Start Quiz
                      </button>
                    ) : (
                      <div className="space-y-4">
                        {quizQuestions.map((question) => (
                          <div key={question.id} className="border-b pb-4">
                            <p className="font-medium mb-2">{question.question}</p>
                            <div className="space-y-2">
                              {question.options.map((option, index) => (
                                <label key={index} className="flex items-center">
                                  <input
                                    type="radio"
                                    name={`question-${question.id}`}
                                    value={index}
                                    onChange={(e) => setQuizAnswers({
                                      ...quizAnswers,
                                      [question.id]: parseInt(e.target.value)
                                    })}
                                    className="mr-2"
                                  />
                                  {option}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        <button
                          onClick={() => submitQuiz(quiz.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Submit Quiz
                        </button>

                        {quizResult && (
                          <div className={`p-4 rounded-lg ${quizResult.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            <p className={`font-semibold ${quizResult.passed ? 'text-green-800' : 'text-red-800'}`}>
                              Score: {quizResult.score}% - {quizResult.passed ? 'PASSED' : 'FAILED'}
                            </p>
                            {quizResult.passed && (
                              <p className="text-green-700 text-sm mt-1">
                                🎉 Congratulations! You've earned your {quiz.name} certification.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Scenario */
          <div className="bg-white rounded-lg shadow p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Interactive Scenario</h2>
                <div className="text-lg font-bold text-blue-600">Score: {currentScenario.score}</div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{currentScenario.content}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">What do you do?</h3>
              {currentScenario.decisions.map((decision) => (
                <button
                  key={decision}
                  onClick={() => makeDecision(decision)}
                  className="w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  {decision.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentScenario(null)}
              className="mt-6 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Exit Scenario
            </button>
          </div>
        )}
      </div>
    </div>
  )
}