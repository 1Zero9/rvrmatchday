/**
 * Optimized Lazy Loading Image Component
 * Provides smooth loading with blur-up effect and intersection observer
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  blurDataURL?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
  sizes?: string;
  quality?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder,
  blurDataURL,
  priority = false,
  onLoad,
  onError,
  aspectRatio,
  sizes,
  quality = 75
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate optimized src with quality parameter
  const optimizedSrc = React.useMemo(() => {
    if (src.startsWith('http') && !src.includes('unsplash.com')) {
      return src;
    }
    
    // For Unsplash images, add optimization parameters
    if (src.includes('unsplash.com')) {
      const url = new URL(src);
      url.searchParams.set('q', quality.toString());
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      return url.toString();
    }
    
    return src;
  }, [src, quality]);

  // Create blur placeholder
  const blurPlaceholder = blurDataURL || 
    `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#9ca3af" font-size="12">
          Loading...
        </text>
      </svg>
    `)}`;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: aspectRatio || 'auto',
      }}
    >
      {/* Blur placeholder */}
      <motion.div
        className="absolute inset-0 bg-gray-200"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundImage: `url(${blurPlaceholder})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(10px)',
          transform: 'scale(1.1)', // Prevent blur edge artifacts
        }}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Main image */}
      {isInView && !hasError && (
        <motion.img
          ref={imgRef}
          src={optimizedSrc}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover ${className}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.1
          }}
          transition={{ 
            opacity: { duration: 0.5, ease: 'easeOut' },
            scale: { duration: 0.8, ease: 'easeOut' }
          }}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          sizes={sizes}
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && isInView && !hasError && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

// Optimized background image component
interface LazyBackgroundImageProps {
  src: string;
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
  priority?: boolean;
  overlay?: boolean;
  overlayOpacity?: number;
}

export const LazyBackgroundImage: React.FC<LazyBackgroundImageProps> = ({
  src,
  children,
  className = '',
  placeholder,
  priority = false,
  overlay = false,
  overlayOpacity = 0.3
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = src;
  }, [isInView, src]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Placeholder */}
      <motion.div
        className="absolute inset-0 bg-gray-300"
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundImage: placeholder ? `url(${placeholder})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Background image */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 1.1
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          backgroundImage: isLoaded ? `url(${src})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // Parallax effect
        }}
      />

      {/* Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default LazyImage;