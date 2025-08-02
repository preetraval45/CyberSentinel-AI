'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Torus, Sphere, Box } from '@react-three/drei'
import * as THREE from 'three'

export default function HeroScene() {
  const groupRef = useRef<THREE.Group>(null)
  const torusRef = useRef<THREE.Mesh>(null)
  const sphereRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003
    }
    if (torusRef.current) {
      torusRef.current.rotation.x += 0.01
      torusRef.current.rotation.z += 0.005
    }
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Sphere ref={sphereRef} args={[0.8, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.6} />
      </Sphere>
      <Torus ref={torusRef} args={[1.5, 0.1, 16, 100]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8b5cf6" transparent opacity={0.8} />
      </Torus>
      <Torus args={[2, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#10b981" transparent opacity={0.6} />
      </Torus>
    </group>
  )
}