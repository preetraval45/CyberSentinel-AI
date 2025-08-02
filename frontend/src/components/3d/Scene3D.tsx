'use client'

import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

interface Scene3DProps {
  children: React.ReactNode
  enableControls?: boolean
  className?: string
}

export default function Scene3D({ children, enableControls = false, className = "w-full h-full" }: Scene3DProps) {
  const canvasConfig = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        gl: { antialias: false, alpha: true, powerPreference: "default" as const },
        dpr: [1, 1] as [number, number]
      };
    }
    
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    const isMobile = window.innerWidth < 768;
    
    return {
      gl: { 
        antialias: !isLowEnd && !isMobile, 
        alpha: true,
        powerPreference: isLowEnd ? "default" as const : "high-performance" as const
      },
      dpr: isLowEnd || isMobile ? [1, 1] as [number, number] : [1, 2] as [number, number]
    };
  }, []);

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={canvasConfig.gl}
        dpr={canvasConfig.dpr}
        performance={{ min: 0.5 }}
        frameloop="demand"
      >
        <Suspense fallback={null}>
          <Environment preset="night" />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          {children}
          {enableControls && <OrbitControls enableZoom={false} enablePan={false} />}
        </Suspense>
      </Canvas>
    </div>
  )
}