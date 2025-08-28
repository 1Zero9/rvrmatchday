/**
 * New Match Creation - Glass Morphism UX
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Complete UX overhaul with proper glass morphism effects
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import StandardLayout from "../../components/StandardLayout";
import { storage } from "../../lib/match-tracker-storage";
import { Match, Team, MatchType } from "../../types/match-tracker";

export default function NewMatchImproved() {
  const router = useRouter();
  const { tracker } = router.query;
  const [saving, setSaving] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState({
    teamId: '',
    opponent: '',
    opponentType: 'new' as 'existing' | 'new',
    existingOpponentId: '',
    matchType: 'League' as MatchType,
    isHomeMatch: true,
    venue: '',
    scheduledDate: '',
    scheduledTime: '',
    hasReferee: false,
    weather: '',
    pitchCondition: 'Good' as 'Excellent' | 'Good' | 'Fair' | 'Poor',
    recordingType: 'live' as 'live' | 'post',
    veoRecording: false,
    veoUrl: ''
  });

  // Load teams on component mount
  useEffect(() => {
    const loadedTeams = storage.getTeams();
    setTeams(loadedTeams);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);
      const opponentName = formData.opponentType === 'existing' && formData.existingOpponentId
        ? teams.find(t => t.id === formData.existingOpponentId)?.name || formData.opponent
        : formData.opponent;

      const match: Match = {
        id: `match-${Date.now()}`,
        teamId: formData.teamId,
        opponent: opponentName,
        matchType: formData.matchType,
        isHomeMatch: formData.isHomeMatch,
        venue: formData.venue || (formData.isHomeMatch ? 'Home Ground' : 'Away Ground'),
        scheduledDate: scheduledDateTime,
        status: formData.recordingType === 'post' ? 'Finished' : 'Scheduled',
        referee: formData.hasReferee ? 'Assigned' : undefined,
        weather: formData.weather || undefined,
        pitchCond: formData.pitchCondition,
        recordedBy: 'admin-1',
        veoRecording: formData.veoRecording,
        veoUrl: formData.veoRecording ? formData.veoUrl : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      storage.saveMatch(match);
      
      if (formData.recordingType === 'live') {
        router.push(`/matches/${match.id}/record`);
      } else {
        router.push(`/matches/${match.id}/post-match`);
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
    <StandardLayout title="New Match">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
        
        {/* Animated Background Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-club-primary rounded-full blur-orb"></div>
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-club-secondary rounded-full blur-orb" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-club-accent rounded-full blur-orb" style={{animationDelay: '4s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-club-neutral rounded-full blur-orb" style={{animationDelay: '1s'}}></div>
        </div>
        
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-club-primary to-club-secondary text-white py-12 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">⚽</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">Create New Match</h1>
                    <p className="text-club-accent mt-1">Set up your match and start recording</p>
                  </div>
                </div>
              </div>
              <Link
                href={tracker ? "/tracker" : "/match-central#tracker"}
                className="glass-card text-white px-8 py-4 font-medium transition-all hover:scale-105 flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            
            {/* Three Column Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Column 1: Match Type & Recording */}
              <div className="space-y-6">
                
                {/* Recording Type */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="glass-card-primary p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3 text-3xl">🎯</span>
                    Recording Type
                  </h2>
                  
                  <div className="space-y-4">
                    <motion.label 
                      whileHover={{ scale: 1.02 }}
                      className={`block p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.recordingType === 'live' 
                          ? 'border-club-primary bg-club-primary/10 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={formData.recordingType === 'live'}
                        onChange={() => updateFormData('recordingType', 'live')}
                        className="sr-only"
                      />
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">🔴</div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">Live Recording</div>
                          <div className="text-sm text-gray-600 mt-2">Track events in real-time during the match with pitch-side interface</div>
                        </div>
                      </div>
                    </motion.label>
                    
                    <motion.label 
                      whileHover={{ scale: 1.02 }}
                      className={`block p-6 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.recordingType === 'post' 
                          ? 'border-club-primary bg-club-primary/10 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={formData.recordingType === 'post'}
                        onChange={() => updateFormData('recordingType', 'post')}
                        className="sr-only"
                      />
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">📋</div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">Post-Match Entry</div>
                          <div className="text-sm text-gray-600 mt-2">Enter final score, statistics and match details after completion</div>
                        </div>
                      </div>
                    </motion.label>
                  </div>
                </motion.div>

                {/* VEO Recording */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="glass-card-secondary p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3 text-3xl">📹</span>
                    VEO Recording
                  </h2>
                  
                  <div className="space-y-4">
                    <motion.label 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-start space-x-4 cursor-pointer p-4 rounded-lg hover:bg-white/50 transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={formData.veoRecording}
                        onChange={(e) => updateFormData('veoRecording', e.target.checked)}
                        className="w-5 h-5 text-club-primary rounded border-2 border-gray-300 focus:ring-2 focus:ring-club-primary focus:border-club-primary transition-colors mt-1"
                      />
                      <div>
                        <div className="text-lg font-bold text-gray-900">Link VEO Camera</div>
                        <div className="text-sm text-gray-600 mt-1">Connect this match to a VEO camera recording</div>
                      </div>
                    </motion.label>
                    
                    {formData.veoRecording && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3 pt-4 border-t border-gray-200"
                      >
                        <label className="block text-sm font-bold text-gray-700">
                          VEO Recording URL
                        </label>
                        <input
                          type="url"
                          value={formData.veoUrl}
                          onChange={(e) => updateFormData('veoUrl', e.target.value)}
                          placeholder="https://app.veo.co/matches/..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary transition-colors bg-white/80"
                        />
                        <p className="text-xs text-gray-500">
                          🔗 Add the VEO match URL to sync video with match events
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
              
              {/* Column 2: Teams & Competition */}
              <div className="space-y-6">
                
                {/* Your Team */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="glass-card-accent p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3 text-3xl">⚽</span>
                    Your Team
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Select Your Team *
                      </label>
                      <select
                        required
                        value={formData.teamId}
                        onChange={(e) => updateFormData('teamId', e.target.value)}
                        className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary transition-colors bg-white/80"
                      >
                        <option value="">Choose Your Team</option>
                        {teams.map(team => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Competition Type *
                      </label>
                      <select
                        required
                        value={formData.matchType}
                        onChange={(e) => updateFormData('matchType', e.target.value as MatchType)}
                        className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary transition-colors bg-white/80"
                      >
                        <option value="League">🏆 League</option>
                        <option value="Cup">🏅 Cup</option>
                        <option value="Friendly">🤝 Friendly</option>
                        <option value="Tournament">⚔️ Tournament</option>
                      </select>
                    </div>
                  </div>
                </motion.div>

                {/* Opponent Team */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="glass-card-primary p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3 text-3xl">🆚</span>
                    Opponent
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex space-x-4">
                      <motion.label 
                        whileHover={{ scale: 1.05 }}
                        className="flex-1 flex items-center cursor-pointer p-3 rounded-lg hover:bg-white/50 transition-all"
                      >
                        <input
                          type="radio"
                          checked={formData.opponentType === 'existing'}
                          onChange={() => updateFormData('opponentType', 'existing')}
                          className="w-4 h-4 text-club-primary border-2 border-gray-300 focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                        />
                        <span className="ml-3 font-medium text-gray-700">Select Existing</span>
                      </motion.label>
                      <motion.label 
                        whileHover={{ scale: 1.05 }}
                        className="flex-1 flex items-center cursor-pointer p-3 rounded-lg hover:bg-white/50 transition-all"
                      >
                        <input
                          type="radio"
                          checked={formData.opponentType === 'new'}
                          onChange={() => updateFormData('opponentType', 'new')}
                          className="w-4 h-4 text-club-primary border-2 border-gray-300 focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                        />
                        <span className="ml-3 font-medium text-gray-700">Add New</span>
                      </motion.label>
                    </div>
                    
                    {formData.opponentType === 'existing' ? (
                      <select
                        required={formData.opponentType === 'existing'}
                        value={formData.existingOpponentId}
                        onChange={(e) => updateFormData('existingOpponentId', e.target.value)}
                        className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary transition-colors bg-white/80"
                      >
                        <option value="">Choose Opponent Team</option>
                        {teams.filter(team => team.id !== formData.teamId).map(team => (
                          <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        required={formData.opponentType === 'new'}
                        value={formData.opponent}
                        onChange={(e) => updateFormData('opponent', e.target.value)}
                        placeholder="Enter opponent team name"
                        className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary transition-colors bg-white/80"
                      />
                    )}
                  </div>
                </motion.div>
              </div>
              
              {/* Column 3: Match Details */}
              <div className="space-y-6">
                
                {/* Venue & Date */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="glass-card-secondary p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3 text-3xl">📅</span>
                    Match Details
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex space-x-4">
                      <motion.label 
                        whileHover={{ scale: 1.05 }}
                        className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.isHomeMatch ? 'border-club-primary bg-club-primary/10' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          checked={formData.isHomeMatch}
                          onChange={() => updateFormData('isHomeMatch', true)}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">🏠</div>
                          <div className="font-bold">Home</div>
                        </div>
                      </motion.label>
                      <motion.label 
                        whileHover={{ scale: 1.05 }}
                        className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          !formData.isHomeMatch ? 'border-club-primary bg-club-primary/10' : 'border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          checked={!formData.isHomeMatch}
                          onChange={() => updateFormData('isHomeMatch', false)}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">✈️</div>
                          <div className="font-bold">Away</div>
                        </div>
                      </motion.label>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Venue Name
                      </label>
                      <input
                        type="text"
                        value={formData.venue}
                        onChange={(e) => updateFormData('venue', e.target.value)}
                        placeholder={formData.isHomeMatch ? "Home Ground" : "Away Ground"}
                        className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary transition-colors bg-white/80"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.scheduledDate}
                          onChange={(e) => updateFormData('scheduledDate', e.target.value)}
                          className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary transition-colors bg-white/80"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Time *
                        </label>
                        <input
                          type="time"
                          required
                          value={formData.scheduledTime}
                          onChange={(e) => updateFormData('scheduledTime', e.target.value)}
                          className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary transition-colors bg-white/80"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Match Conditions */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="glass-card-accent p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3 text-3xl">🌤️</span>
                    Conditions
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Referee Available?
                      </label>
                      <div className="flex space-x-4">
                        <motion.label 
                          whileHover={{ scale: 1.05 }}
                          className={`flex-1 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.hasReferee ? 'border-club-primary bg-club-primary/10' : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            checked={formData.hasReferee}
                            onChange={() => updateFormData('hasReferee', true)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="font-bold">✅ Yes</div>
                          </div>
                        </motion.label>
                        <motion.label 
                          whileHover={{ scale: 1.05 }}
                          className={`flex-1 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            !formData.hasReferee ? 'border-club-primary bg-club-primary/10' : 'border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            checked={!formData.hasReferee}
                            onChange={() => updateFormData('hasReferee', false)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="font-bold">❌ No</div>
                          </div>
                        </motion.label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Weather
                      </label>
                      <input
                        type="text"
                        value={formData.weather}
                        onChange={(e) => updateFormData('weather', e.target.value)}
                        placeholder="e.g., Sunny, Cloudy, Rainy"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary transition-colors bg-white/80"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Pitch Condition *
                      </label>
                      <select
                        required
                        value={formData.pitchCondition}
                        onChange={(e) => updateFormData('pitchCondition', e.target.value)}
                        className="w-full px-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary transition-colors bg-white/80"
                      >
                        <option value="Excellent">🟢 Excellent</option>
                        <option value="Good">🔵 Good</option>
                        <option value="Fair">🟡 Fair</option>
                        <option value="Poor">🔴 Poor</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Submit Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="glass-card-primary p-8 text-center"
            >
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={saving || !formData.teamId || (formData.opponentType === 'new' && !formData.opponent) || (formData.opponentType === 'existing' && !formData.existingOpponentId)}
                  className={`flex-1 py-6 px-8 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-3 ${
                    saving || !formData.teamId || (formData.opponentType === 'new' && !formData.opponent) || (formData.opponentType === 'existing' && !formData.existingOpponentId)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-club-primary to-club-secondary hover:from-club-primary-dark hover:to-club-secondary-dark shadow-lg hover:shadow-xl'
                  } text-white`}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Creating Match...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">{formData.recordingType === 'live' ? '🔴' : '📋'}</span>
                      <span>
                        {formData.recordingType === 'live' 
                          ? 'Create & Start Live Recording' 
                          : 'Create & Enter Results'
                        }
                      </span>
                    </>
                  )}
                </motion.button>
                
                <Link
                  href={tracker ? "/tracker" : "/match-central#tracker"}
                  className="glass-card text-gray-700 hover:text-gray-900 px-8 py-6 font-bold transition-all hover:scale-105 flex items-center space-x-3"
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