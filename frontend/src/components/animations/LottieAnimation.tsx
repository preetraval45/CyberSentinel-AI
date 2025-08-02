'use client'

import { Player } from '@lottiefiles/react-lottie-player'
import { motion, AnimatePresence } from 'framer-motion'

interface LottieAnimationProps {
  src: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loop?: boolean
  autoplay?: boolean
  show?: boolean
  onComplete?: () => void
  className?: string
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24', 
  lg: 'w-32 h-32',
  xl: 'w-48 h-48'
}

export default function LottieAnimation({ 
  src, 
  size = 'md', 
  loop = false, 
  autoplay = true, 
  show = true,
  onComplete,
  className = ''
}: LottieAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`${sizeClasses[size]} ${className}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Player
            autoplay={autoplay}
            loop={loop}
            src={src}
            className="w-full h-full"
            onEvent={(event) => {
              if (event === 'complete' && onComplete) {
                onComplete()
              }
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}