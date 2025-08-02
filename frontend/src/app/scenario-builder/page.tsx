'use client'

import ScenarioBuilder from '../../components/scenario/ScenarioBuilder'
import { Toaster } from 'react-hot-toast'

export default function ScenarioBuilderPage() {
  return (
    <>
      <ScenarioBuilder />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(0, 255, 255, 0.1)',
            color: '#00ffff',
            border: '1px solid rgba(0, 255, 255, 0.3)'
          }
        }}
      />
    </>
  )
}