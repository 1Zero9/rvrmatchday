/**
 * Match Control Center - Dashboard Interface
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Central command dashboard for all match operations:
 * - Quick action buttons for common tasks
 * - Live match status monitoring
 * - Recent activity feed
 * - System status indicators
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import { storage } from "../lib/match-tracker-storage";
import { Match, Team } from "../types/match-tracker";

type DashboardMode = 'record' | 'new' | 'admin';
type RecordingMode = 'live' | 'post-match' | 'edit' | 'view-results';

export default function MatchControlCenter() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [recentResults, setRecentResults] = useState<Match[]>([]);
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
      
      // Categorize matches
      setLiveMatches(loadedMatches.filter(m => m.status === 'Live'));
      setUpcomingMatches(loadedMatches
        .filter(m => m.status === 'Scheduled')
        .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
        .slice(0, 3)
      );
      setRecentResults(loadedMatches
        .filter(m => m.status === 'Finished')
        .sort((a, b) => b.scheduledDate.getTime() - a.scheduledDate.getTime())
        .slice(0, 5)
      );
    } catch (error) {
      console.error('Error loading match data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeSelection = (mode: RecordingMode) => {
    setSelectedMode(mode);
    setSelectedMatch(''); // Reset match selection
  };

  const handleMatchSelection = (matchId: string) => {
    setSelectedMatch(matchId);
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
        router.push(`/match-admin#matches`); // Go to admin to edit
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
        return matches; // All matches can be edited
      case 'view-results':
        return matches.filter(m => m.status === 'Finished');
      default:
        return [];
    }
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

  const quickActions = [
    {
      id: 'record',
      title: 'Record Match',
      description: 'Start recording a live match in real-time',
      icon: '🔴',
      color: 'from-red-500 to-red-600',
      action: () => router.push('/match-recorder')
    },
    {
      id: 'new',
      title: 'New Match',
      description: 'Schedule a new match for your team',
      icon: '➕',
      color: 'from-green-500 to-green-600', 
      action: () => router.push('/match-admin#matches')
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage teams, players, and settings',
      icon: '⚙️',
      color: 'from-slate-600 to-slate-700',
      action: () => router.push('/match-admin')
    }
  ];

  const recordingOptions = [
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
      description: 'Modify match details, teams, or scheduling',
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/40 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
            <p className="text-xl font-medium text-gray-600">Loading Match Recorder...</p>
          </motion.div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/40">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.8) 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Hero Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-green-600 to-blue-700 opacity-90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 fill=%22white%22 opacity=%220.1%22%3e%3ccircle cx=%2220%22 cy=%2220%22 r=%222%22/%3e%3ccircle cx=%2280%22 cy=%2240%22 r=%221%22/%3e%3ccircle cx=%2240%22 cy=%2270%22 r=%221.5%22/%3e%3ccircle cx=%2290%22 cy=%2280%22 r=%221%22/%3e%3ccircle cx=%2210%22 cy=%2260%22 r=%221%22/%3e%3c/svg%3e')] bg-repeat"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/20"
              >
                <span className="text-5xl">⚽</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-5xl font-black mb-4 bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent drop-shadow-lg"
              >
                Match Recorder
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              >
                Professional match recording system • Select your method and get started
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 flex items-center justify-center space-x-6 text-white/80 text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span>Live Recording</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Post-Match Entry</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Match Management</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className={`relative overflow-hidden bg-gradient-to-br ${action.color} text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
              >
                <div className="flex items-center space-x-4">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="text-4xl"
                  >
                    {action.icon}
                  </motion.div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                    <p className="text-white/80 text-sm">{action.description}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            ))}
          </motion.div>

          {/* Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Live Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-red-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-red-800 flex items-center">
                    <span className="mr-2">🔴</span>
                    Live Matches
                  </h3>
                  <span className="bg-red-100 border border-red-200 px-2 py-1 rounded-full text-xs font-bold text-red-700">
                    {liveMatches.length} Active
                  </span>
                </div>
              </div>
              <div className="p-6">
                {liveMatches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">⚽</div>
                    <p className="text-sm">No live matches</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {liveMatches.map(match => {
                      const team = teams.find(t => t.id === match.teamId);
                      return (
                        <div key={match.id} className="p-4 bg-red-50 border border-red-100 rounded-lg">
                          <div className="font-medium text-gray-900 mb-1">
                            {team?.name} vs {match.opponent}
                          </div>
                          <div className="text-sm text-red-600 font-medium flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                            LIVE - {match.matchType}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Upcoming Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-blue-800 flex items-center">
                    <span className="mr-2">📅</span>
                    Next Up
                  </h3>
                  <span className="bg-blue-100 border border-blue-200 px-2 py-1 rounded-full text-xs font-bold text-blue-700">
                    {upcomingMatches.length} Scheduled
                  </span>
                </div>
              </div>
              <div className="p-6">
                {upcomingMatches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">📅</div>
                    <p className="text-sm">No upcoming matches</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingMatches.map(match => {
                      const team = teams.find(t => t.id === match.teamId);
                      const daysAway = Math.ceil((match.scheduledDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      return (
                        <div key={match.id} className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                          <div className="font-medium text-gray-900 mb-1">
                            {team?.name} vs {match.opponent}
                          </div>
                          <div className="text-sm text-blue-600 mb-1">
                            {match.scheduledDate.toLocaleDateString()} - {match.matchType}
                          </div>
                          <div className="text-xs text-gray-600">
                            {daysAway <= 0 ? 'Today' : daysAway === 1 ? 'Tomorrow' : `${daysAway} days away`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <span className="mr-2">📊</span>
                    Recent Results
                  </h3>
                  <span className="bg-gray-100 border border-gray-200 px-2 py-1 rounded-full text-xs font-bold text-gray-700">
                    {recentResults.length} Completed
                  </span>
                </div>
              </div>
              <div className="p-6">
                {recentResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">🏆</div>
                    <p className="text-sm">No recent results</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentResults.map(match => {
                      const team = teams.find(t => t.id === match.teamId);
                      const result = getMatchResult(match);
                      return (
                        <div key={match.id} className="p-4 bg-gray-50 border border-gray-100 rounded-lg">
                          <div className="font-medium text-gray-900 mb-1">
                            {team?.name} vs {match.opponent}
                          </div>
                          {result && (
                            <div className="flex items-center justify-between mb-1">
                              <div className="text-lg font-bold">
                                <span className={result.result === 'W' ? 'text-green-600' : result.result === 'L' ? 'text-red-500' : 'text-yellow-600'}>
                                  {result.teamScore}
                                </span>
                                <span className="text-gray-400 mx-2">-</span>
                                <span className="text-gray-700">{result.opponentScore}</span>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                result.result === 'W' ? 'bg-green-100 text-green-800' :
                                result.result === 'L' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {result.result === 'W' ? 'Won' : result.result === 'L' ? 'Lost' : 'Drew'}
                              </span>
                            </div>
                          )}
                          <div className="text-xs text-gray-600">
                            {match.scheduledDate.toLocaleDateString()} - {match.matchType}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              System Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{teams.filter(t => !t.isOpponent).length}</div>
                <div className="text-sm text-gray-600">Active Teams</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{matches.length}</div>
                <div className="text-sm text-gray-600">Total Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{liveMatches.length}</div>
                <div className="text-sm text-gray-600">Live Now</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{upcomingMatches.length}</div>
                <div className="text-sm text-gray-600">Next 3 Days</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </StandardLayout>
  );
}