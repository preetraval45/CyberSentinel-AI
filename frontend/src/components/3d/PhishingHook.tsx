'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export default function PhishingHook() {
  const meshRef = useRef<Mesh>(null!)

  useFrame((state) => {
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusGeometry args={[1, 0.1, 8, 16]} />
      <meshStandardMaterial color="#ff0066" emissive="#ff0066" emissiveIntensity={0.3} />
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color="#ff0066" emissive="#ff0066" emissiveIntensity={0.3} />
      </mesh>
    </mesh>
  )
}