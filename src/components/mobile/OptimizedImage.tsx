/**
 * 🖼️ Optimized Image Component
 * 
 * High-performance image loading for mobile app
 * Optimizes LCP by preloading critical images and using modern formats
 */

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  loading?: 'lazy' | 'eager';
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  loading = 'lazy',
  quality = 90,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  style,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate placeholder blur data URL if not provided
  const generatePlaceholder = (w: number, h: number): string => {
    // Create a simple gray blur placeholder
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
      </svg>`
    ).toString('base64')}`;
  };

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // Use blur placeholder if enabled and no custom blur provided
  const finalBlurDataURL = placeholder === 'blur' 
    ? blurDataURL || generatePlaceholder(width, height)
    : undefined;

  // Optimize sizes for responsive loading
  const optimizedSizes = sizes || (
    fill 
      ? '100vw'
      : `(max-width: 640px) ${Math.min(width, 640)}px, ${width}px`
  );

  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <div className="text-gray-400 text-center">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={fill ? undefined : { width, height }}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        loading={priority ? 'eager' : loading}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={finalBlurDataURL}
        sizes={optimizedSizes}
        className={`
          transition-opacity duration-300
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
          ${fill ? 'object-cover' : ''}
        `}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading state */}
      {!imageLoaded && !imageError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={fill ? {} : { width, height }}
        >
          <div className="text-gray-400">
            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

// Optimized logo component for faster LCP
export function OptimizedLogo({ 
  size = 60, 
  priority = false,
  className = "" 
}: { 
  size?: number; 
  priority?: boolean;
  className?: string;
}) {
  return (
    <OptimizedImage
      src="/images/logo.png"
      alt="RVR AFC Logo"
      width={size}
      height={size}
      priority={priority}
      quality={95}
      placeholder="blur"
      className={`rounded-full shadow-lg ${className}`}
    />
  );
}

// Optimized background image component
export function OptimizedBackground({ 
  src, 
  alt = "Background", 
  className = "",
  priority = true 
}: { 
  src: string; 
  alt?: string; 
  className?: string;
  priority?: boolean;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority={priority}
      quality={85}
      placeholder="blur"
      sizes="100vw"
      className={`object-cover ${className}`}
      style={{ objectPosition: 'center' }}
    />
  );
}