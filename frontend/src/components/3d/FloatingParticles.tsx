'use client'

import { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Optimized particle count based on device capability
const getParticleCount = () => {
  if (typeof window === 'undefined') return 200;
  const isLowEnd = navigator.hardwareConcurrency <= 4;
  const isMobile = window.innerWidth < 768;
  return isLowEnd || isMobile ? 200 : 1000;
};

export default function FloatingParticles() {
  const ref = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const count = getParticleCount();
    const temp = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      temp.set([
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ], i * 3)
    }
    return temp
  }, [])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime / 10) * 0.1
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime / 15) * 0.1
    }
  })

  return (
    <Suspense fallback={null}>
      <Points ref={ref} positions={particles} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </Suspense>
  )
}