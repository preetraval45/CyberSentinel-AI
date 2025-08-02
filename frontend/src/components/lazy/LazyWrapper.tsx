import { ReactNode } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

interface LazyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export default function LazyWrapper({
  children,
  fallback,
  className = '',
  threshold = 0.1,
  rootMargin = '100px'
}: LazyWrapperProps) {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  return (
    <div ref={elementRef} className={className}>
      {isIntersecting ? (
        children
      ) : (
        fallback || <LoadingSkeleton className="w-full h-32" />
      )}
    </div>
  );
}