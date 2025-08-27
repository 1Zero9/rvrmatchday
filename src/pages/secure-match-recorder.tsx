/**
 * Secure Match Recorder Application
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Main entry point for the secure match recording application.
 * Requires authentication and provides role-based access control.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SecureMatchRecorder from '../components/SecureMatchRecorder';
import { storage } from '../lib/match-tracker-storage';
import { Match, Team } from '../types/match-tracker';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  teams: string[];
}

export default function SecureMatchRecorderApp() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    try {
      const loadedMatches = storage.getMatches();
      const loadedTeams = storage.getTeams();
      
      setMatches(loadedMatches.filter(m => m.status === 'Scheduled' || m.status === 'Live'));
      setTeams(loadedTeams);
    } catch (error) {
      console.error('Error loading match data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const startMatchRecording = (matchId: string) => {
    router.push(`/matches/${matchId}/record?secure=true`);
  };

  const createNewMatch = () => {
    router.push('/matches/new?secure=true');
  };

  return (
    <>
      <Head>
        <title>Secure Match Recorder | RVR FC</title>
        <meta name="description" content="Secure match recording system for authorized personnel" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <SecureMatchRecorder requiredRole="coach">
        {(user: User, token: string) => (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-club-primary to-club-secondary py-12">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-full mb-6">
                    <span className="text-4xl">⚽</span>
                  </div>
                  <h1 className="text-4xl font-bold mb-4">Secure Match Recorder</h1>
                  <p className="text-club-accent text-xl max-w-2xl mx-auto">
                    Professional match recording system for authorized coaches and staff
                  </p>
                </motion.div>
              </div>
            </div>

            {/* User Welcome */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 mb-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-club-accent">Welcome, {user.name}</h2>
                    <p className="text-gray-300 mt-1">
                      Role: <span className="font-semibold text-white">{user.role}</span>
                      {user.teams.includes('*') ? (
                        <span className="ml-4 text-club-accent">• All Teams Access</span>
                      ) : (
                        <span className="ml-4">• Teams: {user.teams.join(', ')}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <p>Secure Session Active</p>
                    <p>🔒 JWT Protected</p>
                  </div>
                </div>
              </motion.div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-accent mx-auto mb-4"></div>
                    <p className="text-gray-300">Loading matches...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                  >
                    <button
                      onClick={createNewMatch}
                      className="bg-club-primary hover:bg-club-secondary p-6 rounded-xl border border-club-accent/20 transition-all duration-200 hover:scale-105 group"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">➕</div>
                        <h3 className="text-lg font-bold mb-2">Create New Match</h3>
                        <p className="text-sm text-gray-300">Set up a new match for recording</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-white/5 hover:bg-white/10 p-6 rounded-xl border border-white/10 transition-all duration-200 hover:scale-105 group"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔄</div>
                        <h3 className="text-lg font-bold mb-2">Refresh Data</h3>
                        <p className="text-sm text-gray-300">Reload latest match information</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => router.push('/match-central')}
                      className="bg-white/5 hover:bg-white/10 p-6 rounded-xl border border-white/10 transition-all duration-200 hover:scale-105 group"
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📊</div>
                        <h3 className="text-lg font-bold mb-2">Match Central</h3>
                        <p className="text-sm text-gray-300">View all match data</p>
                      </div>
                    </button>
                  </motion.div>

                  {/* Available Matches */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">Available Matches</h2>
                    
                    {matches.length === 0 ? (
                      <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 text-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-xl font-bold mb-2">No Matches Available</h3>
                        <p className="text-gray-300 mb-6">Create a new match to start recording</p>
                        <button
                          onClick={createNewMatch}
                          className="bg-club-primary hover:bg-club-secondary px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                          Create First Match
                        </button>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {matches.map((match, index) => {
                          const team = teams.find(t => t.id === match.teamId);
                          return (
                            <motion.div
                              key={match.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-club-accent/50 transition-all group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-4 mb-3">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      match.status === 'Live' 
                                        ? 'bg-red-500/20 text-red-400' 
                                        : 'bg-club-accent/20 text-club-accent'
                                    }`}>
                                      {match.status === 'Live' ? '🔴 LIVE' : '📅 Scheduled'}
                                    </div>
                                    <span className="text-gray-400 text-sm">{match.matchType}</span>
                                  </div>
                                  
                                  <h3 className="text-xl font-bold mb-2">
                                    {team?.name || 'Unknown Team'} vs {match.opponent}
                                  </h3>
                                  
                                  <div className="flex items-center space-x-6 text-sm text-gray-300">
                                    <div className="flex items-center space-x-2">
                                      <span>📍</span>
                                      <span>{match.venue}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span>📅</span>
                                      <span>{new Date(match.scheduledDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span>🕐</span>
                                      <span>{new Date(match.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                  </div>

                                  {/* Match Score (if live or finished) */}
                                  {(match.homeScore !== undefined && match.awayScore !== undefined) && (
                                    <div className="mt-4 text-lg font-bold text-club-accent">
                                      Score: {match.isHomeMatch ? `${match.homeScore} - ${match.awayScore}` : `${match.awayScore} - ${match.homeScore}`}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex space-x-3">
                                  <button
                                    onClick={() => startMatchRecording(match.id)}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all group-hover:scale-105 ${
                                      match.status === 'Live'
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-club-primary hover:bg-club-secondary text-white'
                                    }`}
                                  >
                                    {match.status === 'Live' ? '🔴 Record Live' : '▶️ Start Recording'}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </div>

            {/* Security Footer */}
            <div className="bg-gray-900/50 backdrop-blur-md border-t border-white/10 mt-16 py-6">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>🔒 Secure Session</span>
                    <span>•</span>
                    <span>All actions logged</span>
                    <span>•</span>
                    <span>JWT Authentication</span>
                  </div>
                  <div>
                    RVR FC Match Recorder v2.0
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SecureMatchRecorder>
    </>
  );
}