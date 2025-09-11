/**
 * ⚽ MATCHDAY MODULE
 * Live match tracking and results management
 * 
 * Business Module: €19-39/month
 * Target: Match secretaries, team managers, fans
 */

// MatchDay components (existing ones that relate to this module)
// TODO: Move these to the matchday module structure
// export { default as MatchRecorder } from '../../components/MatchRecorder';
// export { default as LiveScore } from '../../components/LiveScore';
// export { default as FixtureManager } from '../../components/FixtureManager';

// Module configuration
export const MATCHDAY_MODULE_CONFIG = {
  id: 'matchday',
  name: 'MatchDay Live',
  version: '1.0.0',
  description: 'Live match tracking, results management, and fixture scheduling',
  category: 'premium' as const,
  
  // Business model
  pricing: {
    monthly: 39,
    annual: 399,
    currency: 'EUR'
  },
  
  // Features included
  features: [
    'Live match scoring and tracking',
    'Real-time result updates',
    'Fixture management and scheduling',
    'Team lineup management',
    'Substitution tracking',
    'Basic match statistics',
    'Public results display',
    'League table integration',
    'Match report generation',
    'SMS notifications (premium)'
  ],
  
  // Target audience
  targetUsers: [
    'Match secretaries',
    'Team managers',
    'Coaches',
    'Club officials',
    'Fans and supporters'
  ],
  
  // Routes managed by this module
  routes: [
    '/matchday',
    '/match-central',
    '/fixtures',
    '/results',
    '/live/*'
  ],
  
  // Components provided
  components: [
    'MatchRecorder',
    'LiveScore',
    'FixtureManager',
    'TeamLineup',
    'MatchTimer',
    'ScoreBoard',
    'MatchEvents'
  ],
  
  // Dependencies
  dependencies: [], // Can work standalone
  
  // Module status
  status: 'active',
  lastUpdated: new Date().toISOString()
};

// Match data interfaces
export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal';
  player: string;
  team: 'home' | 'away';
  minute: number;
  description?: string;
  timestamp: string;
}

export interface MatchData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled';
  kickoff: string;
  venue?: string;
  events: MatchEvent[];
  lineup?: {
    home: string[];
    away: string[];
  };
  substitutions?: {
    home: Array<{ out: string; in: string; minute: number }>;
    away: Array<{ out: string; in: string; minute: number }>;
  };
}

// MatchDay utilities
export const createMatch = (homeTeam: string, awayTeam: string, kickoff: string): MatchData => {
  return {
    id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    homeTeam,
    awayTeam,
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    kickoff,
    events: [],
    lineup: { home: [], away: [] },
    substitutions: { home: [], away: [] }
  };
};

export const addMatchEvent = (match: MatchData, event: Omit<MatchEvent, 'id' | 'timestamp'>): MatchData => {
  const newEvent: MatchEvent = {
    ...event,
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  
  const updatedMatch = { ...match };
  updatedMatch.events.push(newEvent);
  
  // Update score if it's a goal
  if (event.type === 'goal') {
    if (event.team === 'home') {
      updatedMatch.homeScore += 1;
    } else {
      updatedMatch.awayScore += 1;
    }
  }
  
  return updatedMatch;
};

export const getMatchStatistics = (match: MatchData) => {
  const homeGoals = match.events.filter(e => e.type === 'goal' && e.team === 'home').length;
  const awayGoals = match.events.filter(e => e.type === 'goal' && e.team === 'away').length;
  const homeCards = match.events.filter(e => (e.type === 'yellow_card' || e.type === 'red_card') && e.team === 'home').length;
  const awayCards = match.events.filter(e => (e.type === 'yellow_card' || e.type === 'red_card') && e.team === 'away').length;
  
  return {
    goals: { home: homeGoals, away: awayGoals },
    cards: { home: homeCards, away: awayCards },
    totalEvents: match.events.length,
    duration: match.status === 'completed' ? '90+' : 'Live'
  };
};

// Live match utilities
export const isMatchLive = (match: MatchData): boolean => {
  return match.status === 'live';
};

export const getMatchMinute = (kickoffTime: string): number => {
  if (!kickoffTime) return 0;
  const kickoff = new Date(kickoffTime);
  const now = new Date();
  const diffMs = now.getTime() - kickoff.getTime();
  const minutes = Math.floor(diffMs / 60000);
  return Math.max(0, Math.min(120, minutes)); // Cap at 120 minutes
};

// MatchDay analytics
export const trackMatchEvent = (event: string, matchId: string, properties?: Record<string, any>) => {
  console.log('MatchDay Event:', event, { matchId, ...properties });
};

// League table utilities
export const calculateLeaguePosition = (results: MatchData[], teamName: string) => {
  let points = 0;
  let played = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;
  
  results.filter(match => 
    (match.homeTeam === teamName || match.awayTeam === teamName) && 
    match.status === 'completed'
  ).forEach(match => {
    played++;
    const isHome = match.homeTeam === teamName;
    const ownScore = isHome ? match.homeScore : match.awayScore;
    const oppScore = isHome ? match.awayScore : match.homeScore;
    
    goalsFor += ownScore;
    goalsAgainst += oppScore;
    
    if (ownScore > oppScore) {
      wins++;
      points += 3;
    } else if (ownScore === oppScore) {
      draws++;
      points += 1;
    } else {
      losses++;
    }
  });
  
  return {
    team: teamName,
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    points
  };
};

// Module initialization
export const initializeMatchDayModule = (config?: Partial<typeof MATCHDAY_MODULE_CONFIG>) => {
  console.log('🚀 MatchDay Module initialized:', MATCHDAY_MODULE_CONFIG.name);
  
  // MatchDay-specific initialization
  if (typeof window !== 'undefined') {
    // Add MatchDay-specific CSS classes
    document.documentElement.classList.add('matchday-module-active');
    
    // Initialize real-time updates (WebSocket connections, etc.)
    // TODO: Set up WebSocket for live match updates
    
    // Initialize MatchDay analytics
    trackMatchEvent('module_initialized', 'system', {
      version: MATCHDAY_MODULE_CONFIG.version,
      timestamp: new Date().toISOString()
    });
  }
  
  return MATCHDAY_MODULE_CONFIG;
};