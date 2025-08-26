/**
 * Match Tracker Data Storage
 * Simple localStorage implementation for development
 * TODO: Replace with real database in production
 */

import { 
  Team, 
  Player, 
  Match, 
  MatchEvent, 
  MatchStats, 
  User, 
  AgeGroup,
  TeamSummary,
  MatchStatus 
} from '@/types/match-tracker';

class MatchTrackerStorage {
  private getStorageKey(type: string): string {
    return `rvr_match_tracker_${type}`;
  }

  // Generic storage methods
  private getFromStorage<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.getStorageKey(key));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return [];
    }
  }

  private saveToStorage<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }

  // Teams
  getTeams(): Team[] {
    return this.getFromStorage<Team>('teams').map(team => ({
      ...team,
      createdAt: new Date(team.createdAt),
      updatedAt: new Date(team.updatedAt)
    }));
  }

  getTeam(id: string): Team | null {
    const teams = this.getTeams();
    return teams.find(team => team.id === id) || null;
  }

  saveTeam(team: Team): void {
    const teams = this.getTeams();
    const existingIndex = teams.findIndex(t => t.id === team.id);
    
    if (existingIndex >= 0) {
      teams[existingIndex] = { ...team, updatedAt: new Date() };
    } else {
      teams.push({ ...team, createdAt: new Date(), updatedAt: new Date() });
    }
    
    this.saveToStorage('teams', teams);
  }

  deleteTeam(id: string): void {
    const teams = this.getTeams().filter(team => team.id !== id);
    this.saveToStorage('teams', teams);
  }

  // Players
  getPlayers(teamId?: string): Player[] {
    const players = this.getFromStorage<Player>('players').map(player => ({
      ...player,
      dateOfBirth: new Date(player.dateOfBirth),
      createdAt: new Date(player.createdAt),
      updatedAt: new Date(player.updatedAt)
    }));
    
    return teamId ? players.filter(player => player.teamId === teamId) : players;
  }

  getPlayer(id: string): Player | null {
    const players = this.getPlayers();
    return players.find(player => player.id === id) || null;
  }

  savePlayer(player: Player): void {
    const players = this.getPlayers();
    const existingIndex = players.findIndex(p => p.id === player.id);
    
    if (existingIndex >= 0) {
      players[existingIndex] = { ...player, updatedAt: new Date() };
    } else {
      players.push({ ...player, createdAt: new Date(), updatedAt: new Date() });
    }
    
    this.saveToStorage('players', players);
  }

  deletePlayer(id: string): void {
    const players = this.getPlayers().filter(player => player.id !== id);
    this.saveToStorage('players', players);
  }

  // Matches
  getMatches(teamId?: string): Match[] {
    const matches = this.getFromStorage<Match>('matches').map(match => ({
      ...match,
      scheduledDate: new Date(match.scheduledDate),
      actualKickOff: match.actualKickOff ? new Date(match.actualKickOff) : undefined,
      createdAt: new Date(match.createdAt),
      updatedAt: new Date(match.updatedAt)
    }));
    
    return teamId ? matches.filter(match => match.teamId === teamId) : matches;
  }

  getMatch(id: string): Match | null {
    const matches = this.getMatches();
    return matches.find(match => match.id === id) || null;
  }

  saveMatch(match: Match): void {
    const matches = this.getMatches();
    const existingIndex = matches.findIndex(m => m.id === match.id);
    
    if (existingIndex >= 0) {
      matches[existingIndex] = { ...match, updatedAt: new Date() };
    } else {
      matches.push({ ...match, createdAt: new Date(), updatedAt: new Date() });
    }
    
    this.saveToStorage('matches', matches);
  }

  deleteMatch(id: string): void {
    const matches = this.getMatches().filter(match => match.id !== id);
    this.saveToStorage('matches', matches);
    
    // Also delete related events and stats
    this.deleteMatchEvents(id);
    this.deleteMatchStats(id);
  }

  // Match Events
  getMatchEvents(matchId: string): MatchEvent[] {
    const events = this.getFromStorage<MatchEvent>('match_events').map(event => ({
      ...event,
      recordedAt: new Date(event.recordedAt)
    }));
    
    return events.filter(event => event.matchId === matchId);
  }

  saveMatchEvent(event: MatchEvent): void {
    const events = this.getFromStorage<MatchEvent>('match_events');
    const existingIndex = events.findIndex(e => e.id === event.id);
    
    if (existingIndex >= 0) {
      events[existingIndex] = { ...event, recordedAt: new Date() };
    } else {
      events.push({ ...event, recordedAt: new Date() });
    }
    
    this.saveToStorage('match_events', events);
  }

  deleteMatchEvent(id: string): void {
    const events = this.getFromStorage<MatchEvent>('match_events').filter(event => event.id !== id);
    this.saveToStorage('match_events', events);
  }

  deleteMatchEvents(matchId: string): void {
    const events = this.getFromStorage<MatchEvent>('match_events').filter(event => event.matchId !== matchId);
    this.saveToStorage('match_events', events);
  }

  // Match Stats
  getMatchStats(matchId: string): MatchStats | null {
    const stats = this.getFromStorage<MatchStats>('match_stats').map(stat => ({
      ...stat,
      createdAt: new Date(stat.createdAt),
      updatedAt: new Date(stat.updatedAt)
    }));
    
    return stats.find(stat => stat.matchId === matchId) || null;
  }

  saveMatchStats(stats: MatchStats): void {
    const allStats = this.getFromStorage<MatchStats>('match_stats');
    const existingIndex = allStats.findIndex(s => s.matchId === stats.matchId);
    
    if (existingIndex >= 0) {
      allStats[existingIndex] = { ...stats, updatedAt: new Date() };
    } else {
      allStats.push({ ...stats, createdAt: new Date(), updatedAt: new Date() });
    }
    
    this.saveToStorage('match_stats', allStats);
  }

  deleteMatchStats(matchId: string): void {
    const stats = this.getFromStorage<MatchStats>('match_stats').filter(stat => stat.matchId !== matchId);
    this.saveToStorage('match_stats', stats);
  }

  // Users (Basic implementation)
  getUsers(): User[] {
    return this.getFromStorage<User>('users').map(user => ({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt)
    }));
  }

  getUser(id: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = { ...user, updatedAt: new Date() };
    } else {
      users.push({ ...user, createdAt: new Date(), updatedAt: new Date() });
    }
    
    this.saveToStorage('users', users);
  }

  // Helper methods for dashboard data
  getTeamSummary(teamId: string): TeamSummary | null {
    const team = this.getTeam(teamId);
    if (!team) return null;

    const matches = this.getMatches(teamId);
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
      topScorers: [] // TODO: Calculate from match events
    };
  }

  // Development helpers
  clearAllData(): void {
    if (typeof window === 'undefined') return;
    
    const keys = ['teams', 'players', 'matches', 'match_events', 'match_stats', 'users'];
    keys.forEach(key => {
      localStorage.removeItem(this.getStorageKey(key));
    });
  }

  // Initialize with sample data for development
  initializeSampleData(): void {
    const teams = this.getTeams();
    if (teams.length === 0) {
      this.createSampleData();
    }
  }

  private createSampleData(): void {
    // Sample teams (U12 and above only)
    const sampleTeams: Team[] = [
      {
        id: 'team-u12-boys',
        name: 'RVR U12 Boys',
        ageGroup: 'U12',
        gender: 'Boys',
        coachIds: ['coach-1'],
        assistantCoachIds: [],
        season: '2024-25',
        league: 'Dublin & District Schoolboys League U12',
        homeKit: { primary: '#00A651', secondary: '#FFFFFF' },
        awayKit: { primary: '#001F3F', secondary: '#FFFFFF' },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'team-u14-girls',
        name: 'RVR U14 Girls',
        ageGroup: 'U14',
        gender: 'Girls',
        coachIds: ['coach-2'],
        assistantCoachIds: ['assistant-1'],
        season: '2024-25',
        league: 'Dublin Girls Soccer League U14',
        homeKit: { primary: '#00A651', secondary: '#FFFFFF' },
        awayKit: { primary: '#001F3F', secondary: '#FFFFFF' },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleTeams.forEach(team => this.saveTeam(team));

    // Sample players for U12 Boys
    const samplePlayers: Player[] = [
      {
        id: 'player-u12-1',
        teamId: 'team-u12-boys',
        name: 'Jamie Murphy',
        number: 7,
        position: 'Forward',
        dateOfBirth: new Date('2012-03-15'),
        parentName: 'Sarah Murphy',
        parentPhone: '+353-87-123-4567',
        parentEmail: 'sarah.murphy@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'player-u12-2',
        teamId: 'team-u12-boys',
        name: 'Luke O\'Brien',
        number: 10,
        position: 'Midfielder',
        dateOfBirth: new Date('2012-05-22'),
        parentName: 'Tom O\'Brien',
        parentPhone: '+353-87-234-5678',
        parentEmail: 'tom.obrien@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'player-u12-3',
        teamId: 'team-u12-boys',
        name: 'Sean Walsh',
        number: 1,
        position: 'Goalkeeper',
        dateOfBirth: new Date('2012-01-10'),
        parentName: 'Mary Walsh',
        parentPhone: '+353-87-345-6789',
        parentEmail: 'mary.walsh@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Sample players for U14 Girls
      {
        id: 'player-u14-1',
        teamId: 'team-u14-girls',
        name: 'Emma Kelly',
        number: 9,
        position: 'Forward',
        dateOfBirth: new Date('2010-08-20'),
        parentName: 'David Kelly',
        parentPhone: '+353-87-456-7890',
        parentEmail: 'david.kelly@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'player-u14-2',
        teamId: 'team-u14-girls',
        name: 'Sophie Ryan',
        number: 8,
        position: 'Midfielder',
        dateOfBirth: new Date('2010-12-03'),
        parentName: 'Lisa Ryan',
        parentPhone: '+353-87-567-8901',
        parentEmail: 'lisa.ryan@example.com',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    samplePlayers.forEach(player => this.savePlayer(player));

    // Sample admin user
    const adminUser: User = {
      id: 'admin-1',
      email: 'admin@rvrfc.ie',
      name: 'RVR Admin',
      role: 'admin',
      teamIds: sampleTeams.map(t => t.id),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.saveUser(adminUser);

    // Sample finished matches for league table testing
    const sampleMatches: Match[] = [
      {
        id: 'match-sample-1',
        teamId: 'team-u12-boys',
        opponent: 'Greenfield FC',
        matchType: 'League',
        isHomeMatch: true,
        venue: 'Home Ground',
        scheduledDate: new Date('2024-08-10T14:00:00'),
        status: 'Finished',
        homeScore: 3,
        awayScore: 1,
        referee: 'John Smith',
        weather: 'Sunny',
        temperature: 22,
        pitchCond: 'Good',
        recordedBy: 'admin-1',
        createdAt: new Date('2024-08-10T14:00:00'),
        updatedAt: new Date('2024-08-10T16:00:00')
      },
      {
        id: 'match-sample-2',
        teamId: 'team-u12-boys',
        opponent: 'Meadowbrook FC',
        matchType: 'League',
        isHomeMatch: false,
        venue: 'Away Ground',
        scheduledDate: new Date('2024-08-17T15:30:00'),
        status: 'Finished',
        homeScore: 2,
        awayScore: 2,
        referee: 'Mary Johnson',
        weather: 'Overcast',
        temperature: 18,
        pitchCond: 'Fair',
        recordedBy: 'admin-1',
        createdAt: new Date('2024-08-17T15:30:00'),
        updatedAt: new Date('2024-08-17T17:30:00')
      },
      {
        id: 'match-sample-3',
        teamId: 'team-u14-girls',
        opponent: 'Riverside United',
        matchType: 'League',
        isHomeMatch: true,
        venue: 'Home Ground',
        scheduledDate: new Date('2024-08-15T11:00:00'),
        status: 'Finished',
        homeScore: 4,
        awayScore: 0,
        referee: 'Tom Wilson',
        weather: 'Sunny',
        temperature: 25,
        pitchCond: 'Excellent',
        recordedBy: 'admin-1',
        createdAt: new Date('2024-08-15T11:00:00'),
        updatedAt: new Date('2024-08-15T13:00:00')
      },
      // Upcoming matches
      {
        id: 'match-upcoming-1',
        teamId: 'team-u12-boys',
        opponent: 'Celtic Tigers',
        matchType: 'League',
        isHomeMatch: true,
        venue: 'Home Ground',
        scheduledDate: new Date('2024-08-31T14:00:00'),
        status: 'Scheduled',
        referee: 'Sarah Davis',
        weather: undefined,
        temperature: undefined,
        pitchCond: 'Good',
        recordedBy: 'admin-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'match-upcoming-2',
        teamId: 'team-u14-girls',
        opponent: 'Phoenix FC',
        matchType: 'Cup',
        isHomeMatch: false,
        venue: 'Phoenix Park',
        scheduledDate: new Date('2024-09-02T16:00:00'),
        status: 'Scheduled',
        referee: 'Mike O\'Connor',
        weather: undefined,
        temperature: undefined,
        pitchCond: 'Good',
        recordedBy: 'admin-1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    sampleMatches.forEach(match => this.saveMatch(match));
  }
}

// Export singleton instance
export const storage = new MatchTrackerStorage();