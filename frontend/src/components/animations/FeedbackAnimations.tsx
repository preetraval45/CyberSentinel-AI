'use client'

import LottieAnimation from './LottieAnimation'

// Lottie animation URLs from LottieFiles
const ANIMATIONS = {
  success: 'https://lottie.host/4d5e7f8c-8b4a-4c8e-9f2a-1b3c4d5e6f7g/abcdefghij.json',
  error: 'https://lottie.host/embed/error-animation.json',
  unlock: 'https://lottie.host/embed/unlock-animation.json',
  complete: 'https://lottie.host/embed/complete-animation.json',
  loading: 'https://lottie.host/embed/loading-animation.json'
}

interface FeedbackAnimationProps {
  type: 'success' | 'error' | 'unlock' | 'complete' | 'loading'
  show: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onComplete?: () => void
  message?: string
}

export default function FeedbackAnimation({ 
  type, 
  show, 
  size = 'lg', 
  onComplete,
  message 
}: FeedbackAnimationProps) {
  const colors = {
    success: 'text-green-400',
    error: 'text-red-400',
    unlock: 'text-yellow-400',
    complete: 'text-blue-400',
    loading: 'text-gray-400'
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <LottieAnimation
        src={ANIMATIONS[type]}
        size={size}
        loop={type === 'loading'}
        show={show}
        onComplete={onComplete}
      />
      {message && (
        <p className={`text-center font-semibold ${colors[type]}`}>
          {message}
        </p>
      )}
    </div>
  )
}