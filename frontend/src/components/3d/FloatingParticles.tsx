'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function FloatingParticles() {
  const ref = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const temp = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000; i++) {
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
    <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3b82f6"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  )
}