'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import * as d3 from 'd3'
import { Globe, Zap, Shield, AlertTriangle } from 'lucide-react'

interface AttackData {
  id: string
  lat: number
  lng: number
  type: 'phishing' | 'malware' | 'ddos' | 'breach'
  severity: 'low' | 'medium' | 'high' | 'critical'
  country: string
  timestamp: Date
}

export default function CyberMap() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [attacks, setAttacks] = useState<AttackData[]>([])
  const [selectedAttack, setSelectedAttack] = useState<AttackData | null>(null)

  const mockAttacks: AttackData[] = [
    { id: '1', lat: 40.7128, lng: -74.0060, type: 'phishing', severity: 'high', country: 'USA', timestamp: new Date() },
    { id: '2', lat: 51.5074, lng: -0.1278, type: 'malware', severity: 'critical', country: 'UK', timestamp: new Date() },
    { id: '3', lat: 35.6762, lng: 139.6503, type: 'ddos', severity: 'medium', country: 'Japan', timestamp: new Date() },
    { id: '4', lat: 52.5200, lng: 13.4050, type: 'breach', severity: 'high', country: 'Germany', timestamp: new Date() },
    { id: '5', lat: -33.8688, lng: 151.2093, type: 'phishing', severity: 'low', country: 'Australia', timestamp: new Date() }
  ]

  useEffect(() => {
    setAttacks(mockAttacks)
    
    const interval = setInterval(() => {
      const newAttack: AttackData = {
        id: Date.now().toString(),
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        type: ['phishing', 'malware', 'ddos', 'breach'][Math.floor(Math.random() * 4)] as any,
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        country: 'Unknown',
        timestamp: new Date()
      }
      setAttacks(prev => [...prev.slice(-20), newAttack])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const width = 800
    const height = 400

    svg.selectAll('*').remove()

    // Create projection
    const projection = d3.geoNaturalEarth1()
      .scale(130)
      .translate([width / 2, height / 2])

    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#0a0a0a')

    // Add grid lines
    const graticule = d3.geoGraticule()
    svg.append('path')
      .datum(graticule())
      .attr('d', d3.geoPath().projection(projection))
      .attr('fill', 'none')
      .attr('stroke', '#00ffff')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.3)

    // Add attack points
    attacks.forEach((attack, i) => {
      const [x, y] = projection([attack.lng, attack.lat]) || [0, 0]
      
      const severityColors = {
        low: '#00ff66',
        medium: '#ffff00',
        high: '#ff00ff',
        critical: '#ff0066'
      }

      // Pulsing circle
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 0)
        .attr('fill', severityColors[attack.severity])
        .attr('opacity', 0.8)
        .transition()
        .duration(1000)
        .delay(i * 100)
        .attr('r', attack.severity === 'critical' ? 12 : 8)
        .transition()
        .duration(2000)
        .attr('r', 20)
        .attr('opacity', 0)

      // Static dot
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 3)
        .attr('fill', severityColors[attack.severity])
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .on('click', () => setSelectedAttack(attack))
    })

  }, [attacks])

  return (
    <div className="cyber-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-cyber font-bold neon-text">GLOBAL THREAT MAP</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse" />
            <span className="text-cyber-primary/70 font-mono text-sm">LIVE</span>
          </div>
          <span className="text-cyber-primary/70 font-mono text-sm">
            {attacks.length} ACTIVE THREATS
          </span>
        </div>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          width="100%"
          height="400"
          viewBox="0 0 800 400"
          className="border border-cyber-primary/30 rounded-lg bg-cyber-darker"
        />
        
        {selectedAttack && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-4 right-4 glass-dark p-4 rounded-lg border border-cyber-primary/30 min-w-64"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-cyber font-bold text-cyber-primary uppercase">
                {selectedAttack.type}
              </span>
              <button
                onClick={() => setSelectedAttack(null)}
                className="text-cyber-primary/50 hover:text-cyber-primary"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-cyber-primary/70">Severity:</span>
                <span className="font-cyber font-bold uppercase text-cyber-red">
                  {selectedAttack.severity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyber-primary/70">Location:</span>
                <span className="text-cyber-primary">{selectedAttack.country}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}