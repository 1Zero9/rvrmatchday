/**
 * Match Tracker Supabase Integration
 * Production database implementation replacing localStorage
 */

import { supabase } from './supabase';
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

export class MatchTrackerSupabase {
  // Teams
  async getTeams(): Promise<Team[]> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching teams:', error);
      return [];
    }

    return (data || []).map(this.mapTeamFromDb);
  }

  async getTeam(id: string): Promise<Team | null> {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching team:', error);
      return null;
    }

    return data ? this.mapTeamFromDb(data) : null;
  }

  async saveTeam(team: Team): Promise<void> {
    const dbTeam = this.mapTeamToDb(team);
    
    const { error } = await supabase
      .from('teams')
      .upsert(dbTeam, { onConflict: 'id' });

    if (error) {
      console.error('Error saving team:', error);
      throw new Error(`Failed to save team: ${error.message}`);
    }
  }

  async deleteTeam(id: string): Promise<void> {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting team:', error);
      throw new Error(`Failed to delete team: ${error.message}`);
    }
  }

  // Players
  async getPlayers(teamId?: string): Promise<Player[]> {
    let query = supabase
      .from('players')
      .select('*')
      .order('name');

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching players:', error);
      return [];
    }

    return (data || []).map(this.mapPlayerFromDb);
  }

  async getPlayer(id: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching player:', error);
      return null;
    }

    return data ? this.mapPlayerFromDb(data) : null;
  }

  async savePlayer(player: Player): Promise<void> {
    const dbPlayer = this.mapPlayerToDb(player);
    
    const { error } = await supabase
      .from('players')
      .upsert(dbPlayer, { onConflict: 'id' });

    if (error) {
      console.error('Error saving player:', error);
      throw new Error(`Failed to save player: ${error.message}`);
    }
  }

  async deletePlayer(id: string): Promise<void> {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting player:', error);
      throw new Error(`Failed to delete player: ${error.message}`);
    }
  }

  // Matches
  async getMatches(teamId?: string): Promise<Match[]> {
    let query = supabase
      .from('matches')
      .select('*')
      .order('scheduled_date', { ascending: false });

    if (teamId) {
      query = query.eq('team_id', teamId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }

    return (data || []).map(this.mapMatchFromDb);
  }

  async getMatch(id: string): Promise<Match | null> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching match:', error);
      return null;
    }

    return data ? this.mapMatchFromDb(data) : null;
  }

  async saveMatch(match: Match): Promise<void> {
    const dbMatch = this.mapMatchToDb(match);
    
    const { error } = await supabase
      .from('matches')
      .upsert(dbMatch, { onConflict: 'id' });

    if (error) {
      console.error('Error saving match:', error);
      throw new Error(`Failed to save match: ${error.message}`);
    }
  }

  async deleteMatch(id: string): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting match:', error);
      throw new Error(`Failed to delete match: ${error.message}`);
    }
  }

  // Match Events
  async getMatchEvents(matchId: string): Promise<MatchEvent[]> {
    const { data, error } = await supabase
      .from('match_events')
      .select('*')
      .eq('match_id', matchId)
      .order('event_minute');

    if (error) {
      console.error('Error fetching match events:', error);
      return [];
    }

    return (data || []).map(this.mapMatchEventFromDb);
  }

  async saveMatchEvent(event: MatchEvent): Promise<void> {
    const dbEvent = this.mapMatchEventToDb(event);
    
    const { error } = await supabase
      .from('match_events')
      .upsert(dbEvent, { onConflict: 'id' });

    if (error) {
      console.error('Error saving match event:', error);
      throw new Error(`Failed to save match event: ${error.message}`);
    }
  }

  async deleteMatchEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('match_events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting match event:', error);
      throw new Error(`Failed to delete match event: ${error.message}`);
    }
  }

  // Match Stats
  async getMatchStats(matchId: string): Promise<MatchStats | null> {
    const { data, error } = await supabase
      .from('match_stats')
      .select('*')
      .eq('match_id', matchId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      console.error('Error fetching match stats:', error);
      return null;
    }

    return data ? this.mapMatchStatsFromDb(data) : null;
  }

  async saveMatchStats(stats: MatchStats): Promise<void> {
    const dbStats = this.mapMatchStatsToDb(stats);
    
    const { error } = await supabase
      .from('match_stats')
      .upsert(dbStats, { onConflict: 'match_id' });

    if (error) {
      console.error('Error saving match stats:', error);
      throw new Error(`Failed to save match stats: ${error.message}`);
    }
  }

  async deleteMatchStats(matchId: string): Promise<void> {
    const { error } = await supabase
      .from('match_stats')
      .delete()
      .eq('match_id', matchId);

    if (error) {
      console.error('Error deleting match stats:', error);
      throw new Error(`Failed to delete match stats: ${error.message}`);
    }
  }

  // Team Summary with statistics
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

    // Get top scorers from match events
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

  // Get top scorers for a team
  async getTopScorers(teamId: string): Promise<{ playerId: string; playerName: string; goals: number; }[]> {
    const { data, error } = await supabase
      .from('match_events')
      .select(`
        player_id,
        player_name,
        match_id,
        matches!inner(team_id)
      `)
      .eq('event_type', 'Goal')
      .eq('matches.team_id', teamId);

    if (error) {
      console.error('Error fetching top scorers:', error);
      return [];
    }

    // Count goals by player
    const scorers: { [key: string]: { playerId: string; playerName: string; goals: number } } = {};
    
    (data || []).forEach(event => {
      const key = event.player_id || event.player_name;
      if (!scorers[key]) {
        scorers[key] = {
          playerId: event.player_id || '',
          playerName: event.player_name,
          goals: 0
        };
      }
      scorers[key].goals++;
    });

    return Object.values(scorers)
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10);
  }

  // Clear all data (for development)
  async clearAllData(): Promise<void> {
    const tables = ['match_events', 'match_stats', 'matches', 'players', 'teams'];
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', ''); // Delete all rows

      if (error) {
        console.error(`Error clearing ${table}:`, error);
        throw new Error(`Failed to clear ${table}: ${error.message}`);
      }
    }
  }

  // Database mapping functions
  private mapTeamFromDb(dbTeam: any): Team {
    return {
      id: dbTeam.id,
      name: dbTeam.name,
      ageGroup: dbTeam.age_group,
      gender: dbTeam.gender,
      coachIds: dbTeam.coach_ids || [],
      assistantCoachIds: dbTeam.assistant_coach_ids || [],
      season: dbTeam.season,
      league: dbTeam.league,
      homeKit: dbTeam.home_kit || {},
      awayKit: dbTeam.away_kit || {},
      isOpponent: dbTeam.is_opponent,
      homeVenue: dbTeam.home_venue,
      contactEmail: dbTeam.contact_email,
      contactPhone: dbTeam.contact_phone,
      notes: dbTeam.notes,
      createdAt: new Date(dbTeam.created_at),
      updatedAt: new Date(dbTeam.updated_at)
    };
  }

  private mapTeamToDb(team: Team): any {
    return {
      id: team.id,
      name: team.name,
      age_group: team.ageGroup,
      gender: team.gender,
      coach_ids: team.coachIds || [],
      assistant_coach_ids: team.assistantCoachIds || [],
      season: team.season,
      league: team.league,
      home_kit: team.homeKit || {},
      away_kit: team.awayKit || {},
      is_opponent: team.isOpponent || false,
      home_venue: team.homeVenue,
      contact_email: team.contactEmail,
      contact_phone: team.contactPhone,
      notes: team.notes
    };
  }

  private mapPlayerFromDb(dbPlayer: any): Player {
    return {
      id: dbPlayer.id,
      teamId: dbPlayer.team_id,
      name: dbPlayer.name,
      number: dbPlayer.jersey_number,
      position: dbPlayer.position,
      dateOfBirth: dbPlayer.date_of_birth ? new Date(dbPlayer.date_of_birth) : undefined,
      parentName: dbPlayer.parent_name,
      parentEmail: dbPlayer.parent_email,
      parentPhone: dbPlayer.parent_phone,
      role: dbPlayer.role,
      isActive: dbPlayer.is_active,
      createdAt: new Date(dbPlayer.created_at),
      updatedAt: new Date(dbPlayer.updated_at)
    };
  }

  private mapPlayerToDb(player: Player): any {
    return {
      id: player.id,
      team_id: player.teamId,
      name: player.name,
      jersey_number: player.number || player.jerseyNumber || player.shirtNumber,
      position: player.position,
      date_of_birth: player.dateOfBirth?.toISOString()?.split('T')[0],
      parent_name: player.parentName || player.parentContact?.name,
      parent_email: player.parentEmail || player.parentContact?.email,
      parent_phone: player.parentPhone || player.parentContact?.phone,
      role: player.role || 'player',
      is_active: player.isActive !== false
    };
  }

  private mapMatchFromDb(dbMatch: any): Match {
    return {
      id: dbMatch.id,
      teamId: dbMatch.team_id,
      opponent: dbMatch.opponent,
      matchType: dbMatch.match_type,
      isHomeMatch: dbMatch.is_home_match,
      venue: dbMatch.venue,
      scheduledDate: new Date(dbMatch.scheduled_date),
      actualKickOff: dbMatch.actual_kick_off ? new Date(dbMatch.actual_kick_off) : undefined,
      status: dbMatch.status,
      referee: dbMatch.referee,
      assistantReferees: dbMatch.assistant_referees || [],
      weather: dbMatch.weather,
      temperature: dbMatch.temperature,
      pitchCond: dbMatch.pitch_condition,
      homeScore: dbMatch.home_score,
      awayScore: dbMatch.away_score,
      veoRecording: dbMatch.veo_recording,
      veoUrl: dbMatch.veo_url,
      playerOfTheMatch: dbMatch.player_of_the_match,
      yellowCards: dbMatch.yellow_cards,
      redCards: dbMatch.red_cards,
      attendance: dbMatch.attendance,
      notes: dbMatch.notes,
      recordedBy: dbMatch.recorded_by,
      createdAt: new Date(dbMatch.created_at),
      updatedAt: new Date(dbMatch.updated_at)
    };
  }

  private mapMatchToDb(match: Match): any {
    return {
      id: match.id,
      team_id: match.teamId,
      opponent: match.opponent,
      match_type: match.matchType,
      is_home_match: match.isHomeMatch,
      venue: match.venue,
      scheduled_date: match.scheduledDate.toISOString(),
      actual_kick_off: match.actualKickOff?.toISOString(),
      status: match.status,
      referee: match.referee,
      assistant_referees: match.assistantReferees || [],
      weather: match.weather,
      temperature: match.temperature,
      pitch_condition: match.pitchCond,
      home_score: match.homeScore,
      away_score: match.awayScore,
      veo_recording: match.veoRecording || false,
      veo_url: match.veoUrl,
      player_of_the_match: match.playerOfTheMatch,
      yellow_cards: match.yellowCards,
      red_cards: match.redCards,
      attendance: match.attendance,
      notes: match.notes,
      recorded_by: match.recordedBy
    };
  }

  private mapMatchEventFromDb(dbEvent: any): MatchEvent {
    return {
      id: dbEvent.id,
      matchId: dbEvent.match_id,
      playerId: dbEvent.player_id,
      playerName: dbEvent.player_name,
      eventType: dbEvent.event_type,
      minute: dbEvent.minute,
      additionalTime: dbEvent.additional_time,
      half: dbEvent.half,
      eventData: dbEvent.event_data || {},
      notes: dbEvent.notes,
      recordedAt: new Date(dbEvent.recorded_at),
      recordedBy: dbEvent.recorded_by
    };
  }

  private mapMatchEventToDb(event: MatchEvent): any {
    return {
      id: event.id,
      match_id: event.matchId,
      player_id: event.playerId,
      player_name: event.playerName,
      event_type: event.eventType,
      minute: event.minute,
      additional_time: event.additionalTime,
      half: event.half,
      event_data: event.eventData || {},
      notes: event.notes,
      recorded_by: event.recordedBy
    };
  }

  private mapMatchStatsFromDb(dbStats: any): MatchStats {
    return {
      id: dbStats.id,
      matchId: dbStats.match_id,
      possession: dbStats.possession,
      shots: dbStats.shots || 0,
      shotsOnTarget: dbStats.shots_on_target || 0,
      corners: dbStats.corners || 0,
      fouls: dbStats.fouls || 0,
      yellowCards: dbStats.yellow_cards || 0,
      redCards: dbStats.red_cards || 0,
      offsides: dbStats.offsides || 0,
      passes: dbStats.passes,
      passAccuracy: dbStats.pass_accuracy,
      crosses: dbStats.crosses,
      tackles: dbStats.tackles,
      saves: dbStats.saves,
      goalsConceded: dbStats.goals_conceded,
      cleanSheet: dbStats.clean_sheet || false,
      playerRatings: dbStats.player_ratings || {},
      manOfTheMatch: dbStats.man_of_the_match,
      createdAt: new Date(dbStats.created_at),
      updatedAt: new Date(dbStats.updated_at)
    };
  }

  private mapMatchStatsToDb(stats: MatchStats): any {
    return {
      id: stats.id,
      match_id: stats.matchId,
      possession: stats.possession,
      shots: stats.shots,
      shots_on_target: stats.shotsOnTarget,
      corners: stats.corners,
      fouls: stats.fouls,
      yellow_cards: stats.yellowCards,
      red_cards: stats.redCards,
      offsides: stats.offsides,
      passes: stats.passes,
      pass_accuracy: stats.passAccuracy,
      crosses: stats.crosses,
      tackles: stats.tackles,
      saves: stats.saves,
      goals_conceded: stats.goalsConceded,
      clean_sheet: stats.cleanSheet,
      player_ratings: stats.playerRatings || {},
      man_of_the_match: stats.manOfTheMatch
    };
  }
}

// Export singleton instance
export const supabaseStorage = new MatchTrackerSupabase();