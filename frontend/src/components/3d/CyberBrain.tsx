'use client'

import { useRef, Suspense, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Optimized geometry based on device capability
const getGeometry = () => {
  if (typeof window === 'undefined') return [1, 16, 16];
  const isLowEnd = navigator.hardwareConcurrency <= 4;
  return isLowEnd ? [1, 16, 16] : [1, 32, 32];
};

export default function CyberBrain() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  const geometry = useMemo(() => getGeometry(), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <Suspense fallback={null}>
      <Sphere ref={meshRef} args={geometry} scale={1.2}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Suspense>
  )
}