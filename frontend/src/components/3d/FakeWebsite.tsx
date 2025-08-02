'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export default function FakeWebsite() {
  const meshRef = useRef<Mesh>(null!)

  useFrame((state) => {
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
  })

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1.2, 0.1]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.8, 1]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[-0.6 + i * 0.6, 0.2, 0.07]}>
          <boxGeometry args={[0.4, 0.1, 0.01]} />
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  )
}