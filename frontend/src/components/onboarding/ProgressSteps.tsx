'use client'

import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/solid'

interface Step {
  id: number
  name: string
  description: string
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <nav className="flex justify-center mb-12">
      <ol className="flex items-center space-x-4">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="flex items-center">
            <div className="flex items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: stepIdx * 0.1 }}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  stepIdx < currentStep
                    ? 'border-cyber-primary bg-cyber-primary text-cyber-dark'
                    : stepIdx === currentStep
                    ? 'border-cyber-primary bg-transparent text-cyber-primary'
                    : 'border-cyber-primary/30 bg-transparent text-cyber-primary/30'
                }`}
              >
                {stepIdx < currentStep ? (
                  <CheckIcon className="h-6 w-6" />
                ) : (
                  <span className="font-cyber font-bold">{step.id}</span>
                )}
              </motion.div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-cyber font-bold ${
                  stepIdx <= currentStep ? 'text-cyber-primary' : 'text-cyber-primary/50'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-cyber-primary/70">{step.description}</p>
              </div>
            </div>
            {stepIdx < steps.length - 1 && (
              <div className="ml-4 h-0.5 w-12 bg-cyber-primary/30" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}