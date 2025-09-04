/**
 * Match Recorder - Simplified UX
 * Simple 3-step process: Log Result → Add Details (optional) → Done
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import { storageV2 as storage } from "../lib/match-tracker-storage-v2";
import { supabase } from "../lib/supabase";
import { Match, Team } from "../types/match-tracker";

type Step = 'result' | 'details' | 'done';

interface QuickResult {
  homeTeam: string;
  homeTeamCustom: string;
  awayTeam: string;
  awayTeamCustom: string;
  homeScore: number;
  awayScore: number;
  matchDate: string;
  isHomeMatch: boolean;
  matchType: string;
}

interface MatchDetails {
  venue: string;
  referee: boolean;
  weather: string;
  notes: string;
  goalScorers: { playerId: string; playerName: string; assistedBy?: string; minute?: number }[];
  selectedSquad: string[];
}

export default function MatchRecorderSimple() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('result');
  const [savedMatchId, setSavedMatchId] = useState<string>('');
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [mode, setMode] = useState<'record' | 'schedule'>('record');
  
  const [quickResult, setQuickResult] = useState<QuickResult>({
    homeTeam: '',
    homeTeamCustom: '',
    awayTeam: '',
    awayTeamCustom: '',
    homeScore: 0,
    awayScore: 0,
    matchDate: new Date().toISOString().split('T')[0],
    isHomeMatch: true,
    matchType: 'League'
  });

  const [details, setDetails] = useState<MatchDetails>({
    venue: 'Home Ground',
    referee: false,
    weather: '',
    notes: '',
    goalScorers: [],
    selectedSquad: []
  });

  const [players, setPlayers] = useState<any[]>([]);

  // Get available venues from matches
  const getAvailableVenues = () => {
    const venues = ['Home Ground', 'Phoenix Park', 'Away Ground', 'Training Ground'];
    return venues;
  };

  // Calculate RVR goals to determine goal scorer slots
  const getRVRGoals = () => {
    return quickResult.isHomeMatch ? quickResult.homeScore : quickResult.awayScore;
  };

  // Check if match is in the future (fixture)
  const isFutureMatch = () => {
    const matchDate = new Date(quickResult.matchDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    matchDate.setHours(0, 0, 0, 0);
    return matchDate > today;
  };

  // Auto-update goal scorers when score changes (only for past/today matches)
  useEffect(() => {
    if (!isFutureMatch()) {
      const rvrGoals = getRVRGoals();
      const currentScorers = details.goalScorers.length;
      
      if (rvrGoals !== currentScorers) {
        const newScorers = [];
        for (let i = 0; i < rvrGoals; i++) {
          newScorers.push(details.goalScorers[i] || { playerId: '', playerName: '', assistedBy: '' });
        }
        setDetails(prev => ({ ...prev, goalScorers: newScorers }));
      }
    }
  }, [quickResult.homeScore, quickResult.awayScore, quickResult.isHomeMatch, quickResult.matchDate]);

  useEffect(() => {
    loadData();
    
    // Check for mode parameter
    const modeParam = router.query.mode as string;
    if (modeParam === 'schedule' || modeParam === 'record') {
      setMode(modeParam);
    }
    
    // Check for edit mode
    const editId = router.query.edit as string;
    if (editId) {
      loadMatchForEdit(editId);
    }
  }, [router.query]);

  const loadData = async () => {
    try {
      // Load teams directly from database
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select(`*, players(*)`)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error loading teams:', error);
        setTeams([]);
      } else {
        const loadedTeams: Team[] = teamsData?.map(team => ({
          id: team.id,
          name: team.team_name,
          category: team.age_group || 'Unknown',
          ageGroup: team.age_group || 'Unknown',
          gender: team.gender || 'Mixed',
          season: team.season || '2024/25',
          league: team.league || 'Local',
          homeVenue: team.home_venue || 'St. Finian\'s GAA',
          contactEmail: team.contact_email || '',
          contactPhone: team.contact_phone || '',
          coaches: team.coaches || [],
          notes: team.notes || '',
          homeKit: { primary: '#009639', secondary: '#FFFFFF' },
          awayKit: { primary: '#FFFFFF', secondary: '#009639' },
          isOpponent: team.team_type === 'opponent',
          players: team.players?.map((p: any) => ({
            id: p.id,
            teamId: team.id,
            name: p.player_name,
            position: p.position || 'Field Player',
            isCaptain: p.is_captain || false,
            isViceCaptain: p.is_vice_captain || false,
            isActive: p.is_active !== false,
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at || p.created_at)
          })) || [],
          createdAt: new Date(team.created_at),
          updatedAt: new Date(team.updated_at || team.created_at)
        })) || [];
        setTeams(loadedTeams);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get players from the selected RVR team
  const getAvailablePlayers = () => {
    const selectedTeamId = quickResult.isHomeMatch ? quickResult.homeTeam : quickResult.awayTeam;
    const selectedTeam = teams.find(t => t.id === selectedTeamId && !t.isOpponent);
    return selectedTeam?.players || [];
  };

  const loadMatchForEdit = async (matchId: string) => {
    try {
      const matches = await storage.getMatches();
      const matchToEdit = matches.find(m => m.id === matchId);
      
      if (matchToEdit) {
        setEditingMatch(matchToEdit);
        setSavedMatchId(matchId);
        
        // Find team names
        const homeTeam = teams.find(t => t.id === matchToEdit.teamId);
        const awayTeamName = matchToEdit.opponent;
        const awayTeam = teams.find(t => t.name === awayTeamName);
        
        // Populate form with match data
        setQuickResult({
          homeTeam: matchToEdit.isHomeMatch ? matchToEdit.teamId : (awayTeam?.id || 'custom'),
          homeTeamCustom: matchToEdit.isHomeMatch ? '' : (!awayTeam ? awayTeamName : ''),
          awayTeam: matchToEdit.isHomeMatch ? (awayTeam?.id || 'custom') : matchToEdit.teamId,
          awayTeamCustom: matchToEdit.isHomeMatch ? (!awayTeam ? awayTeamName : '') : '',
          homeScore: matchToEdit.homeScore || 0,
          awayScore: matchToEdit.awayScore || 0,
          matchDate: matchToEdit.scheduledDate.toISOString().split('T')[0],
          isHomeMatch: matchToEdit.isHomeMatch,
          matchType: matchToEdit.matchType || 'League'
        });
        
        // Load goal events for this match
        const goalEvents = await storage.getMatchEvents(matchToEdit.id);
        const goalScorers = goalEvents
          .filter(e => e.eventType === 'Goal')
          .map(event => ({
            playerId: event.playerId || '',
            playerName: event.playerName || '',
            assistedBy: event.eventData?.assistPlayerName || '',
            minute: event.minute || 0
          }));

        setDetails({
          venue: matchToEdit.venue || 'Home Ground',
          referee: matchToEdit.referee === 'Yes',
          weather: matchToEdit.weather || '',
          notes: matchToEdit.notes || '',
          goalScorers: goalScorers,
          selectedSquad: matchToEdit.selectedSquad || []
        });

        // If match has details or goal scorers, go directly to details step
        const hasDetails = matchToEdit.venue || matchToEdit.referee || matchToEdit.weather || 
                          matchToEdit.notes || goalScorers.length > 0;
        
        if (hasDetails) {
          setStep('details');
        }
      }
    } catch (error) {
      console.error('Error loading match for edit:', error);
    }
  };

  const saveResult = async () => {
    try {
      // Create teams if custom
      let homeTeamId = quickResult.homeTeam;
      let awayTeamName = quickResult.awayTeam;

      if (quickResult.homeTeam === 'custom' && quickResult.homeTeamCustom) {
        const homeTeam: Team = {
          id: `team-${Date.now()}-home`,
          name: quickResult.homeTeamCustom,
          ageGroup: 'Unknown',
          season: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await storage.saveTeam(homeTeam);
        homeTeamId = homeTeam.id;
      }

      if (quickResult.awayTeam === 'custom' && quickResult.awayTeamCustom) {
        const awayTeam: Team = {
          id: `team-${Date.now()}-away`,
          name: quickResult.awayTeamCustom,
          ageGroup: 'Unknown',
          isOpponent: true,
          season: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await storage.saveTeam(awayTeam);
        awayTeamName = awayTeam.name;
      } else {
        const awayTeamObj = teams.find(t => t.id === quickResult.awayTeam);
        awayTeamName = awayTeamObj?.name || 'Unknown';
      }

      // Create or update the match
      const newMatch: Match = {
        id: editingMatch ? editingMatch.id : `match-${Date.now()}`,
        teamId: homeTeamId,
        opponent: awayTeamName,
        matchType: quickResult.matchType,
        isHomeMatch: quickResult.isHomeMatch,
        venue: details.venue,
        scheduledDate: new Date(quickResult.matchDate),
        status: isFutureMatch() ? 'Scheduled' : 'Finished',
        homeScore: isFutureMatch() ? undefined : (quickResult.isHomeMatch ? quickResult.homeScore : quickResult.awayScore),
        awayScore: isFutureMatch() ? undefined : (quickResult.isHomeMatch ? quickResult.awayScore : quickResult.homeScore),
        referee: details.referee ? 'Yes' : 'No',
        weather: details.weather,
        pitchCond: 'Good',
        notes: details.notes,
        selectedSquad: details.selectedSquad,
        recordedBy: 'match-recorder',
        createdAt: editingMatch ? editingMatch.createdAt : new Date(),
        updatedAt: new Date()
      };

      await storage.saveMatch(newMatch);
      
      // Save goal events (only for completed matches)
      if (!isFutureMatch()) {
        console.log('Saving goal events, goalScorers:', details.goalScorers);
        for (let i = 0; i < details.goalScorers.length; i++) {
          const scorer = details.goalScorers[i];
          console.log('Processing scorer:', scorer);
          if (scorer.playerName) {
            const goalEvent = {
              id: `event-${Date.now()}-${i}`,
              matchId: newMatch.id,
              playerId: scorer.playerId,
              playerName: scorer.playerName,
              eventType: 'Goal' as const,
              minute: scorer.minute || (i * 10 + 15), // Default minutes if not specified
              half: 1 as const,
              eventData: scorer.assistedBy ? { assistPlayerName: scorer.assistedBy } : {},
              recordedAt: new Date(),
              recordedBy: 'match-recorder'
            };
            await storage.saveMatchEvent(goalEvent);
          }
        }
      }
      
      setSavedMatchId(newMatch.id);
      setStep('done');

    } catch (error) {
      console.error('Error saving result:', error);
      alert('Error saving result. Please try again.');
    }
  };

  const editMatch = () => {
    setStep('result');
  };

  const deleteMatch = async () => {
    if (confirm('Are you sure you want to delete this match result?')) {
      try {
        await storage.deleteMatch(savedMatchId);
        router.push('/match-central');
      } catch (error) {
        console.error('Error deleting match:', error);
        alert('Error deleting match.');
      }
    }
  };

  const getTeamName = (teamId: string, customName: string) => {
    if (teamId === 'custom') return customName;
    return teams.find(t => t.id === teamId)?.name || 'Unknown';
  };

  const isResultValid = () => {
    const teamsValid = (quickResult.homeTeam && (quickResult.homeTeam !== 'custom' || quickResult.homeTeamCustom)) &&
                      (quickResult.awayTeam && (quickResult.awayTeam !== 'custom' || quickResult.awayTeamCustom));
    const dateValid = quickResult.matchDate;
    
    // For fixtures (future dates), teams and date are enough
    // For results (past/today), we also need scores if they were entered
    return teamsValid && dateValid;
  };

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-2xl mx-auto px-4">

          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={`text-3xl font-bold mb-2 ${
              editingMatch ? 'text-gray-900' : mode === 'record' ? 'text-red-900' : 'text-blue-900'
            }`}>
              {editingMatch 
                ? '✏️ Edit Match' 
                : mode === 'record' 
                  ? '📝 Record Match' 
                  : '📅 Schedule Match'
              }
            </h1>
            <p className="text-gray-600">
              {editingMatch 
                ? 'Update match details and results' 
                : mode === 'record'
                  ? 'Record results for completed matches (today or earlier)'
                  : 'Schedule upcoming fixtures (today or future dates)'
              }
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${step === 'result' ? 'text-blue-600' : step === 'details' || step === 'done' ? 'text-green-600' : 'text-gray-500'}`}>
                1. {isFutureMatch() ? 'Match Info' : 'Result'}
              </span>
              <span className={`text-sm font-medium ${step === 'details' ? 'text-blue-600' : step === 'done' ? 'text-green-600' : 'text-gray-500'}`}>
                2. Details (Optional)
              </span>
              <span className={`text-sm font-medium ${step === 'done' ? 'text-blue-600' : 'text-gray-500'}`}>
                3. Done
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: step === 'result' ? '33%' : step === 'details' ? '66%' : '100%' 
                }}
              ></div>
            </div>
          </div>

          {/* Step 1: Log Result */}
          {step === 'result' && (
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className={`text-xl font-bold mb-6 ${
                mode === 'record' ? 'text-red-900' : 'text-blue-900'
              }`}>
                {mode === 'record' ? '📝 Record Match Result' : '📅 Schedule Fixture'}
              </h2>
              
              <div className="space-y-4">
                {/* Date */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    mode === 'record' ? 'text-red-700' : 'text-blue-700'
                  }`}>
                    Match Date {mode === 'record' ? '(Today or Earlier)' : '(Today or Later)'}
                  </label>
                  <input
                    type="date"
                    value={quickResult.matchDate}
                    onChange={(e) => setQuickResult(prev => ({ ...prev, matchDate: e.target.value }))}
                    max={mode === 'record' ? new Date().toISOString().split('T')[0] : undefined}
                    min={mode === 'schedule' ? new Date().toISOString().split('T')[0] : undefined}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
                      mode === 'record' ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                  />
                  {isFutureMatch() && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
                      📅 <strong>Future Date Detected:</strong> This will be saved as a fixture until match details are added.
                    </div>
                  )}
                </div>

                {/* Match Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Match Type</label>
                  <select
                    value={quickResult.matchType}
                    onChange={(e) => setQuickResult(prev => ({ ...prev, matchType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="League">🏆 League</option>
                    <option value="Cup">🏅 Cup</option>
                    <option value="Friendly">🤝 Friendly</option>
                    <option value="Tournament">🎯 Tournament</option>
                    <option value="Training">⚽ Training Match</option>
                  </select>
                </div>

                {/* Teams */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Home Team</label>
                    <select
                      value={quickResult.homeTeam}
                      onChange={(e) => setQuickResult(prev => ({ ...prev, homeTeam: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Team</option>
                      {teams.filter(t => !t.isOpponent).map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                      <option value="custom">+ Add Custom Team</option>
                    </select>
                    {quickResult.homeTeam === 'custom' && (
                      <input
                        type="text"
                        placeholder="Enter team name"
                        value={quickResult.homeTeamCustom}
                        onChange={(e) => setQuickResult(prev => ({ ...prev, homeTeamCustom: e.target.value }))}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Away Team</label>
                    <select
                      value={quickResult.awayTeam}
                      onChange={(e) => setQuickResult(prev => ({ ...prev, awayTeam: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Opponent</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                      <option value="custom">+ Add Custom Opponent</option>
                    </select>
                    {quickResult.awayTeam === 'custom' && (
                      <input
                        type="text"
                        placeholder="Enter opponent name"
                        value={quickResult.awayTeamCustom}
                        onChange={(e) => setQuickResult(prev => ({ ...prev, awayTeamCustom: e.target.value }))}
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                </div>

                {/* Score - only show for past/today matches */}
                {!isFutureMatch() && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Final Score</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        {getTeamName(quickResult.homeTeam, quickResult.homeTeamCustom) || 'Home Team'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={quickResult.homeScore}
                        onChange={(e) => setQuickResult(prev => ({ ...prev, homeScore: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-bold"
                      />
                    </div>
                    <div className="text-2xl font-bold text-gray-400">-</div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        {getTeamName(quickResult.awayTeam, quickResult.awayTeamCustom) || 'Away Team'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={quickResult.awayScore}
                        onChange={(e) => setQuickResult(prev => ({ ...prev, awayScore: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-bold"
                      />
                    </div>
                  </div>
                </div>
                )}

                {/* Home/Away Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Match Location</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setQuickResult(prev => ({ ...prev, isHomeMatch: true }))}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        quickResult.isHomeMatch
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      🏠 Home Match
                    </button>
                    <button
                      onClick={() => setQuickResult(prev => ({ ...prev, isHomeMatch: false }))}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                        !quickResult.isHomeMatch
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ✈️ Away Match
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => router.push('/match-central')}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      await saveResult();
                      setStep('done');
                    }}
                    disabled={!isResultValid()}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                  >
                    {isFutureMatch() ? '📅 Save Fixture' : '✅ Save Result'}
                  </button>
                  
                  <button
                    onClick={() => {
                      if (isResultValid()) {
                        setStep('details');
                      } else {
                        alert('Please complete the required fields first');
                      }
                    }}
                    disabled={!isResultValid()}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors"
                  >
                    {isFutureMatch() ? '➡️ Add Match Info' : '➡️ Add Details'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Optional Details */}
          {step === 'details' && (
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {isFutureMatch() ? '📅 Match Details (Optional)' : '📋 Additional Details (Optional)'}
              </h2>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                    <select
                      value={details.venue}
                      onChange={(e) => setDetails(prev => ({ ...prev, venue: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {getAvailableVenues().map(venue => (
                        <option key={venue} value={venue}>{venue}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Referee Present</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="referee"
                          checked={details.referee === true}
                          onChange={() => setDetails(prev => ({ ...prev, referee: true }))}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="referee"
                          checked={details.referee === false}
                          onChange={() => setDetails(prev => ({ ...prev, referee: false }))}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weather Conditions</label>
                  <select
                    value={details.weather}
                    onChange={(e) => setDetails(prev => ({ ...prev, weather: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select...</option>
                    <option value="Sunny">☀️ Sunny</option>
                    <option value="Partly Cloudy">⛅ Partly Cloudy</option>
                    <option value="Cloudy">☁️ Cloudy</option>
                    <option value="Light Rain">🌦️ Light Rain</option>
                    <option value="Heavy Rain">🌧️ Heavy Rain</option>
                    <option value="Windy">💨 Windy</option>
                    <option value="Foggy">🌫️ Foggy</option>
                  </select>
                </div>

                {/* Squad Selection - Only show if not future match and RVR team selected */}
                {!isFutureMatch() && getAvailablePlayers().length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Match Squad (Select players who played)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                      {getAvailablePlayers().map((player) => (
                        <label key={player.id} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-2 rounded">
                          <input
                            type="checkbox"
                            checked={details.selectedSquad.includes(player.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setDetails(prev => ({
                                  ...prev,
                                  selectedSquad: [...prev.selectedSquad, player.id]
                                }));
                              } else {
                                setDetails(prev => ({
                                  ...prev,
                                  selectedSquad: prev.selectedSquad.filter(id => id !== player.id)
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {player.name}
                            {player.position && <span className="text-gray-500 ml-1">({player.position})</span>}
                          </span>
                        </label>
                      ))}
                    </div>
                    {details.selectedSquad.length > 0 && (
                      <p className="text-sm text-green-600 mt-2">
                        ✅ {details.selectedSquad.length} player{details.selectedSquad.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                )}

                {/* Goal Scorers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Scorers ({getRVRGoals()} goal{getRVRGoals() !== 1 ? 's' : ''})
                  </label>
                  <div className="space-y-3">
                    {Array.from({ length: getRVRGoals() }, (_, index) => {
                      const scorer = details.goalScorers[index] || { playerId: '', playerName: '', assistedBy: '' };
                      return (
                        <div key={index} className="flex gap-2 items-center p-3 bg-green-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-600 w-12">
                            Goal {index + 1}:
                          </div>
                          <select
                            value={scorer.playerId}
                            onChange={(e) => {
                              const selectedPlayer = getAvailablePlayers().find(p => p.id === e.target.value);
                              const newScorers = [...details.goalScorers];
                              while (newScorers.length <= index) {
                                newScorers.push({ playerId: '', playerName: '', assistedBy: '' });
                              }
                              newScorers[index] = { 
                                ...newScorers[index], 
                                playerId: e.target.value,
                                playerName: selectedPlayer?.name || ''
                              };
                              setDetails(prev => ({ ...prev, goalScorers: newScorers }));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">Select player...</option>
                            {details.selectedSquad.length > 0 ? (
                              details.selectedSquad.map(playerId => {
                                const player = getAvailablePlayers().find(p => p.id === playerId);
                                return player ? (
                                  <option key={player.id} value={player.id}>
                                    {player.name} {player.position && `(${player.position})`}
                                  </option>
                                ) : null;
                              })
                            ) : (
                              getAvailablePlayers().map(player => (
                                <option key={player.id} value={player.id}>
                                  {player.name} {player.position && `(${player.position})`}
                                </option>
                              ))
                            )}
                          </select>
                          <select
                            value={scorer.assistedBy || ''}
                            onChange={(e) => {
                              const newScorers = [...details.goalScorers];
                              while (newScorers.length <= index) {
                                newScorers.push({ playerId: '', playerName: '', assistedBy: '' });
                              }
                              newScorers[index] = { ...newScorers[index], assistedBy: e.target.value };
                              setDetails(prev => ({ ...prev, goalScorers: newScorers }));
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="">Assisted by...</option>
                            {details.selectedSquad.length > 0 ? (
                              details.selectedSquad.map(playerId => {
                                const player = getAvailablePlayers().find(p => p.id === playerId);
                                return player && player.id !== scorer.playerId ? (
                                  <option key={player.id} value={player.name}>
                                    {player.name} {player.position && `(${player.position})`}
                                  </option>
                                ) : null;
                              })
                            ) : (
                              getAvailablePlayers()
                                .filter(player => player.id !== scorer.playerId)
                                .map(player => (
                                  <option key={player.id} value={player.name}>
                                    {player.name} {player.position && `(${player.position})`}
                                  </option>
                                ))
                            )}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Match Notes</label>
                  <textarea
                    value={details.notes}
                    onChange={(e) => setDetails(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Key moments, player performances, etc."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep('result')}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  ← Back
                </button>
                
                <button
                  onClick={async () => {
                    await saveResult();
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  ✅ Save Match
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Done */}
          {step === 'done' && (
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isFutureMatch() ? 'Fixture Scheduled!' : 'Match Result Saved!'}
              </h2>
              <p className="text-gray-600 mb-8">
                {isFutureMatch() ? (
                  `${getTeamName(quickResult.homeTeam, quickResult.homeTeamCustom)} vs ${getTeamName(quickResult.awayTeam, quickResult.awayTeamCustom)} - ${new Date(quickResult.matchDate).toLocaleDateString()}`
                ) : (
                  `${getTeamName(quickResult.homeTeam, quickResult.homeTeamCustom)} ${quickResult.homeScore} - ${quickResult.awayScore} ${getTeamName(quickResult.awayTeam, quickResult.awayTeamCustom)}`
                )}
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={editMatch}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  ✏️ Edit
                </button>
                
                <button
                  onClick={deleteMatch}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  🗑️ Delete
                </button>
                
                <button
                  onClick={() => router.push('/match-central')}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  {isFutureMatch() ? '📅 View Fixtures' : '📊 View Results'}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setStep('result');
                    setQuickResult({
                      homeTeam: '',
                      homeTeamCustom: '',
                      awayTeam: '',
                      awayTeamCustom: '',
                      homeScore: 0,
                      awayScore: 0,
                      matchDate: new Date().toISOString().split('T')[0],
                      isHomeMatch: true,
                      matchType: 'League'
                    });
                    setDetails({
                      venue: 'Home Ground',
                      referee: false,
                      weather: '',
                      notes: '',
                      goalScorers: [],
                      selectedSquad: []
                    });
                  }}
                  className="px-6 py-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  ➕ Record Another Match
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </StandardLayout>
  );
}