/**
 * Match Administration Dashboard - Redesigned UX
 * Complete admin system for teams, venues, leagues, players
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import { storage } from "../lib/match-tracker-storage";
import { Team, Player, Match } from "../types/match-tracker";

type AdminTab = 'teams' | 'opponents' | 'venues' | 'leagues' | 'matches' | 'players' | 'settings';

interface Venue {
  id: string;
  name: string;
  address: string;
  capacity?: number;
  surface: 'Grass' | 'Artificial' | 'Indoor';
  notes?: string;
}

interface League {
  id: string;
  name: string;
  season: string;
  ageGroup: string;
  gender: 'Male' | 'Female' | 'Mixed';
  division?: string;
}

export default function MatchAdmin() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('teams');
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Local storage for venues and leagues (extend storage later)
  const [venues, setVenues] = useState<Venue[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);

  // Form states
  const [teamForm, setTeamForm] = useState({
    name: '',
    ageGroup: '',
    gender: 'Mixed' as 'Male' | 'Female' | 'Mixed',
    league: '',
    season: '2024-25',
    homeVenue: '',
    coach: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [opponentForm, setOpponentForm] = useState({
    name: '',
    league: '',
    ageGroup: '',
    gender: 'Mixed' as 'Male' | 'Female' | 'Mixed',
    homeVenue: '',
    contactEmail: '',
    contactPhone: '',
    notes: ''
  });

  const [venueForm, setVenueForm] = useState({
    name: '',
    address: '',
    capacity: '',
    surface: 'Grass' as 'Grass' | 'Artificial' | 'Indoor',
    notes: ''
  });

  const [leagueForm, setLeagueForm] = useState({
    name: '',
    season: '2024-25',
    ageGroup: '',
    gender: 'Mixed' as 'Male' | 'Female' | 'Mixed',
    division: ''
  });

  const [matchForm, setMatchForm] = useState({
    teamId: '',
    opponent: '',
    scheduledDate: '',
    scheduledTime: '',
    venue: '',
    matchType: 'League',
    isHomeMatch: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const loadedTeams = storage.getTeams();
      const loadedMatches = storage.getMatches();
      setTeams(loadedTeams);
      setMatches(loadedMatches);
      
      // Load venues and leagues from localStorage
      const savedVenues = localStorage.getItem('rvr_venues');
      if (savedVenues) {
        setVenues(JSON.parse(savedVenues));
      }
      
      const savedLeagues = localStorage.getItem('rvr_leagues');
      if (savedLeagues) {
        setLeagues(JSON.parse(savedLeagues));
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveVenues = (newVenues: Venue[]) => {
    localStorage.setItem('rvr_venues', JSON.stringify(newVenues));
    setVenues(newVenues);
  };

  const saveLeagues = (newLeagues: League[]) => {
    localStorage.setItem('rvr_leagues', JSON.stringify(newLeagues));
    setLeagues(newLeagues);
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: teamForm.name,
        ageGroup: teamForm.ageGroup,
        gender: teamForm.gender,
        season: teamForm.season,
        league: teamForm.league,
        homeKit: { primary: '#00A651', secondary: '#FFFFFF' },
        awayKit: { primary: '#001F3F', secondary: '#FFFFFF' },
        coachIds: [],
        assistantCoachIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      storage.saveTeam(newTeam);
      setTeams([...teams, newTeam]);
      setTeamForm({
        name: '',
        ageGroup: '',
        gender: 'Mixed',
        league: '',
        season: '2024-25',
        homeVenue: '',
        coach: '',
        contactEmail: '',
        contactPhone: ''
      });
      
      alert('Team created successfully!');
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creating team. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpponentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const newOpponent: Team = {
        id: `opponent-${Date.now()}`,
        name: opponentForm.name,
        ageGroup: opponentForm.ageGroup,
        gender: opponentForm.gender,
        league: opponentForm.league,
        season: '2024-25',
        homeKit: { primary: '#FF0000', secondary: '#FFFFFF' },
        awayKit: { primary: '#000000', secondary: '#FFFFFF' },
        coachIds: [],
        assistantCoachIds: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      storage.saveTeam(newOpponent);
      setTeams([...teams, newOpponent]);
      setOpponentForm({
        name: '',
        league: '',
        ageGroup: '',
        gender: 'Mixed',
        homeVenue: '',
        contactEmail: '',
        contactPhone: '',
        notes: ''
      });
      
      alert('Opponent team added successfully!');
    } catch (error) {
      console.error('Error adding opponent:', error);
      alert('Error adding opponent. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleVenueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const newVenue: Venue = {
        id: `venue-${Date.now()}`,
        name: venueForm.name,
        address: venueForm.address,
        capacity: venueForm.capacity ? parseInt(venueForm.capacity) : undefined,
        surface: venueForm.surface,
        notes: venueForm.notes
      };

      saveVenues([...venues, newVenue]);
      setVenueForm({
        name: '',
        address: '',
        capacity: '',
        surface: 'Grass',
        notes: ''
      });
      
      alert('Venue added successfully!');
    } catch (error) {
      console.error('Error adding venue:', error);
      alert('Error adding venue. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLeagueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const newLeague: League = {
        id: `league-${Date.now()}`,
        name: leagueForm.name,
        season: leagueForm.season,
        ageGroup: leagueForm.ageGroup,
        gender: leagueForm.gender,
        division: leagueForm.division
      };

      saveLeagues([...leagues, newLeague]);
      setLeagueForm({
        name: '',
        season: '2024-25',
        ageGroup: '',
        gender: 'Mixed',
        division: ''
      });
      
      alert('League added successfully!');
    } catch (error) {
      console.error('Error adding league:', error);
      alert('Error adding league. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteTeam = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      storage.deleteTeam(teamId);
      setTeams(teams.filter(team => team.id !== teamId));
    }
  };

  const deleteVenue = (venueId: string) => {
    if (confirm('Are you sure you want to delete this venue?')) {
      const updated = venues.filter(venue => venue.id !== venueId);
      saveVenues(updated);
    }
  };

  const deleteLeague = (leagueId: string) => {
    if (confirm('Are you sure you want to delete this league?')) {
      const updated = leagues.filter(league => league.id !== leagueId);
      saveLeagues(updated);
    }
  };

  const handleMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const scheduledDateTime = new Date(`${matchForm.scheduledDate}T${matchForm.scheduledTime}`);
      
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        teamId: matchForm.teamId,
        opponent: matchForm.opponent,
        scheduledDate: scheduledDateTime,
        venue: matchForm.venue,
        matchType: matchForm.matchType as any,
        isHomeMatch: matchForm.isHomeMatch,
        status: 'Scheduled',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      storage.saveMatch(newMatch);
      setMatches([...matches, newMatch]);
      setMatchForm({
        teamId: '',
        opponent: '',
        scheduledDate: '',
        scheduledTime: '',
        venue: '',
        matchType: 'League',
        isHomeMatch: true
      });
      
      alert('Match created successfully!');
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Error creating match. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteMatch = (matchId: string) => {
    if (confirm('Are you sure you want to delete this match?')) {
      storage.deleteMatch(matchId);
      setMatches(matches.filter(match => match.id !== matchId));
    }
  };

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading Administration...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  const tabs = [
    { id: 'teams', label: 'Your Teams', icon: '⚽', count: teams.filter(t => !t.isOpponent).length },
    { id: 'opponents', label: 'Opponents', icon: '🏟️', count: teams.filter(t => t.isOpponent).length },
    { id: 'venues', label: 'Venues', icon: '📍', count: venues.length },
    { id: 'leagues', label: 'Leagues', icon: '🏆', count: leagues.length },
    { id: 'matches', label: 'Matches', icon: '🎯', count: matches.length },
    { id: 'players', label: 'Players', icon: '👥', count: 0 },
    { id: 'settings', label: 'Settings', icon: '⚙️', count: 0 }
  ];

  const yourTeams = teams.filter(team => !team.isOpponent);
  const opponentTeams = teams.filter(team => team.isOpponent);

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-club-primary rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-white">⚽</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Match Administration</h1>
                  <p className="text-gray-600 mt-1">Manage teams, opponents, venues, and leagues</p>
                </div>
              </div>
              <Link
                href="/match-central"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Match Central</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-club-primary text-club-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          
          {/* Your Teams Tab */}
          {activeTab === 'teams' && (
            <div>
              {/* Add New Team Form */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-2xl">➕</span>
                  Add Your Team
                </h2>
                
                <form onSubmit={handleTeamSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={teamForm.name}
                        onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                        placeholder="e.g. Rivervalley Rangers U12 Boys"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age Group *
                      </label>
                      <input
                        type="text"
                        required
                        value={teamForm.ageGroup}
                        onChange={(e) => setTeamForm(prev => ({ ...prev, ageGroup: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                        placeholder="e.g. U12, U14, Senior"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      <select
                        value={teamForm.gender}
                        onChange={(e) => setTeamForm(prev => ({ ...prev, gender: e.target.value as 'Male' | 'Female' | 'Mixed' }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                      >
                        <option value="Mixed">Mixed</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        League/Competition
                      </label>
                      <input
                        type="text"
                        value={teamForm.league}
                        onChange={(e) => setTeamForm(prev => ({ ...prev, league: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                        placeholder="e.g. Dublin & District Schoolboys League"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-club-primary hover:bg-club-primary/90 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating Team...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Team</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Teams List */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-2xl">⚽</span>
                  Your Teams ({yourTeams.length})
                </h2>
                
                {yourTeams.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⚽</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
                    <p className="text-gray-500">Create your first team using the form above</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {yourTeams.map((team) => (
                      <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{team.name}</h3>
                          <button
                            onClick={() => deleteTeam(team.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>Age: {team.ageGroup}</div>
                          <div>Gender: {team.gender}</div>
                          {team.league && <div>League: {team.league}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Opponents Tab */}
          {activeTab === 'opponents' && (
            <div>
              {/* Add Opponent Form */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-2xl">➕</span>
                  Add Opponent Team
                </h2>
                
                <form onSubmit={handleOpponentSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Team Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={opponentForm.name}
                        onChange={(e) => setOpponentForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="e.g. Celtic Tigers FC"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        League/Competition
                      </label>
                      <input
                        type="text"
                        value={opponentForm.league}
                        onChange={(e) => setOpponentForm(prev => ({ ...prev, league: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="e.g. Dublin & District League"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age Group
                      </label>
                      <input
                        type="text"
                        value={opponentForm.ageGroup}
                        onChange={(e) => setOpponentForm(prev => ({ ...prev, ageGroup: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="e.g. U12, U14, Senior"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Home Venue
                      </label>
                      <input
                        type="text"
                        value={opponentForm.homeVenue}
                        onChange={(e) => setOpponentForm(prev => ({ ...prev, homeVenue: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="e.g. Phoenix Park"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Adding Opponent...</span>
                      </>
                    ) : (
                      <>
                        <span>Add Opponent</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Opponents List */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-2xl">🏟️</span>
                  Opponent Teams ({opponentTeams.length})
                </h2>
                
                {opponentTeams.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏟️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No opponents yet</h3>
                    <p className="text-gray-500">Add opponent teams to use in match setup</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opponentTeams.map((team) => (
                      <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{team.name}</h3>
                          <button
                            onClick={() => deleteTeam(team.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          {team.ageGroup && <div>Age: {team.ageGroup}</div>}
                          {team.league && <div>League: {team.league}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Venues Tab */}
          {activeTab === 'venues' && (
            <div>
              {/* Add Venue Form */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-2xl">➕</span>
                  Add Venue
                </h2>
                
                <form onSubmit={handleVenueSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={venueForm.name}
                        onChange={(e) => setVenueForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="e.g. Phoenix Park Pitch 1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Surface Type
                      </label>
                      <select
                        value={venueForm.surface}
                        onChange={(e) => setVenueForm(prev => ({ ...prev, surface: e.target.value as 'Grass' | 'Artificial' | 'Indoor' }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                      >
                        <option value="Grass">🌱 Grass</option>
                        <option value="Artificial">🏗️ Artificial</option>
                        <option value="Indoor">🏢 Indoor</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={venueForm.address}
                        onChange={(e) => setVenueForm(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Full address for GPS navigation"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Adding Venue...</span>
                      </>
                    ) : (
                      <>
                        <span>Add Venue</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Venues List */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-2xl">📍</span>
                  Venues ({venues.length})
                </h2>
                
                {venues.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No venues yet</h3>
                    <p className="text-gray-500">Add venues to use in match setup</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {venues.map((venue) => (
                      <div key={venue.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                          <button
                            onClick={() => deleteVenue(venue.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>Surface: {venue.surface}</div>
                          {venue.address && <div>Address: {venue.address}</div>}
                          {venue.capacity && <div>Capacity: {venue.capacity}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Leagues Tab */}
          {activeTab === 'leagues' && (
            <div>
              {/* Add League Form */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-2xl">➕</span>
                  Add League/Competition
                </h2>
                
                <form onSubmit={handleLeagueSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        League Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={leagueForm.name}
                        onChange={(e) => setLeagueForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="e.g. Dublin & District Schoolboys League"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Season
                      </label>
                      <input
                        type="text"
                        value={leagueForm.season}
                        onChange={(e) => setLeagueForm(prev => ({ ...prev, season: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="e.g. 2024-25"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age Group
                      </label>
                      <input
                        type="text"
                        value={leagueForm.ageGroup}
                        onChange={(e) => setLeagueForm(prev => ({ ...prev, ageGroup: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="e.g. U12, U14, Senior"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Division
                      </label>
                      <input
                        type="text"
                        value={leagueForm.division}
                        onChange={(e) => setLeagueForm(prev => ({ ...prev, division: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="e.g. Division 1, Premier, Championship"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Adding League...</span>
                      </>
                    ) : (
                      <>
                        <span>Add League</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Leagues List */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-2xl">🏆</span>
                  Leagues & Competitions ({leagues.length})
                </h2>
                
                {leagues.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No leagues yet</h3>
                    <p className="text-gray-500">Add leagues and competitions your teams play in</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {leagues.map((league) => (
                      <div key={league.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{league.name}</h3>
                          <button
                            onClick={() => deleteLeague(league.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            🗑️
                          </button>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>Season: {league.season}</div>
                          {league.ageGroup && <div>Age: {league.ageGroup}</div>}
                          {league.division && <div>Division: {league.division}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Players Tab */}
          {activeTab === 'players' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Player Management</h3>
                <p className="text-gray-500">Player management features coming soon</p>
              </div>
            </div>
          )}

          {/* Matches Tab */}
          {activeTab === 'matches' && (
            <div>
              {/* Create Match Form */}
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-2xl">➕</span>
                  Schedule New Match
                </h2>
                
                <form onSubmit={handleMatchSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Team *
                      </label>
                      <select
                        required
                        value={matchForm.teamId}
                        onChange={(e) => setMatchForm(prev => ({ ...prev, teamId: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                      >
                        <option value="">Select your team...</option>
                        {teams.filter(team => !team.isOpponent).map(team => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opponent *
                      </label>
                      <input
                        type="text"
                        required
                        value={matchForm.opponent}
                        onChange={(e) => setMatchForm(prev => ({ ...prev, opponent: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                        placeholder="e.g., Celtic Tigers FC"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Match Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={matchForm.scheduledDate}
                        onChange={(e) => setMatchForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kick-off Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={matchForm.scheduledTime}
                        onChange={(e) => setMatchForm(prev => ({ ...prev, scheduledTime: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={matchForm.venue}
                        onChange={(e) => setMatchForm(prev => ({ ...prev, venue: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                        placeholder="e.g., Phoenix Park Pitch 1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Match Type
                      </label>
                      <select
                        value={matchForm.matchType}
                        onChange={(e) => setMatchForm(prev => ({ ...prev, matchType: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                      >
                        <option value="League">League</option>
                        <option value="Cup">Cup</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Tournament">Tournament</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={matchForm.isHomeMatch}
                        onChange={(e) => setMatchForm(prev => ({ ...prev, isHomeMatch: e.target.checked }))}
                        className="w-4 h-4 text-club-primary focus:ring-club-primary border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Home Match</span>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-club-primary hover:bg-club-primary/90 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating Match...</span>
                      </>
                    ) : (
                      <>
                        <span>Schedule Match</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Matches List */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3 text-2xl">🎯</span>
                  Scheduled Matches ({matches.length})
                </h2>
                
                {matches.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎯</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No matches scheduled</h3>
                    <p className="text-gray-500">Create your first match using the form above</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matches.map((match) => {
                      const team = teams.find(t => t.id === match.teamId);
                      return (
                        <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1">
                                {team?.name || 'Unknown Team'} vs {match.opponent}
                              </div>
                              <div className="text-sm text-gray-600 space-x-4">
                                <span>📅 {match.scheduledDate.toLocaleDateString()}</span>
                                <span>🕐 {match.scheduledDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                                <span>📍 {match.venue || (match.isHomeMatch ? 'Home' : 'Away')}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  match.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                                  match.status === 'Live' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {match.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Link
                                href={`/matches/${match.id}/record`}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                              >
                                📱 Record
                              </Link>
                              <button
                                onClick={() => deleteMatch(match.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚙️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
                <p className="text-gray-500">System settings coming soon</p>
              </div>
            </div>
          )}

        </div>
        </div>
      </div>
    </StandardLayout>
  );
}