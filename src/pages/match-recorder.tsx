/**
 * Match Recorder - Complete Recording Interface
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Full match recording system with team setup, venue management, and recording modes
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import { storage } from "../lib/match-tracker-storage";
import { Match, Team } from "../types/match-tracker";

type RecordingMode = 'live' | 'post-match' | 'edit' | 'view-results';
type SetupStep = 'mode' | 'match-selection' | 'team-setup' | 'venue' | 'recording';

export default function MatchRecorder() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<SetupStep>('mode');
  const [selectedMode, setSelectedMode] = useState<RecordingMode | ''>('');
  const [selectedMatch, setSelectedMatch] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      storage.initializeSampleData();
      const loadedMatches = storage.getMatches();
      const loadedTeams = storage.getTeams();
      
      setMatches(loadedMatches);
      setTeams(loadedTeams);
    } catch (error) {
      console.error('Error loading match data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeSelection = (mode: RecordingMode) => {
    setSelectedMode(mode);
    setCurrentStep('match-selection');
  };

  const handleMatchSelection = (matchId: string) => {
    setSelectedMatch(matchId);
    setCurrentStep('team-setup');
  };

  const startRecording = () => {
    if (!selectedMatch || !selectedMode) return;

    switch (selectedMode) {
      case 'live':
        router.push(`/matches/${selectedMatch}/record`);
        break;
      case 'post-match':
        router.push(`/matches/${selectedMatch}/post-match`);
        break;
      case 'edit':
        router.push(`/match-admin#matches`);
        break;
      case 'view-results':
        router.push(`/match-central#overview`);
        break;
    }
  };

  const getMatchesForMode = () => {
    switch (selectedMode) {
      case 'live':
        return matches.filter(m => m.status === 'Scheduled' || m.status === 'Live');
      case 'post-match':
        return matches.filter(m => m.status === 'Scheduled' || m.status === 'Live' || m.status === 'Finished');
      case 'edit':
        return matches;
      case 'view-results':
        return matches.filter(m => m.status === 'Finished');
      default:
        return [];
    }
  };

  const recordingModes = [
    {
      id: 'live' as RecordingMode,
      title: 'Live Recording',
      description: 'Record match events as they happen in real-time',
      icon: '🔴',
      color: 'from-red-500 to-red-600',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 'post-match' as RecordingMode,
      title: 'Post-Match Entry',
      description: 'Enter final results and details after the match',
      icon: '📝',
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'edit' as RecordingMode,
      title: 'Edit Match',
      description: 'Modify existing match details or scheduling',
      icon: '✏️',
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'view-results' as RecordingMode,
      title: 'View Results',
      description: 'Review completed match results and statistics',
      icon: '📊',
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-club-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading Match Recorder...</p>
          </motion.div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-club-primary rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-white">⚽</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Match Recorder</h1>
                  <p className="text-gray-600 mt-1">Professional match recording and management system</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <a
                  href="/match-central"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span className="text-lg">📊</span>
                  <span className="hidden sm:inline">View Results</span>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Step Indicator */}
          <div className="mb-8">
            <nav className="flex justify-center">
              <ol className="flex items-center space-x-4">
                {[
                  { id: 'mode', name: 'Recording Mode', icon: '🎯' },
                  { id: 'match-selection', name: 'Select Match', icon: '⚽' },
                  { id: 'team-setup', name: 'Team Setup', icon: '👥' },
                  { id: 'venue', name: 'Venue & Details', icon: '🏟️' },
                  { id: 'recording', name: 'Start Recording', icon: '🔴' }
                ].map((step, index) => (
                  <li key={step.id} className="flex items-center">
                    {index > 0 && (
                      <div className="hidden sm:block w-8 h-px bg-gray-300 mx-2"></div>
                    )}
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                      currentStep === step.id 
                        ? 'bg-club-primary text-white shadow-lg' 
                        : index < ['mode', 'match-selection', 'team-setup', 'venue', 'recording'].indexOf(currentStep)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className="text-lg">{step.icon}</span>
                      <span className="hidden sm:inline">{step.name}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Step Content */}
          
          {/* Step 1: Recording Mode Selection */}
          {currentStep === 'mode' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Recording Mode</h2>
                <p className="text-gray-600">Select how you want to record or manage your match</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {recordingModes.map((mode, index) => (
                  <motion.button
                    key={mode.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeSelection(mode.id)}
                    className={`p-6 rounded-xl border-2 ${mode.borderColor} ${mode.bgColor} hover:shadow-lg transition-all duration-300 text-left`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{mode.icon}</div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-2 ${mode.textColor}`}>{mode.title}</h3>
                        <p className="text-gray-600 text-sm">{mode.description}</p>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Match Selection */}
          {currentStep === 'match-selection' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Match</h2>
                <p className="text-gray-600">
                  Choose the match you want to {selectedMode === 'live' ? 'record live' : 
                                                selectedMode === 'post-match' ? 'enter results for' :
                                                selectedMode === 'edit' ? 'edit' : 'view results for'}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {getMatchesForMode().map((match) => {
                  const team = teams.find(t => t.id === match.teamId);
                  return (
                    <motion.button
                      key={match.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleMatchSelection(match.id)}
                      className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedMatch === match.id 
                          ? 'border-club-primary bg-club-primary/5 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              {team?.name || 'Unknown Team'} vs {match.opponent}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              match.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                              match.status === 'Live' ? 'bg-red-100 text-red-700' :
                              match.status === 'Finished' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {match.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <span>📅 {match.scheduledDate.toLocaleDateString()}</span>
                            <span>⏰ {match.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>{match.isHomeMatch ? '🏠 Home' : '✈️ Away'}</span>
                            <span>🏆 {match.matchType}</span>
                            {match.venue && <span>🏟️ {match.venue}</span>}
                          </div>
                        </div>
                        
                        <div className="text-gray-400">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep('mode')}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ← Back to Mode Selection
                </button>
                
                {selectedMatch && (
                  <button
                    onClick={() => setCurrentStep('team-setup')}
                    className="px-6 py-3 bg-club-primary hover:bg-club-primary-dark text-white rounded-lg font-semibold transition-colors"
                  >
                    Continue to Team Setup →
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Team Setup */}
          {currentStep === 'team-setup' && selectedMatch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Setup & Squad Selection</h2>
                <p className="text-gray-600">Configure team details and select your squad</p>
              </div>

              {(() => {
                const match = matches.find(m => m.id === selectedMatch);
                const team = teams.find(t => t.id === match?.teamId);
                return (
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Our Team */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-club-primary rounded-xl flex items-center justify-center">
                          <span className="text-2xl text-white">🏠</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{team?.name || 'Our Team'}</h3>
                          <p className="text-gray-600">{match?.isHomeMatch ? 'Home Team' : 'Away Team'}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Formation</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary">
                            <option>4-4-2</option>
                            <option>4-3-3</option>
                            <option>3-5-2</option>
                            <option>4-5-1</option>
                            <option>5-3-2</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Kit Color</label>
                          <div className="flex space-x-3">
                            <button className="w-10 h-10 rounded-full bg-red-600 border-2 border-gray-300 hover:border-gray-400"></button>
                            <button className="w-10 h-10 rounded-full bg-blue-600 border-2 border-gray-300 hover:border-gray-400"></button>
                            <button className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 hover:border-gray-400"></button>
                            <button className="w-10 h-10 rounded-full bg-yellow-500 border-2 border-gray-300 hover:border-gray-400"></button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Captain</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary">
                            <option>Select Captain...</option>
                            <option>John Smith</option>
                            <option>Michael Jones</option>
                            <option>David Brown</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Opposition Team */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-gray-600 rounded-xl flex items-center justify-center">
                          <span className="text-2xl text-white">⚽</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{match?.opponent}</h3>
                          <p className="text-gray-600">{match?.isHomeMatch ? 'Away Team' : 'Home Team'}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Opposition Formation</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary">
                            <option>Unknown</option>
                            <option>4-4-2</option>
                            <option>4-3-3</option>
                            <option>3-5-2</option>
                            <option>4-5-1</option>
                            <option>5-3-2</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Opposition Kit</label>
                          <div className="flex space-x-3">
                            <button className="w-10 h-10 rounded-full bg-blue-600 border-2 border-gray-300 hover:border-gray-400"></button>
                            <button className="w-10 h-10 rounded-full bg-red-600 border-2 border-gray-300 hover:border-gray-400"></button>
                            <button className="w-10 h-10 rounded-full bg-green-600 border-2 border-gray-300 hover:border-gray-400"></button>
                            <button className="w-10 h-10 rounded-full bg-black border-2 border-gray-300 hover:border-gray-400"></button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Key Players</label>
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                            rows={3}
                            placeholder="Note any key players to watch..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep('match-selection')}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ← Back to Match Selection
                </button>
                
                <button
                  onClick={() => setCurrentStep('venue')}
                  className="px-6 py-3 bg-club-primary hover:bg-club-primary-dark text-white rounded-lg font-semibold transition-colors"
                >
                  Continue to Venue →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Venue & Match Details */}
          {currentStep === 'venue' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue & Match Details</h2>
                <p className="text-gray-600">Confirm venue details and match conditions</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Match Venue</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                        placeholder="Stadium name or location..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Referee</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                        placeholder="Referee name..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assistant Referees</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                        placeholder="Assistant referee names..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Weather Conditions</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary">
                        <option>Clear/Sunny</option>
                        <option>Partly Cloudy</option>
                        <option>Overcast</option>
                        <option>Light Rain</option>
                        <option>Heavy Rain</option>
                        <option>Windy</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pitch Condition</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary">
                        <option>Excellent</option>
                        <option>Good</option>
                        <option>Fair</option>
                        <option>Poor</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expected Attendance</label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Competition</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                        placeholder="League, Cup, Friendly..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Match Notes</label>
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                        rows={3}
                        placeholder="Pre-match notes, tactics, or special considerations..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep('team-setup')}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ← Back to Team Setup
                </button>
                
                <button
                  onClick={() => setCurrentStep('recording')}
                  className="px-6 py-3 bg-club-primary hover:bg-club-primary-dark text-white rounded-lg font-semibold transition-colors"
                >
                  Ready to Record →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 5: Start Recording */}
          {currentStep === 'recording' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <div className="text-6xl mb-6">🎬</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Recording!</h2>
                <p className="text-gray-600 text-lg mb-8">
                  Everything is set up. Click the button below to begin 
                  {selectedMode === 'live' ? ' live recording' : 
                   selectedMode === 'post-match' ? ' entering results' : 
                   selectedMode === 'edit' ? ' editing the match' : ' viewing results'}.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setCurrentStep('venue')}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    ← Back to Review
                  </button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startRecording}
                    className={`px-8 py-4 rounded-xl font-bold text-white shadow-xl hover:shadow-2xl transition-all ${
                      selectedMode === 'live' ? 'bg-gradient-to-r from-red-600 to-red-700' :
                      selectedMode === 'post-match' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
                      selectedMode === 'edit' ? 'bg-gradient-to-r from-green-600 to-green-700' :
                      'bg-gradient-to-r from-purple-600 to-purple-700'
                    }`}
                  >
                    <span className="text-2xl mr-3">
                      {selectedMode === 'live' ? '🔴' : 
                       selectedMode === 'post-match' ? '📝' : 
                       selectedMode === 'edit' ? '✏️' : '📊'}
                    </span>
                    Start {selectedMode === 'live' ? 'Live Recording' : 
                           selectedMode === 'post-match' ? 'Post-Match Entry' : 
                           selectedMode === 'edit' ? 'Match Editing' : 'Results Review'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </StandardLayout>
  );
}