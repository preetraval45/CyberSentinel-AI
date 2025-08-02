'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Phone, PhoneCall, Mic, MicOff, Play, Pause } from 'lucide-react'
import toast from 'react-hot-toast'

interface VoiceCall {
  call_id: string
  scenario_type: string
  difficulty_level: number
  transcript: string
  audio_data: string
}

interface CallResponse {
  call_id: string
  transcript: string
  ai_score: number
  vulnerability_score: number
  feedback: Array<{
    type: string
    message: string
    score_impact: number
  }>
}

export default function VoiceCallSimulator() {
  const [currentCall, setCurrentCall] = useState<VoiceCall | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [callResponse, setCallResponse] = useState<CallResponse | null>(null)
  const [selectedScenario, setSelectedScenario] = useState('tech_support')
  const [difficultyLevel, setDifficultyLevel] = useState(1)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const scenarios = {
    tech_support: 'Tech Support Scam',
    bank_fraud: 'Bank Fraud Call',
    prize_scam: 'Prize/Lottery Scam'
  }

  const startCall = async () => {
    try {
      const response = await fetch('/api/voice-calls/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_type: selectedScenario,
          difficulty_level: difficultyLevel
        })
      })
      
      const call = await response.json()
      setCurrentCall(call)
      
      // Convert hex audio data to blob and play
      const audioBlob = new Blob([new Uint8Array(call.audio_data.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)))], { type: 'audio/mpeg' })
      const audioUrl = URL.createObjectURL(audioBlob)
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (error) {
      toast.error('Failed to start call')
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        await submitResponse(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      toast.error('Failed to start recording')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const submitResponse = async (audioBlob: Blob) => {
    if (!currentCall) return

    const formData = new FormData()
    formData.append('audio_file', audioBlob, 'response.wav')

    try {
      const response = await fetch(`/api/voice-calls/respond/${currentCall.call_id}`, {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      setCallResponse(result)
      
      result.feedback.forEach((feedback: any) => {
        if (feedback.type === 'vulnerability') {
          toast.error(feedback.message)
        } else if (feedback.type === 'strength') {
          toast.success(feedback.message)
        } else {
          toast(feedback.message)
        }
      })
    } catch (error) {
      toast.error('Failed to submit response')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-cyber-green'
    if (score >= 60) return 'text-cyber-secondary'
    return 'text-cyber-red'
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-cyber font-black neon-text mb-4">
            VOICE CALL SIMULATOR
          </h1>
          <p className="text-cyber-primary/70 font-mono">
            Social engineering awareness training with AI analysis
          </p>
        </motion.div>

        {!currentCall ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cyber-card p-8 text-center"
          >
            <h2 className="text-2xl font-cyber font-bold text-cyber-primary mb-6">
              SELECT SCENARIO
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.entries(scenarios).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedScenario(key)}
                  className={`cyber-card p-4 transition-all duration-300 ${
                    selectedScenario === key ? 'border-cyber-primary cyber-glow' : 'border-cyber-primary/30'
                  }`}
                >
                  <div className="font-cyber font-bold text-cyber-primary">{label}</div>
                </button>
              ))}
            </div>

            <div className="mb-8">
              <label className="block text-cyber-primary font-cyber font-bold mb-4">
                DIFFICULTY: {difficultyLevel}
              </label>
              <input
                type="range"
                min="1"
                max="3"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(parseInt(e.target.value))}
                className="w-full slider"
              />
            </div>

            <button
              onClick={startCall}
              className="cyber-button-primary px-8 py-4 text-lg flex items-center space-x-2 mx-auto"
            >
              <PhoneCall className="w-5 h-5" />
              <span>START CALL</span>
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="cyber-card p-6"
            >
              <div className="text-center mb-6">
                <Phone className="w-16 h-16 text-cyber-primary mx-auto mb-4" />
                <h3 className="text-xl font-cyber font-bold text-cyber-primary">
                  {scenarios[currentCall.scenario_type as keyof typeof scenarios]}
                </h3>
              </div>

              <div className="mb-6">
                <h4 className="font-cyber font-bold text-cyber-primary mb-2">CALLER:</h4>
                <div className="glass-dark p-4 rounded-lg">
                  <p className="text-cyber-primary/80">{currentCall.transcript}</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    if (audioRef.current) {
                      if (isPlaying) {
                        audioRef.current.pause()
                        setIsPlaying(false)
                      } else {
                        audioRef.current.play()
                        setIsPlaying(true)
                      }
                    }
                  }}
                  className="cyber-button-primary p-3"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-4 rounded-full border-2 ${
                    isRecording 
                      ? 'bg-cyber-red/20 border-cyber-red text-cyber-red animate-pulse' 
                      : 'bg-cyber-primary/20 border-cyber-primary text-cyber-primary'
                  }`}
                >
                  {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
              </div>

              <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="cyber-card p-6"
            >
              {callResponse ? (
                <div>
                  <h3 className="text-xl font-cyber font-bold text-cyber-primary mb-6">
                    RESULTS
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span>AI Score:</span>
                      <span className={`font-bold ${getScoreColor(callResponse.ai_score)}`}>
                        {callResponse.ai_score.toFixed(1)}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vulnerability:</span>
                      <span className="font-bold text-cyber-red">
                        {(callResponse.vulnerability_score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-cyber font-bold mb-2">YOUR RESPONSE:</h4>
                    <div className="glass-dark p-4 rounded-lg">
                      <p className="text-sm">{callResponse.transcript}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {callResponse.feedback.map((feedback, index) => (
                      <div key={index} className="p-3 rounded border-l-4 border-cyber-primary/50">
                        <p className="text-sm">{feedback.message}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentCall(null)
                      setCallResponse(null)
                    }}
                    className="cyber-button-primary w-full mt-6"
                  >
                    NEW CALL
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Mic className="w-16 h-16 text-cyber-primary/30 mx-auto mb-4" />
                  <p className="text-cyber-primary/70">
                    {isRecording ? 'Recording...' : 'Ready to record'}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}