'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export default function AIBrain() {
  const meshRef = useRef<Mesh>(null!)
  const neuronRefs = useRef<Mesh[]>([])

  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    neuronRefs.current.forEach((neuron, i) => {
      if (neuron) {
        neuron.material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2
      }
    })
  })

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.2} transparent opacity={0.7} />
      </mesh>
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          ref={(el) => neuronRefs.current[i] = el!}
          position={[
            Math.cos(i * Math.PI / 4) * 0.6,
            Math.sin(i * Math.PI / 4) * 0.6,
            Math.sin(i * Math.PI / 2) * 0.3
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}