import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
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
      <Layout currentSection="public">
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading Match Central...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentSection="public">
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-md border-b border-white/20"
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image 
                  src="/images/logo.png" 
                  alt="Rivervalley Rangers AFC Logo" 
                  width={60}
                  height={60}
                  className="drop-shadow-lg"
                />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">Match Central</h1>
                  <p className="text-blue-100">Your complete matchday experience</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  href="/app/matches/new"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  + Add Match
                </Link>
                <Link 
                  href="/"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white border border-white/20">
              <div className="text-3xl font-bold text-green-400">{teams.length}</div>
              <div className="text-sm text-blue-100">Active Teams</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white border border-white/20">
              <div className="text-3xl font-bold text-blue-400">{recentMatches.length}</div>
              <div className="text-sm text-blue-100">Recent Matches</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white border border-white/20">
              <div className="text-3xl font-bold text-yellow-400">{upcomingMatches.length}</div>
              <div className="text-sm text-blue-100">Upcoming</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white border border-white/20">
              <div className="text-3xl font-bold text-purple-400">
                {recentMatches.filter(m => getMatchResult(m) === 'W').length}
              </div>
              <div className="text-sm text-blue-100">Recent Wins</div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-2 mb-6 border border-white/20"
          >
            <div className="flex space-x-1">
              {[
                { id: 'recent', label: 'Recent Results', count: recentMatches.length },
                { id: 'upcoming', label: 'Upcoming Fixtures', count: upcomingMatches.length },
                { id: 'all', label: 'View All', count: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-primary-600 shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label} {tab.count !== null && `(${tab.count})`}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Match Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            
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
        </div>
      </div>
    </Layout>
  );
}