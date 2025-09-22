/**
 * Homepage Dynamic Data Hook
 * Fetches real data for the 3 hero boxes: Latest Result, Next Fixture, Latest News
 */

import { useState, useEffect } from 'react';
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
  category: string;
  author: string;
}

interface HomepageData {
  latestResult: LatestResult | null;
  nextFixture: NextFixture | null;
  latestNews: LatestNews | null;
  loading: boolean;
  error: string | null;
}

export function useHomepageData(): HomepageData {
  const [data, setData] = useState<HomepageData>({
    latestResult: null,
    nextFixture: null,
    latestNews: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    async function fetchHomepageData() {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch latest completed match result
        const { data: latestMatch, error: matchError } = await supabase
          .from('matches')
          .select(`
            id,
            team_id,
            opponent_team_id,
            opponent,
            home_score,
            away_score,
            scheduled_date,
            venue,
            status,
            is_home_match,
            match_type,
            teams!matches_team_id_fkey(name),
            opponent_team:teams!matches_opponent_team_id_fkey(name)
          `)
          .eq('status', 'Finished')
          .not('home_score', 'is', null)
          .not('away_score', 'is', null)
          .order('scheduled_date', { ascending: false })
          .limit(1);

        // Fetch next upcoming fixture
        const { data: nextMatch, error: fixtureError } = await supabase
          .from('matches')
          .select(`
            id,
            team_id,
            opponent_team_id,
            opponent,
            scheduled_date,
            venue,
            status,
            is_home_match,
            match_type,
            teams!matches_team_id_fkey(name),
            opponent_team:teams!matches_opponent_team_id_fkey(name)
          `)
          .in('status', ['Scheduled', 'Confirmed'])
          .gte('scheduled_date', new Date().toISOString().split('T')[0])
          .order('scheduled_date', { ascending: true })
          .limit(1);

        // Fetch latest news article (handle missing table gracefully)
        let latestNewsData = null;
        let newsError = null;
        try {
          const { data, error } = await supabase
            .from('news_articles')
            .select(`
              id,
              title,
              excerpt,
              content,
              publish_date,
              category,
              author,
              status
            `)
            .eq('status', 'published')
            .order('publish_date', { ascending: false })
            .limit(1);
          
          latestNewsData = data;
          newsError = error;
        } catch (error) {
          console.log('News table not available, using fallback news');
          // Use fallback news data
          latestNewsData = [{
            id: 'fallback-1',
            title: 'Welcome to RVR FC',
            excerpt: 'Stay tuned for the latest club news and updates',
            publish_date: new Date().toISOString(),
            category: 'Club News',
            author: 'RVR FC'
          }];
        }

        if (matchError) {
          console.error('Error fetching latest match:', matchError);
        }

        if (fixtureError) {
          console.error('Error fetching next fixture:', fixtureError);
        }

        if (newsError) {
          console.error('Error fetching latest news:', newsError);
        }

        // Process latest result
        let latestResult: LatestResult | null = null;
        if (latestMatch && latestMatch.length > 0) {
          const match = latestMatch[0];
          
          // Determine team names
          const ourTeamName = match.teams?.name || 'Our Team';
          const opponentName = match.opponent_team?.name || match.opponent || 'Opponent';
          
          // For display purposes, show home vs away based on is_home_match
          const homeTeam = match.is_home_match ? ourTeamName : opponentName;
          const awayTeam = match.is_home_match ? opponentName : ourTeamName;
          
          // Determine result from our team's perspective
          let result: 'win' | 'loss' | 'draw' = 'draw';
          if (match.home_score !== match.away_score) {
            if (match.is_home_match) {
              // We were home team
              result = match.home_score > match.away_score ? 'win' : 'loss';
            } else {
              // We were away team
              result = match.away_score > match.home_score ? 'win' : 'loss';
            }
          }

          latestResult = {
            id: match.id,
            homeTeam,
            awayTeam,
            homeScore: match.home_score || 0,
            awayScore: match.away_score || 0,
            matchDate: match.scheduled_date,
            matchType: match.match_type || 'League',
            isHomeMatch: match.is_home_match,
            result
          };
        }

        // Process next fixture
        let nextFixture: NextFixture | null = null;
        if (nextMatch && nextMatch.length > 0) {
          const match = nextMatch[0];
          
          // Determine team names
          const ourTeamName = match.teams?.name || 'Our Team';
          const opponentName = match.opponent_team?.name || match.opponent || 'Opponent';
          
          // For display purposes, show home vs away based on is_home_match
          const homeTeam = match.is_home_match ? ourTeamName : opponentName;
          const awayTeam = match.is_home_match ? opponentName : ourTeamName;

          nextFixture = {
            id: match.id,
            homeTeam,
            awayTeam,
            matchDate: match.scheduled_date,
            matchTime: '15:00', // Default time, schema doesn't seem to have separate time field
            venue: match.venue || 'TBD',
            matchType: match.match_type || 'League',
            isHomeMatch: match.is_home_match
          };
        }

        // Process latest news
        let latestNews: LatestNews | null = null;
        if (latestNewsData && latestNewsData.length > 0) {
          const news = latestNewsData[0];
          latestNews = {
            id: news.id,
            title: news.title,
            excerpt: news.excerpt || news.content?.substring(0, 100) + '...' || '',
            publishDate: news.publish_date,
            category: news.category || 'Club News',
            author: news.author || 'RVR FC'
          };
        }

        setData({
          latestResult,
          nextFixture,
          latestNews,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load data'
        }));
      }
    }

    fetchHomepageData();
  }, []);

  return data;
}

// Helper function to format date for display
export function formatMatchDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else if (date > today) {
    return date.toLocaleDateString('en-IE', { 
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    });
  } else {
    return date.toLocaleDateString('en-IE', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  }
}

// Helper function to format time
export function formatMatchTime(timeString: string): string {
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return date.toLocaleTimeString('en-IE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return timeString;
  }
}