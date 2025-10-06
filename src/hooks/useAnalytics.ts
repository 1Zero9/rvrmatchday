/**
 * 📊 Analytics Hook for Mobile App
 * 
 * Tracks user behavior, performance metrics, and engagement
 * Provides insights for mobile experience optimization
 */

import { useEffect, useRef, useState } from 'react';

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface UserSession {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: AnalyticsEvent[];
  userAgent: string;
  screenSize: string;
  referrer: string;
  isReturning: boolean;
}

interface AnalyticsMetrics {
  sessionDuration: number;
  pageViews: number;
  bounceRate: number;
  engagement: 'low' | 'medium' | 'high';
  conversionFunnel: {
    homeViews: number;
    fixtureViews: number;
    resultViews: number;
    teamViews: number;
    loginAttempts: number;
  };
}

export default function useAnalytics() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isTracking, setIsTracking] = useState(true);
  const sessionRef = useRef<UserSession | null>(null);
  const lastEventTime = useRef<number>(Date.now());

  // Initialize session
  useEffect(() => {
    if (!isTracking) return;

    const sessionId = generateSessionId();
    const isReturning = localStorage.getItem('rvr-analytics-returning') === 'true';
    
    const newSession: UserSession = {
      sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: [],
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      referrer: document.referrer,
      isReturning
    };

    setSession(newSession);
    sessionRef.current = newSession;

    // Mark as returning user
    localStorage.setItem('rvr-analytics-returning', 'true');

    // Track session start
    trackEvent('session', 'start', 'mobile_app', {
      isReturning,
      screenSize: newSession.screenSize,
      userAgent: newSession.userAgent
    });

    // Setup session persistence
    const saveSession = () => {
      if (sessionRef.current) {
        localStorage.setItem('rvr-analytics-session', JSON.stringify(sessionRef.current));
      }
    };

    // Save session periodically and on unload
    const intervalId = setInterval(saveSession, 30000); // Every 30 seconds
    window.addEventListener('beforeunload', saveSession);
    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', saveSession);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      saveSession();
    };
  }, [isTracking]);

  // Handle visibility changes (tab switching, app backgrounding)
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      trackEvent('engagement', 'return', 'tab_focus');
      updateLastActivity();
    } else {
      trackEvent('engagement', 'leave', 'tab_blur');
    }
  };

  // Generate unique session ID
  const generateSessionId = (): string => {
    return `rvr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Update last activity time
  const updateLastActivity = () => {
    const now = Date.now();
    lastEventTime.current = now;
    
    if (sessionRef.current) {
      sessionRef.current.lastActivity = now;
      setSession({ ...sessionRef.current });
    }
  };

  // Core tracking function
  const trackEvent = (
    category: string,
    action: string,
    label?: string,
    metadata?: Record<string, any>,
    value?: number
  ) => {
    if (!isTracking || !sessionRef.current) return;

    const event: AnalyticsEvent = {
      event: `${category}_${action}`,
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: sessionRef.current.sessionId,
      metadata
    };

    // Add to session events
    sessionRef.current.events.push(event);
    updateLastActivity();

    // Log to console for development
    console.log('📊 Analytics Event:', {
      category,
      action,
      label,
      metadata,
      value
    });

    // Here you would normally send to analytics service
    // sendToAnalyticsService(event);
  };

  // Track page views
  const trackPageView = (page: string, additionalData?: Record<string, any>) => {
    if (!sessionRef.current) return;

    sessionRef.current.pageViews++;
    trackEvent('navigation', 'page_view', page, {
      pageNumber: sessionRef.current.pageViews,
      ...additionalData
    });
  };

  // Track user interactions
  const trackInteraction = (element: string, action: string, context?: string) => {
    trackEvent('interaction', action, element, { context });
  };

  // Track performance metrics
  const trackPerformance = (metric: string, value: number, category: 'lcp' | 'fid' | 'cls' | 'custom') => {
    trackEvent('performance', metric, category, { value }, value);
  };

  // Track conversion funnel events
  const trackConversion = (step: string, success: boolean, metadata?: Record<string, any>) => {
    trackEvent('conversion', success ? 'complete' : 'abandon', step, metadata);
  };

  // Track errors
  const trackError = (error: string, context: string, metadata?: Record<string, any>) => {
    trackEvent('error', 'occurred', error, { context, ...metadata });
  };

  // Calculate session metrics
  const getSessionMetrics = (): AnalyticsMetrics | null => {
    if (!sessionRef.current) return null;

    const sessionDuration = Date.now() - sessionRef.current.startTime;
    const events = sessionRef.current.events;
    
    // Calculate engagement based on session duration and interactions
    let engagement: 'low' | 'medium' | 'high' = 'low';
    if (sessionDuration > 180000 && events.length > 10) engagement = 'high'; // 3+ minutes, 10+ events
    else if (sessionDuration > 60000 && events.length > 5) engagement = 'medium'; // 1+ minute, 5+ events

    // Calculate conversion funnel
    const conversionFunnel = {
      homeViews: events.filter(e => e.label === 'home').length,
      fixtureViews: events.filter(e => e.label === 'fixtures').length,
      resultViews: events.filter(e => e.label === 'results').length,
      teamViews: events.filter(e => e.label === 'teams').length,
      loginAttempts: events.filter(e => e.category === 'auth' && e.action === 'attempt').length
    };

    // Calculate bounce rate (single page session < 30 seconds)
    const bounceRate = sessionRef.current.pageViews === 1 && sessionDuration < 30000 ? 1 : 0;

    return {
      sessionDuration,
      pageViews: sessionRef.current.pageViews,
      bounceRate,
      engagement,
      conversionFunnel
    };
  };

  // Get user journey insights
  const getUserJourney = () => {
    if (!sessionRef.current) return [];

    return sessionRef.current.events
      .filter(event => event.category === 'navigation')
      .map(event => ({
        page: event.label,
        timestamp: event.timestamp,
        duration: 0 // Could calculate time on page
      }));
  };

  // Export session data for analysis
  const exportSessionData = () => {
    if (!sessionRef.current) return null;

    return {
      session: sessionRef.current,
      metrics: getSessionMetrics(),
      journey: getUserJourney()
    };
  };

  // Clear analytics data (GDPR compliance)
  const clearAnalyticsData = () => {
    localStorage.removeItem('rvr-analytics-session');
    localStorage.removeItem('rvr-analytics-returning');
    setSession(null);
    sessionRef.current = null;
    setIsTracking(false);
  };

  // Enable/disable tracking
  const setTrackingEnabled = (enabled: boolean) => {
    setIsTracking(enabled);
    if (!enabled) {
      clearAnalyticsData();
    }
  };

  return {
    // Core tracking functions
    trackEvent,
    trackPageView,
    trackInteraction,
    trackPerformance,
    trackConversion,
    trackError,
    
    // Data and insights
    session,
    getSessionMetrics,
    getUserJourney,
    exportSessionData,
    
    // Privacy controls
    clearAnalyticsData,
    setTrackingEnabled,
    isTracking,
    
    // Convenience methods
    updateLastActivity
  };
}

// Analytics context for custom events
export const AnalyticsEvents = {
  // Navigation events
  SCREEN_VIEW: (screen: string) => ({ category: 'navigation', action: 'screen_view', label: screen }),
  BACK_NAVIGATION: (from: string) => ({ category: 'navigation', action: 'back', label: from }),
  
  // Interaction events
  BUTTON_CLICK: (button: string) => ({ category: 'interaction', action: 'click', label: button }),
  CARD_TAP: (card: string) => ({ category: 'interaction', action: 'tap', label: card }),
  HERO_INTERACTION: (action: string) => ({ category: 'interaction', action, label: 'next_match_hero' }),
  
  // Engagement events
  CREST_ANIMATION: (action: 'view' | 'skip') => ({ category: 'engagement', action, label: 'crest_animation' }),
  SESSION_DURATION: (minutes: number) => ({ category: 'engagement', action: 'duration', value: minutes }),
  
  // Performance events
  LCP_MEASUREMENT: (value: number) => ({ category: 'performance', action: 'lcp', value }),
  ERROR_BOUNDARY: (error: string) => ({ category: 'error', action: 'boundary', label: error }),
  
  // Conversion events
  DESKTOP_REDIRECT: () => ({ category: 'conversion', action: 'desktop_click', label: 'cta_button' }),
  LOGIN_ATTEMPT: (success: boolean) => ({ category: 'conversion', action: success ? 'login_success' : 'login_fail' }),
  PWA_INSTALL: (action: 'prompt' | 'accept' | 'dismiss') => ({ category: 'conversion', action, label: 'pwa_install' })
};

// Hook for tracking specific mobile app events
export function useMobileAnalytics() {
  const analytics = useAnalytics();

  const trackMobileEvent = (eventType: keyof typeof AnalyticsEvents, ...args: any[]) => {
    const event = AnalyticsEvents[eventType](...args);
    analytics.trackEvent(event.category, event.action, event.label, undefined, event.value);
  };

  return {
    ...analytics,
    trackMobileEvent
  };
}