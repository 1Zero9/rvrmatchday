/**
 * MatchDay - Public Scoreboard
 * Public version of match central showing only basic results and fixtures
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import MobileNavigationPro from "../components/mobile/MobileNavigationPro";
import AdvancedTeamFilter from "../components/AdvancedTeamFilter";
import { supabase } from "../lib/supabase";
import { Team, Match } from "../types/match-tracker";
import { MatchTypeBadge } from "../components/MatchTypeBadge";

type TabType = 'results' | 'fixtures' | 'quickrecord';

export default function MatchDay() {
  const [activeTab, setActiveTab] = useState<TabType>('results');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('all');
  const [selectedMatchTypes, setSelectedMatchTypes] = useState<Set<string>>(new Set(['League']));
  const [expandedResults, setExpandedResults] = useState<{[key: string]: boolean}>({});
  const [fullScreenMatch, setFullScreenMatch] = useState<Match | null>(null);

  const loadData = async () => {
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          id,
          name,
          age_group,
          gender,
          league,
          season,
          home_venue,
          contact_email,
          contact_phone,
          coaches,
          notes,
          is_opponent,
          is_active,
          created_at,
          updated_at,
          players(
            id,
            first_name,
            last_name,
            jersey_number,
            position,
            is_active
          )
        `)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (teamsError) {
        console.error('Error loading teams:', teamsError);
        setTeams([]);
      } else {
        const loadedTeams: Team[] = teamsData?.map(team => ({
          id: team.id,
          name: team.name,
          ageGroup: team.age_group || 'Open',
          gender: team.gender || 'Mixed',
          season: team.season || '2024-25',
          league: team.league || 'Unassigned',
          homeVenue: team.home_venue || 'St. Finian\'s GAA',
          contactEmail: team.contact_email || '',
          contactPhone: team.contact_phone || '',
          coaches: Array.isArray(team.coaches) ? team.coaches : (team.coaches ? [team.coaches] : []),
          notes: team.notes || '',
          homeKit: { primary: '#009639', secondary: '#FFFFFF' },
          awayKit: { primary: '#FFFFFF', secondary: '#009639' },
          isOpponent: team.is_opponent || false,
          isActive: team.is_active !== false,
          players: team.players?.filter((p: any) => p.is_active !== false).map((p: any) => ({
            id: p.id,
            teamId: team.id,
            name: `${p.first_name} ${p.last_name}`.trim(),
            position: p.position || 'Field Player',
            isCaptain: p.is_captain || false,
            isViceCaptain: p.is_vice_captain || false,
            isActive: p.is_active !== false,
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at || p.created_at)
          })) || [],
          createdAt: new Date(team.created_at),
          updatedAt: new Date(team.updated_at || team.created_at)
        })) || [];
        setTeams(loadedTeams);
      }

      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select(`
          id,
          team_id,
          opponent,
          scheduled_date,
          match_type,
          is_home_match,
          status,
          home_score,
          away_score,
          venue
        `)
        .order('scheduled_date', { ascending: false });

      if (matchesError) {
        console.error('Error loading matches:', matchesError);
        setAllMatches([]);
      } else {
        const loadedMatches: Match[] = matchesData?.map(match => ({
          id: match.id,
          teamId: match.team_id,
          opponent: match.opponent,
          scheduledDate: new Date(match.scheduled_date),
          venue: match.venue || 'St. Finian\'s GAA',
          isHomeMatch: match.is_home_match || false,
          matchType: match.match_type || 'Friendly',
          status: match.status || 'Scheduled',
          homeScore: match.home_score,
          awayScore: match.away_score
        })) || [];
        setAllMatches(loadedMatches);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const toggleMatchExpand = (matchId: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  // Full-screen match modal functions
  const openFullScreenMatch = (match: Match) => {
    setFullScreenMatch(match);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeFullScreenMatch = () => {
    setFullScreenMatch(null);
    document.body.style.overflow = 'unset';
  };

  // Keyboard escape functionality
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullScreenMatch) {
        closeFullScreenMatch();
      }
    };

    if (fullScreenMatch) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [fullScreenMatch]);

  useEffect(() => {
    loadData();
  }, []);

  const getRecentResults = () => {
    return allMatches
      .filter(match => 
        match.status === 'Finished' && 
        match.homeScore !== undefined && 
        match.awayScore !== undefined &&
        (selectedTeamId === 'all' || match.teamId === selectedTeamId) &&
        (selectedMatchTypes.size === 0 || selectedMatchTypes.has(match.matchType))
      )
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())
      .slice(0, 8); // Show more results with better layout
  };

  const getUpcomingFixtures = () => {
    return allMatches
      .filter(match => 
        match.status === 'Scheduled' &&
        (selectedTeamId === 'all' || match.teamId === selectedTeamId) &&
        (selectedMatchTypes.size === 0 || selectedMatchTypes.has(match.matchType))
      )
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, 8); // Show more fixtures with better layout
  };

  const getSeasonStats = () => {
    const filteredMatches = allMatches.filter(match => 
      match.status === 'Finished' && 
      match.homeScore !== undefined && 
      match.awayScore !== undefined &&
      (selectedTeamId === 'all' || match.teamId === selectedTeamId) &&
      (selectedMatchTypes.size === 0 || selectedMatchTypes.has(match.matchType))
    );

    const stats = {
      played: filteredMatches.length,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0
    };

    filteredMatches.forEach(match => {
      const result = getMatchResult(match);
      const teamScore = result.teamScore;
      const opponentScore = result.opponentScore;
      
      stats.goalsFor += teamScore;
      stats.goalsAgainst += opponentScore;
      
      if (result.result === 'W') stats.won++;
      else if (result.result === 'D') stats.drawn++;
      else if (result.result === 'L') stats.lost++;
    });

    return stats;
  };

  const getMatchResult = (match: Match) => {
    if (match.homeScore === undefined || match.awayScore === undefined) {
      return { result: 'TBD', teamScore: 0, opponentScore: 0 };
    }
    
    const teamScore = match.isHomeMatch ? match.homeScore : match.awayScore;
    const opponentScore = match.isHomeMatch ? match.awayScore : match.homeScore;
    
    let result = 'D';
    if (teamScore > opponentScore) result = 'W';
    if (teamScore < opponentScore) result = 'L';
    
    return { result, teamScore, opponentScore };
  };

  const recentResults = React.useMemo(() => getRecentResults(), [allMatches, selectedTeamId, selectedMatchTypes]);
  const upcomingFixtures = React.useMemo(() => getUpcomingFixtures(), [allMatches, selectedTeamId, selectedMatchTypes]);
  const seasonStats = React.useMemo(() => getSeasonStats(), [allMatches, selectedTeamId, selectedMatchTypes]);

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading MatchDay...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="min-h-screen">
        {/* Mobile Version - Direct branded container */}
        <div className="block md:hidden min-h-screen bg-gradient-to-br from-[var(--club-primary)] via-[var(--club-primary)] to-[var(--club-primary)]/95 relative">
          {/* Mobile Navigation */}
          <MobileNavigationPro currentPage="/matchday" />
          
          {/* Mobile Content */}
          <div className="px-4 py-6 pt-20"> {/* pt-20 to account for fixed nav */}

            {/* Mobile Tab Navigation */}
            <div className="mb-6">
              <div className="flex space-x-2">
                {[
                  { key: 'results', label: 'Recent Results', icon: '🏆', colors: 'from-emerald-500/80 to-green-600/80 border-emerald-300/40' },
                  { key: 'fixtures', label: 'Fixtures', icon: '📅', colors: 'from-blue-500/80 to-indigo-600/80 border-blue-300/40' },
                  { key: 'quickrecord', label: 'Quick Record', icon: '🚀', colors: 'from-orange-500/80 to-amber-600/80 border-orange-300/40' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as TabType)}
                    className={`flex-1 py-4 px-4 text-sm font-bold rounded-2xl transition-all duration-300 backdrop-blur-xl border-2 transform hover:scale-105 shadow-lg ${
                      activeTab === tab.key
                        ? `bg-gradient-to-br ${tab.colors} text-white shadow-xl scale-105`
                        : 'bg-white/10 text-white/80 hover:bg-white/20 border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg">{tab.icon}</span>
                      <span className="tracking-wide">{tab.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Content */}
            {activeTab === 'results' && (
              <div className="space-y-3">
                <h2 className="font-bold text-sm text-white mb-4">Recent Results</h2>
                {recentResults.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
                    <p className="text-white/70">No recent results</p>
                  </div>
                ) : (
                  recentResults.slice(0, 5).map((match, index) => {
                    const team = teams.find(t => t.id === match.teamId);
                    const result = getMatchResult(match);
                    if (!team) return null;
                    
                    return (
                      <div key={match.id} className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-white/90 font-medium">
                            {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold ${
                            result.result === 'W' ? 'bg-green-500/20 text-green-200' : 
                            result.result === 'L' ? 'bg-red-500/20 text-red-200' : 'bg-yellow-500/20 text-yellow-200'
                          }`}>
                            {result.result}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">{team.name}</div>
                            <div className="text-sm text-white/80">vs {match.opponent}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">
                              {result.teamScore} - {result.opponentScore}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'fixtures' && (
              <div className="space-y-3">
                <h2 className="font-bold text-sm text-white mb-4">Upcoming Fixtures</h2>
                {upcomingFixtures.length === 0 ? (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
                    <p className="text-white/70">No upcoming fixtures</p>
                  </div>
                ) : (
                  upcomingFixtures.slice(0, 5).map((match, index) => {
                    const team = teams.find(t => t.id === match.teamId);
                    if (!team) return null;
                    
                    return (
                      <div key={match.id} className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-white/90">
                            {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                          <div className="text-sm text-white/80">
                            {match.isHomeMatch ? 'Home' : 'Away'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">{team.name}</div>
                            <div className="text-sm text-white/80">vs {match.opponent}</div>
                          </div>
                          <div className="text-right text-sm text-white/90">
                            {match.venue}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'quickrecord' && (
              <div className="space-y-4">
                <h2 className="font-bold text-sm text-white mb-4">Quick Match Tracker</h2>
                
                {/* Quick Record Info */}
                <div className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/30 p-4 shadow-2xl">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">📱</div>
                    <h3 className="text-white font-bold text-lg mb-2">Parent Match Tracker</h3>
                    <p className="text-white/80 text-sm">
                      Simple match tracking for parents - record time, score, and basic match details
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">⏱️</span>
                        <div>
                          <h4 className="text-white font-medium text-sm">Time Tracking</h4>
                          <p className="text-white/70 text-xs">Live match timer with start/pause controls</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📊</span>
                        <div>
                          <h4 className="text-white font-medium text-sm">Score Tracking</h4>
                          <p className="text-white/70 text-xs">Simple +/- buttons for team scores</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">⚽</span>
                        <div>
                          <h4 className="text-white font-medium text-sm">Match Formats</h4>
                          <p className="text-white/70 text-xs">5v5, 7v7, 9v9, 11v11 support</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <a 
                      href="/quick-record"
                      className="relative overflow-hidden inline-block group"
                    >
                      {/* Outer glow ring */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 rounded-3xl blur-sm opacity-75 group-hover:opacity-100 animate-pulse"></div>
                      
                      {/* Main button */}
                      <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 text-white font-black py-6 px-12 rounded-3xl transition-all duration-700 transform group-hover:scale-110 shadow-2xl group-hover:shadow-[0_25px_50px_rgba(249,115,22,0.6)] border-2 border-white/30 backdrop-blur-lg group-hover:border-white/50">
                        
                        {/* Animated shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        
                        {/* Floating orbs background */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden">
                          <div className="absolute top-2 left-4 w-3 h-3 bg-yellow-200/60 rounded-full animate-pulse"></div>
                          <div className="absolute bottom-3 right-6 w-2 h-2 bg-orange-200/70 rounded-full animate-bounce"></div>
                          <div className="absolute top-1/2 right-3 w-4 h-4 bg-amber-200/60 rounded-full animate-ping"></div>
                        </div>
                        
                        {/* Button content */}
                        <div className="relative flex items-center justify-center space-x-4">
                          {/* Left icon with rotation animation */}
                          <div className="relative">
                            <span className="text-4xl group-hover:rotate-[360deg] transition-transform duration-700 inline-block">⚽</span>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping group-hover:animate-bounce"></div>
                          </div>
                          
                          {/* Main text with stagger animation */}
                          <div className="text-center">
                            <div className="text-2xl font-black tracking-wider mb-1 group-hover:text-yellow-200 transition-colors duration-300">
                              <span className="inline-block group-hover:animate-pulse">START</span>
                              <span className="inline-block ml-2 group-hover:animate-pulse" style={{animationDelay: '0.1s'}}>MATCH</span>
                            </div>
                            <div className="text-lg font-extrabold tracking-widest opacity-95 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent group-hover:from-yellow-100 group-hover:to-orange-100">RECORDER</span>
                            </div>
                          </div>
                          
                          {/* Right icon with trail effect */}
                          <div className="relative">
                            <span className="text-3xl group-hover:translate-x-2 group-hover:scale-125 transition-all duration-500 inline-block">🚀</span>
                            <div className="absolute top-1/2 left-0 w-8 h-1 bg-gradient-to-r from-orange-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-8 transition-all duration-500 transform -translate-y-1/2"></div>
                          </div>
                        </div>
                        
                        {/* Bottom energy bar */}
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:w-32 transition-all duration-500"></div>
                      </div>
                      
                      {/* Floating text above button */}
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:-translate-y-2">
                        <div className="bg-black/80 text-white text-xs font-bold py-1 px-3 rounded-full whitespace-nowrap backdrop-blur-sm border border-white/20">
                          🔥 EPIC MATCH TRACKING
                        </div>
                      </div>
                      
                      {/* Ripple effect on hover */}
                      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 rounded-3xl bg-white/10 animate-ping"></div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Brand Footer */}
            <footer className="bg-gradient-to-r from-[var(--club-primary)] to-[var(--club-secondary)] py-8 px-4 text-center mt-8 rounded-2xl border border-white/20">
              <div className="text-xs text-white space-y-2">
                <p className="font-semibold">© 2025 Rivervalley Rangers AFC</p>
                <p className="text-white/80">Powered by RVR Football Platform</p>
                <p className="text-white/70 text-xs">Community Football Since 1981</p>
              </div>
            </footer>
          </div>
        </div>

        {/* Desktop Version - Full Functionality Restored */}
        <div className="hidden md:block">
          <div className="bg-gradient-to-br from-green-50 to-blue-50">
        
        {/* Compact Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Left side - Title */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-xl text-white">⚽</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">MatchDay</h1>
                  <p className="text-sm text-gray-600">Live scores and fixtures</p>
                </div>
              </div>

              {/* Center - Tab Navigation */}
              <nav className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('results')}
                  className={`flex items-center space-x-3 py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'results'
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 border border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  <span className="text-xl">🏆</span>
                  <span>Results</span>
                </button>
                <button
                  onClick={() => setActiveTab('fixtures')}
                  className={`flex items-center space-x-3 py-3 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'fixtures'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <span className="text-xl">📅</span>
                  <span>Fixtures</span>
                </button>
              </nav>

              {/* Right side - Filters (Optimized single row layout) */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 hidden lg:block">Filters:</label>
                
                {/* Team Filter */}
                <AdvancedTeamFilter
                  teams={teams}
                  selectedTeamId={selectedTeamId}
                  onSelectionChange={setSelectedTeamId}
                  className="w-48"
                />
                
                {/* Match Type Filters - Horizontal Layout */}
                <div className="flex items-center space-x-1">
                  {[
                    { type: 'League', colors: 'from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700', bgInactive: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100', icon: '🏆' },
                    { type: 'Cup', colors: 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700', bgInactive: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100', icon: '🏅' },
                    { type: 'Friendly', colors: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700', bgInactive: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100', icon: '🤝' },
                    { type: 'Tournament', colors: 'from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700', bgInactive: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100', icon: '🎯' }
                  ].map(({ type, colors, bgInactive, icon }) => (
                    <button
                      key={type}
                      onClick={() => {
                        const newTypes = new Set(selectedMatchTypes);
                        if (newTypes.has(type)) {
                          newTypes.delete(type);
                        } else {
                          newTypes.add(type);
                        }
                        setSelectedMatchTypes(newTypes);
                      }}
                      className={`w-20 px-3 py-2 text-xs font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg ${
                        selectedMatchTypes.has(type)
                          ? `bg-gradient-to-r ${colors} text-white shadow-lg`
                          : `${bgInactive} border`
                      }`}
                      title={type}
                    >
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-sm">{icon}</span>
                        <span className="hidden xl:inline">{type}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Sidebar - Season Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sticky top-6">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl">📊</span>
                  <h3 className="text-lg font-bold text-gray-900">Season Overview</h3>
                </div>
                
                {selectedTeamId !== 'all' && (
                  <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
                    <p className="text-sm font-medium text-blue-800">
                      {teams.find(t => t.id === selectedTeamId)?.name}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Played</span>
                    <span className="text-lg font-bold text-gray-900">{seasonStats.played}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-700">Won</span>
                    <span className="text-lg font-bold text-green-600">{seasonStats.won}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-yellow-700">Drawn</span>
                    <span className="text-lg font-bold text-yellow-600">{seasonStats.drawn}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-red-700">Lost</span>
                    <span className="text-lg font-bold text-red-600">{seasonStats.lost}</span>
                  </div>

                  <hr className="my-3 border-gray-200" />

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-700">Goals For</span>
                    <span className="text-lg font-bold text-blue-600">{seasonStats.goalsFor}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-700">Goals Against</span>
                    <span className="text-lg font-bold text-purple-600">{seasonStats.goalsAgainst}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
                    <span className="text-sm font-semibold text-gray-700">Goal Difference</span>
                    <span className={`text-lg font-bold ${
                      (seasonStats.goalsFor - seasonStats.goalsAgainst) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {seasonStats.goalsFor - seasonStats.goalsAgainst >= 0 ? '+' : ''}{seasonStats.goalsFor - seasonStats.goalsAgainst}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'results' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl">🏆</span>
                    <h2 className="text-xl font-bold text-gray-900">Latest Results</h2>
                    <span className="text-sm text-gray-500">({recentResults.length} matches)</span>
                  </div>

                  {recentResults.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">⚽</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Yet</h3>
                      <p className="text-gray-600">Match results will appear here once games are played.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {recentResults.map((match, index) => {
                        const team = teams.find(t => t.id === match.teamId);
                        const result = getMatchResult(match);
                        
                        if (!team) return null;

                        return (
                          <motion.div
                            key={match.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                            onClick={() => toggleMatchExpand(match.id)}
                          >
                            <div className={`h-1 ${
                              result.result === 'W' ? 'bg-green-500' : 
                              result.result === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>
                            
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm text-gray-500">
                                    {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                                      day: 'numeric',
                                      month: 'short'
                                    })}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-900">{team.name}</span>
                                    <span className="text-gray-400">vs</span>
                                    <span className="font-semibold text-gray-900">{match.opponent}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <div className={`text-lg font-bold ${
                                    result.result === 'W' ? 'text-green-600' : 
                                    result.result === 'L' ? 'text-red-600' : 'text-yellow-600'
                                  }`}>
                                    {result.teamScore} - {result.opponentScore}
                                  </div>
                                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                                    result.result === 'W' ? 'bg-green-100 text-green-700' : 
                                    result.result === 'L' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {result.result === 'W' ? 'WIN' : result.result === 'L' ? 'LOSS' : 'DRAW'}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500 space-x-3">
                                  <span className={`px-2 py-1 rounded ${
                                    match.isHomeMatch ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                  }`}>
                                    {match.isHomeMatch ? 'HOME' : 'AWAY'}
                                  </span>
                                  <span>{match.venue}</span>
                                  <MatchTypeBadge matchType={match.matchType} />
                                </div>
                                
                                {/* Epic View Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFullScreenMatch(match);
                                  }}
                                  className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold transition-all transform hover:scale-105 shadow-sm"
                                  title="Epic View"
                                >
                                  🎬
                                </button>
                              </div>

                              {/* Expanded Content */}
                              {expandedResults[match.id] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-3 pt-3 border-t border-gray-200 overflow-hidden"
                                >
                                  <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                      <span>Match Date:</span>
                                      <span className="font-medium text-gray-900">
                                        {match.scheduledDate.toLocaleDateString('en-GB', { 
                                          weekday: 'long',
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Kick-off Time:</span>
                                      <span className="font-medium text-gray-900">
                                        {match.scheduledDate.toLocaleTimeString([], { 
                                          hour: '2-digit', 
                                          minute: '2-digit' 
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Competition:</span>
                                      <MatchTypeBadge matchType={match.matchType} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Venue:</span>
                                      <span className="font-medium text-gray-900">{match.venue}</span>
                                    </div>
                                    {match.status === 'Finished' && (
                                      <div className="flex justify-between pt-2 border-t border-gray-100">
                                        <span>Final Result:</span>
                                        <span className={`font-bold ${
                                          result.result === 'W' ? 'text-green-600' : 
                                          result.result === 'L' ? 'text-red-600' : 'text-yellow-600'
                                        }`}>
                                          {result.result === 'W' ? '🏆 VICTORY' : 
                                           result.result === 'L' ? '💪 DEFEAT' : '🤝 DRAW'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'fixtures' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl">📅</span>
                    <h2 className="text-xl font-bold text-gray-900">Upcoming Fixtures</h2>
                    <span className="text-sm text-gray-500">({upcomingFixtures.length} matches)</span>
                  </div>

                  {upcomingFixtures.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">📅</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Fixtures</h3>
                      <p className="text-gray-600">New fixtures will be added soon.</p>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {upcomingFixtures.map((match, index) => {
                        const team = teams.find(t => t.id === match.teamId);
                        if (!team) return null;

                        return (
                          <motion.div
                            key={match.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => toggleMatchExpand(match.id)}
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm font-medium text-blue-600">
                                    {new Date(match.scheduledDate).toLocaleDateString('en-GB', {
                                      weekday: 'short',
                                      day: 'numeric',
                                      month: 'short'
                                    })}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-900">{team.name}</span>
                                    <span className="text-gray-400">vs</span>
                                    <span className="font-semibold text-gray-900">{match.opponent}</span>
                                  </div>
                                </div>
                                
                                <div className="text-sm text-gray-600">
                                  {new Date(match.scheduledDate).toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                              
                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500 space-x-3">
                                  <span className={`px-2 py-1 rounded ${
                                    match.isHomeMatch ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                                  }`}>
                                    {match.isHomeMatch ? 'HOME' : 'AWAY'}
                                  </span>
                                  <span>{match.venue}</span>
                                  <MatchTypeBadge matchType={match.matchType} />
                                </div>
                                
                                {/* Epic View Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFullScreenMatch(match);
                                  }}
                                  className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold transition-all transform hover:scale-105 shadow-sm"
                                  title="Epic View"
                                >
                                  🎬
                                </button>
                              </div>

                              {/* Expanded Content */}
                              {expandedResults[match.id] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-3 pt-3 border-t border-gray-200 overflow-hidden"
                                >
                                  <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                      <span>Match Date:</span>
                                      <span className="font-medium text-gray-900">
                                        {match.scheduledDate.toLocaleDateString('en-GB', { 
                                          weekday: 'long',
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Kick-off Time:</span>
                                      <span className="font-medium text-gray-900">
                                        {match.scheduledDate.toLocaleTimeString([], { 
                                          hour: '2-digit', 
                                          minute: '2-digit' 
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Competition:</span>
                                      <MatchTypeBadge matchType={match.matchType} />
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Venue:</span>
                                      <span className="font-medium text-gray-900">{match.venue}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Status:</span>
                                      <span className="font-medium text-blue-600">SCHEDULED</span>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </div>

          </div> {/* End grid */}
        </div> {/* End container */}
          </div> {/* End desktop bg */}
        </div> {/* End desktop version */}
      </div> {/* End mobile/desktop wrapper */}

      {/* Epic Full-Screen Match Card Modal (Restored) */}
      <AnimatePresence>
        {fullScreenMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          >
            {/* Cinematic Backdrop with Particles */}
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/80 to-black/90"
              style={{
                backdropFilter: 'blur(20px) saturate(1.2)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
              }}
              onClick={closeFullScreenMatch}
            >
              {/* Animated Particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full"
                    initial={{ 
                      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                      scale: 0,
                    }}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 0.6, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Epic Card Container */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.3, opacity: 0, rotateY: 90 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 300,
                duration: 1.2 
              }}
              className="relative max-w-md w-full max-h-[70vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ delay: 0.5 }}
                onClick={closeFullScreenMatch}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/50 hover:bg-red-500/80 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Epic Match Card */}
              <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-club-primary to-club-secondary p-6 text-white">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⚽</div>
                    <h2 className="text-2xl font-bold mb-1">Epic Match</h2>
                    <p className="text-white/80">
                      {fullScreenMatch && teams.find(t => t.id === fullScreenMatch.teamId)?.name}
                    </p>
                  </div>
                </div>

                {/* Match Details */}
                {fullScreenMatch && (
                  <div className="p-6 space-y-6">
                    {/* Teams & Score */}
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-2">
                          {new Date(fullScreenMatch.scheduledDate).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(fullScreenMatch.scheduledDate).toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>

                      <div className="flex items-center justify-center space-x-6 mb-6">
                        <div className="text-center flex-1">
                          <div className="font-bold text-lg text-gray-900">
                            {teams.find(t => t.id === fullScreenMatch.teamId)?.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {fullScreenMatch.isHomeMatch ? 'HOME' : 'AWAY'}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          {fullScreenMatch.status === 'Finished' && fullScreenMatch.homeScore !== undefined && fullScreenMatch.awayScore !== undefined ? (
                            <div className="text-4xl font-bold text-gray-900">
                              {fullScreenMatch.isHomeMatch ? fullScreenMatch.homeScore : fullScreenMatch.awayScore}
                              <span className="text-gray-400 mx-2">-</span>
                              {fullScreenMatch.isHomeMatch ? fullScreenMatch.awayScore : fullScreenMatch.homeScore}
                            </div>
                          ) : (
                            <div className="text-2xl font-bold text-blue-600">VS</div>
                          )}
                        </div>
                        
                        <div className="text-center flex-1">
                          <div className="font-bold text-lg text-gray-900">
                            {fullScreenMatch.opponent}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {!fullScreenMatch.isHomeMatch ? 'HOME' : 'AWAY'}
                          </div>
                        </div>
                      </div>

                      {/* Result Badge */}
                      {fullScreenMatch.status === 'Finished' && fullScreenMatch.homeScore !== undefined && fullScreenMatch.awayScore !== undefined && (
                        <div className="mb-6">
                          {(() => {
                            const result = getMatchResult(fullScreenMatch);
                            return (
                              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full font-bold ${
                                result.result === 'W' ? 'bg-green-100 text-green-700' :
                                result.result === 'L' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                <span className="text-xl">
                                  {result.result === 'W' ? '🏆' : result.result === 'L' ? '💪' : '🤝'}
                                </span>
                                <span>
                                  {result.result === 'W' ? 'VICTORY' : result.result === 'L' ? 'DEFEAT' : 'DRAW'}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Match Info */}
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Competition</span>
                        <div className="flex items-center space-x-2">
                          <MatchTypeBadge matchType={fullScreenMatch.matchType} />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Venue</span>
                        <span className="text-sm font-medium text-gray-900">{fullScreenMatch.venue}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className={`text-sm font-medium ${
                          fullScreenMatch.status === 'Finished' ? 'text-green-600' :
                          fullScreenMatch.status === 'Live' ? 'text-red-600' : 'text-blue-600'
                        }`}>
                          {fullScreenMatch.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          window.open('/match-recorder', '_blank');
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all"
                      >
                        📊 Match Recorder
                      </button>
                      
                      <button
                        onClick={closeFullScreenMatch}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </StandardLayout>
  );
}