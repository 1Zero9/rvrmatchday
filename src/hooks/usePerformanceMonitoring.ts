/**
 * 📊 Performance Monitoring Hook
 * 
 * Tracks Core Web Vitals and custom performance metrics
 * Provides real-time performance data for mobile experience optimization
 */

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  lcp?: number;  // Largest Contentful Paint
  fid?: number;  // First Input Delay  
  cls?: number;  // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  fcp?: number;  // First Contentful Paint
  tti?: number;  // Time to Interactive
}

interface PerformanceData {
  metrics: PerformanceMetrics;
  isLoading: boolean;
  error: string | null;
  grade: 'excellent' | 'good' | 'needs-improvement' | 'poor';
}

export default function usePerformanceMonitoring() {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    metrics: {},
    isLoading: true,
    error: null,
    grade: 'good'
  });

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    let observer: PerformanceObserver | null = null;
    const metrics: PerformanceMetrics = {};

    // Function to calculate performance grade
    const calculateGrade = (currentMetrics: PerformanceMetrics): 'excellent' | 'good' | 'needs-improvement' | 'poor' => {
      const { lcp, fid, cls } = currentMetrics;
      
      let score = 0;
      let total = 0;

      // LCP scoring (target: ≤ 2.5s)
      if (lcp !== undefined) {
        total++;
        if (lcp <= 2500) score += 1;
        else if (lcp <= 4000) score += 0.5;
      }

      // FID scoring (target: ≤ 100ms)
      if (fid !== undefined) {
        total++;
        if (fid <= 100) score += 1;
        else if (fid <= 300) score += 0.5;
      }

      // CLS scoring (target: ≤ 0.1)
      if (cls !== undefined) {
        total++;
        if (cls <= 0.1) score += 1;
        else if (cls <= 0.25) score += 0.5;
      }

      if (total === 0) return 'good';

      const percentage = score / total;
      if (percentage >= 0.9) return 'excellent';
      if (percentage >= 0.75) return 'good';
      if (percentage >= 0.5) return 'needs-improvement';
      return 'poor';
    };

    // Function to update metrics and grade
    const updateMetrics = (newMetrics: Partial<PerformanceMetrics>) => {
      const updatedMetrics = { ...metrics, ...newMetrics };
      Object.assign(metrics, newMetrics);
      
      setPerformanceData(prev => ({
        ...prev,
        metrics: updatedMetrics,
        grade: calculateGrade(updatedMetrics),
        isLoading: false
      }));
    };

    try {
      // Use Web Vitals API if available
      if ('PerformanceObserver' in window) {
        observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            switch (entry.entryType) {
              case 'largest-contentful-paint':
                updateMetrics({ lcp: entry.startTime });
                break;
              case 'first-input':
                updateMetrics({ fid: (entry as any).processingStart - entry.startTime });
                break;
              case 'layout-shift':
                // Accumulate CLS
                if (!(entry as any).hadRecentInput) {
                  const currentCls = metrics.cls || 0;
                  updateMetrics({ cls: currentCls + (entry as any).value });
                }
                break;
              case 'navigation':
                const navEntry = entry as PerformanceNavigationTiming;
                updateMetrics({
                  ttfb: navEntry.responseStart - navEntry.fetchStart,
                  fcp: navEntry.loadEventEnd - navEntry.fetchStart
                });
                break;
            }
          }
        });

        // Observe different performance entry types
        try {
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          console.log('LCP not supported');
        }

        try {
          observer.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          console.log('FID not supported');
        }

        try {
          observer.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          console.log('CLS not supported');
        }

        try {
          observer.observe({ entryTypes: ['navigation'] });
        } catch (e) {
          console.log('Navigation timing not supported');
        }
      }

      // Fallback measurements using Navigation Timing API
      const measureBasicMetrics = () => {
        if ('performance' in window && 'getEntriesByType' in performance) {
          const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
          if (navEntries.length > 0) {
            const nav = navEntries[0];
            updateMetrics({
              ttfb: nav.responseStart - nav.fetchStart,
              fcp: nav.loadEventEnd - nav.fetchStart
            });
          }

          // Measure Time to Interactive (approximation)
          if (document.readyState === 'complete') {
            const loadComplete = performance.timing?.loadEventEnd - performance.timing?.navigationStart;
            if (loadComplete > 0) {
              updateMetrics({ tti: loadComplete });
            }
          }
        }
      };

      // Run initial measurement
      if (document.readyState === 'complete') {
        measureBasicMetrics();
      } else {
        window.addEventListener('load', measureBasicMetrics);
      }

      // Set loading to false after a reasonable time if no metrics are captured
      const timeout = setTimeout(() => {
        setPerformanceData(prev => ({ ...prev, isLoading: false }));
      }, 3000);

      return () => {
        if (observer) {
          observer.disconnect();
        }
        clearTimeout(timeout);
        window.removeEventListener('load', measureBasicMetrics);
      };

    } catch (error) {
      console.error('Performance monitoring error:', error);
      setPerformanceData(prev => ({
        ...prev,
        error: 'Failed to initialize performance monitoring',
        isLoading: false
      }));
    }
  }, []);

  // Helper function to format metrics for display
  const formatMetric = (value: number | undefined, unit: string = 'ms'): string => {
    if (value === undefined) return 'N/A';
    if (unit === 'ms') return `${Math.round(value)}ms`;
    if (unit === 's') return `${(value / 1000).toFixed(2)}s`;
    return value.toFixed(3);
  };

  // Helper function to get grade color
  const getGradeColor = (): string => {
    switch (performanceData.grade) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'needs-improvement': return 'text-orange-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Helper function to check if target is met
  const meetsTarget = (metric: 'lcp' | 'fid' | 'cls', value?: number): boolean => {
    if (value === undefined) return false;
    switch (metric) {
      case 'lcp': return value <= 2500; // 2.5s
      case 'fid': return value <= 100;  // 100ms
      case 'cls': return value <= 0.1;  // 0.1
      default: return false;
    }
  };

  return {
    ...performanceData,
    formatMetric,
    getGradeColor,
    meetsTarget,
    // Export raw metrics for external use
    lcpTarget: performanceData.metrics.lcp ? performanceData.metrics.lcp <= 2500 : null,
    fidTarget: performanceData.metrics.fid ? performanceData.metrics.fid <= 100 : null,
    clsTarget: performanceData.metrics.cls ? performanceData.metrics.cls <= 0.1 : null,
  };
}

// Standalone function to log performance data to console (for debugging)
export const logPerformanceMetrics = () => {
  if (typeof window === 'undefined') return;

  console.group('🚀 RVR AFC Performance Metrics');
  
  try {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      console.log('TTFB:', Math.round(navigation.responseStart - navigation.fetchStart), 'ms');
      console.log('Load Complete:', Math.round(navigation.loadEventEnd - navigation.fetchStart), 'ms');
    }

    const paintEntries = performance.getEntriesByName('first-contentful-paint');
    if (paintEntries.length > 0) {
      console.log('FCP:', Math.round(paintEntries[0].startTime), 'ms');
    }

    // Log any LCP entries
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      const latestLCP = lcpEntries[lcpEntries.length - 1];
      console.log('LCP:', Math.round(latestLCP.startTime), 'ms');
    }

  } catch (error) {
    console.log('Could not retrieve all performance metrics');
  }
  
  console.groupEnd();
};