/**
 * Unified Match Central Dashboard - Clean Theme
 * Consolidates live dashboard, fixtures, results, tables, and match tracker
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import CelebrationResultCard from "../components/CelebrationResultCard";
import { storageV2 as storage } from "../lib/match-tracker-storage-v2";
import { Team, TeamSummary, Match } from "../types/match-tracker";

type TabType = 'overview' | 'fixtures' | 'management' | 'statistics';

export default function MatchCentral() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<TeamSummary[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [overviewFilter, setOverviewFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [expandedResults, setExpandedResults] = useState<{[key: string]: boolean}>({});
  const [allMatches, setAllMatches] = useState<Match[]>([]);

  const toggleMatchExpand = (matchId: string) => {
    setExpandedResults(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  const hasExtraInfo = (match: Match) => {
    // Check if match has additional information to show when expanded
    return match.veoRecording || 
           match.veoUrl ||
           (match.notes && match.notes.length > 0) ||
           (match.playerOfTheMatch && match.playerOfTheMatch.length > 0) ||
           (match.yellowCards && match.yellowCards.length > 0) ||
           (match.redCards && match.redCards.length > 0) ||
           (match.attendance && match.attendance > 0);
  };

  const loadData = async () => {
    try {
      // Initialize sample data
      storage.initializeSampleData();
      
      // Load teams
      const loadedTeams = await storage.getTeams();
      setTeams(loadedTeams);
      
      // Load all matches
      const loadedMatches = await storage.getMatches();
      setAllMatches(loadedMatches);
      
      // Load team summaries
      const summaries = await Promise.all(
        loadedTeams.map(async team => await storage.getTeamSummary(team.id))
      );
      
      setTeamSummaries(summaries.filter(Boolean) as TeamSummary[]);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Handle hash routing
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'fixtures', 'management', 'statistics'].includes(hash)) {
      setActiveTab(hash as TabType);
    }
  }, []);

  // Get actual match data for fixtures and results
  const getUpcomingMatches = () => {
    const upcoming = allMatches
      .filter(match => match.status === 'Scheduled')
      .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
      .slice(0, 10);
    
    if (selectedTeam === 'all') {
      return upcoming;
    }
    
    return upcoming.filter(match => match.teamId === selectedTeam);
  };

  const getRecentResults = () => {
    const finished = allMatches
      .filter(match => match.status === 'Finished')
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())
      .slice(0, 10);
    
    if (selectedTeam === 'all') {
      return finished;
    }
    
    return finished.filter(match => match.teamId === selectedTeam);
  };

  // Recalculate data when selectedTeam changes
  const upcomingMatches = React.useMemo(() => getUpcomingMatches(), [selectedTeam, allMatches]);
  const recentResults = React.useMemo(() => getRecentResults(), [selectedTeam, allMatches]);

  // Get filtered results for overview
  const getFilteredOverviewResults = () => {
    const finished = allMatches
      .filter(match => match.status === 'Finished')
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
    
    if (overviewFilter === 'all') {
      return finished;
    }
    
    return finished.filter(match => match.teamId === overviewFilter);
  };

  const filteredOverviewResults = React.useMemo(() => getFilteredOverviewResults(), [overviewFilter, allMatches]);

  // Generate league table from match results
  const getLeagueTable = () => {
    const teamStats = new Map();
    
    // Initialize team stats
    teams.forEach(team => {
      if (!team.isOpponent) {
        teamStats.set(team.id, {
          team: team,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0
        });
      }
    });

    // Process finished matches
    const finishedMatches = allMatches.filter(match => match.status === 'Finished');
    
    finishedMatches.forEach(match => {
      if (match.homeScore !== undefined && match.awayScore !== undefined) {
        const stats = teamStats.get(match.teamId);
        if (stats) {
          stats.played++;
          
          const teamScore = match.isHomeMatch ? match.homeScore : match.awayScore;
          const opponentScore = match.isHomeMatch ? match.awayScore : match.homeScore;
          
          stats.goalsFor += teamScore;
          stats.goalsAgainst += opponentScore;
          stats.goalDifference = stats.goalsFor - stats.goalsAgainst;
          
          if (teamScore > opponentScore) {
            stats.won++;
            stats.points += 3;
          } else if (teamScore === opponentScore) {
            stats.drawn++;
            stats.points += 1;
          } else {
            stats.lost++;
          }
        }
      }
    });

    // Convert to array and sort by points, then goal difference, then goals for
    return Array.from(teamStats.values())
      .filter(stats => stats.played > 0) // Only show teams that have played
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
      });
  };

  const leagueTable = React.useMemo(() => getLeagueTable(), [teams]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Update URL hash without page reload
    window.history.replaceState(null, '', `#${tab}`);
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

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading Match Central...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊', public: true },
    { id: 'fixtures', label: 'Fixtures', icon: '📅', public: true },
    { id: 'statistics', label: 'Statistics', icon: '📈', public: true },
    { id: 'management', label: 'Management', icon: '⚙️', public: false }
  ];

  return (
    <div className="min-h-screen">
      {/* Mobile-Only Design */}
      <div className="block md:hidden bg-white">
        {/* Simplified Mobile Header */}
        <div className="bg-club-primary text-white p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">Match Central</h1>
            <a
              href="/match-recorder"
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1"
            >
              <span>🔴</span>
              <span className="text-sm">Record</span>
            </a>
          </div>
        </div>

        {/* Simple Tab Bar */}
        <div className="bg-white border-b border-gray-200 px-4">
          <nav className="flex space-x-1">
            <button
              onClick={() => handleTabChange('overview')}
              className={`py-3 px-4 font-medium text-sm transition-all ${
                activeTab === 'overview'
                  ? 'border-b-2 border-club-primary text-club-primary'
                  : 'text-gray-500'
              }`}
            >
              Results
            </button>
            <button
              onClick={() => handleTabChange('fixtures')}
              className={`py-3 px-4 font-medium text-sm transition-all ${
                activeTab === 'fixtures'
                  ? 'border-b-2 border-club-primary text-club-primary'
                  : 'text-gray-500'
              }`}
            >
              Fixtures
            </button>
            <button
              onClick={() => handleTabChange('statistics')}
              className={`py-3 px-4 font-medium text-sm transition-all ${
                activeTab === 'statistics'
                  ? 'border-b-2 border-club-primary text-club-primary'
                  : 'text-gray-500'
              }`}
            >
              📊 Stats
            </button>
          </nav>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {/* Mobile Overview */}
          {activeTab === 'overview' && (
            <div>
              {/* Simple Filter */}
              {teams.filter(team => !team.isOpponent).length > 1 && (
                <div className="mb-4">
                  <select
                    value={overviewFilter}
                    onChange={(e) => setOverviewFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Teams</option>
                    {teams.filter(team => !team.isOpponent).map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Mobile Match Cards */}
              <div className="space-y-3">
                {filteredOverviewResults.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">⚽</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">No Results Yet</h3>
                    <a
                      href="/match-recorder"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      <span>🔴</span>
                      Record Match
                    </a>
                  </div>
                ) : (
                  filteredOverviewResults.map((match) => {
                    const team = teams.find(t => t.id === match.teamId);
                    const result = getMatchResult(match);
                    const isExpanded = expandedResults[match.id];
                    const hasExtra = hasExtraInfo(match);
                    
                    if (!team) return null;

                    return (
                      <div
                        key={match.id}
                        className="bg-white rounded-lg border shadow-sm"
                      >
                        {/* Compact Mobile Card */}
                        <div 
                          className={`p-3 ${hasExtra ? 'cursor-pointer' : ''}`}
                          onClick={() => hasExtra && toggleMatchExpand(match.id)}
                        >
                          <div className="flex items-center justify-between">
                            {/* Teams & Date */}
                            <div className="flex-1">
                              <div className="text-sm font-bold text-gray-900 mb-1">
                                {team.name} vs {match.opponent}
                              </div>
                              <div className="text-xs text-gray-600">
                                {new Date(match.scheduledDate).toLocaleDateString()}
                              </div>
                            </div>
                            
                            {/* Score */}
                            <div className="text-right">
                              <div className="text-xl font-black text-gray-900">
                                {result.teamScore} - {result.opponentScore}
                              </div>
                              <div className={`text-xs font-bold px-2 py-1 rounded ${
                                result.result === 'W' ? 'bg-green-100 text-green-700' :
                                result.result === 'L' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {result.result === 'W' ? 'WIN' : result.result === 'L' ? 'LOSS' : 'DRAW'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Details */}
                        {hasExtra && isExpanded && (
                          <div className="border-t border-gray-100 bg-gray-50 p-3">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {match.playerOfTheMatch && (
                                <div className="text-center p-2 bg-yellow-100 rounded">
                                  <div>⭐ Player of Match</div>
                                  <div className="font-bold">{match.playerOfTheMatch}</div>
                                </div>
                              )}
                              {match.attendance && (
                                <div className="text-center p-2 bg-blue-100 rounded">
                                  <div>👥 Attendance</div>
                                  <div className="font-bold">{match.attendance}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Mobile Fixtures */}
          {activeTab === 'fixtures' && (
            <div className="space-y-3">
              {upcomingMatches.map((match) => {
                const team = teams.find(t => t.id === match.teamId);
                return (
                  <div key={match.id} className="bg-white rounded-lg border shadow-sm p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {team?.name || 'Unknown'} vs {match.opponent}
                        </div>
                        <div className="text-xs text-gray-600">
                          {match.scheduledDate.toLocaleDateString()} • {match.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <a
                        href={`/matches/${match.id}/record`}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                      >
                        Record
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mobile Statistics */}
          {activeTab === 'statistics' && (
            <div>
              {/* Team Selector */}
              <div className="mb-4">
                <select className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm">
                  <option value="">Select Team</option>
                  <option value="u16-boys">U16 Boys</option>
                  <option value="u14-girls">U14 Girls</option>
                  <option value="seniors">Senior Team</option>
                  <option value="u12-mixed">U12 Mixed</option>
                </select>
              </div>

              {/* Mobile Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-green-600">12</div>
                  <div className="text-xs text-gray-600">Played</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-blue-600">8</div>
                  <div className="text-xs text-gray-600">Wins</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-yellow-600">2</div>
                  <div className="text-xs text-gray-600">Draws</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-red-600">2</div>
                  <div className="text-xs text-gray-600">Losses</div>
                </div>
              </div>

              {/* Goals & Performance */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">32</div>
                  <div className="text-xs text-gray-600">Goals For</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">18</div>
                  <div className="text-xs text-gray-600">Against</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-green-600">+14</div>
                  <div className="text-xs text-gray-600">Difference</div>
                </div>
              </div>

              {/* Recent Form */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">📈 Recent Form</h3>
                <div className="flex space-x-1 justify-center">
                  <span className="w-8 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                  <span className="w-8 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                  <span className="w-8 h-8 bg-yellow-500 rounded text-white text-xs flex items-center justify-center">D</span>
                  <span className="w-8 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                  <span className="w-8 h-8 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">⭐ Top Performers</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Most POTM:</span>
                    <span className="font-medium">Jamie O'Brien (3)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Scorer:</span>
                    <span className="font-medium">Alex Murphy (8)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Attendance:</span>
                    <span className="font-medium">450</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Design - Hidden on Mobile */}
      <div className="hidden md:block">
        <StandardLayout>
          <div className="min-h-screen bg-gray-50">
            {/* Simplified Mobile Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
                {/* Desktop Layout */}
                <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-club-primary rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-white">⚽</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Match Central</h1>
                  <p className="text-gray-600 mt-1">Complete football match management system</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Navigation Tabs */}
                <nav className="flex space-x-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                        activeTab === tab.id
                          ? 'bg-club-primary text-white shadow-md'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-base">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </nav>
                
                {/* Divider */}
                <div className="h-8 w-px bg-gray-300"></div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <a
                    href="/match-recorder"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <span className="text-lg">🔴</span>
                    <span className="hidden sm:inline">Record</span>
                  </a>
                  <a
                    href="/match-admin"
                    className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <span className="text-lg">⚙️</span>
                    <span className="hidden sm:inline">Admin</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-4 md:py-8">

        {/* Team Filter (for management) */}
        {(activeTab === 'management') && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Filter by team:</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
              >
                <option value="all">All Teams</option>
                {teams.filter(team => !team.isOpponent).map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Filter Bar - Enhanced Features Style */}
              <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-6 mb-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">🏆</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Match Results</h2>
                      <p className="text-sm text-gray-600">Track your team's performance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Filter:</label>
                    <select
                      value={overviewFilter}
                      onChange={(e) => setOverviewFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 shadow-sm"
                    >
                      <option value="all">All Teams</option>
                      {teams.filter(team => !team.isOpponent).map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-3">
                {filteredOverviewResults.length === 0 ? (
                  <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl shadow-lg border border-gray-100 p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-white text-3xl">⚽</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Results Yet!</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                      {overviewFilter === 'all' 
                        ? 'Play some matches and results will appear here!' 
                        : `No results yet for ${teams.find(t => t.id === overviewFilter)?.name || 'this team'}`
                      }
                    </p>
                    <a
                      href="/match-recorder"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                    >
                      <span className="text-xl">🔴</span>
                      <span>Record Your First Match</span>
                    </a>
                  </div>
                ) : (
                  filteredOverviewResults.map((match, index) => {
                    const team = teams.find(t => t.id === match.teamId);
                    const result = getMatchResult(match);
                    const isExpanded = expandedResults[match.id];
                    const hasExtra = hasExtraInfo(match);
                    
                    if (!team) return null;

                    return (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className={`bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden relative ${
                          hasExtra ? 'cursor-pointer' : ''
                        }`}
                        onClick={() => hasExtra && toggleMatchExpand(match.id)}
                      >
                        {/* Result Indicator Strip - Enhanced */}
                        <div className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-xl ${
                          result.result === 'W' ? 'bg-gradient-to-b from-green-400 to-green-600' : 
                          result.result === 'L' ? 'bg-gradient-to-b from-red-400 to-red-600' : 'bg-gradient-to-b from-yellow-400 to-yellow-600'
                        }`}></div>
                        
                        {/* Main Card Content - Enhanced Layout */}
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            
                            {/* Left Side - Match Info */}
                            <div className="flex-1 pr-4">
                              {/* Teams */}
                              <div className="flex items-center gap-4 mb-3">
                                <div className="text-xl font-bold text-gray-900">
                                  {team.name}
                                </div>
                                <span className="text-gray-400 font-bold text-lg">vs</span>
                                <div className="text-xl font-bold text-gray-900">
                                  {match.opponent}
                                </div>
                              </div>
                              
                              {/* Match Details */}
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span className="font-semibold bg-white/70 px-2 py-1 rounded-lg">
                                  {new Date(match.scheduledDate).toLocaleDateString()}
                                </span>
                                <span className={`px-3 py-1 rounded-lg font-semibold shadow-sm ${
                                  match.isHomeMatch 
                                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700' 
                                    : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
                                }`}>
                                  {match.isHomeMatch ? '🏠 HOME' : '✈️ AWAY'}
                                </span>
                                <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-lg font-semibold shadow-sm">
                                  {match.matchType}
                                </span>
                              </div>
                            </div>

                            {/* Right Side - Score & Actions */}
                            <div className="flex items-center gap-4">
                              {/* Edit Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/match-recorder?edit=${match.id}`);
                                }}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-110"
                                title="Edit match"
                              >
                                ✏️
                              </button>
                              
                              {/* Delete Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Are you sure you want to delete this match result?')) {
                                    storage.deleteMatch(match.id);
                                    loadData();
                                  }
                                }}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-110"
                                title="Delete match"
                              >
                                🗑️
                              </button>
                              
                              {/* Score Display */}
                              <div className="text-center bg-white/70 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className={`text-4xl font-black ${
                                    result.teamScore > result.opponentScore ? 'text-green-600' : 'text-gray-700'
                                  }`}>
                                    {result.teamScore}
                                  </span>
                                  <span className="text-gray-400 text-3xl font-bold">-</span>
                                  <span className={`text-4xl font-black ${
                                    result.opponentScore > result.teamScore ? 'text-green-600' : 'text-gray-700'
                                  }`}>
                                    {result.opponentScore}
                                  </span>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
                                  result.result === 'W' ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700' :
                                  result.result === 'L' ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700' :
                                  'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700'
                                }`}>
                                  {result.result === 'W' ? '🏆 WIN' : result.result === 'L' ? '💔 LOSS' : '🤝 DRAW'}
                                </div>
                              </div>
                              
                              {/* Expand Arrow */}
                              {hasExtra && (
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-gray-400 hover:text-blue-600 transition-colors p-3 rounded-xl hover:bg-blue-50 shadow-sm hover:shadow-md"
                                >
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expandable Extra Details */}
                        {hasExtra && (
                          <motion.div
                            initial={false}
                            animate={{ 
                              height: isExpanded ? 'auto' : 0,
                              opacity: isExpanded ? 1 : 0
                            }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                
                                {match.playerOfTheMatch && (
                                  <div className="text-center p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 backdrop-blur-sm border border-yellow-300 rounded-xl shadow-sm">
                                    <div className="text-xl mb-2">⭐</div>
                                    <div className="text-xs text-gray-600 font-medium">Player of Match</div>
                                    <div className="text-sm font-bold text-gray-900">{match.playerOfTheMatch}</div>
                                  </div>
                                )}
                                
                                {match.attendance && match.attendance > 0 && (
                                  <div className="text-center p-3 bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300 rounded-xl shadow-sm">
                                    <div className="text-xl mb-2">👥</div>
                                    <div className="text-xs text-gray-600 font-medium">Attendance</div>
                                    <div className="text-sm font-bold text-gray-900">{match.attendance}</div>
                                  </div>
                                )}

                                {match.yellowCards && (
                                  <div className="text-center p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 backdrop-blur-sm border border-yellow-300 rounded-xl shadow-sm">
                                    <div className="text-xl mb-2">🟨</div>
                                    <div className="text-xs text-gray-600 font-medium">Yellow Cards</div>
                                    <div className="text-sm font-bold text-gray-900">{match.yellowCards}</div>
                                  </div>
                                )}

                                {match.redCards && (
                                  <div className="text-center p-3 bg-gradient-to-br from-red-100 to-red-200 border border-red-300 rounded-xl shadow-sm">
                                    <div className="text-xl mb-2">🟥</div>
                                    <div className="text-xs text-gray-600 font-medium">Red Cards</div>
                                    <div className="text-sm font-bold text-gray-900">{match.redCards}</div>
                                  </div>
                                )}

                                {match.referee && (
                                  <div className="text-center p-3 bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-xl shadow-sm">
                                    <div className="text-xl mb-2">👨‍⚖️</div>
                                    <div className="text-xs text-gray-600 font-medium">Referee</div>
                                    <div className="text-sm font-bold text-gray-900">{match.referee}</div>
                                  </div>
                                )}

                                {match.weather && (
                                  <div className="text-center p-3 bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300 rounded-xl shadow-sm">
                                    <div className="text-xl mb-2">🌤️</div>
                                    <div className="text-xs text-gray-600 font-medium">Weather</div>
                                    <div className="text-sm font-bold text-gray-900">{match.weather}</div>
                                  </div>
                                )}
                              </div>
                              
                              {match.notes && (
                                <div className="mt-4 p-4 bg-white/80 border border-gray-300 rounded-xl shadow-sm">
                                  <div className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2">
                                    <span>📝</span>
                                    Match Notes
                                  </div>
                                  <div className="text-sm text-gray-700">{match.notes}</div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* Management Tab - Requires Authentication */}
          {activeTab === 'management' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h3>
                  <p className="text-gray-600 mb-6">
                    Team management features require authentication. Please log in to access match creation, editing, and team management tools.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">🎯 Management Features</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Create and schedule new matches</li>
                        <li>• Edit match details and results</li>
                        <li>• Manage team rosters and information</li>
                        <li>• Access detailed match statistics</li>
                        <li>• Admin tools for club management</li>
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href="/match-admin"
                        className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-bold transition-colors flex items-center justify-center shadow-xl hover:shadow-2xl"
                      >
                        <span className="mr-3 text-xl">🔑</span>
                        <div>
                          <div className="text-lg">Match Admin</div>
                          <div className="text-xs opacity-90">Management Access</div>
                        </div>
                      </a>
                    </div>
                    
                    <div className="text-sm text-gray-500 border-t pt-4 mt-6">
                      <p>Don't have an account? Contact the club administrator to request access.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Fixtures Tab */}
          {activeTab === 'fixtures' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-white to-blue-50 rounded-xl shadow-lg border border-blue-100 p-6 mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">📅</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Upcoming Fixtures</h2>
                    <p className="text-sm text-gray-600">
                      {upcomingMatches.length} match{upcomingMatches.length !== 1 ? 'es' : ''} scheduled
                    </p>
                  </div>
                </div>
                  
                  <div className="space-y-4">
                    {upcomingMatches.length === 0 ? (
                      <div className="bg-gradient-to-br from-white via-gray-50 to-purple-50 rounded-xl p-8 text-center shadow-lg border border-purple-100">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <span className="text-white text-3xl">📅</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">No Fixtures Scheduled</h3>
                        <p className="text-gray-600 mb-6">
                          {selectedTeam === 'all' ? 'Schedule upcoming matches to see them here' : 'No upcoming fixtures for selected team'}
                        </p>
                        <a
                          href="/match-recorder"
                          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                        >
                          <span className="text-xl">📅</span>
                          <span>Schedule a Match</span>
                        </a>
                      </div>
                    ) : (
                      upcomingMatches.map((match, index) => {
                        const team = teams.find(t => t.id === match.teamId);
                        return (
                          <motion.div 
                            key={match.id} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            className="bg-gradient-to-br from-white via-gray-50 to-purple-50 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden relative"
                          >
                            {/* Future Match Indicator Strip */}
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-400 to-purple-600 rounded-l-xl"></div>
                            
                            {/* Card Content */}
                            <div className="p-6">
                              <div className="flex items-center justify-between">
                                
                                {/* Left Side - Match Info */}
                                <div className="flex-1 pr-4">
                                  {/* Teams */}
                                  <div className="flex items-center gap-4 mb-3">
                                    <div className="text-xl font-bold text-gray-900">
                                      {team.name}
                                    </div>
                                    <span className="text-gray-400 font-bold text-lg">vs</span>
                                    <div className="text-xl font-bold text-gray-900">
                                      {match.opponent}
                                    </div>
                                  </div>
                                  
                                  {/* Match Details */}
                                  <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <span className="font-semibold bg-white/70 px-2 py-1 rounded-lg">
                                      {match.scheduledDate.toLocaleDateString()}
                                    </span>
                                    <span className="font-semibold bg-white/70 px-2 py-1 rounded-lg">
                                      {match.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg font-semibold shadow-sm ${
                                      match.isHomeMatch 
                                        ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700' 
                                        : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700'
                                    }`}>
                                      {match.isHomeMatch ? '🏠 HOME' : '✈️ AWAY'}
                                    </span>
                                    <span className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-lg font-semibold shadow-sm">
                                      {match.matchType}
                                    </span>
                                  </div>
                                </div>

                                {/* Right Side - Actions */}
                                <div className="flex items-center gap-4">
                                  {/* Edit Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/match-recorder?edit=${match.id}`);
                                    }}
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-3 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-110"
                                    title="Edit fixture"
                                  >
                                    ✏️
                                  </button>
                                  
                                  {/* Delete Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm('Are you sure you want to delete this fixture?')) {
                                        storage.deleteMatch(match.id);
                                        loadData();
                                      }
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-xl transition-all shadow-sm hover:shadow-md transform hover:scale-110"
                                    title="Delete fixture"
                                  >
                                    🗑️
                                  </button>
                                  
                                  {/* Action Button */}
                                  <a
                                    href={`/matches/${match.id}/record`}
                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                                  >
                                    📱 Record
                                  </a>
                                  
                                  {/* Fixture Badge */}
                                  <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-200 text-blue-700 rounded-xl text-sm font-bold shadow-sm">
                                    📅 FIXTURE
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
            </motion.div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'statistics' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-white to-purple-50 rounded-xl shadow-lg border border-purple-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">📊</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Season Statistics</h2>
                      <p className="text-sm text-gray-600">Team performance analytics</p>
                    </div>
                  </div>
                  
                  {/* Team Selector for Stats */}
                  <select className="border border-gray-300 rounded-xl px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    <option value="">Select Team</option>
                    <option value="u16-boys">U16 Boys</option>
                    <option value="u14-girls">U14 Girls</option>
                    <option value="seniors">Senior Team</option>
                    <option value="u12-mixed">U12 Mixed</option>
                  </select>
                </div>

                {/* Stats Grid - Enhanced */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="text-2xl mb-2">⚽</div>
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-xs text-gray-600 font-medium">Matches Played</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-xs text-gray-600 font-medium">Wins</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="text-2xl mb-2">🤝</div>
                    <div className="text-2xl font-bold text-yellow-600">2</div>
                    <div className="text-xs text-gray-600 font-medium">Draws</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="text-2xl mb-2">💔</div>
                    <div className="text-2xl font-bold text-red-600">2</div>
                    <div className="text-xs text-gray-600 font-medium">Losses</div>
                  </motion.div>
                </div>

                {/* Detailed Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-900">32</div>
                    <div className="text-xs text-gray-600">Goals For</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-900">18</div>
                    <div className="text-xs text-gray-600">Goals Against</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-green-600">+14</div>
                    <div className="text-xs text-gray-600">Goal Difference</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-900">450</div>
                    <div className="text-xs text-gray-600">Avg Attendance</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-yellow-600">15</div>
                    <div className="text-xs text-gray-600">Total Cards</div>
                  </div>
                </div>

                {/* Top Performers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="mr-2">⭐</span>
                      Top Performers
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Most POTM:</span>
                        <span className="font-medium">Jamie O'Brien (3)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Top Scorer:</span>
                        <span className="font-medium">Alex Murphy (8 goals)</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="mr-2">🏠</span>
                      Home vs Away
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Home Record:</span>
                        <span className="font-medium text-green-600">6W-1D-0L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Away Record:</span>
                        <span className="font-medium text-blue-600">2W-1D-2L</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                      <span className="mr-2">📈</span>
                      Recent Form
                    </h3>
                    <div className="flex space-x-1 mb-2">
                      <span className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                      <span className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                      <span className="w-6 h-6 bg-yellow-500 rounded text-white text-xs flex items-center justify-center">D</span>
                      <span className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                      <span className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center">W</span>
                    </div>
                    <p className="text-xs text-gray-600">Last 5 matches</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
        </div>
          </div>
        </StandardLayout>
      </div>
    </div>
  );
}