/**
 * Match Tracker Data Types
 * RVR Football Club - Match Tracking System
 */

// User Roles and Permissions
export type UserRole = 'admin' | 'coach' | 'assistant' | 'parent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  teamIds: string[]; // Teams this user has access to
  createdAt: Date;
  updatedAt: Date;
}

// Team Management (U12+ only)
export type AgeGroup = 'U12' | 'U13' | 'U14' | 'U15' | 'U16' | 'U17' | 'U18' | 'Senior';

export interface Team {
  id: string;
  name: string;
  ageGroup?: AgeGroup | string;
  gender?: 'Boys' | 'Girls' | 'Mixed' | 'Male' | 'Female';
  coachIds?: string[];
  assistantCoachIds?: string[];
  season?: string; // e.g., "2024-25"
  league?: string;
  homeKit?: {
    primary: string;
    secondary: string;
  };
  awayKit?: {
    primary: string;
    secondary: string;
  };
  
  // Additional fields for opponent teams and admin management
  isOpponent?: boolean;
  homeVenue?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  players?: Player[];
  
  createdAt?: Date;
  updatedAt?: Date;
}

// Player Management
export interface Player {
  id: string;
  teamId?: string;
  name: string;
  jerseyNumber?: number;
  shirtNumber?: number;
  number?: number; // For compatibility with existing data
  position?: 'GK' | 'DEF' | 'MID' | 'FWD' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward' | string;
  dateOfBirth?: Date;
  parentContact?: {
    name: string;
    email: string;
    phone: string;
  };
  // Compatibility with existing storage format
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  
  role?: 'player' | 'substitute' | 'coach';
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Match Management
export type MatchType = 'League' | 'Cup' | 'Friendly' | 'Tournament';
export type MatchStatus = 'Scheduled' | 'Live' | 'Finished' | 'Cancelled' | 'Postponed';

export interface Match {
  id: string;
  teamId: string;
  opponent: string;
  matchType: MatchType;
  isHomeMatch: boolean;
  venue: string;
  scheduledDate: Date;
  actualKickOff?: Date;
  status: MatchStatus;
  
  // Match Officials
  referee?: string;
  assistantReferees?: string[];
  
  // Weather & Conditions
  weather?: string;
  temperature?: number;
  pitchCond: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  
  // Result
  homeScore?: number;
  awayScore?: number;
  
  // VEO Recording Integration
  veoRecording?: boolean;
  veoUrl?: string;
  
  // Match Statistics (optional - for post-match entry)
  playerOfTheMatch?: string;
  yellowCards?: string; // Comma-separated player names
  redCards?: string; // Comma-separated player names
  attendance?: number;
  notes?: string;
  selectedSquad?: string[]; // Player IDs who played this match
  
  // Match Events will be in separate MatchEvent table
  createdAt: Date;
  updatedAt: Date;
  recordedBy: string; // User ID who recorded the match
}

// Match Events (Goals, Cards, Subs, etc.)
export type EventType = 
  | 'Goal' 
  | 'YellowCard' 
  | 'RedCard' 
  | 'Substitution' 
  | 'Injury' 
  | 'CornerKick' 
  | 'FreeKick' 
  | 'PenaltyKick' 
  | 'OffsideCall'
  | 'Foul'
  | 'Shot'
  | 'Save';

export interface MatchEvent {
  id: string;
  matchId: string;
  playerId?: string;
  playerName: string; // Stored for historical data even if player is removed
  eventType: EventType;
  minute: number;
  additionalTime?: number;
  half: 1 | 2;
  
  // Event-specific data
  eventData?: {
    // For substitutions
    playerInId?: string;
    playerInName?: string;
    playerOutId?: string;
    playerOutName?: string;
    
    // For goals
    assistPlayerId?: string;
    assistPlayerName?: string;
    goalType?: 'Open Play' | 'Penalty' | 'Free Kick' | 'Corner' | 'Own Goal';
    
    // For cards
    cardReason?: string;
    
    // For shots
    shotOutcome?: 'Goal' | 'Saved' | 'Blocked' | 'Wide' | 'Over' | 'Post';
    shotLocation?: 'Box' | 'Outside Box' | 'Long Range';
  };
  
  notes?: string;
  recordedAt: Date;
  recordedBy: string; // User ID
}

// Match Statistics
export interface MatchStats {
  id: string;
  matchId: string;
  
  // Team Stats
  possession?: number; // Percentage
  shots: number;
  shotsOnTarget: number;
  corners: number;
  fouls: number;
  yellowCards: number;
  redCards: number;
  offsides: number;
  
  // Additional stats
  passes?: number;
  passAccuracy?: number;
  crosses?: number;
  tackles?: number;
  
  // Goalkeeper specific
  saves?: number;
  goalsConceded?: number;
  cleanSheet: boolean;
  
  // Player ratings (1-10)
  playerRatings?: { [playerId: string]: number };
  
  // Man of the Match
  manOfTheMatch?: string; // Player ID
  
  createdAt: Date;
  updatedAt: Date;
}

// Season/League Tables
export interface LeagueTable {
  id: string;
  league: string;
  season: string;
  ageGroup: AgeGroup;
  
  standings: LeagueStanding[];
  
  updatedAt: Date;
}

export interface LeagueStanding {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  position: number;
  
  // Form (last 5 games)
  form: ('W' | 'D' | 'L')[];
}

// Dashboard Views
export interface TeamSummary {
  team: Team;
  currentSeason: {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    position?: number;
  };
  recentMatches: Match[];
  upcomingMatches: Match[];
  topScorers: {
    playerId: string;
    playerName: string;
    goals: number;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  success: boolean;
  error?: string;
}

// Form Types for UI
export interface CreateMatchForm {
  teamId: string;
  opponent: string;
  matchType: MatchType;
  isHomeMatch: boolean;
  venue: string;
  scheduledDate: Date;
  referee?: string;
}

export interface MatchEventForm {
  playerId?: string;
  playerName: string;
  eventType: EventType;
  minute: number;
  half: 1 | 2;
  notes?: string;
  eventData?: any;
}