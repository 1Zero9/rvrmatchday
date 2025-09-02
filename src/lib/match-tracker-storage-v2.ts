/**
 * Match Tracker Storage - Production Version
 * Replaces localStorage with Supabase for production
 */

import { 
  Team, 
  Player, 
  Match, 
  MatchEvent, 
  MatchStats, 
  User, 
  TeamSummary,
  MatchStatus 
} from '@/types/match-tracker';

import { existingDbStorage } from './match-tracker-existing-db';
import { storage as legacyStorage } from './match-tracker-storage';

// Storage mode - can be switched via environment or config
const USE_SUPABASE = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

export class MatchTrackerStorageV2 {
  private get storage() {
    return USE_SUPABASE ? existingDbStorage : legacyStorage;
  }

  // Teams
  async getTeams(): Promise<Team[]> {
    if (USE_SUPABASE) {
      return await existingDbStorage.getTeams();
    } else {
      return legacyStorage.getTeams();
    }
  }

  async getTeam(id: string): Promise<Team | null> {
    if (USE_SUPABASE) {
      return await existingDbStorage.getTeam(id);
    } else {
      return legacyStorage.getTeam(id);
    }
  }

  async saveTeam(team: Team): Promise<void> {
    if (USE_SUPABASE) {
      await existingDbStorage.saveTeam(team);
    } else {
      legacyStorage.saveTeam(team);
    }
  }

  async deleteTeam(id: string): Promise<void> {
    if (USE_SUPABASE) {
      await existingDbStorage.deleteTeam(id);
    } else {
      legacyStorage.deleteTeam(id);
    }
  }

  // Players
  async getPlayers(teamId?: string): Promise<Player[]> {
    if (USE_SUPABASE) {
      return await existingDbStorage.getPlayers(teamId);
    } else {
      return legacyStorage.getPlayers(teamId);
    }
  }

  async getPlayer(id: string): Promise<Player | null> {
    if (USE_SUPABASE) {
      return await existingDbStorage.getPlayer(id);
    } else {
      return legacyStorage.getPlayer(id);
    }
  }

  async savePlayer(player: Player): Promise<void> {
    if (USE_SUPABASE) {
      await existingDbStorage.savePlayer(player);
    } else {
      legacyStorage.savePlayer(player);
    }
  }

  async deletePlayer(id: string): Promise<void> {
    if (USE_SUPABASE) {
      await existingDbStorage.deletePlayer(id);
    } else {
      legacyStorage.deletePlayer(id);
    }
  }

  // Matches
  async getMatches(teamId?: string): Promise<Match[]> {
    if (USE_SUPABASE) {
      return await existingDbStorage.getMatches(teamId);
    } else {
      return legacyStorage.getMatches(teamId);
    }
  }

  async getMatch(id: string): Promise<Match | null> {
    if (USE_SUPABASE) {
      return await existingDbStorage.getMatch(id);
    } else {
      return legacyStorage.getMatch(id);
    }
  }

  async saveMatch(match: Match): Promise<void> {
    if (USE_SUPABASE) {
      await existingDbStorage.saveMatch(match);
    } else {
      legacyStorage.saveMatch(match);
    }
  }

  async deleteMatch(id: string): Promise<void> {
    if (USE_SUPABASE) {
      await existingDbStorage.deleteMatch(id);
    } else {
      legacyStorage.deleteMatch(id);
    }
  }

  // Match Events
  async getMatchEvents(matchId: string): Promise<MatchEvent[]> {
    if (USE_SUPABASE) {
      return await existingDbStorage.getMatchEvents(matchId);
    } else {
      return legacyStorage.getMatchEvents(matchId);
    }
  }

  async getAllMatchEvents(): Promise<MatchEvent[]> {
    if (USE_SUPABASE) {
      return await existingDbStorage.getAllMatchEvents();
    } else {
      return legacyStorage.getAllMatchEvents();
    }
  }

  async saveMatchEvent(event: MatchEvent): Promise<void> {
    if (USE_SUPABASE) {
      await existingDbStorage.saveMatchEvent(event);
    } else {
      legacyStorage.saveMatchEvent(event);
    }
  }

  async deleteMatchEvent(id: string): Promise<void> {
    if (USE_SUPABASE) {
      await existingDbStorage.deleteMatchEvent(id);
    } else {
      legacyStorage.deleteMatchEvent(id);
    }
  }

  // Match Stats
  async getMatchStats(matchId: string): Promise<MatchStats | null> {
    if (USE_SUPABASE) {
      return await existingDbStorage.getMatchStats(matchId);
    } else {
      return legacyStorage.getMatchStats(matchId);
    }
  }

  async saveMatchStats(stats: MatchStats): Promise<void> {
    if (USE_SUPABASE) {
      await existingDbStorage.saveMatchStats(stats);
    } else {
      legacyStorage.saveMatchStats(stats);
    }
  }

  async deleteMatchStats(matchId: string): Promise<void> {
    if (USE_SUPABASE) {
      await existingDbStorage.deleteMatchStats(matchId);
    } else {
      legacyStorage.deleteMatchStats(matchId);
    }
  }

  // Team Summary
  async getTeamSummary(teamId: string): Promise<TeamSummary | null> {
    if (USE_SUPABASE) {
      return await existingDbStorage.getTeamSummary(teamId);
    } else {
      return legacyStorage.getTeamSummary(teamId);
    }
  }

  // Development helpers
  async clearAllData(): Promise<void> {
    if (USE_SUPABASE) {
      await existingDbStorage.clearAllData();
    } else {
      legacyStorage.clearAllData();
    }
  }

  // Initialize with sample data for development
  initializeSampleData(): void {
    if (!USE_SUPABASE) {
      legacyStorage.initializeSampleData();
    }
    // For Supabase, sample data would be inserted via SQL or admin interface
  }

  // Utility method to check storage mode
  isUsingSupabase(): boolean {
    return USE_SUPABASE;
  }

  // Migration utility - copy localStorage data to Supabase
  async migrateToSupabase(): Promise<void> {
    if (USE_SUPABASE) {
      console.log('Already using Supabase');
      return;
    }

    try {
      // Get all localStorage data
      const teams = legacyStorage.getTeams();
      const players = legacyStorage.getPlayers();
      const matches = legacyStorage.getMatches();
      
      // Save to Supabase
      for (const team of teams) {
        await existingDbStorage.saveTeam(team);
      }
      
      for (const player of players) {
        await existingDbStorage.savePlayer(player);
      }
      
      for (const match of matches) {
        await existingDbStorage.saveMatch(match);
        
        // Migrate events and stats for this match
        const events = legacyStorage.getMatchEvents(match.id);
        for (const event of events) {
          await existingDbStorage.saveMatchEvent(event);
        }
        
        const stats = legacyStorage.getMatchStats(match.id);
        if (stats) {
          await existingDbStorage.saveMatchStats(stats);
        }
      }

      console.log('Migration to Supabase completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const storageV2 = new MatchTrackerStorageV2();