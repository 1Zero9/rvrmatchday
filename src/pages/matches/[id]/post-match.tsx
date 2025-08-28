/**
 * Post-Match Result Entry System - Clean Theme
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import StandardLayout from "../../../components/StandardLayout";
import { storage } from "../../../lib/match-tracker-storage";
import { Match, Team } from "../../../types/match-tracker";

export default function PostMatchEntryImproved() {
  const router = useRouter();
  const { id } = router.query;
  const [match, setMatch] = useState<Match | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [saving, setSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    homeScore: '',
    awayScore: '',
    notes: '',
    playerOfTheMatch: '',
    yellowCards: '',
    redCards: '',
    injuries: '',
    attendance: '',
    veoRecording: false,
    veoUrl: ''
  });

  useEffect(() => {
    if (id && typeof id === 'string') {
      const matchData = storage.getMatch(id);
      if (matchData) {
        setMatch(matchData);
        
        const teamData = storage.getTeams().find(t => t.id === matchData.teamId);
        if (teamData) {
          setTeam(teamData);
        }

        // Pre-populate existing data
        if (matchData.homeScore !== undefined && matchData.awayScore !== undefined) {
          setFormData(prev => ({
            ...prev,
            homeScore: matchData.homeScore!.toString(),
            awayScore: matchData.awayScore!.toString()
          }));
        }

        if (matchData.veoRecording) {
          setFormData(prev => ({
            ...prev,
            veoRecording: matchData.veoRecording || false,
            veoUrl: matchData.veoUrl || ''
          }));
        }
      }
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!match) return;
    
    setSaving(true);

    try {
      const updatedMatch: Match = {
        ...match,
        status: 'Finished',
        homeScore: parseInt(formData.homeScore),
        awayScore: parseInt(formData.awayScore),
        veoRecording: formData.veoRecording,
        veoUrl: formData.veoRecording ? formData.veoUrl : undefined,
        updatedAt: new Date()
      };

      storage.saveMatch(updatedMatch);
      
      // Show success and redirect
      alert('Match results saved successfully!');
      router.push('/match-central#results');
    } catch (error) {
      console.error('Error saving match results:', error);
      alert('Error saving results. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!match || !team) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading Match Details...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  // For now, show auth gate - in production this would check actual auth
  if (!isAuthenticated) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50">
          {/* Page Header */}
          <div className="bg-slate-800 border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">🔒</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Admin Access Required</h1>
                    <p className="text-slate-300 mt-1">Match editing requires admin authentication</p>
                  </div>
                </div>
                <Link
                  href="/match-central#results"
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Back to Results</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Staff Authentication Required</h3>
              <p className="text-gray-600 mb-6">
                This match editing feature is only available to authorized club staff.
              </p>
              
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-slate-900 mb-2">🎯 Admin Features</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Edit match scores and details</li>
                  <li>• Add player statistics and notes</li>
                  <li>• Manage match recordings</li>
                  <li>• Update team information</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <a
                  href="/login"
                  className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                >
                  <span className="mr-2">🔑</span>
                  Staff Login
                </a>
                <div className="text-sm text-gray-500">
                  Don't have admin access? Contact the club administrator.
                </div>
                <button
                  onClick={() => setIsAuthenticated(true)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  (Demo: Click to bypass auth)
                </button>
              </div>
            </div>
          </div>
        </div>
      </StandardLayout>
    );
  }

  const teamScore = match.isHomeMatch ? formData.homeScore : formData.awayScore;
  const opponentScore = match.isHomeMatch ? formData.awayScore : formData.homeScore;

  // Calculate result
  let resultIcon = '';
  let resultText = '';
  let resultColor = '';

  if (formData.homeScore && formData.awayScore) {
    const teamScoreNum = parseInt(teamScore);
    const opponentScoreNum = parseInt(opponentScore);

    if (teamScoreNum > opponentScoreNum) {
      resultIcon = '🏆';
      resultText = 'WIN';
      resultColor = 'text-green-600';
    } else if (teamScoreNum === opponentScoreNum) {
      resultIcon = '🤝';
      resultText = 'DRAW';
      resultColor = 'text-yellow-600';
    } else {
      resultIcon = '😔';
      resultText = 'LOSS';
      resultColor = 'text-red-600';
    }
  }

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-white">📋</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Post-Match Entry</h1>
                  <p className="text-gray-600 mt-1">{team.name} vs {match.opponent} - {match.matchType}</p>
                </div>
              </div>
              <Link
                href="/match-central#results"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Results</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Match Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm border p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center space-x-1">
                    <span>📅</span>
                    <span>{new Date(match.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>🕐</span>
                    <span>{new Date(match.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>📍</span>
                    <span>{match.venue}</span>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {match.matchType}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-club-primary">
                  {match.isHomeMatch ? '🏠 Home Match' : '✈️ Away Match'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Entry Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            
            {/* Final Score */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3 text-2xl">⚽</span>
                Final Score
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 items-center">
                {/* Home Team Score */}
                <div className="text-center">
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <div className="text-lg font-bold text-gray-900 mb-2">
                      {match.isHomeMatch ? team.name : match.opponent}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      {match.isHomeMatch ? '🏠 Home' : '✈️ Away'}
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      required
                      value={formData.homeScore}
                      onChange={(e) => updateFormData('homeScore', e.target.value)}
                      className="w-20 h-20 text-3xl font-bold text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary bg-white transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* VS Divider */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-400 mb-2">VS</div>
                  <div className="text-sm text-gray-600">Final Score</div>
                  
                  {/* Result Preview */}
                  {resultText && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-4 bg-gray-50 rounded-lg p-3"
                    >
                      <div className={`text-xl font-bold ${resultColor}`}>
                        <span className="mr-2">{resultIcon}</span>
                        {resultText}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Away Team Score */}
                <div className="text-center">
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <div className="text-lg font-bold text-gray-900 mb-2">
                      {match.isHomeMatch ? match.opponent : team.name}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      {match.isHomeMatch ? '✈️ Away' : '🏠 Home'}
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      required
                      value={formData.awayScore}
                      onChange={(e) => updateFormData('awayScore', e.target.value)}
                      className="w-20 h-20 text-3xl font-bold text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary bg-white transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Additional Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3 text-xl">📝</span>
                Match Statistics (Optional)
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Player of the Match ⭐
                  </label>
                  <input
                    type="text"
                    value={formData.playerOfTheMatch}
                    onChange={(e) => updateFormData('playerOfTheMatch', e.target.value)}
                    placeholder="Player name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Attendance 👥
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.attendance}
                    onChange={(e) => updateFormData('attendance', e.target.value)}
                    placeholder="Number of spectators"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Yellow Cards 🟨
                  </label>
                  <input
                    type="text"
                    value={formData.yellowCards}
                    onChange={(e) => updateFormData('yellowCards', e.target.value)}
                    placeholder="Player names (comma separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Red Cards 🟥
                  </label>
                  <input
                    type="text"
                    value={formData.redCards}
                    onChange={(e) => updateFormData('redCards', e.target.value)}
                    placeholder="Player names (comma separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Match Notes 📝
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => updateFormData('notes', e.target.value)}
                  placeholder="Key moments, tactical notes, performance observations, player highlights..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary resize-none"
                />
              </div>
            </motion.div>

            {/* VEO Recording */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3 text-xl">📹</span>
                VEO Video Recording
              </h2>
              
              <div className="space-y-6">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.veoRecording}
                    onChange={(e) => updateFormData('veoRecording', e.target.checked)}
                    className="w-5 h-5 text-club-primary rounded border-gray-300 focus:ring-2 focus:ring-club-primary focus:border-club-primary mt-0.5"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Link VEO Camera Recording</div>
                    <div className="text-sm text-gray-600 mt-1">Add a link to the VEO camera recording for this match</div>
                  </div>
                </label>
                
                {formData.veoRecording && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 pt-4 border-t border-gray-200"
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        VEO Recording URL
                      </label>
                      <input
                        type="url"
                        value={formData.veoUrl}
                        onChange={(e) => updateFormData('veoUrl', e.target.value)}
                        placeholder="https://app.veo.co/matches/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                      />
                      <p className="text-sm text-gray-500">
                        Paste the VEO match URL to link video highlights with match events
                      </p>
                      {formData.veoUrl && (
                        <a
                          href={formData.veoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-club-primary hover:text-club-primary/80 transition-colors text-sm"
                        >
                          <span className="mr-1">🔗</span>
                          <span className="font-medium">Open VEO Recording</span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Submit Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border p-6"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  type="submit"
                  disabled={saving || !formData.homeScore || !formData.awayScore}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 ${
                    saving || !formData.homeScore || !formData.awayScore
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-club-primary hover:bg-club-primary/90 shadow-sm hover:shadow-md'
                  } text-white`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving Results...</span>
                    </>
                  ) : (
                    <>
                      <span>✅</span>
                      <span>Save Match Results</span>
                    </>
                  )}
                </button>
                
                <Link
                  href="/match-central#results"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Cancel</span>
                </Link>
              </div>
            </motion.div>
          </motion.form>
        </div>
      </div>
    </StandardLayout>
  );
}