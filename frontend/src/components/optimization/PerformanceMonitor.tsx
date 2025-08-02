'use client'

import { useEffect, useState } from 'react';

interface PerformanceMonitorProps {
  onPerformanceChange?: (metrics: { fps: number; memory: number; quality: 'high' | 'medium' | 'low' }) => void;
}

export default function PerformanceMonitor({ onPerformanceChange }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState({ fps: 60, memory: 0 });
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const memory = (performance as any).memory?.usedJSHeapSize || 0;
        
        let newQuality: 'high' | 'medium' | 'low' = 'high';
        if (fps < 30 || memory > 100 * 1024 * 1024) {
          newQuality = 'low';
        } else if (fps < 45 || memory > 50 * 1024 * 1024) {
          newQuality = 'medium';
        }
        
        setMetrics({ fps, memory });
        setQuality(newQuality);
        
        if (onPerformanceChange) {
          onPerformanceChange({ fps, memory, quality: newQuality });
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [onPerformanceChange]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {Math.round(metrics.memory / 1024 / 1024)}MB</div>
      <div>Quality: {quality}</div>
    </div>
  );
}