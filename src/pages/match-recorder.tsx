/**
 * Match Recorder - Simplified UX
 * Simple 3-step process: Log Result → Add Details (optional) → Done
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import MobileLayout from "../components/MobileLayout";
import MatchDetailsForm from "../components/MatchDetailsForm";
import { storageV2 as storage } from "../lib/match-tracker-storage-v2";
import { supabase } from "../lib/supabase";
import { Match, Team } from "../types/match-tracker";
import { RequireAuth } from "../components/SecureAuth";

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
  matchStatus: string;
}

interface MatchDetails {
  venue: string;
  referee: boolean;
  weather: string;
  notes: string;
  goalScorers: { playerId: string; playerName: string; assistedBy?: string; minute?: number }[];
  selectedSquad: string[];
}

function MatchRecorderSimple() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('result');
  const [savedMatchId, setSavedMatchId] = useState<string>('');
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [detailsLoaded, setDetailsLoaded] = useState(false);
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
    matchType: 'League',
    matchStatus: 'Finished'
  });

  const [details, setDetails] = useState<MatchDetails>({
    venue: 'Home Ground',
    referee: false,
    weather: '',
    notes: '',
    goalScorers: [],
    selectedSquad: []
  });

  // Debug details state changes
  useEffect(() => {
    if (editingMatch) {
      console.log('🔍 Details state in edit mode:', {
        weather: details.weather,
        selectedSquad: details.selectedSquad.length,
        goalScorers: details.goalScorers.length,
        notes: details.notes?.substring(0, 50)
      });
    }
  }, [details, editingMatch]);

  const [players, setPlayers] = useState<any[]>([]);

  // State for venues
  const [venues, setVenues] = useState<string[]>(['Home Ground', 'Phoenix Park', 'Away Ground', 'Training Ground']);
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [newVenueName, setNewVenueName] = useState('');

  // Load venues from database
  const loadVenues = async () => {
    try {
      console.log('🏟️ Loading venues from database...');
      
      // First try to get venues from a venues table
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('name')
        .order('name');

      if (venuesData && !venuesError && venuesData.length > 0) {
        const venueNames = venuesData.map(v => v.name);
        console.log('🏟️ Loaded venues from venues table:', venueNames);
        setVenues(['Home Ground', ...venueNames]);
        return;
      }

      console.log('🏟️ Venues table not found or empty, trying fallback...');
      
      // Fallback: get unique venues from existing matches
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('venue')
        .not('venue', 'is', null);

      if (matchesData && !matchesError) {
        const uniqueVenues = [...new Set(matchesData.map(m => m.venue).filter(Boolean))];
        if (uniqueVenues.length > 0) {
          const finalVenues = ['Home Ground', 'Phoenix Park', 'Away Ground', ...uniqueVenues.sort()];
          console.log('🏟️ Using venues from matches:', finalVenues);
          setVenues(finalVenues);
        } else {
          console.log('🏟️ Using default venues');
          setVenues(['Home Ground', 'Phoenix Park', 'Away Ground', 'Training Ground']);
        }
      } else {
        console.log('🏟️ Error loading from matches, using defaults');
        setVenues(['Home Ground', 'Phoenix Park', 'Away Ground', 'Training Ground']);
      }
    } catch (error) {
      console.error('Error loading venues:', error);
      console.log('🏟️ Exception occurred, using default venues');
      setVenues(['Home Ground', 'Phoenix Park', 'Away Ground', 'Training Ground']);
    }
  };

  // Add new venue to database
  const addNewVenue = async () => {
    if (!newVenueName.trim()) return;
    
    try {
      // Try to insert into venues table
      const { error: venueError } = await supabase
        .from('venues')
        .insert([{ name: newVenueName.trim(), is_active: true }]);

      if (!venueError) {
        // Successfully added to venues table
        setVenues(prev => [...prev, newVenueName.trim()].sort());
        setNewVenueName('');
        setShowAddVenue(false);
        return;
      }

      // If venues table doesn't exist, just add to local state
      console.log('Venues table not found, adding to local state only');
      setVenues(prev => [...prev, newVenueName.trim()].sort());
      setNewVenueName('');
      setShowAddVenue(false);
    } catch (error) {
      console.error('Error adding venue:', error);
    }
  };

  // Get available venues
  const getAvailableVenues = () => venues;

  // Calculate RVR goals to determine goal scorer slots
  const getRVRGoals = () => {
    // RVR team is ALWAYS the first team (homeTeam in the UI)
    // The score we want is ALWAYS the homeScore (RVR's score)
    return quickResult.homeScore;
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
    loadVenues();
    
    // Check for mode parameter
    const modeParam = router.query.mode as string;
    if (modeParam === 'schedule' || modeParam === 'record') {
      setMode(modeParam);
    }
    
    // Reset details loaded state when not editing
    if (!router.query.edit) {
      setDetailsLoaded(true);
    }
  }, [router.query]);

  // Separate effect for edit mode that depends on teams being loaded
  useEffect(() => {
    const editId = router.query.edit as string;
    if (editId && teams.length > 0) {
      console.log('Teams loaded, now loading match for edit:', editId);
      loadMatchForEdit(editId);
    }
  }, [router.query.edit, teams]);

  // Load players when the selected team changes
  useEffect(() => {
    const loadPlayersForTeam = async () => {
      if (quickResult.homeTeam && quickResult.homeTeam !== 'custom') {
        try {
          const { data: playersData, error } = await supabase
            .from('players')
            .select('*')
            .eq('team_id', quickResult.homeTeam)
            .eq('is_active', true)
            .order('first_name');

          if (error) {
            console.error('Error loading players:', error);
            setPlayers([]);
          } else {
            console.log('🏃 Loaded players for team:', quickResult.homeTeam, playersData?.length || 0);
            setPlayers(playersData || []);
          }
        } catch (error) {
          console.error('Error in loadPlayersForTeam:', error);
          setPlayers([]);
        }
      } else {
        setPlayers([]);
      }
    };

    loadPlayersForTeam();
  }, [quickResult.homeTeam]);

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
          name: team.name,
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
          isOpponent: team.is_opponent || false,
          players: team.players?.map((p: any) => ({
            id: p.id,
            teamId: team.id,
            name: p.first_name,
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
    // RVR team is ALWAYS the first team (homeTeam in the UI)
    // Get players from the homeTeam (which represents RVR team)
    const rvrTeam = teams.find(t => t.id === quickResult.homeTeam && !t.isOpponent);
    
    console.log('🔍 Getting available players:', {
      homeTeam: quickResult.homeTeam,
      awayTeam: quickResult.awayTeam,
      foundTeam: rvrTeam?.name,
      playersCount: rvrTeam?.players?.length || 0
    });
    
    return rvrTeam?.players || [];
  };

  const loadMatchForEdit = async (matchId: string) => {
    try {
      console.log('Loading match for edit:', matchId);
      console.log('Available teams:', teams.length);
      
      const matches = await storage.getMatches();
      console.log('All matches loaded:', matches.length);
      console.log('Available match IDs:', matches.map(m => m.id));
      console.log('Looking for match ID:', matchId);
      
      const matchToEdit = matches.find(m => m.id === matchId);
      
      if (matchToEdit) {
        console.log('Found match to edit:', matchToEdit);
        setEditingMatch(matchToEdit);
        setSavedMatchId(matchId);
        
        // Find team names
        const homeTeam = teams.find(t => t.id === matchToEdit.teamId);
        const awayTeamName = matchToEdit.opponent;
        const awayTeam = teams.find(t => t.name === awayTeamName);
        
        console.log('Team mapping:', { homeTeam, awayTeam, awayTeamName });
        
        // Populate form with match data
        // In our UI: homeTeam = RVR team, awayTeam = opponent team
        // We need to map the stored match data back to this format
        const rvrTeam = teams.find(t => t.id === matchToEdit.teamId);
        const opponentTeam = teams.find(t => t.name === awayTeamName);
        
        // Calculate RVR's score and opponent's score based on match location
        const rvrScore = matchToEdit.isHomeMatch ? matchToEdit.homeScore : matchToEdit.awayScore;
        const opponentScore = matchToEdit.isHomeMatch ? matchToEdit.awayScore : matchToEdit.homeScore;
        
        const quickResultData = {
          homeTeam: matchToEdit.teamId, // RVR team (always first field)
          homeTeamCustom: '',
          awayTeam: opponentTeam?.id || 'custom', // Opponent team (always second field)
          awayTeamCustom: opponentTeam ? '' : awayTeamName,
          homeScore: rvrScore || 0, // RVR's score (always first score)
          awayScore: opponentScore || 0, // Opponent's score (always second score)
          matchDate: matchToEdit.scheduledDate.toISOString().split('T')[0],
          isHomeMatch: matchToEdit.isHomeMatch,
          matchType: matchToEdit.matchType || 'League',
          matchStatus: matchToEdit.status || 'Finished'
        };
        
        console.log('Setting quickResult to:', quickResultData);
        setQuickResult(quickResultData);
        
        // Load goal events for this match
        const goalEvents = await storage.getMatchEvents(matchToEdit.id);
        console.log('Loaded goal events:', goalEvents);
        
        const goalScorers = goalEvents
          .filter(e => e.eventType === 'Goal')
          .map(event => ({
            playerId: event.playerId || '',
            playerName: event.playerName || '',
            assistedBy: event.eventData?.assistPlayerName || '',
            minute: event.minute || 0
          }))
          .sort((a, b) => a.minute - b.minute); // Sort by minute for consistency

        console.log('Processed goal scorers:', goalScorers);

        const detailsToSet = {
          venue: matchToEdit.venue || 'Home Ground',
          referee: matchToEdit.referee === 'Yes',
          weather: matchToEdit.weather || '',
          notes: matchToEdit.notes || '',
          goalScorers: goalScorers,
          selectedSquad: matchToEdit.selectedSquad || []
        };
        
        console.log('🏗️ Setting match details for edit:', {
          rawReferee: matchToEdit.referee,
          convertedReferee: matchToEdit.referee === 'Yes',
          detailsToSet: detailsToSet
        });
        
        setDetails(detailsToSet);
        setDetailsLoaded(true);

        // Always start at step 1 (result) when editing
        setStep('result');
      } else {
        console.error('Match not found for editing:', matchId);
      }
    } catch (error) {
      console.error('Error loading match for edit:', error);
    }
  };

  const saveResult = async () => {
    try {
      console.log('💾 SaveResult - Starting with quickResult:', quickResult);
      console.log('💾 SaveResult - EditingMatch:', editingMatch?.id);
      console.log('💾 SaveResult - Router query edit:', router.query.edit);
      
      // Ensure we're using the correct match ID for edits - prevent duplicates
      const actualEditId = router.query.edit as string || editingMatch?.id;
      console.log('💾 SaveResult - Actual edit ID to use:', actualEditId);
      
      // Only create teams if they're truly custom AND we're not editing an existing match
      let homeTeamId = quickResult.homeTeam;
      let awayTeamName = quickResult.awayTeam;

      // Handle home team
      if (quickResult.homeTeam === 'custom' && quickResult.homeTeamCustom && !actualEditId) {
        console.log('🏠 Creating new custom home team:', quickResult.homeTeamCustom);
        const homeTeam: Team = {
          id: crypto.randomUUID(),
          name: quickResult.homeTeamCustom,
          ageGroup: 'Unknown',
          season: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await storage.saveTeam(homeTeam);
        homeTeamId = homeTeam.id;
      } else if (quickResult.homeTeam !== 'custom') {
        // Use existing team ID
        homeTeamId = quickResult.homeTeam;
      }

      // Handle away team
      if (quickResult.awayTeam === 'custom' && quickResult.awayTeamCustom && !actualEditId) {
        console.log('✈️ Creating new custom away team:', quickResult.awayTeamCustom);
        const awayTeam: Team = {
          id: crypto.randomUUID(),
          name: quickResult.awayTeamCustom,
          ageGroup: 'Unknown',
          isOpponent: true,
          season: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await storage.saveTeam(awayTeam);
        awayTeamName = awayTeam.name;
      } else if (quickResult.awayTeam === 'custom' && quickResult.awayTeamCustom) {
        // For editing: use the custom name directly
        awayTeamName = quickResult.awayTeamCustom;
      } else {
        // Use existing team name
        const awayTeamObj = teams.find(t => t.id === quickResult.awayTeam);
        awayTeamName = awayTeamObj?.name || 'Unknown';
      }

      console.log('💾 Final team mapping:', { homeTeamId, awayTeamName });

      // Create or update the match
      // Map UI scores to database scores based on match location
      const dbHomeScore = isFutureMatch() ? undefined : 
        (quickResult.isHomeMatch ? quickResult.homeScore : quickResult.awayScore); // If home match, home=RVR; if away match, home=opponent
      const dbAwayScore = isFutureMatch() ? undefined : 
        (quickResult.isHomeMatch ? quickResult.awayScore : quickResult.homeScore); // If home match, away=opponent; if away match, away=RVR
      
      const newMatch: Match = {
        id: actualEditId || crypto.randomUUID(),
        teamId: homeTeamId,
        opponent: awayTeamName,
        matchType: quickResult.matchType,
        isHomeMatch: quickResult.isHomeMatch,
        venue: details.venue,
        scheduledDate: new Date(quickResult.matchDate),
        status: quickResult.matchStatus as any,
        homeScore: dbHomeScore,
        awayScore: dbAwayScore,
        referee: details.referee ? 'Yes' : 'No',
        weather: details.weather,
        pitchCond: 'Good',
        notes: details.notes,
        selectedSquad: details.selectedSquad,
        recordedBy: 'match-recorder',
        createdAt: (editingMatch || actualEditId) ? (editingMatch?.createdAt || new Date()) : new Date(),
        updatedAt: new Date()
      };

      await storage.saveMatch(newMatch);
      
      // Save goal events (only for completed matches)
      if (!isFutureMatch()) {
        console.log('Saving goal events, goalScorers:', details.goalScorers);
        
        // If editing match, first delete existing goal events to prevent duplicates
        if (actualEditId) {
          console.log('Editing match - clearing existing goal events to prevent duplicates');
          const existingEvents = await storage.getMatchEvents(newMatch.id);
          const existingGoalEvents = existingEvents.filter(e => e.eventType === 'Goal');
          console.log('Found existing goal events to delete:', existingGoalEvents.length);
          
          for (const event of existingGoalEvents) {
            await storage.deleteMatchEvent(event.id);
          }
        }
        
        // Now save the current goal scorers
        for (let i = 0; i < details.goalScorers.length; i++) {
          const scorer = details.goalScorers[i];
          console.log('Processing scorer:', scorer);
          if (scorer.playerName) {
            const goalEvent = {
              id: crypto.randomUUID(),
              matchId: newMatch.id,
              playerId: scorer.playerId,
              playerName: scorer.playerName,
              eventType: 'Goal' as const,
              minute: scorer.minute || (i * 10 + 15), // Default minutes if not specified
              half: 1 as const,
              eventData: scorer.assistedBy ? { 
                assistPlayerName: scorer.assistedBy,
                goalType: 'Open Play' as const
              } : { goalType: 'Open Play' as const },
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
    <div>
      {/* Mobile Version */}
      <div className="block md:hidden">
        <MobileLayout currentPage="/match-recorder" showNavigation={false}>
          <div className={`min-h-screen relative ${
            editingMatch ? 'bg-gradient-to-br from-purple-50 to-purple-100' : 
            mode === 'record' ? 'bg-gradient-to-br from-green-50 to-emerald-100' : 
            'bg-gradient-to-br from-blue-50 to-indigo-100'
          }`}>
            
            {/* Compact Mobile Header with Progress */}
            <div className={`px-4 py-6 ${
              editingMatch ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 
              mode === 'record' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
              'bg-gradient-to-r from-blue-500 to-indigo-600'
            } text-white relative overflow-hidden`}>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-4 text-6xl">⚽</div>
                <div className="absolute bottom-2 left-4 text-4xl">📊</div>
              </div>
              
              <div className="relative z-10">
                {/* Header with inline progress */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">
                      {editingMatch ? '✏️' : mode === 'record' ? '⚽' : '📅'}
                    </div>
                    <div>
                      <h1 className="text-xl font-bold">
                        {editingMatch ? 'Edit Match' : mode === 'record' ? 'Record Match' : 'Schedule Match'}
                      </h1>
                      <p className="text-white/80 text-sm">
                        Step {step === 'result' ? '1' : step === 'details' ? '2' : '3'} of 3
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/match-central')}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                  >
                    <span className="text-lg">✕</span>
                  </button>
                </div>
                
                {/* Compact progress bar */}
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: step === 'result' ? '33%' : step === 'details' ? '66%' : '100%' 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Content */}
            <div className="p-4 space-y-6">
              
              {/* Step 1: Quick Result Form */}
              {step === 'result' && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
                  <div className="text-center mb-6">
                    <div className="text-3xl mb-2">
                      {editingMatch ? '✏️' : mode === 'record' ? '📝' : '📅'}
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {editingMatch ? 'Edit Match' : mode === 'record' ? 'Record Result' : 'Schedule Match'}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Match Date
                      </label>
                      <input
                        type="date"
                        value={quickResult.matchDate}
                        onChange={(e) => setQuickResult(prev => ({ ...prev, matchDate: e.target.value }))}
                        max={mode === 'record' ? new Date().toISOString().split('T')[0] : undefined}
                        min={mode === 'schedule' ? new Date().toISOString().split('T')[0] : undefined}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Match Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Match Type</label>
                      <select
                        value={quickResult.matchType}
                        onChange={(e) => setQuickResult(prev => ({ ...prev, matchType: e.target.value }))}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="League">🏆 League</option>
                        <option value="Cup">🏅 Cup</option>
                        <option value="Friendly">🤝 Friendly</option>
                        <option value="Tournament">🎯 Tournament</option>
                        <option value="Training">⚽ Training Match</option>
                      </select>
                    </div>

                    {/* Teams */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Home Team</label>
                        <select
                          value={quickResult.homeTeam}
                          onChange={(e) => setQuickResult(prev => ({ ...prev, homeTeam: e.target.value }))}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Opponent</option>
                          {teams.filter(team => team.isOpponent).map(team => (
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

                    {/* Score - only for past/today matches */}
                    {!isFutureMatch() && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Final Score</label>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">
                              {getTeamName(quickResult.homeTeam, quickResult.homeTeamCustom) || 'Home'}
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={quickResult.homeScore}
                              onChange={(e) => setQuickResult(prev => ({ ...prev, homeScore: parseInt(e.target.value) || 0 }))}
                              className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-bold"
                            />
                          </div>
                          <div className="text-xl font-bold text-gray-400">-</div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">
                              {getTeamName(quickResult.awayTeam, quickResult.awayTeamCustom) || 'Away'}
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={quickResult.awayScore}
                              onChange={(e) => setQuickResult(prev => ({ ...prev, awayScore: parseInt(e.target.value) || 0 }))}
                              className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Home/Away Toggle */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Match Location</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setQuickResult(prev => ({ ...prev, isHomeMatch: true }))}
                          className={`px-3 py-3 rounded-lg font-semibold transition-all ${
                            quickResult.isHomeMatch
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          🏠 Home
                        </button>
                        <button
                          onClick={() => setQuickResult(prev => ({ ...prev, isHomeMatch: false }))}
                          className={`px-3 py-3 rounded-lg font-semibold transition-all ${
                            !quickResult.isHomeMatch
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          ✈️ Away
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex flex-col gap-3 mt-6">
                    <button
                      onClick={async () => {
                        await saveResult();
                        setStep('done');
                      }}
                      disabled={!isResultValid()}
                      className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
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
                      className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
                    >
                      {isFutureMatch() ? '➡️ Add Info' : '➡️ Add Details'}
                    </button>
                    
                    <button
                      onClick={() => router.push('/match-central')}
                      className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Details Form */}
              {step === 'details' && detailsLoaded && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
                  <MatchDetailsForm 
                    details={details}
                    setDetails={setDetails}
                    quickResult={quickResult}
                    editingMatch={editingMatch}
                    teams={teams}
                    players={players}
                    onBack={() => setStep('result')}
                    onSave={saveResult}
                    isFutureMatch={isFutureMatch}
                    getAvailablePlayers={getAvailablePlayers}
                    getRVRGoals={getRVRGoals}
                    getAvailableVenues={getAvailableVenues}
                    showAddVenue={showAddVenue}
                    setShowAddVenue={setShowAddVenue}
                    newVenueName={newVenueName}
                    setNewVenueName={setNewVenueName}
                    addNewVenue={addNewVenue}
                  />
                </div>
              )}

              {/* Step 3: Done */}
              {step === 'done' && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 text-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {isFutureMatch() ? 'Fixture Scheduled!' : 'Match Saved!'}
                  </h2>
                  <p className="text-gray-600 mb-6 text-sm">
                    {isFutureMatch() ? (
                      `${getTeamName(quickResult.homeTeam, quickResult.homeTeamCustom)} vs ${getTeamName(quickResult.awayTeam, quickResult.awayTeamCustom)}`
                    ) : (
                      `${getTeamName(quickResult.homeTeam, quickResult.homeTeamCustom)} ${quickResult.homeScore} - ${quickResult.awayScore} ${getTeamName(quickResult.awayTeam, quickResult.awayTeamCustom)}`
                    )}
                  </p>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={editMatch}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        ✏️ Edit
                      </button>
                      
                      <button
                        onClick={deleteMatch}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    
                    <button
                      onClick={() => router.push('/match-central')}
                      className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      {isFutureMatch() ? '📅 View Fixtures' : '📊 View Results'}
                    </button>

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
                      className="w-full px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      ➕ Record Another
                    </button>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </MobileLayout>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <StandardLayout>
          <div className={`min-h-screen py-8 relative overflow-hidden ${
            editingMatch ? 'bg-gradient-to-br from-purple-50 to-purple-100' : 
            mode === 'record' ? 'bg-gradient-to-br from-green-50 to-emerald-100' : 
            'bg-gradient-to-br from-blue-50 to-indigo-100'
          }`}>
            {/* Subtle background elements */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-current rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/6 w-72 h-72 bg-current rounded-full blur-3xl" />
            </div>

            <div className="max-w-3xl mx-auto px-4 relative z-10">

              {/* Compact Desktop Header */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`rounded-2xl p-6 text-white relative overflow-hidden ${
                  editingMatch ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 
                  mode === 'record' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
                  'bg-gradient-to-r from-blue-500 to-indigo-600'
                }`}>
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 right-6 text-8xl">⚽</div>
                    <div className="absolute bottom-4 left-6 text-6xl">📊</div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">
                          {editingMatch ? '✏️' : mode === 'record' ? '⚽' : '📅'}
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold">
                            {editingMatch ? 'Edit Match' : mode === 'record' ? 'Match Recorder' : 'Schedule Match'}
                          </h1>
                          <p className="text-white/80">
                            {editingMatch ? 'Update match details and results' : 
                             mode === 'record' ? 'Record completed match results' : 
                             'Schedule upcoming fixtures'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push('/match-central')}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
                      >
                        <span className="text-xl">✕</span>
                      </button>
                    </div>
                    
                    {/* Inline progress steps */}
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          step === 'result' ? 'bg-white text-gray-800' : (step === 'details' || step === 'done') ? 'bg-white/80 text-gray-800' : 'bg-white/30 text-white'
                        }`}>
                          1
                        </div>
                        <span className="text-white/90 text-sm font-medium">
                          {isFutureMatch() ? 'Match Info' : 'Result'}
                        </span>
                      </div>
                      
                      <div className="flex-1 h-0.5 bg-white/30 rounded-full">
                        <div 
                          className="h-0.5 bg-white rounded-full transition-all duration-500"
                          style={{ width: step === 'result' ? '0%' : step === 'details' ? '50%' : '100%' }}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          step === 'details' ? 'bg-white text-gray-800' : step === 'done' ? 'bg-white/80 text-gray-800' : 'bg-white/30 text-white'
                        }`}>
                          2
                        </div>
                        <span className="text-white/90 text-sm font-medium">Details</span>
                      </div>
                      
                      <div className="flex-1 h-0.5 bg-white/30 rounded-full">
                        <div 
                          className="h-0.5 bg-white rounded-full transition-all duration-500"
                          style={{ width: step === 'done' ? '100%' : '0%' }}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          step === 'done' ? 'bg-white text-gray-800' : 'bg-white/30 text-white'
                        }`}>
                          3
                        </div>
                        <span className="text-white/90 text-sm font-medium">Done</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

          {/* Step 1: Enhanced Result Form */}
          {step === 'result' && (
            <motion.div
              className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 shadow-2xl p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">
                  {editingMatch ? '✏️' : mode === 'record' ? '📝' : '📅'}
                </div>
                <h2 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                  mode === 'record' ? 'from-red-600 to-red-800' : 'from-blue-600 to-blue-800'
                }`}>
                  {editingMatch ? 'Edit Match Result' : mode === 'record' ? 'Record Match Result' : 'Schedule Fixture'}
                </h2>
              </div>
              
              {/* Debug Info for Edit Mode */}
              {editingMatch && (
                <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-xs text-yellow-800">
                    <strong>🔧 Edit Debug:</strong> Home={quickResult.homeTeam}, Away={quickResult.awayTeam}, Score={quickResult.homeScore}-{quickResult.awayScore}, Date={quickResult.matchDate}
                  </div>
                </div>
              )}
              
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
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 bg-white/80 backdrop-blur-sm ${
                      mode === 'record' ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'
                    } hover:shadow-md`}
                    key={`date-${editingMatch?.id || 'new'}-${quickResult.matchDate}`}
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
                    key={`matchtype-${editingMatch?.id || 'new'}-${quickResult.matchType}`}
                  >
                    <option value="League">🏆 League</option>
                    <option value="Cup">🏅 Cup</option>
                    <option value="Friendly">🤝 Friendly</option>
                    <option value="Tournament">🎯 Tournament</option>
                    <option value="Training">⚽ Training Match</option>
                  </select>
                </div>

                {/* Match Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Match Status</label>
                  <select
                    value={quickResult.matchStatus}
                    onChange={(e) => setQuickResult(prev => ({ ...prev, matchStatus: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    key={`matchstatus-${editingMatch?.id || 'new'}-${quickResult.matchStatus}`}
                  >
                    <option value="Finished">✅ Finished</option>
                    <option value="Scheduled">📅 Scheduled</option>
                    <option value="Live">🔴 Live</option>
                    <option value="Cancelled">❌ Cancelled</option>
                    <option value="Postponed">⏰ Postponed</option>
                  </select>
                  {(quickResult.matchStatus === 'Cancelled' || quickResult.matchStatus === 'Postponed') && (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ℹ️ <strong>Note:</strong> {quickResult.matchStatus} matches will not trigger recording notifications.
                        {quickResult.matchStatus === 'Postponed' && ' You can reschedule by editing the match date.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Teams */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Home Team</label>
                    <select
                      value={quickResult.homeTeam}
                      onChange={(e) => setQuickResult(prev => ({ ...prev, homeTeam: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:shadow-md"
                      key={`hometeam-${editingMatch?.id || 'new'}-${quickResult.homeTeam}`}
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80 backdrop-blur-sm hover:shadow-md"
                      key={`awayteam-${editingMatch?.id || 'new'}-${quickResult.awayTeam}`}
                    >
                      <option value="">Select Opponent</option>
                      {teams.filter(team => team.isOpponent).map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                      {teams.filter(team => team.isOpponent).length === 0 && (
                        <option value="" disabled>No opponent teams found - use custom option below</option>
                      )}
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
                    {teams.filter(team => team.isOpponent).length === 0 && (
                      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                        💡 <strong>Tip:</strong> Create opponent teams in <a href="/match-admin" className="underline font-medium">Match Admin</a> for easier selection, or use the custom option above.
                      </div>
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
                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 text-center text-3xl font-bold transition-all duration-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg"
                        key={`homescore-${editingMatch?.id || 'new'}-${quickResult.homeScore}`}
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
                        className="w-full px-4 py-4 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 focus:border-blue-500 text-center text-3xl font-bold transition-all duration-200 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg"
                        key={`awayscore-${editingMatch?.id || 'new'}-${quickResult.awayScore}`}
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
                      className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                        quickResult.isHomeMatch
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                          : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                      }`}
                    >
                      🏠 Home Match
                    </button>
                    <button
                      onClick={() => setQuickResult(prev => ({ ...prev, isHomeMatch: false }))}
                      className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                        !quickResult.isHomeMatch
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                          : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
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
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
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
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    {isFutureMatch() ? '➡️ Add Match Info' : '➡️ Add Details'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Optional Details */}
          {step === 'details' && !detailsLoaded && (
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading match details...</p>
            </motion.div>
          )}
          
          {step === 'details' && detailsLoaded && (
            <MatchDetailsForm 
              details={details}
              setDetails={setDetails}
              quickResult={quickResult}
              editingMatch={editingMatch}
              teams={teams}
              players={players}
              onBack={() => setStep('result')}
              onSave={saveResult}
              isFutureMatch={isFutureMatch}
              getAvailablePlayers={getAvailablePlayers}
              getRVRGoals={getRVRGoals}
              getAvailableVenues={getAvailableVenues}
              showAddVenue={showAddVenue}
              setShowAddVenue={setShowAddVenue}
              newVenueName={newVenueName}
              setNewVenueName={setNewVenueName}
              addNewVenue={addNewVenue}
            />
          )}

          {/* Step 3: Done */}
          {step === 'done' && (
            <motion.div
              className="bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 shadow-2xl p-10 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
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
      </div>
    </div>
  );
}

// Secure wrapper requiring coach/admin access for match recording
export default function SecureMatchRecorder() {
  return (
    <RequireAuth requiredPermission="match:record">
      <MatchRecorderSimple />
    </RequireAuth>
  );
}