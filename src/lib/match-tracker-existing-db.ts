/**
 * Match Tracker Integration for Existing Database
 * Adapts to the existing normalized database schema
 */

import { supabase } from './supabase';
import { 
  Team, 
  Player, 
  Match, 
  MatchEvent, 
  MatchStats, 
  TeamSummary
} from '@/types/match-tracker';

export class MatchTrackerExistingDB {
  // Teams - using existing structure
  async getTeams(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        id,
        name,
        short_name,
        season,
        home_colors,
        away_colors,
        is_active,
        is_public,
        created_at,
        updated_at,
        team_types(name),
        leagues(name)
      `)
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching teams:', error);
      return [];
    }

    return (data || []).map(this.mapTeamFromExistingDB);
  }

  async getTeam(id: string): Promise<Team | null> {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        id,
        name,
        short_name,
        season,
        home_colors,
        away_colors,
        is_active,
        is_public,
        created_at,
        updated_at,
        team_types(name),
        leagues(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching team:', error);
      return null;
    }

    return data ? this.mapTeamFromExistingDB(data) : null;
  }

  // Players - using existing structure with team relationships
  async getPlayers(teamId?: string): Promise<Player[]> {
    let query = supabase
      .from('players')
      .select(`
        id,
        first_name,
        last_name,
        date_of_birth,
        jersey_number,
        parent_email,
        parent_phone,
        emergency_contact_name,
        emergency_contact_phone,
        is_active,
        created_at,
        updated_at,
        positions(name),
        team_players(
          team_id,
          teams(name)
        )
      `)
      .eq('is_active', true);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching players:', error);
      return [];
    }

    let players = (data || []).map(this.mapPlayerFromExistingDB);

    // Filter by team if specified
    if (teamId) {
      players = players.filter(player => player.teamId === teamId);
    }

    return players;
  }

  async getPlayer(id: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .select(`
        id,
        first_name,
        last_name,
        date_of_birth,
        jersey_number,
        parent_email,
        parent_phone,
        emergency_contact_name,
        emergency_contact_phone,
        is_active,
        created_at,
        updated_at,
        positions(name),
        team_players(
          team_id,
          teams(name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching player:', error);
      return null;
    }

    return data ? this.mapPlayerFromExistingDB(data) : null;
  }

  // Matches - using existing structure
  async getMatches(teamId?: string): Promise<Match[]> {
    let query = supabase
      .from('matches')
      .select(`
        id,
        team_id,
        match_date,
        kick_off_time,
        home_away,
        match_type,
        status,
        our_score,
        their_score,
        attendance,
        referee_name,
        weather_conditions,
        pitch_conditions,
        match_report,
        private_notes,
        created_at,
        updated_at,
        created_by,
        teams(name),
        opponents(name),
        venues(name, address),
        leagues(name)
      `)
      .order('match_date', { ascending: false });

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }

    return (data || []).map(this.mapMatchFromExistingDB);
  }

  async getMatch(id: string): Promise<Match | null> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        id,
        team_id,
        match_date,
        kick_off_time,
        home_away,
        match_type,
        status,
        our_score,
        their_score,
        attendance,
        referee_name,
        weather_conditions,
        pitch_conditions,
        match_report,
        private_notes,
        created_at,
        updated_at,
        created_by,
        teams(name),
        opponents(name),
        venues(name, address),
        leagues(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching match:', error);
      return null;
    }

