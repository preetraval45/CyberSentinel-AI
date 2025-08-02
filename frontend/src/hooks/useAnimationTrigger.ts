'use client'

import { useState, useCallback } from 'react'

interface AnimationState {
  type: 'success' | 'error' | 'unlock' | 'complete' | 'loading'
  title: string
  message: string
  show: boolean
}

export function useAnimationTrigger() {
  const [animation, setAnimation] = useState<AnimationState>({
    type: 'success',
    title: '',
    message: '',
    show: false
  })

  const triggerSuccess = useCallback((title: string, message: string) => {
    setAnimation({
      type: 'success',
      title,
      message,
      show: true
    })
  }, [])

  const triggerError = useCallback((title: string, message: string) => {
    setAnimation({
      type: 'error',
      title,
      message,
      show: true
    })
  }, [])

  const triggerUnlock = useCallback((title: string, message: string) => {
    setAnimation({
      type: 'unlock',
      title,
      message,
      show: true
    })
  }, [])

  const triggerComplete = useCallback((title: string, message: string) => {
    setAnimation({
      type: 'complete',
      title,
      message,
      show: true
    })
  }, [])

  const hideAnimation = useCallback(() => {
    setAnimation(prev => ({ ...prev, show: false }))
  }, [])

  return {
    animation,
    triggerSuccess,
    triggerError,
    triggerUnlock,
    triggerComplete,
    hideAnimation
  }
}