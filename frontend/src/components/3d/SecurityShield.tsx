'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder, Ring } from '@react-three/drei'
import * as THREE from 'three'

export default function SecurityShield() {
  const groupRef = useRef<THREE.Group>(null)
  const shieldRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
    if (shieldRef.current) {
      shieldRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <Cylinder ref={shieldRef} args={[1.2, 1.2, 0.1, 6]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#10b981" wireframe transparent opacity={0.8} />
      </Cylinder>
      <Ring args={[1.5, 1.7, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
      </Ring>
      <Ring args={[2, 2.2, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#8b5cf6" transparent opacity={0.4} />
      </Ring>
    </group>
  )
}