    return data ? this.mapMatchFromExistingDB(data) : null;
  }

  // Match Events - using existing structure
  async getMatchEvents(matchId: string): Promise<MatchEvent[]> {
    const { data, error } = await supabase
      .from('match_events')
      .select(`
        id,
        match_id,
        player_id,
        event_type,
        event_minute,
        event_half,
        description,
        is_our_team,
        created_at,
        created_by,
        players(first_name, last_name)
      `)
      .eq('match_id', matchId)
      .order('event_minute');

    if (error) {
      console.error('Error fetching match events:', error);
      return [];
    }

    return (data || []).map(this.mapMatchEventFromExistingDB);
  }

  // Team Summary - calculated from existing data
  async getTeamSummary(teamId: string): Promise<TeamSummary | null> {
    const team = await this.getTeam(teamId);
    if (!team) return null;

    const matches = await this.getMatches(teamId);
    const finishedMatches = matches.filter(match => match.status === 'Finished');
    const upcomingMatches = matches
      .filter(match => match.status === 'Scheduled')
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, 5);
    
    const recentMatches = finishedMatches
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())
      .slice(0, 5);

    // Calculate season stats
    let won = 0, drawn = 0, lost = 0, goalsFor = 0, goalsAgainst = 0;
    
    finishedMatches.forEach(match => {
      if (match.homeScore !== undefined && match.awayScore !== undefined) {
        const teamScore = match.isHomeMatch ? match.homeScore : match.awayScore;
        const opponentScore = match.isHomeMatch ? match.awayScore : match.homeScore;
        
        goalsFor += teamScore;
        goalsAgainst += opponentScore;
        
        if (teamScore > opponentScore) won++;
        else if (teamScore === opponentScore) drawn++;
        else lost++;
      }
    });

    // Get top scorers
    const topScorers = await this.getTopScorers(teamId);

    return {
      team,
      currentSeason: {
        played: finishedMatches.length,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        points: (won * 3) + drawn
      },
      recentMatches,
      upcomingMatches,
      topScorers
    };
  }

  // Get top scorers from match events
  async getTopScorers(teamId: string): Promise<{ playerId: string; playerName: string; goals: number; }[]> {
    const { data, error } = await supabase
      .from('match_events')
      .select(`
        player_id,
        players(first_name, last_name),
        matches!inner(team_id)
      `)
      .eq('event_type', 'Goal')
      .eq('matches.team_id', teamId)
      .eq('is_our_team', true);

    if (error) {
      console.error('Error fetching top scorers:', error);
      return [];
    }

    // Count goals by player
    const scorers: { [key: string]: { playerId: string; playerName: string; goals: number } } = {};
    
    (data || []).forEach(event => {
      const playerId = event.player_id || 'unknown';
      const playerName = event.players 
        ? `${event.players.first_name} ${event.players.last_name}`
        : 'Unknown Player';
      
      if (!scorers[playerId]) {
        scorers[playerId] = {
          playerId,
          playerName,
          goals: 0
        };
      }
      scorers[playerId].goals++;
    });

    return Object.values(scorers)
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10);
  }

  // Write operations for existing database structure
  async saveTeam(team: Team): Promise<void> {
    throw new Error('Team creation not available in quick setup. Please use the club management system to add teams.');
  }

  async deleteTeam(id: string): Promise<void> {
    throw new Error('Team deletion not available. Please use the club management system.');
  }

  async savePlayer(player: Player): Promise<void> {
    throw new Error('Player management not available in match recorder. Please use the club management system.');
  }

  async deletePlayer(id: string): Promise<void> {
    throw new Error('Player deletion not available. Please use the club management system.');
  }

  async saveMatch(match: Match): Promise<void> {
    throw new Error('Match creation not available in quick setup. Please use the proper match scheduling system.');
  }

  async deleteMatch(id: string): Promise<void> {
    throw new Error('Match deletion not available. Please use the match management system.');
  }

  async saveMatchEvent(event: MatchEvent): Promise<void> {
    // This could be implemented for live match recording
    const { error } = await supabase
      .from('match_events')
      .insert({
        match_id: event.matchId,
        player_id: event.playerId,
        event_type: event.eventType,
        event_minute: event.minute,
        event_half: event.half,
        description: event.notes,
        is_our_team: true,
        created_by: event.recordedBy
      });

    if (error) {
      throw new Error(`Failed to save match event: ${error.message}`);
    }
  }

  async deleteMatchEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('match_events')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete match event: ${error.message}`);
    }
  }

  async getMatchStats(matchId: string): Promise<MatchStats | null> {
    console.warn('getMatchStats not implemented for existing database structure');
    return null;
  }

  async saveMatchStats(stats: MatchStats): Promise<void> {
    console.warn('saveMatchStats not implemented for existing database structure');
  }

  async deleteMatchStats(matchId: string): Promise<void> {
    console.warn('deleteMatchStats not implemented for existing database structure');
  }

  async clearAllData(): Promise<void> {
    console.warn('clearAllData not implemented for existing database structure');
  }

  initializeSampleData(): void {
    // No-op for existing database
  }

  // Database mapping functions for existing schema
  private mapTeamFromExistingDB(dbTeam: any): Team {
    return {
      id: dbTeam.id,
      name: dbTeam.name,
      ageGroup: dbTeam.team_types?.name || 'Unknown',
      gender: 'Mixed', // Default since not in existing schema
      season: dbTeam.season,
      league: dbTeam.leagues?.name,
      homeKit: {
        primary: dbTeam.home_colors || '#00A651',
        secondary: '#FFFFFF'
      },
      awayKit: {
        primary: dbTeam.away_colors || '#001F3F',
        secondary: '#FFFFFF'
      },
      isOpponent: false,
      createdAt: new Date(dbTeam.created_at),
      updatedAt: new Date(dbTeam.updated_at)
    };
  }

  private mapPlayerFromExistingDB(dbPlayer: any): Player {
    // Get team info from team_players relationship
    const teamPlayer = dbPlayer.team_players?.[0];
    
    return {
      id: dbPlayer.id,
      teamId: teamPlayer?.team_id,
      name: `${dbPlayer.first_name} ${dbPlayer.last_name}`,
      number: dbPlayer.jersey_number,
      position: dbPlayer.positions?.name || 'Unknown',
      dateOfBirth: dbPlayer.date_of_birth ? new Date(dbPlayer.date_of_birth) : undefined,
      parentName: dbPlayer.emergency_contact_name,
      parentEmail: dbPlayer.parent_email,
      parentPhone: dbPlayer.parent_phone,
      isActive: dbPlayer.is_active,
      createdAt: new Date(dbPlayer.created_at),
      updatedAt: new Date(dbPlayer.updated_at)
    };
  }

  private mapMatchFromExistingDB(dbMatch: any): Match {
    // Combine date and time for scheduled date
    const matchDate = new Date(dbMatch.match_date);
    if (dbMatch.kick_off_time) {
      const [hours, minutes] = dbMatch.kick_off_time.split(':');
      matchDate.setHours(parseInt(hours), parseInt(minutes));
    }

    return {
      id: dbMatch.id,
      teamId: dbMatch.team_id,
      opponent: dbMatch.opponents?.name || 'Unknown Opponent',
      matchType: dbMatch.match_type || 'League',
      isHomeMatch: dbMatch.home_away === 'HOME',
      venue: dbMatch.venues?.name || 'Unknown Venue',
      scheduledDate: matchDate,
      status: dbMatch.status || 'Scheduled',
      homeScore: dbMatch.home_away === 'HOME' ? dbMatch.our_score : dbMatch.their_score,
      awayScore: dbMatch.home_away === 'HOME' ? dbMatch.their_score : dbMatch.our_score,
      referee: dbMatch.referee_name,
      weather: dbMatch.weather_conditions,
      pitchCond: dbMatch.pitch_conditions || 'Good',
      attendance: dbMatch.attendance,
      notes: dbMatch.match_report || dbMatch.private_notes,
      recordedBy: dbMatch.created_by || 'system',
      createdAt: new Date(dbMatch.created_at),
      updatedAt: new Date(dbMatch.updated_at)
    };
  }

  private mapMatchEventFromExistingDB(dbEvent: any): MatchEvent {
    const playerName = dbEvent.players 
      ? `${dbEvent.players.first_name} ${dbEvent.players.last_name}`
      : 'Unknown Player';

    return {
      id: dbEvent.id,
      matchId: dbEvent.match_id,
      playerId: dbEvent.player_id,
      playerName,
      eventType: dbEvent.event_type,
      minute: dbEvent.event_minute,
      half: dbEvent.event_half || 1,
      notes: dbEvent.description,
      recordedAt: new Date(dbEvent.created_at),
      recordedBy: dbEvent.created_by || 'system'
    };
  }
}

// Export singleton instance
export const existingDbStorage = new MatchTrackerExistingDB();