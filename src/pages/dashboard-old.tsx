import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Match {
  id: string;
  match_date: string;
  home_away: string;
  status: string;
  notes?: string;
  our_score: number;
  their_score: number;
  opponents: { name: string }[];
  venues: { name: string }[] | null;
  teams: { name: string }[];
}

interface Team {
  id: string;
  name: string;
  age_group: string;
}

export default function MatchCentral() {
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming' | 'all'>('recent');

  const fetchMatches = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id, 
          match_date, 
          home_away, 
          status,
          notes, 
          our_score, 
          their_score, 
          opponents(name), 
          venues(name),
          teams(name)
        `)
        .order('match_date', { ascending: false });

      if (!error && data) {
        const now = new Date();
        const matches = data as Match[];
        
        const recent = matches.filter(m => new Date(m.match_date) < now && m.status === 'finished').slice(0, 5);
        const upcoming = matches.filter(m => new Date(m.match_date) >= now || m.status === 'scheduled').slice(0, 5);
        
        setRecentMatches(recent);
        setUpcomingMatches(upcoming);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  }, []);

  const fetchTeams = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('age_group', { ascending: true });

      if (!error && data) {
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMatches(), fetchTeams()]);
      setLoading(false);
    };
    
    loadData();
  }, [fetchMatches, fetchTeams]);

  const getMatchResult = (match: Match) => {
    if (match.status !== 'finished') return null;
    
    if (match.our_score > match.their_score) return 'W';
    if (match.our_score < match.their_score) return 'L';
    return 'D';
  };

  const getResultColor = (result: string | null) => {
    switch (result) {
      case 'W': return 'bg-green-100 text-green-800';
      case 'L': return 'bg-red-100 text-red-800';
      case 'D': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Match Central...</p>
        </div>
      </div>
    );
  }

  // Main action boxes for Match Central
  const actionBoxes = [
    {
      id: 'recent',
      title: '🏆 Recent Results',
      subtitle: `${recentMatches.length} matches completed`,
      color: 'from-green-600 to-emerald-700',
      icon: '🏆',
      description: 'Latest match results and scores',
      active: activeTab === 'recent'
    },
    {
      id: 'upcoming',
      title: '📅 Upcoming Fixtures', 
      subtitle: `${upcomingMatches.length} matches scheduled`,
      color: 'from-blue-600 to-cyan-700',
      icon: '📅',
      description: 'Next matches and fixtures',
      active: activeTab === 'upcoming'
    },
    {
      id: 'add',
      title: '➕ Add Match',
      subtitle: 'Schedule or log results',
      color: 'from-purple-600 to-violet-700',
      icon: '➕',
      description: 'Create new match entries'
    },
    {
      id: 'teams',
      title: '⚽ Our Teams',
      subtitle: `${teams.length} active teams`,
      color: 'from-amber-600 to-orange-700',
      icon: '⚽',
      description: 'View all club teams'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Clean Geometric Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl translate-x-40"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl translate-y-36"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
               backgroundSize: '30px 30px'
             }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Top Navigation - Minimal */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center p-6"
        >
          <div className="flex items-center space-x-4">
            <Image 
              src="/images/logo.png" 
              alt="Rivervalley Rangers AFC Logo" 
              width={75}
              height={75}
              className="drop-shadow-lg"
            />
            <div className="text-white">
              <h1 className="text-xl font-bold">Match Central</h1>
              <p className="text-sm text-blue-200">Your complete matchday experience</p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex space-x-4 text-sm">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              ← Home
            </Link>
          </div>
        </motion.div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-6xl w-full">
            
            {/* Hero Title */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Match Central
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Your Complete Matchday Experience • Live Updates & Results
              </p>
            </motion.div>

            {/* Action Boxes Grid */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              {actionBoxes.map((box, index) => (
                <motion.div
                  key={box.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <div 
                    className={`
                      bg-gradient-to-br ${box.color} 
                      rounded-3xl p-8 h-64
                      text-white shadow-2xl 
                      cursor-pointer 
                      border border-white/10
                      backdrop-blur-sm
                      relative overflow-hidden
                      transition-all duration-300
                      hover:shadow-3xl hover:border-white/30
                      ${box.active ? 'ring-2 ring-white/50' : ''}
                    `}
                    onClick={() => {
                      if (box.id === 'recent' || box.id === 'upcoming') {
                        setActiveTab(box.id as any);
                      } else if (box.id === 'add') {
                        window.location.href = '/app/matches/new';
                      }
                    }}
                  >
                    {/* Background Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      <div>
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {box.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                          {box.title}
                        </h3>
                        <p className="text-sm opacity-90 mb-4">
                          {box.subtitle}
                        </p>
                      </div>
                      <div className="text-xs opacity-70">
                        {box.description}
                      </div>
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Stats - Clean & Minimal */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                <div>
                  <p className="text-3xl font-bold text-green-400 mb-1">{teams.length}</p>
                  <p className="text-sm text-blue-200">Active Teams</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400 mb-1">{recentMatches.length}</p>
                  <p className="text-sm text-blue-200">Recent Matches</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-400 mb-1">{upcomingMatches.length}</p>
                  <p className="text-sm text-blue-200">Upcoming</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-400 mb-1">
                    {recentMatches.filter(m => getMatchResult(m) === 'W').length}
                  </p>
                  <p className="text-sm text-blue-200">Recent Wins</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Match Details Overlay */}
        {(activeTab === 'recent' || activeTab === 'upcoming') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setActiveTab('recent')}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="mr-2">
                      {activeTab === 'recent' ? '🏆' : '📅'}
                    </span>
                    {activeTab === 'recent' ? 'Recent Results' : 'Upcoming Fixtures'}
                  </h2>
                  <button
                    onClick={() => setActiveTab('recent')}
                    className="text-gray-500 hover:text-gray-700 p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            
            {/* Recent Matches */}
            {activeTab === 'recent' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">🏆</span>
                  Recent Results
                </h2>
                
                {recentMatches.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">⚽</div>
                    <p className="text-lg mb-2">No recent matches found</p>
                    <p className="text-sm">Matches will appear here once coaches log results</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentMatches.map((match, index) => {
                      const result = getMatchResult(match);
                      return (
                        <motion.div
                          key={match.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            {result && (
                              <div className={`px-3 py-1 rounded-full text-sm font-bold ${getResultColor(result)}`}>
                                {result}
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-900">
                                {match.teams[0]?.name || 'Team'} vs {match.opponents[0]?.name || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center space-x-3">
                                <span>📅 {formatDate(match.match_date)}</span>
                                {match.venues?.[0] && <span>📍 {match.venues[0].name}</span>}
                                <span className="capitalize">({match.home_away})</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600">
                              {match.our_score} - {match.their_score}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Upcoming Matches */}
            {activeTab === 'upcoming' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">📅</span>
                  Upcoming Fixtures
                </h2>
                
                {upcomingMatches.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">📅</div>
                    <p className="text-lg mb-2">No upcoming matches scheduled</p>
                    <p className="text-sm">Check back later for new fixtures</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingMatches.map((match, index) => (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-500 text-white p-2 rounded-lg">
                            ⚽
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {match.teams[0]?.name || 'Team'} vs {match.opponents[0]?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center space-x-3">
                              <span>📅 {formatDate(match.match_date)}</span>
                              {match.venues?.[0] && <span>📍 {match.venues[0].name}</span>}
                              <span className="capitalize">({match.home_away})</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            match.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* All Matches */}
            {activeTab === 'all' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="mr-2">📊</span>
                    All Match Management
                  </h2>
                  <Link 
                    href="/app/matches/new"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    + Add New Match
                  </Link>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Link href="/app/matches" className="group">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group-hover:shadow-lg">
                      <div className="text-3xl mb-3">📋</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">View All Matches</h3>
                      <p className="text-gray-600 text-sm">Browse complete match history and details</p>
                    </div>
                  </Link>
                  
                  <Link href="/app/matches/new" className="group">
                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200 group-hover:shadow-lg">
                      <div className="text-3xl mb-3">➕</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Match</h3>
                      <p className="text-gray-600 text-sm">Schedule new fixtures and log results</p>
                    </div>
                  </Link>
                </div>

                {/* Teams Overview */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">⚽</span>
                    Our Teams
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {teams.map((team) => (
                      <div key={team.id} className="p-4 bg-gray-50 rounded-lg text-center">
                        <div className="text-2xl mb-2">🏆</div>
                        <div className="font-semibold text-gray-900">{team.name}</div>
                        <div className="text-sm text-gray-600">{team.age_group}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            </motion.div>
          </motion.div>
        )}

      </div>
    </div>
  );
}