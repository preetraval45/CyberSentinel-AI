'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export default function ChatBubble() {
  const meshRef = useRef<Mesh>(null!)

  useFrame((state) => {
    meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
  })

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-0.4, -0.6, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-0.6, -0.9, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}