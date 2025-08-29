/**
 * Secure Match Recorder Application - Clean Theme
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import StandardLayout from '../components/StandardLayout';
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

export default function SecureMatchRecorderPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    try {
      const loadedMatches = storage.getMatches();
      const loadedTeams = storage.getTeams();
      
      setMatches(loadedMatches.filter(m => m.status === 'Scheduled' || m.status === 'In Progress'));
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

  const quickActions = [
    {
      id: 'create',
      title: 'Create New Match',
      description: 'Set up a new match for recording',
      icon: '➕',
      color: 'bg-club-primary hover:bg-blue-700',
      action: createNewMatch
    },
    {
      id: 'refresh',
      title: 'Refresh Data',
      description: 'Reload latest match information',
      icon: '🔄',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => window.location.reload()
    },
    {
      id: 'recorder',
      title: 'Simple Recorder',
      description: 'Use the simple match recorder',
      icon: '📱',
      color: 'bg-red-600 hover:bg-red-700',
      action: () => router.push('/match-recorder')
    },
    {
      id: 'central',
      title: 'Match Central',
      description: 'View all match data',
      icon: '📊',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => router.push('/match-central')
    },
    {
      id: 'admin',
      title: 'Administration',
      description: 'Manage teams and settings',
      icon: '⚙️',
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => router.push('/match-admin')
    }
  ];

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading Secure Recorder...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <Head>
        <title>Secure Match Recorder | RVR FC</title>
        <meta name="description" content="Secure match recording system for authorized personnel" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <SecureMatchRecorder requiredRole="coach">
        {(user: User, token: string) => (
          <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl text-white">🔒</span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">Secure Match Recorder</h1>
                      <p className="text-gray-600 mt-1">Authorized personnel only</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium text-gray-900">Welcome, {user.name}</div>
                      <div className="text-sm text-gray-600">{user.role}</div>
                    </div>
                    <div className="w-10 h-10 bg-club-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-club-primary">{user.name.charAt(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.action}
                      className={`${action.color} text-white p-6 rounded-xl text-left transition-all shadow-sm hover:shadow-md`}
                    >
                      <div className="text-3xl mb-3">{action.icon}</div>
                      <div className="font-bold text-lg mb-2">{action.title}</div>
                      <div className="text-sm opacity-90">{action.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Available Matches */}
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3">⚽</span>
                    Available Matches
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({matches.length} matches)
                    </span>
                  </h2>

                  {matches.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📋</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Matches Available</h3>
                      <p className="text-gray-600 mb-6">No scheduled or in-progress matches found. Create a new match to get started.</p>
                      <button
                        onClick={createNewMatch}
                        className="bg-club-primary hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Create New Match
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {matches.map((match) => {
                        const team = teams.find(t => t.id === match.teamId);
                        const isInProgress = match.status === 'In Progress';
                        
                        return (
                          <div
                            key={match.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div className="font-medium text-gray-900">{team?.name || 'Unknown Team'}</div>
                                <span className="text-gray-400">vs</span>
                                <div className="font-medium text-gray-900">{match.opponent}</div>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                  isInProgress 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {match.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {match.matchType} • {match.scheduledDate.toLocaleDateString()} at {match.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {match.isHomeMatch ? 'Home' : 'Away'} • {match.venue || (match.isHomeMatch ? 'Home Ground' : 'Away Ground')}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              {user.teams.includes(match.teamId) ? (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => startMatchRecording(match.id)}
                                  className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                                    isInProgress 
                                      ? 'bg-green-600 hover:bg-green-700' 
                                      : 'bg-club-primary hover:bg-blue-700'
                                  }`}
                                >
                                  {isInProgress ? 'Resume Recording' : 'Start Recording'}
                                </motion.button>
                              ) : (
                                <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
                                  Not authorized for this team
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* User Teams */}
              <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">👥</span>
                  Your Authorized Teams
                </h2>
                
                {user.teams.length === 0 ? (
                  <p className="text-gray-600">No teams assigned to your account.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.teams.map((teamId) => {
                      const team = teams.find(t => t.id === teamId);
                      return (
                        <div
                          key={teamId}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="font-medium text-gray-900">{team?.name || 'Unknown Team'}</div>
                          {team && (
                            <div className="text-sm text-gray-600 mt-1">
                              {team.ageGroup} • {team.league}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">⚠️</div>
                  <div>
                    <h3 className="font-bold text-yellow-800 mb-2">Security Notice</h3>
                    <p className="text-yellow-700 text-sm">
                      This is a secure area for authorized personnel only. All activities are logged and monitored. 
                      Ensure you only record matches for teams you are authorized to manage.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SecureMatchRecorder>
    </StandardLayout>
  );
}