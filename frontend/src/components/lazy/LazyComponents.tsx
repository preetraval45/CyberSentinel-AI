import dynamic from 'next/dynamic';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import LazyWrapper from './LazyWrapper';

// 3D Components with lazy loading and intersection observer
export const LazyCyberBrain = dynamic(
  () => import('@/components/3d/CyberBrain'),
  {
    loading: () => <LoadingSkeleton className="w-full h-64" />,
    ssr: false
  }
);

export const LazySecurityShield = dynamic(
  () => import('@/components/3d/SecurityShield'),
  {
    loading: () => <LoadingSkeleton className="w-full h-48" />,
    ssr: false
  }
);

export const LazyFloatingParticles = dynamic(
  () => import('@/components/3d/FloatingParticles'),
  {
    loading: () => <div className="w-full h-32" />,
    ssr: false
  }
);

export const LazyHeroScene = dynamic(
  () => import('@/components/3d/HeroScene'),
  {
    loading: () => <LoadingSkeleton className="w-full h-96" />,
    ssr: false
  }
);

// Viewport-aware 3D components
export const ViewportAwareCyberBrain = (props: any) => (
  <LazyWrapper fallback={<LoadingSkeleton className="w-full h-64" />}>
    <LazyCyberBrain {...props} />
  </LazyWrapper>
);

export const ViewportAwareFloatingParticles = (props: any) => (
  <LazyWrapper fallback={<div className="w-full h-32" />}>
    <LazyFloatingParticles {...props} />
  </LazyWrapper>
);

// Animation Components
export const LazyLottieAnimation = dynamic(
  () => import('@/components/animations/LottieAnimation'),
  {
    loading: () => <div className="w-16 h-16 animate-pulse bg-gray-700 rounded" />,
    ssr: false
  }
);

export const LazyAnimationModal = dynamic(
  () => import('@/components/animations/AnimationModal'),
  {
    loading: () => null,
    ssr: false
  }
);

// Dashboard Components with intersection observer
export const LazyAdminTabs = dynamic(
  () => import('@/components/admin/AdminTabs'),
  {
    loading: () => <LoadingSkeleton className="w-full h-96" />
  }
);

export const LazyUserStats = dynamic(
  () => import('@/components/user/UserStats'),
  {
    loading: () => <LoadingSkeleton className="w-full h-32" />
  }
);

// Heavy components with viewport awareness
export const ViewportAwareAdminTabs = (props: any) => (
  <LazyWrapper fallback={<LoadingSkeleton className="w-full h-96" />}>
    <LazyAdminTabs {...props} />
  </LazyWrapper>
);

export const ViewportAwareUserStats = (props: any) => (
  <LazyWrapper fallback={<LoadingSkeleton className="w-full h-32" />}>
    <LazyUserStats {...props} />
  </LazyWrapper>
);

// Viewport-based conditional rendering hook with memory optimization
export const useViewportOptimization = () => {
  if (typeof window === 'undefined') {
    return { isLowEnd: true, shouldRender3D: false, deviceMemory: 4 };
  }
  
  const deviceMemory = (navigator as any).deviceMemory || 4;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLowEnd = hardwareConcurrency <= 4 || deviceMemory <= 4 || isMobile;
  const shouldRender3D = window.innerWidth >= 768 && !isLowEnd && deviceMemory >= 4;
  
  return { isLowEnd, shouldRender3D, deviceMemory, isMobile };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  if (typeof window === 'undefined') return { fps: 60, memory: 0 };
  
  const getFPS = () => {
    let fps = 60;
    let lastTime = performance.now();
    let frameCount = 0;
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
    return fps;
  };
  
  const getMemoryUsage = () => {
    return (performance as any).memory?.usedJSHeapSize || 0;
  };
  
  return { fps: getFPS(), memory: getMemoryUsage() };
};