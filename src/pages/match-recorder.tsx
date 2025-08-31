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
type RecorderType = 'quick' | 'full';

export default function MatchRecorder() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [recorderType, setRecorderType] = useState<RecorderType | ''>('');
  const [currentStep, setCurrentStep] = useState<SetupStep>('mode');
  const [selectedMode, setSelectedMode] = useState<RecordingMode | ''>('');
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  
  // Quick setup state
  const [quickSetup, setQuickSetup] = useState({
    homeTeam: '',
    homeTeamCustom: '',
    awayTeam: '',
    awayTeamCustom: '',
    venue: '',
    venueCustom: '',
    kickoffTime: ''
  });
  
  // Get available teams for dropdowns
  const getAvailableTeams = () => {
    return teams.filter(team => !team.isOpponent);
  };
  
  // Get existing venues from matches
  const getAvailableVenues = () => {
    const venues = matches
      .map(match => match.venue)
      .filter(venue => venue && venue.trim() !== '')
      .filter((venue, index, self) => self.indexOf(venue) === index) // unique values
      .sort();
    return venues;
  };

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
    <div className="min-h-screen">
      {/* Mobile-Only Design */}
      <div className="block md:hidden bg-white">
        {/* Simple Mobile Header */}
        <div className="bg-club-primary text-white p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">Match Recorder</h1>
            <a
              href="/match-central"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-1"
            >
              <span>📊</span>
              <span className="text-sm">Results</span>
            </a>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="p-4">
          {/* Mobile Setup Selection */}
          {recorderType === '' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Record a Match</h2>
                <p className="text-gray-600 text-sm">How do you want to set up?</p>
              </div>

              <div className="space-y-4">
                {/* Quick Setup - Mobile */}
                <button
                  onClick={() => setRecorderType('quick')}
                  className="w-full p-4 bg-green-50 border-2 border-green-200 rounded-xl text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h3 className="font-bold text-green-700">Quick Setup</h3>
                      <p className="text-xs text-gray-600">Record now, add details later</p>
                    </div>
                  </div>
                </button>

                {/* Full Setup - Mobile */}
                <button
                  onClick={() => setRecorderType('full')}
                  className="w-full p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h3 className="font-bold text-blue-700">Full Setup</h3>
                      <p className="text-xs text-gray-600">Complete configuration</p>
                    </div>
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* Mobile Quick Setup */}
          {recorderType === 'quick' && (
            <div>
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Quick Setup</h2>
                <p className="text-gray-600 text-sm">Just the essentials</p>
              </div>

              <div className="space-y-4">
                {/* Teams */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Home Team</label>
                  <select
                    value={quickSetup.homeTeam}
                    onChange={(e) => setQuickSetup(prev => ({ ...prev, homeTeam: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select or add team...</option>
                    {getAvailableTeams().map(team => (
                      <option key={team.id} value={team.name}>{team.name}</option>
                    ))}
                    <option value="custom">Add New Team</option>
                  </select>
                  {quickSetup.homeTeam === 'custom' && (
                    <input
                      type="text"
                      value={quickSetup.homeTeamCustom}
                      onChange={(e) => setQuickSetup(prev => ({ ...prev, homeTeamCustom: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
                      placeholder="Team name..."
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Away Team</label>
                  <select
                    value={quickSetup.awayTeam}
                    onChange={(e) => setQuickSetup(prev => ({ ...prev, awayTeam: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select or add team...</option>
                    {getAvailableTeams().map(team => (
                      <option key={team.id} value={team.name}>{team.name}</option>
                    ))}
                    <option value="custom">Add New Team</option>
                  </select>
                  {quickSetup.awayTeam === 'custom' && (
                    <input
                      type="text"
                      value={quickSetup.awayTeamCustom}
                      onChange={(e) => setQuickSetup(prev => ({ ...prev, awayTeamCustom: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
                      placeholder="Opposition team..."
                    />
                  )}
                </div>

                {/* Venue & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                    <select
                      value={quickSetup.venue}
                      onChange={(e) => setQuickSetup(prev => ({ ...prev, venue: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Where?</option>
                      {getAvailableVenues().map(venue => (
                        <option key={venue} value={venue}>{venue}</option>
                      ))}
                      <option value="custom">New Venue</option>
                    </select>
                    {quickSetup.venue === 'custom' && (
                      <input
                        type="text"
                        value={quickSetup.venueCustom}
                        onChange={(e) => setQuickSetup(prev => ({ ...prev, venueCustom: e.target.value }))}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg mt-2 text-sm"
                        placeholder="Venue..."
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kickoff</label>
                    <input
                      type="time"
                      value={quickSetup.kickoffTime}
                      onChange={(e) => setQuickSetup(prev => ({ ...prev, kickoffTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setRecorderType('')}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      console.log('Quick recording started:', quickSetup);
                      router.push('/matches/quick/record');
                    }}
                    disabled={!(quickSetup.homeTeam && quickSetup.homeTeam !== 'custom' || quickSetup.homeTeamCustom) || !(quickSetup.awayTeam && quickSetup.awayTeam !== 'custom' || quickSetup.awayTeamCustom)}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <span>🔴</span>
                    Start Recording
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Full Setup Navigation */}
          {recorderType === 'full' && (
            <div>
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Full Setup</h2>
                <p className="text-gray-600 text-sm">Complete match configuration</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {recordingModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleModeSelection(mode.id)}
                    className={`p-3 rounded-lg border-2 ${mode.borderColor} ${mode.bgColor} text-center`}
                  >
                    <div className="text-2xl mb-1">{mode.icon}</div>
                    <div className={`text-xs font-bold ${mode.textColor}`}>{mode.title}</div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setRecorderType('')}
                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 text-sm"
              >
                ← Back to Options
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Desktop Design - Hidden on Mobile */}
      <div className="hidden md:block">
        <StandardLayout>
          <div className="min-h-screen bg-gray-50">
            {/* Desktop Header */}
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

        <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8 py-4 md:py-8">
          
          {/* Step Indicator - Full Setup Only */}
          {recorderType === 'full' && (
            <div className="mb-6 md:mb-8">
              <nav className="flex justify-center px-2">
                <ol className="flex items-center space-x-2 md:space-x-4">
                {[
                  { id: 'mode', name: 'Mode', icon: '🎯' },
                  { id: 'match-selection', name: 'Match', icon: '⚽' },
                  { id: 'team-setup', name: 'Teams', icon: '👥' },
                  { id: 'venue', name: 'Venue', icon: '🏟️' },
                  { id: 'recording', name: 'Record', icon: '🔴' }
                ].map((step, index) => (
                  <li key={step.id} className="flex items-center">
                    {index > 0 && (
                      <div className="hidden sm:block w-4 md:w-8 h-px bg-gray-300 mx-1 md:mx-2"></div>
                    )}
                    <div className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-3 py-2 rounded-lg text-xs md:text-sm font-medium ${
                      currentStep === step.id 
                        ? 'bg-club-primary text-white shadow-lg' 
                        : index < ['mode', 'match-selection', 'team-setup', 'venue', 'recording'].indexOf(currentStep)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className="text-sm md:text-lg">{step.icon}</span>
                      <span className="hidden sm:inline text-xs md:text-sm">{step.name}</span>
                    </div>
                  </li>
                ))}
                </ol>
              </nav>
            </div>
          )}

          {/* Step Content */}
          
          {/* Step 1: Setup Type Selection */}
          {currentStep === 'mode' && recorderType === '' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How do you want to set up your match?</h2>
                <p className="text-gray-600">Choose between quick setup for immediate recording or full setup for detailed match management</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Quick Setup */}
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRecorderType('quick')}
                  className="p-6 rounded-xl border-2 border-green-200 bg-green-50 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">⚡</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-green-700">Quick Setup</h3>
                      <p className="text-gray-600 text-sm mb-3">Start recording immediately with minimal setup. Perfect for when the match is about to begin.</p>
                      <div className="text-xs text-green-600 font-medium">
                        ✓ 30 second setup • ✓ Record now • ✓ Add details later
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </motion.button>

                {/* Full Setup */}
                <motion.button
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRecorderType('full')}
                  className="p-6 rounded-xl border-2 border-blue-200 bg-blue-50 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">🎯</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-blue-700">Full Setup</h3>
                      <p className="text-gray-600 text-sm mb-3">Complete match setup with team details, venues, and full configuration options.</p>
                      <div className="text-xs text-blue-600 font-medium">
                        ✓ Detailed setup • ✓ Team management • ✓ Venue details
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Quick Setup Flow */}
          {recorderType === 'quick' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">⚡</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Match Setup</h2>
                  <p className="text-gray-600">Enter basic details and start recording immediately</p>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Home Team - Dropdown + Custom */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Home Team</label>
                      <select
                        value={quickSetup.homeTeam}
                        onChange={(e) => setQuickSetup(prev => ({ ...prev, homeTeam: e.target.value, homeTeamCustom: e.target.value === 'custom' ? prev.homeTeamCustom : '' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary mb-2"
                      >
                        <option value="">Select home team...</option>
                        {getAvailableTeams().map(team => (
                          <option key={team.id} value={team.name}>{team.name}</option>
                        ))}
                        <option value="custom">➕ Add new team manually</option>
                      </select>
                      {quickSetup.homeTeam === 'custom' && (
                        <input
                          type="text"
                          value={quickSetup.homeTeamCustom}
                          onChange={(e) => setQuickSetup(prev => ({ ...prev, homeTeamCustom: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                          placeholder="Enter team name..."
                        />
                      )}
                    </div>
                    
                    {/* Away Team - Dropdown + Custom */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Away Team</label>
                      <select
                        value={quickSetup.awayTeam}
                        onChange={(e) => setQuickSetup(prev => ({ ...prev, awayTeam: e.target.value, awayTeamCustom: e.target.value === 'custom' ? prev.awayTeamCustom : '' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary mb-2"
                      >
                        <option value="">Select away team...</option>
                        {getAvailableTeams().map(team => (
                          <option key={team.id} value={team.name}>{team.name}</option>
                        ))}
                        <option value="custom">➕ Add new team manually</option>
                      </select>
                      {quickSetup.awayTeam === 'custom' && (
                        <input
                          type="text"
                          value={quickSetup.awayTeamCustom}
                          onChange={(e) => setQuickSetup(prev => ({ ...prev, awayTeamCustom: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                          placeholder="Enter opposition team name..."
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Venue - Dropdown + Custom */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                      <select
                        value={quickSetup.venue}
                        onChange={(e) => setQuickSetup(prev => ({ ...prev, venue: e.target.value, venueCustom: e.target.value === 'custom' ? prev.venueCustom : '' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary mb-2"
                      >
                        <option value="">Select venue...</option>
                        {getAvailableVenues().map(venue => (
                          <option key={venue} value={venue}>{venue}</option>
                        ))}
                        <option value="custom">➕ Add new venue manually</option>
                      </select>
                      {quickSetup.venue === 'custom' && (
                        <input
                          type="text"
                          value={quickSetup.venueCustom}
                          onChange={(e) => setQuickSetup(prev => ({ ...prev, venueCustom: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                          placeholder="Enter venue name..."
                        />
                      )}
                    </div>
                    
                    {/* Kickoff Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kickoff Time</label>
                      <input
                        type="time"
                        value={quickSetup.kickoffTime}
                        onChange={(e) => setQuickSetup(prev => ({ ...prev, kickoffTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setRecorderType('')}
                      className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      ← Back
                    </button>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          // Save teams/venue to system
                          console.log('Saving to system:', quickSetup);
                          // TODO: Add save functionality
                        }}
                        disabled={!(quickSetup.homeTeam && quickSetup.homeTeam !== 'custom' || quickSetup.homeTeamCustom) || !(quickSetup.awayTeam && quickSetup.awayTeam !== 'custom' || quickSetup.awayTeamCustom)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <span>💾</span>
                        Save & Add to System
                      </button>
                      
                      <button
                        onClick={() => {
                          // Start recording immediately
                          console.log('Quick recording started:', quickSetup);
                          router.push('/matches/quick/record');
                        }}
                        disabled={!(quickSetup.homeTeam && quickSetup.homeTeam !== 'custom' || quickSetup.homeTeamCustom) || !(quickSetup.awayTeam && quickSetup.awayTeam !== 'custom' || quickSetup.awayTeamCustom)}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                      >
                        <span>🔴</span>
                        Start Recording Now
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick Info Notice */}
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600">💡</span>
                      <div className="text-sm text-yellow-800">
                        <strong>Quick Tip:</strong> You can start recording immediately and add detailed team information, venues, and player details to the system later using the "Save & Add to System" option.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Full Setup - Recording Mode Selection */}
          {recorderType === 'full' && currentStep === 'mode' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Recording Mode</h2>
                <p className="text-gray-600 text-sm">Select how you want to record or manage your match</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {recordingModes.map((mode, index) => (
                  <motion.button
                    key={mode.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeSelection(mode.id)}
                    className={`p-4 rounded-xl border-2 ${mode.borderColor} ${mode.bgColor} hover:shadow-lg transition-all duration-300 text-center`}
                  >
                    <div className="text-3xl mb-2">{mode.icon}</div>
                    <h3 className={`text-sm font-bold mb-1 ${mode.textColor}`}>{mode.title}</h3>
                    <p className="text-gray-600 text-xs">{mode.description}</p>
                  </motion.button>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setRecorderType('')}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ← Back to Setup Options
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Match Selection - Full Setup Only */}
          {recorderType === 'full' && currentStep === 'match-selection' && (
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

          {/* Step 3: Team Setup - Full Setup Only */}
          {recorderType === 'full' && currentStep === 'team-setup' && selectedMatch && (
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

          {/* Step 4: Venue & Match Details - Full Setup Only */}
          {recorderType === 'full' && currentStep === 'venue' && (
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

          {/* Step 5: Start Recording - Full Setup Only */}
          {recorderType === 'full' && currentStep === 'recording' && (
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
      </div>
    </div>
  );
}