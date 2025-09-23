/**
 * Optimized Homepage Data Hook
 * Enhanced version with performance optimizations, caching, and better loading states
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

interface LatestResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  matchDate: string;
  matchType: string;
  isHomeMatch: boolean;
  result: 'win' | 'loss' | 'draw';
}

interface NextFixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  matchTime: string;
  venue: string;
  matchType: string;
  isHomeMatch: boolean;
}

interface LatestNews {
  id: string;
  title: string;
  excerpt: string;
  publishDate: string;
  author: string;
  category: string;
  featured: boolean;
}

interface HomepageData {
  latestResult: LatestResult | null;
  nextFixture: NextFixture | null;
  latestNews: LatestNews | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Cache for homepage data with timestamp
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000) { // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  clear() {
    this.cache.clear();
  }
}

const cache = new DataCache();

export const useOptimizedHomepageData = (): HomepageData => {
  const [latestResult, setLatestResult] = useState<LatestResult | null>(null);
  const [nextFixture, setNextFixture] = useState<NextFixture | null>(null);
  const [latestNews, setLatestNews] = useState<LatestNews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Optimized data fetching with parallel requests and caching
  const fetchHomepageData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedResult = cache.get<LatestResult>('latestResult');
      const cachedFixture = cache.get<NextFixture>('nextFixture');
      const cachedNews = cache.get<LatestNews>('latestNews');

      if (cachedResult && cachedFixture && cachedNews) {
        setLatestResult(cachedResult);
        setNextFixture(cachedFixture);
        setLatestNews(cachedNews);
        setLoading(false);
        return;
      }

      // Parallel data fetching for better performance
      const [resultsResponse, fixturesResponse, newsResponse] = await Promise.allSettled([
        // Latest completed match
        supabase
          .from('matches')
          .select('*')
          .not('home_score', 'is', null)
          .not('away_score', 'is', null)
          .order('scheduled_date', { ascending: false })
          .limit(1),
        
        // Next upcoming match
        supabase
          .from('matches')
          .select('*')
          .is('home_score', null)
          .is('away_score', null)
          .gte('scheduled_date', new Date().toISOString().split('T')[0])
          .order('scheduled_date', { ascending: true })
          .limit(1),
        
        // Latest published news
        supabase
          .from('news_articles')
          .select('*')
          .eq('status', 'published')
          .order('publish_date', { ascending: false })
          .limit(1)
      ]);

      // Process latest result
      if (resultsResponse.status === 'fulfilled' && resultsResponse.value.data && resultsResponse.value.data.length > 0) {
        const match = resultsResponse.value.data[0];
        const result: LatestResult = {
          id: match.id,
          homeTeam: match.home_team,
          awayTeam: match.away_team,
          homeScore: match.home_score,
          awayScore: match.away_score,
          matchDate: match.scheduled_date,
          matchType: match.competition || 'League',
          isHomeMatch: match.home_team.toLowerCase().includes('rivervalley') || match.home_team.toLowerCase().includes('rvr'),
          result: match.home_score > match.away_score ? 'win' : match.home_score < match.away_score ? 'loss' : 'draw'
        };
        setLatestResult(result);
        cache.set('latestResult', result, 10 * 60 * 1000); // 10 minutes cache
      } else {
        // Demo data fallback
        const demoResult: LatestResult = {
          id: 'demo-result',
          homeTeam: 'Rivervalley Rangers',
          awayTeam: 'Swords Celtic',
          homeScore: 3,
          awayScore: 1,
          matchDate: '2025-01-18',
          matchType: 'League Division 3',
          isHomeMatch: true,
          result: 'win'
        };
        setLatestResult(demoResult);
        cache.set('latestResult', demoResult, 5 * 60 * 1000); // 5 minutes cache for demo
      }

      // Process next fixture
      if (fixturesResponse.status === 'fulfilled' && fixturesResponse.value.data && fixturesResponse.value.data.length > 0) {
        const match = fixturesResponse.value.data[0];
        const fixture: NextFixture = {
          id: match.id,
          homeTeam: match.home_team,
          awayTeam: match.away_team,
          matchDate: match.scheduled_date,
          matchTime: match.scheduled_time || '15:00',
          venue: match.venue || 'TBD',
          matchType: match.competition || 'League',
          isHomeMatch: match.home_team.toLowerCase().includes('rivervalley') || match.home_team.toLowerCase().includes('rvr')
        };
        setNextFixture(fixture);
        cache.set('nextFixture', fixture, 15 * 60 * 1000); // 15 minutes cache
      } else {
        // Demo data fallback
        const demoFixture: NextFixture = {
          id: 'demo-fixture',
          homeTeam: 'Rivervalley Rangers',
          awayTeam: 'Malahide United',
          matchDate: '2025-01-25',
          matchTime: '15:00',
          venue: 'Ward River Valley Park',
          matchType: 'League Division 3',
          isHomeMatch: true
        };
        setNextFixture(demoFixture);
        cache.set('nextFixture', demoFixture, 5 * 60 * 1000);
      }

      // Process latest news
      if (newsResponse.status === 'fulfilled' && newsResponse.value.data && newsResponse.value.data.length > 0) {
        const article = newsResponse.value.data[0];
        const news: LatestNews = {
          id: article.id,
          title: article.title,
          excerpt: article.excerpt,
          publishDate: article.publish_date,
          author: article.author,
          category: article.category,
          featured: article.featured
        };
        setLatestNews(news);
        cache.set('latestNews', news, 10 * 60 * 1000); // 10 minutes cache
      } else {
        // Demo data fallback
        const demoNews: LatestNews = {
          id: 'demo-news',
          title: 'New Season Training Begins',
          excerpt: 'Exciting news as we kick off preparations for the upcoming season with renewed energy and ambition.',
          publishDate: '2025-01-20',
          author: 'Club Secretary',
          category: 'club_news',
          featured: true
        };
        setLatestNews(demoNews);
        cache.set('latestNews', demoNews, 5 * 60 * 1000);
      }

    } catch (err) {
      console.error('Error fetching homepage data:', err);
      setError('Failed to load latest updates. Please refresh the page.');
      
      // Set fallback demo data on error
      setLatestResult({
        id: 'demo-result',
        homeTeam: 'Rivervalley Rangers',
        awayTeam: 'Swords Celtic',
        homeScore: 3,
        awayScore: 1,
        matchDate: '2025-01-18',
        matchType: 'League Division 3',
        isHomeMatch: true,
        result: 'win'
      });
      
      setNextFixture({
        id: 'demo-fixture',
        homeTeam: 'Rivervalley Rangers',
        awayTeam: 'Malahide United',
        matchDate: '2025-01-25',
        matchTime: '15:00',
        venue: 'Ward River Valley Park',
        matchType: 'League Division 3',
        isHomeMatch: true
      });
      
      setLatestNews({
        id: 'demo-news',
        title: 'New Season Training Begins',
        excerpt: 'Exciting news as we kick off preparations for the upcoming season with renewed energy and ambition.',
        publishDate: '2025-01-20',
        author: 'Club Secretary',
        category: 'club_news',
        featured: true
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);

  // Memoized return value for performance
  return useMemo(() => ({
    latestResult,
    nextFixture,
    latestNews,
    loading,
    error,
    refetch: fetchHomepageData
  }), [latestResult, nextFixture, latestNews, loading, error, fetchHomepageData]);
};

// Utility functions for date/time formatting
export const formatMatchDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  } catch {
    return dateString;
  }
};

export const formatMatchTime = (timeString: string): string => {
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-IE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return timeString;
  }
};

export const getRelativeTimeToMatch = (dateString: string, timeString?: string): string => {
  try {
    const matchDateTime = new Date(`${dateString}T${timeString || '15:00'}`);
    const now = new Date();
    const diffMs = matchDateTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
    return matchDateTime.toLocaleDateString('en-IE');
  } catch {
    return dateString;
  }
};