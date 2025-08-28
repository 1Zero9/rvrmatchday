/**
 * New Match Creation - Clean Theme
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import StandardLayout from "../../components/StandardLayout";
import { storage } from "../../lib/match-tracker-storage";
import { Match, Team, MatchType } from "../../types/match-tracker";

export default function NewMatch() {
  const router = useRouter();
  const { tracker } = router.query;
  const [saving, setSaving] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState({
    teamId: '',
    opponent: '',
    matchType: 'League' as MatchType,
    isHomeMatch: true,
    venue: '',
    scheduledDate: '',
    scheduledTime: '',
    recordingType: 'live' as 'live' | 'post' | 'schedule',
    loadExisting: false,
    existingMatchId: ''
  });

  const [scheduledMatches, setScheduledMatches] = useState<Match[]>([]);

  useEffect(() => {
    const loadedTeams = storage.getTeams();
    setTeams(loadedTeams);
    
    // Load scheduled matches
    const allMatches = storage.getMatches();
    const scheduled = allMatches.filter(match => match.status === 'Scheduled');
    setScheduledMatches(scheduled);
  }, []);

  // Load existing match data when selected
  useEffect(() => {
    if (formData.loadExisting && formData.existingMatchId) {
      const match = scheduledMatches.find(m => m.id === formData.existingMatchId);
      if (match) {
        setFormData(prev => ({
          ...prev,
          teamId: match.teamId,
          opponent: match.opponent,
          matchType: match.matchType,
          isHomeMatch: match.isHomeMatch,
          venue: match.venue || '',
          scheduledDate: match.scheduledDate ? new Date(match.scheduledDate).toISOString().split('T')[0] : '',
          scheduledTime: match.scheduledDate ? new Date(match.scheduledDate).toISOString().split('T')[1].substring(0, 5) : ''
        }));
      }
    }
  }, [formData.loadExisting, formData.existingMatchId, scheduledMatches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const scheduledDateTime = formData.scheduledDate && formData.scheduledTime 
        ? new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
        : new Date();
      
      if (formData.loadExisting && formData.existingMatchId) {
        // Update existing scheduled match for recording
        const existingMatch = scheduledMatches.find(m => m.id === formData.existingMatchId);
        if (existingMatch) {
          const updatedMatch: Match = {
            ...existingMatch,
            status: formData.recordingType === 'post' ? 'Finished' : 'In Progress',
            updatedAt: new Date()
          };

          storage.saveMatch(updatedMatch);
          
          if (formData.recordingType === 'live') {
            router.push(`/matches/${updatedMatch.id}/record`);
          } else {
            router.push(`/matches/${updatedMatch.id}/post-match`);
          }
        }
      } else {
        // Create new match
        const match: Match = {
          id: `match-${Date.now()}`,
          teamId: formData.teamId,
          opponent: formData.opponent,
          matchType: formData.matchType,
          isHomeMatch: formData.isHomeMatch,
          venue: formData.venue || (formData.isHomeMatch ? 'Home Ground' : 'Away Ground'),
          scheduledDate: scheduledDateTime,
          status: formData.recordingType === 'schedule' ? 'Scheduled' : 
                  formData.recordingType === 'post' ? 'Finished' : 'In Progress',
          recordedBy: 'admin-1',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        storage.saveMatch(match);
        
        if (formData.recordingType === 'schedule') {
          alert('Match scheduled successfully!');
          router.push(tracker ? "/tracker" : "/match-central#fixtures");
        } else if (formData.recordingType === 'live') {
          router.push(`/matches/${match.id}/record`);
        } else {
          router.push(`/matches/${match.id}/post-match`);
        }
      }
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Error creating match. Please try again.');
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

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-2xl text-white">⚽</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Create New Match</h1>
                  <p className="text-gray-600 mt-1">Set up your match and start recording</p>
                </div>
              </div>
              <Link
                href={tracker ? "/tracker" : "/match-central#tracker"}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <span>←</span>
                <span>Cancel</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Match Creation Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          
          {/* Match Setup Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center mb-6">
              <div className="text-2xl mr-3">⚽</div>
              <h3 className="text-xl font-bold text-gray-900">Match Setup</h3>
            </div>
            
            {/* Load Existing Match Option */}
            {scheduledMatches.length > 0 && (
              <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.loadExisting}
                    onChange={(e) => {
                      updateFormData('loadExisting', e.target.checked);
                      if (!e.target.checked) {
                        updateFormData('existingMatchId', '');
                      }
                    }}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    📅 Load Scheduled Match
                    <span className="block text-xs text-gray-500">Record a match that was previously scheduled</span>
                  </span>
                </label>
                
                {formData.loadExisting && (
                  <div className="mt-3">
                    <select
                      value={formData.existingMatchId}
                      onChange={(e) => updateFormData('existingMatchId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                    >
                      <option value="">Choose Scheduled Match</option>
                      {scheduledMatches.map(match => (
                        <option key={match.id} value={match.id}>
                          {teams.find(t => t.id === match.teamId)?.name || 'Team'} vs {match.opponent} - {match.matchType} ({new Date(match.scheduledDate).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Recording Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Action Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                  formData.recordingType === 'live' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    checked={formData.recordingType === 'live'}
                    onChange={() => updateFormData('recordingType', 'live')}
                    className="sr-only"
                  />
                  <div className="text-xl mb-1">🔴</div>
                  <div className="text-sm font-bold text-gray-900">Live Recording</div>
                  <div className="text-xs text-gray-600 mt-1">Track events in real-time</div>
                </label>
                
                <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                  formData.recordingType === 'post' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    checked={formData.recordingType === 'post'}
                    onChange={() => updateFormData('recordingType', 'post')}
                    className="sr-only"
                  />
                  <div className="text-xl mb-1">📋</div>
                  <div className="text-sm font-bold text-gray-900">Post-Match Entry</div>
                  <div className="text-xs text-gray-600 mt-1">Enter after completion</div>
                </label>

                <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                  formData.recordingType === 'schedule' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    checked={formData.recordingType === 'schedule'}
                    onChange={() => updateFormData('recordingType', 'schedule')}
                    className="sr-only"
                  />
                  <div className="text-xl mb-1">📅</div>
                  <div className="text-sm font-bold text-gray-900">Schedule Match</div>
                  <div className="text-xs text-gray-600 mt-1">Add to fixtures list</div>
                </label>
              </div>
            </div>
            
            {/* Teams & Competition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Team *</label>
                <select
                  required
                  value={formData.teamId}
                  onChange={(e) => updateFormData('teamId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                >
                  <option value="">Choose Your Team</option>
                  {teams.filter(team => !team.isOpponent).map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opponent *</label>
                <input
                  type="text"
                  required
                  value={formData.opponent}
                  onChange={(e) => updateFormData('opponent', e.target.value)}
                  placeholder="Enter opponent name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
            
            {/* Match Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Competition */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Competition</label>
                <select
                  value={formData.matchType}
                  onChange={(e) => updateFormData('matchType', e.target.value as MatchType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                >
                  <option value="League">🏆 League</option>
                  <option value="Cup">🏅 Cup</option>
                  <option value="Friendly">🤝 Friendly</option>
                  <option value="Tournament">⚔️ Tournament</option>
                </select>
              </div>
              
              {/* Home/Away */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                <div className="grid grid-cols-2 gap-1">
                  <label className={`p-2 border-2 rounded-lg cursor-pointer transition-all text-center ${
                    formData.isHomeMatch ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      checked={formData.isHomeMatch}
                      onChange={() => updateFormData('isHomeMatch', true)}
                      className="sr-only"
                    />
                    <div className="text-sm">🏠</div>
                    <div className="text-xs font-bold text-gray-900">Home</div>
                  </label>
                  <label className={`p-2 border-2 rounded-lg cursor-pointer transition-all text-center ${
                    !formData.isHomeMatch ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      checked={!formData.isHomeMatch}
                      onChange={() => updateFormData('isHomeMatch', false)}
                      className="sr-only"
                    />
                    <div className="text-sm">✈️</div>
                    <div className="text-xs font-bold text-gray-900">Away</div>
                  </label>
                </div>
              </div>
              
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date {formData.recordingType !== 'schedule' && '*'}
                </label>
                <input
                  type="date"
                  required={formData.recordingType !== 'schedule'}
                  value={formData.scheduledDate}
                  onChange={(e) => updateFormData('scheduledDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                />
              </div>
              
              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time {formData.recordingType !== 'schedule' && '*'}
                </label>
                <input
                  type="time"
                  required={formData.recordingType !== 'schedule'}
                  value={formData.scheduledTime}
                  onChange={(e) => updateFormData('scheduledTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900"
                />
              </div>
            </div>
            
            {/* Venue Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => updateFormData('venue', e.target.value)}
                placeholder={formData.isHomeMatch ? "Home Ground" : "Away Ground"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Action Button Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                type="submit"
                disabled={saving || !formData.teamId || !formData.opponent}
                className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                  saving || !formData.teamId || !formData.opponent
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl text-white'
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Match...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">
                      {formData.recordingType === 'live' ? '🔴' : formData.recordingType === 'schedule' ? '📅' : '📋'}
                    </span>
                    <span>
                      {formData.recordingType === 'live' 
                        ? 'Create & Start Live Recording' 
                        : formData.recordingType === 'schedule'
                        ? 'Schedule Match'
                        : 'Create & Enter Results'
                      }
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.form>
        </div>
      </div>
    </StandardLayout>
  );
}