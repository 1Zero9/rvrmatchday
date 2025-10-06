/**
 * 🎯 Performance Testing Utilities
 * 
 * Measures and analyzes Core Web Vitals for optimization
 * Provides baseline measurements and improvement tracking
 */

interface PerformanceBaseline {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  fcp: number | null;
  timestamp: string;
  userAgent: string;
  url: string;
}

class PerformanceTester {
  private baseline: PerformanceBaseline | null = null;
  
  // Measure current performance metrics
  async measurePerformance(): Promise<PerformanceBaseline> {
    return new Promise((resolve) => {
      const baseline: PerformanceBaseline = {
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null,
        fcp: null,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      // Measure TTFB and FCP from Navigation Timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        baseline.ttfb = navigation.responseStart - navigation.fetchStart;
        baseline.fcp = navigation.loadEventEnd - navigation.fetchStart;
      }

      // Use Performance Observer for Core Web Vitals
      let metricsCollected = 0;
      const totalMetrics = 3; // LCP, FID, CLS

      const checkComplete = () => {
        if (metricsCollected >= totalMetrics) {
          resolve(baseline);
        }
      };

      // LCP Observer
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            baseline.lcp = entries[entries.length - 1].startTime;
            metricsCollected++;
            checkComplete();
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.log('LCP measurement not supported');
        metricsCollected++;
        checkComplete();
      }

      // FID Observer
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const entry = entries[0] as any;
            baseline.fid = entry.processingStart - entry.startTime;
            metricsCollected++;
            checkComplete();
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.log('FID measurement not supported');
        metricsCollected++;
        checkComplete();
      }

      // CLS Observer
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as any;
            if (!layoutShift.hadRecentInput) {
              clsValue += layoutShift.value;
            }
          }
          baseline.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
        // CLS is measured over time, so we'll consider it collected after a delay
        setTimeout(() => {
          metricsCollected++;
          checkComplete();
        }, 2000);
      } catch (e) {
        console.log('CLS measurement not supported');
        metricsCollected++;
        checkComplete();
      }

      // Fallback timeout
      setTimeout(() => {
        resolve(baseline);
      }, 5000);
    });
  }

  // Grade performance based on Core Web Vitals thresholds
  gradePerformance(metrics: PerformanceBaseline): {
    overall: 'excellent' | 'good' | 'needs-improvement' | 'poor';
    scores: {
      lcp: 'excellent' | 'good' | 'poor' | 'unknown';
      fid: 'excellent' | 'good' | 'poor' | 'unknown';
      cls: 'excellent' | 'good' | 'poor' | 'unknown';
    };
    recommendations: string[];
  } {
    const scores = {
      lcp: this.gradeLCP(metrics.lcp),
      fid: this.gradeFID(metrics.fid),
      cls: this.gradeCLS(metrics.cls)
    };

    // Calculate overall grade
    const goodMetrics = Object.values(scores).filter(score => 
      score === 'excellent' || score === 'good'
    ).length;
    
    let overall: 'excellent' | 'good' | 'needs-improvement' | 'poor';
    if (goodMetrics === 3) overall = 'excellent';
    else if (goodMetrics >= 2) overall = 'good';
    else if (goodMetrics >= 1) overall = 'needs-improvement';
    else overall = 'poor';

    // Generate recommendations
    const recommendations = this.generateRecommendations(metrics, scores);

    return { overall, scores, recommendations };
  }

  private gradeLCP(lcp: number | null): 'excellent' | 'good' | 'poor' | 'unknown' {
    if (lcp === null) return 'unknown';
    if (lcp <= 2500) return 'excellent'; // ≤ 2.5s
    if (lcp <= 4000) return 'good';       // ≤ 4.0s
    return 'poor';                        // > 4.0s
  }

  private gradeFID(fid: number | null): 'excellent' | 'good' | 'poor' | 'unknown' {
    if (fid === null) return 'unknown';
    if (fid <= 100) return 'excellent';   // ≤ 100ms
    if (fid <= 300) return 'good';        // ≤ 300ms
    return 'poor';                        // > 300ms
  }

  private gradeCLS(cls: number | null): 'excellent' | 'good' | 'poor' | 'unknown' {
    if (cls === null) return 'unknown';
    if (cls <= 0.1) return 'excellent';   // ≤ 0.1
    if (cls <= 0.25) return 'good';       // ≤ 0.25
    return 'poor';                        // > 0.25
  }

  private generateRecommendations(
    metrics: PerformanceBaseline, 
    scores: any
  ): string[] {
    const recommendations: string[] = [];

    if (scores.lcp === 'poor' || scores.lcp === 'good') {
      recommendations.push('🎯 Optimize Largest Contentful Paint: Consider image optimization, preloading critical resources');
    }

    if (scores.fid === 'poor' || scores.fid === 'good') {
      recommendations.push('⚡ Improve First Input Delay: Reduce JavaScript execution time, use code splitting');
    }

    if (scores.cls === 'poor' || scores.cls === 'good') {
      recommendations.push('🎨 Fix Cumulative Layout Shift: Set explicit dimensions for images and ads');
    }

    if (metrics.ttfb && metrics.ttfb > 800) {
      recommendations.push('🚀 Optimize Time to First Byte: Improve server response time or use CDN');
    }

    return recommendations;
  }

  // Log comprehensive performance report
  logPerformanceReport(metrics: PerformanceBaseline): void {
    const analysis = this.gradePerformance(metrics);
    
    console.group('🎯 RVR AFC Performance Report');
    console.log('📅 Timestamp:', metrics.timestamp);
    console.log('🌐 URL:', metrics.url);
    console.log('📱 User Agent:', metrics.userAgent.substring(0, 80) + '...');
    console.log('');
    
    console.group('📊 Core Web Vitals');
    console.log(`🎯 LCP: ${metrics.lcp ? `${(metrics.lcp / 1000).toFixed(2)}s` : 'N/A'} (${analysis.scores.lcp})`);
    console.log(`⚡ FID: ${metrics.fid ? `${metrics.fid.toFixed(0)}ms` : 'N/A'} (${analysis.scores.fid})`);
    console.log(`🎨 CLS: ${metrics.cls ? metrics.cls.toFixed(3) : 'N/A'} (${analysis.scores.cls})`);
    console.groupEnd();

    console.group('⏱️ Other Metrics');
    console.log(`🚀 TTFB: ${metrics.ttfb ? `${metrics.ttfb.toFixed(0)}ms` : 'N/A'}`);
    console.log(`🎨 FCP: ${metrics.fcp ? `${(metrics.fcp / 1000).toFixed(2)}s` : 'N/A'}`);
    console.groupEnd();

    console.log(`🏆 Overall Grade: ${analysis.overall.toUpperCase()}`);

    if (analysis.recommendations.length > 0) {
      console.group('💡 Recommendations');
      analysis.recommendations.forEach(rec => console.log(rec));
      console.groupEnd();
    }

    console.groupEnd();
  }

  // Store baseline for comparison
  setBaseline(metrics: PerformanceBaseline): void {
    this.baseline = metrics;
    localStorage.setItem('rvr-performance-baseline', JSON.stringify(metrics));
  }

  // Get stored baseline
  getBaseline(): PerformanceBaseline | null {
    if (this.baseline) return this.baseline;
    
    const stored = localStorage.getItem('rvr-performance-baseline');
    if (stored) {
      this.baseline = JSON.parse(stored);
      return this.baseline;
    }
    
    return null;
  }

  // Compare current performance with baseline
  async compareWithBaseline(): Promise<{
    current: PerformanceBaseline;
    baseline: PerformanceBaseline | null;
    improvements: string[];
    regressions: string[];
  }> {
    const current = await this.measurePerformance();
    const baseline = this.getBaseline();
    
    const improvements: string[] = [];
    const regressions: string[] = [];

    if (baseline) {
      // Compare LCP
      if (current.lcp && baseline.lcp) {
        const diff = current.lcp - baseline.lcp;
        if (diff < -100) improvements.push(`LCP improved by ${Math.abs(diff).toFixed(0)}ms`);
        else if (diff > 100) regressions.push(`LCP regressed by ${diff.toFixed(0)}ms`);
      }

      // Compare FID
      if (current.fid && baseline.fid) {
        const diff = current.fid - baseline.fid;
        if (diff < -10) improvements.push(`FID improved by ${Math.abs(diff).toFixed(0)}ms`);
        else if (diff > 10) regressions.push(`FID regressed by ${diff.toFixed(0)}ms`);
      }

      // Compare CLS
      if (current.cls && baseline.cls) {
        const diff = current.cls - baseline.cls;
        if (diff < -0.05) improvements.push(`CLS improved by ${Math.abs(diff).toFixed(3)}`);
        else if (diff > 0.05) regressions.push(`CLS regressed by ${diff.toFixed(3)}`);
      }
    }

    return { current, baseline, improvements, regressions };
  }
}

// Export singleton instance
export const performanceTester = new PerformanceTester();

// Helper function for quick performance measurement
export const measurePerformanceNow = () => performanceTester.measurePerformance();

// Helper function for logging performance report
export const logPerformanceReport = () => {
  performanceTester.measurePerformance().then(metrics => {
    performanceTester.logPerformanceReport(metrics);
  });
};