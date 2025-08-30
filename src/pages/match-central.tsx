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
import { storage } from "../lib/match-tracker-storage";
import { Team, TeamSummary, Match } from "../types/match-tracker";

type TabType = 'overview' | 'fixtures' | 'management';

export default function MatchCentral() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<TeamSummary[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [overviewFilter, setOverviewFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [expandedResults, setExpandedResults] = useState<{[key: string]: boolean}>({});

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

  const loadData = () => {
    // Initialize sample data
    storage.initializeSampleData();
    
    // Load teams
    const loadedTeams = storage.getTeams();
    setTeams(loadedTeams);
    
    // Load team summaries
    const summaries = loadedTeams
      .map(team => storage.getTeamSummary(team.id))
      .filter(Boolean) as TeamSummary[];
    
    setTeamSummaries(summaries);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Handle hash routing
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'fixtures', 'management'].includes(hash)) {
      setActiveTab(hash as TabType);
    }
  }, []);

  // Get actual match data for fixtures and results
  const getUpcomingMatches = () => {
    const allMatches = storage.getMatches();
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
    const allMatches = storage.getMatches();
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
  const upcomingMatches = React.useMemo(() => getUpcomingMatches(), [selectedTeam, teams]);
  const recentResults = React.useMemo(() => getRecentResults(), [selectedTeam, teams]);

  // Get filtered results for overview
  const getFilteredOverviewResults = () => {
    const allMatches = storage.getMatches();
    const finished = allMatches
      .filter(match => match.status === 'Finished')
      .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime());
    
    if (overviewFilter === 'all') {
      return finished;
    }
    
    return finished.filter(match => match.teamId === overviewFilter);
  };

  const filteredOverviewResults = React.useMemo(() => getFilteredOverviewResults(), [overviewFilter, teams]);

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
    const finishedMatches = storage.getMatches().filter(match => match.status === 'Finished');
    
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
    { id: 'management', label: 'Management', icon: '⚙️', public: false }
  ];

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Simplified Mobile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
            {/* Mobile Layout */}
            <div className="block md:hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-club-primary rounded-xl flex items-center justify-center">
                    <span className="text-xl text-white">⚽</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Match Central</h1>
                  </div>
                </div>
                <a
                  href="/match-recorder"
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold transition-all flex items-center space-x-1 shadow-lg"
                >
                  <span className="text-lg">🔴</span>
                  <span className="text-sm">Record</span>
                </a>
              </div>
              
              {/* Mobile Tabs - Horizontal Scroll */}
              <nav className="flex space-x-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-4 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-club-primary text-white shadow-md'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between">
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
              className="relative min-h-screen"
            >
              {/* Hero Background with Glass Effect */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden">
                <img 
                  src="/images/homepg-image3.jpg" 
                  alt="Match background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
              
              <div className="relative z-10 p-3 md:p-8">
                {/* Filter Bar */}
                <div className="bg-white/90 backdrop-blur-md border border-white/30 rounded-xl p-3 md:p-4 mb-4 md:mb-6 shadow-xl">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span>🏆</span>
                      Match Results
                    </h2>
                    <div className="flex items-center gap-2 md:gap-3">
                      <label className="text-sm font-medium text-gray-700">Filter:</label>
                      <select
                        value={overviewFilter}
                        onChange={(e) => setOverviewFilter(e.target.value)}
                        className="px-2 py-1 md:px-3 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900 text-sm"
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
                  <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                    <div className="text-4xl mb-4">⚽</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">No Results Yet!</h3>
                    <p className="text-gray-600 mb-6">
                      {overviewFilter === 'all' 
                        ? 'Play some matches and results will appear here!' 
                        : `No results yet for ${teams.find(t => t.id === overviewFilter)?.name || 'this team'}`
                      }
                    </p>
                    <a
                      href="/match-recorder"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <span>🔴</span>
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
                        className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden ${
                          hasExtra ? 'cursor-pointer' : ''
                        }`}
                        onClick={() => hasExtra && toggleMatchExpand(match.id)}
                      >
                        {/* Result Indicator */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          result.result === 'W' ? 'bg-green-500' : 
                          result.result === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        
                        {/* Compact Match Card */}
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            
                            {/* Team Names - Left Side */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="text-base font-bold text-gray-900">
                                  {team.name}
                                </div>
                                <span className="text-gray-400 text-sm">vs</span>
                                <div className="text-base font-bold text-gray-900">
                                  {match.opponent}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span>{new Date(match.scheduledDate).toLocaleDateString()}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  match.isHomeMatch 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {match.isHomeMatch ? 'HOME' : 'AWAY'}
                                </span>
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  {match.matchType}
                                </span>
                              </div>
                            </div>

                            {/* Score - Right Side */}
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <span className={`text-2xl font-black ${
                                    result.teamScore > result.opponentScore ? 'text-green-600' : 'text-gray-700'
                                  }`}>
                                    {result.teamScore}
                                  </span>
                                  <span className="text-gray-400 text-xl font-bold">-</span>
                                  <span className={`text-2xl font-black ${
                                    result.opponentScore > result.teamScore ? 'text-green-600' : 'text-gray-700'
                                  }`}>
                                    {result.opponentScore}
                                  </span>
                                </div>
                                <div className={`text-center mt-1 px-2 py-1 rounded text-xs font-bold ${
                                  result.result === 'W' ? 'bg-green-100 text-green-700' :
                                  result.result === 'L' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {result.result === 'W' ? 'WIN' : result.result === 'L' ? 'LOSS' : 'DRAW'}
                                </div>
                              </div>
                              
                              {/* Expand Arrow */}
                              {hasExtra && (
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
                            <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                
                                {match.playerOfTheMatch && (
                                  <div className="text-center p-2 bg-yellow-100/80 backdrop-blur-sm border border-yellow-300/50 rounded-lg">
                                    <div className="text-lg mb-1">⭐</div>
                                    <div className="text-xs text-gray-600">Player of Match</div>
                                    <div className="text-xs font-bold text-gray-900">{match.playerOfTheMatch}</div>
                                  </div>
                                )}
                                
                                {match.attendance && match.attendance > 0 && (
                                  <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded">
                                    <div className="text-lg mb-1">👥</div>
                                    <div className="text-xs text-gray-600">Attendance</div>
                                    <div className="text-xs font-bold text-gray-900">{match.attendance}</div>
                                  </div>
                                )}

                                {match.yellowCards && (
                                  <div className="text-center p-2 bg-yellow-100/80 backdrop-blur-sm border border-yellow-300/50 rounded-lg">
                                    <div className="text-lg mb-1">🟨</div>
                                    <div className="text-xs text-gray-600">Yellow Cards</div>
                                    <div className="text-xs font-bold text-gray-900">{match.yellowCards}</div>
                                  </div>
                                )}

                                {match.redCards && (
                                  <div className="text-center p-2 bg-red-50 border border-red-200 rounded">
                                    <div className="text-lg mb-1">🟥</div>
                                    <div className="text-xs text-gray-600">Red Cards</div>
                                    <div className="text-xs font-bold text-gray-900">{match.redCards}</div>
                                  </div>
                                )}

                                {match.referee && (
                                  <div className="text-center p-2 bg-gray-50 border border-gray-200 rounded">
                                    <div className="text-lg mb-1">👨‍⚖️</div>
                                    <div className="text-xs text-gray-600">Referee</div>
                                    <div className="text-xs font-bold text-gray-900">{match.referee}</div>
                                  </div>
                                )}

                                {match.weather && (
                                  <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded">
                                    <div className="text-lg mb-1">🌤️</div>
                                    <div className="text-xs text-gray-600">Weather</div>
                                    <div className="text-xs font-bold text-gray-900">{match.weather}</div>
                                  </div>
                                )}
                              </div>
                              
                              {match.notes && (
                                <div className="mt-3 p-3 bg-white border border-gray-200 rounded">
                                  <div className="text-xs text-gray-600 font-medium mb-1">📝 Match Notes</div>
                                  <div className="text-xs text-gray-700">{match.notes}</div>
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
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3">📅</span>
                    Upcoming Fixtures
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({upcomingMatches.length} matches)
                    </span>
                  </h2>
                  
                  <div className="space-y-4">
                    {upcomingMatches.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {selectedTeam === 'all' ? 'No upcoming fixtures scheduled' : 'No upcoming fixtures for selected team'}
                      </div>
                    ) : (
                      upcomingMatches.map((match) => {
                        const team = teams.find(t => t.id === match.teamId);
                        return (
                          <div key={match.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{team?.name || 'Unknown Team'}</div>
                              <div className="text-sm text-gray-600">vs {match.opponent}</div>
                              <div className="text-xs text-club-primary">{match.matchType} • {team?.league}</div>
                            </div>
                            <div className="text-center mx-4">
                              <div className="font-medium text-gray-900">{match.scheduledDate.toLocaleDateString()}</div>
                              <div className="text-sm text-gray-600">{match.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                            <div className="text-center mx-4">
                              <div className="text-sm font-medium text-gray-700">{match.isHomeMatch ? 'Home' : 'Away'}</div>
                              <div className="text-xs text-gray-500">{match.venue || (match.isHomeMatch ? 'Home Ground' : 'Away Ground')}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <a
                                href={`/matches/${match.id}/record`}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                Start Recording
                              </a>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}



        </div>
        </div>
      </div>
    </StandardLayout>
  );
}