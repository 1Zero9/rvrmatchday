/**
 * Match Administration - User-Friendly Team Setup Wizard
 * Simple step-by-step process for creating RVR teams and opponents
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import { supabase } from "../lib/supabase";
import { Team } from "../types/match-tracker";

type TeamType = 'rvr' | 'opponent';
type WizardStep = 'type' | 'basic' | 'details' | 'coaches' | 'squad' | 'review' | 'complete';

interface WizardData {
  // Step 1: Team Type
  teamType: TeamType;
  
  // Step 2: Basic Info
  teamName: string;
  ageGroup: string;
  gender: 'Male' | 'Female' | 'Mixed';
  
  // Step 3: Details
  league: string;
  season: string;
  homeVenue: string;
  coaches: string[];
  contactEmail: string;
  contactPhone: string;
  notes: string;
  
  // Step 4: Squad (RVR teams only)
  players: Array<{
    name: string;
    position: string;
    isCaptain: boolean;
    isViceCaptain: boolean;
  }>;
}

export default function MatchAdminNew() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<WizardStep>('type');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Reference data
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [leagues, setLeagues] = useState<string[]>([]);
  const [venues, setVenues] = useState<string[]>([]);
  const [coaches, setCoaches] = useState<string[]>([]);
  const [positions, setPositions] = useState<string[]>([]);
  const [existingPlayers, setExistingPlayers] = useState<{id: string, name: string, position: string}[]>([]);
  
  const [wizardData, setWizardData] = useState<WizardData>({
    teamType: 'rvr',
    teamName: '',
    ageGroup: '',
    gender: 'Male',
    league: '',
    season: '2024/25',
    homeVenue: '',
    coaches: [],
    contactEmail: '',
    contactPhone: '',
    notes: '',
    players: []
  });

  // Load reference data
  useEffect(() => {
    loadReferenceData();
    loadTeams();
  }, []);

  // Handle edit query parameter - only run once when teams load
  useEffect(() => {
    const editTeamId = router.query.edit as string;
    
    if (editTeamId && teams.length > 0) {
      const teamToEdit = teams.find(t => t.id === editTeamId);
      
      if (teamToEdit && currentStep === 'type') {
        setWizardData({
          teamType: teamToEdit.isOpponent ? 'opponent' : 'rvr',
          teamName: teamToEdit.name,
          ageGroup: teamToEdit.ageGroup || '',
          gender: teamToEdit.gender || 'Mixed',
          league: teamToEdit.league || '',
          season: teamToEdit.season || '2024/25',
          homeVenue: teamToEdit.homeVenue || '',
          coaches: Array.isArray(teamToEdit.coaches) ? teamToEdit.coaches : [],
          contactEmail: teamToEdit.contactEmail || '',
          contactPhone: teamToEdit.contactPhone || '',
          notes: teamToEdit.notes || '',
          players: teamToEdit.players?.map(p => ({
            name: p.name,
            position: p.position,
            isCaptain: p.isCaptain || false,
            isViceCaptain: p.isViceCaptain || false
          })) || []
        });
        setCurrentStep('basic');
      }
    }
  }, [router.query.edit, teams]);

  const loadReferenceData = async () => {
    try {
      // Use fallback data if reference tables don't exist yet
      const fallbackAgeGroups = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'Senior', 'Vets'];
      const fallbackLeagues = ['Dublin & District Schoolboys League', 'DDSL Premier', 'DDSL Div 1', 'DDSL Div 2', 'Friendly'];
      const fallbackVenues = ['St. Finian\'s GAA', 'Ward River Valley Pitch', 'Away Venue'];
      const fallbackPositions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Substitute'];
      
      setAgeGroups(fallbackAgeGroups);
      setLeagues(fallbackLeagues);
      setVenues(fallbackVenues);
      setPositions(fallbackPositions);
      
      // Try to load existing players and coaches from teams table
      const { data: playersData } = await supabase
        .from('players')
        .select('id, first_name, position')
        .order('first_name');
        
      setExistingPlayers(playersData?.map(item => ({
        id: item.id,
        name: item.first_name,
        position: item.position || ''
      })) || []);
      
      // Load coaches from teams table
      const { data: teamsData } = await supabase
        .from('teams')
        .select('coaches')
        .not('coaches', 'is', null);
        
      const allCoaches = new Set<string>();
      teamsData?.forEach(team => {
        if (Array.isArray(team.coaches)) {
          team.coaches.forEach(coach => allCoaches.add(coach));
        }
      });
      setCoaches(Array.from(allCoaches));
      
    } catch (error) {
      console.error('Error loading reference data:', error);
      // Set fallback data even on error
      setAgeGroups(['U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'Senior', 'Vets']);
      setLeagues(['DDSL Premier', 'DDSL Div 1', 'DDSL Div 2', 'Friendly']);
      setVenues(['St. Finian\'s GAA', 'Ward River Valley Pitch']);
      setPositions(['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Substitute']);
    }
  };

  const loadTeams = async () => {
    try {
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select(`*, players(*)`)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error loading teams:', error);
      } else {
        const transformedTeams: Team[] = (teamsData || []).map(team => ({
          id: team.id,
          name: team.name,
          category: team.age_group || 'Unknown',
          ageGroup: team.age_group,
          gender: team.gender,
          season: team.season,
          league: team.league,
          homeVenue: team.home_venue,
          contactEmail: team.contact_email,
          contactPhone: team.contact_phone,
          coaches: team.coaches || [],
          notes: team.notes,
          homeKit: { primary: '#009639', secondary: '#FFFFFF' },
          awayKit: { primary: '#FFFFFF', secondary: '#009639' },
          isOpponent: team.is_opponent || false,
          players: (team.players || []).map(p => ({
            id: p.id,
            teamId: team.id,
            name: p.first_name,
            position: p.position,
            isCaptain: p.is_captain || false,
            isViceCaptain: p.is_vice_captain || false,
            isActive: p.is_active !== false,
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at || p.created_at)
          })),
          createdAt: new Date(team.created_at),
          updatedAt: new Date(team.updated_at || team.created_at)
        }));
        
        setTeams(transformedTeams);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const nextStep = () => {
    const steps: WizardStep[] = ['type', 'basic', 'details', 'coaches', 'squad', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      const nextStepName = steps[currentIndex + 1];
      // Skip coaches and squad steps for opponent teams
      if ((nextStepName === 'coaches' || nextStepName === 'squad') && wizardData.teamType === 'opponent') {
        setCurrentStep('review');
      } else {
        setCurrentStep(nextStepName);
      }
    }
  };

  const prevStep = () => {
    const steps: WizardStep[] = ['type', 'basic', 'details', 'coaches', 'squad', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStepName = steps[currentIndex - 1];
      // Skip coaches and squad steps for opponent teams going backwards
      if ((currentStep === 'review' && wizardData.teamType === 'opponent')) {
        setCurrentStep('details');
      } else {
        setCurrentStep(prevStepName);
      }
    }
  };

  const addPlayer = () => {
    setWizardData(prev => ({
      ...prev,
      players: [...prev.players, { name: '', position: '', isCaptain: false, isViceCaptain: false }]
    }));
  };

  const updatePlayer = (index: number, field: keyof WizardData['players'][0], value: any) => {
    setWizardData(prev => {
      const updatedPlayers = prev.players.map((player, i) => {
        if (i === index) {
          const updatedPlayer = { ...player, [field]: value };
          
          // Captain/Vice-Captain validation
          if (field === 'isCaptain' && value === true) {
            // If making captain, cannot be vice-captain and remove captain from others
            updatedPlayer.isViceCaptain = false;
            return updatedPlayer;
          } else if (field === 'isViceCaptain' && value === true) {
            // If making vice-captain, cannot be captain and remove vice-captain from others  
            updatedPlayer.isCaptain = false;
            return updatedPlayer;
          }
          
          return updatedPlayer;
        } else {
          // Remove captain/vice-captain from other players when assigning to current player
          if (field === 'isCaptain' && value === true) {
            return { ...player, isCaptain: false };
          } else if (field === 'isViceCaptain' && value === true) {
            return { ...player, isViceCaptain: false };
          }
          return player;
        }
      });
      
      return {
        ...prev,
        players: updatedPlayers
      };
    });
  };

  const removePlayer = (index: number) => {
    setWizardData(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index)
    }));
  };

  const saveTeam = async () => {
    setSaving(true);
    try {
      const editTeamId = router.query.edit as string;
      const isEditing = Boolean(editTeamId);
      const teamId = isEditing ? editTeamId : crypto.randomUUID();
      
      // Create team record with coaches
      const teamData = {
        id: teamId,
        name: wizardData.teamName,
        age_group: wizardData.ageGroup,
        gender: wizardData.gender,
        league: wizardData.league,
        season: wizardData.season,
        home_venue: wizardData.homeVenue,
        contact_email: wizardData.contactEmail,
        contact_phone: wizardData.contactPhone,
        coaches: wizardData.coaches,
        notes: wizardData.notes,
        is_opponent: wizardData.teamType === 'opponent'
      };

      const { error: teamError } = isEditing 
        ? await supabase.from('teams').update(teamData).eq('id', teamId)
        : await supabase.from('teams').insert(teamData);
      
      if (teamError) {
        throw new Error(`Team save error: ${teamError.message}`);
      }

      // Save players for RVR teams
      if (wizardData.teamType === 'rvr' && wizardData.players.length > 0) {
        if (isEditing) {
          // Delete existing players and re-add (simpler than complex update logic)
          await supabase.from('players').delete().eq('team_id', teamId);
        }
        
        const playersData = wizardData.players.map(player => ({
          id: crypto.randomUUID(),
          team_id: teamId,
          first_name: player.name,
          position: player.position,
          is_active: true
          // TODO: Add is_captain and is_vice_captain after running SQL migration
        }));

        const { error: playersError } = await supabase.from('players').insert(playersData);
        
        if (playersError) {
          throw new Error(`Players save error: ${playersError.message}`);
        }
      }

      await loadTeams();
      setCurrentStep('complete');
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Error saving team: ' + error);
    } finally {
      setSaving(false);
    }
  };

  const resetWizard = () => {
    setWizardData({
      teamType: 'rvr',
      teamName: '',
      ageGroup: '',
      gender: 'Male',
      league: '',
      season: '2024/25',
      homeVenue: '',
      coaches: [],
      contactEmail: '',
      contactPhone: '',
      notes: '',
      players: []
    });
    setCurrentStep('type');
  };

  const stepNames = {
    type: 'Team Type',
    basic: 'Basic Info', 
    details: 'Details',
    coaches: 'Coaches',
    squad: 'Squad',
    review: 'Review',
    complete: 'Complete'
  };

  const getStepNumber = (step: WizardStep): number => {
    const steps = wizardData.teamType === 'rvr' 
      ? ['type', 'basic', 'details', 'coaches', 'squad', 'review']
      : ['type', 'basic', 'details', 'review'];
    return steps.indexOf(step) + 1;
  };

  const getTotalSteps = (): number => {
    return wizardData.teamType === 'rvr' ? 6 : 4;
  };

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
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
        <div className="max-w-4xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Team Setup Wizard</h1>
            <p className="text-xl text-gray-600">Simple 4-step process to add teams and opponents</p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Step {getStepNumber(currentStep)} of {getTotalSteps()}
              </span>
              <span className="text-sm text-gray-500">{stepNames[currentStep]}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  wizardData.teamType === 'rvr' ? 'bg-green-600' : 'bg-orange-600'
                }`}
                style={{ width: `${(getStepNumber(currentStep) / getTotalSteps()) * 100}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Team Type Selection */}
            {currentStep === 'type' && (
              <motion.div
                key="type"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  What type of team are you adding?
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <button
                    onClick={() => {
                      setWizardData(prev => ({ ...prev, teamType: 'rvr' }));
                      nextStep();
                    }}
                    className={`p-8 border-2 rounded-lg transition-all hover:shadow-lg ${
                      wizardData.teamType === 'rvr' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-green-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">⚽</div>
                      <h3 className="text-xl font-bold text-green-700 mb-2">RVR Team</h3>
                      <p className="text-gray-600">River Valley Rangers team with full squad management</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setWizardData(prev => ({ ...prev, teamType: 'opponent' }));
                      nextStep();
                    }}
                    className={`p-8 border-2 rounded-lg transition-all hover:shadow-lg ${
                      wizardData.teamType === 'opponent' 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">🏟️</div>
                      <h3 className="text-xl font-bold text-orange-700 mb-2">Opponent Team</h3>
                      <p className="text-gray-600">External team for match scheduling</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Basic Information */}
            {currentStep === 'basic' && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Basic Team Information
                </h2>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Team Name */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Team Name *
                      {!wizardData.teamName && <span className="text-red-500 ml-2">(Required)</span>}
                    </label>
                    <input
                      type="text"
                      value={wizardData.teamName}
                      onChange={(e) => setWizardData(prev => ({ ...prev, teamName: e.target.value }))}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., RVR U14 Boys"
                    />
                  </div>

                  {/* Age Group */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Age Group *
                      {!wizardData.ageGroup && <span className="text-red-500 ml-2">(Required)</span>}
                    </label>
                    <select
                      value={wizardData.ageGroup}
                      onChange={(e) => setWizardData(prev => ({ ...prev, ageGroup: e.target.value })))
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Age Group</option>
                      {ageGroups.map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      Options available: {ageGroups.length} ({ageGroups.slice(0,3).join(', ')}...)
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Gender *
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Male', 'Female', 'Mixed'].map(gender => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() => setWizardData(prev => ({ ...prev, gender: gender as any }))}
                          className={`py-3 px-4 rounded-lg border-2 transition-all ${
                            wizardData.gender === gender
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-green-300'
                          }`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8 space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!wizardData.teamName || !wizardData.ageGroup}
                    className={`px-8 py-3 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium ${
                      wizardData.teamType === 'rvr' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Details */}
            {currentStep === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Team Details
                </h2>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* League */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      League/Competition *
                    </label>
                    <select
                      value={wizardData.league}
                      onChange={(e) => setWizardData(prev => ({ ...prev, league: e.target.value }))}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select League</option>
                      {leagues.map(league => (
                        <option key={league} value={league}>{league}</option>
                      ))}
                    </select>
                  </div>

                  {/* Season */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Season *
                    </label>
                    <select
                      value={wizardData.season}
                      onChange={(e) => setWizardData(prev => ({ ...prev, season: e.target.value }))}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="2024/25">2024/25</option>
                      <option value="2025/26">2025/26</option>
                    </select>
                  </div>

                  {/* Home Venue */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Home Venue
                    </label>
                    <select
                      value={wizardData.homeVenue}
                      onChange={(e) => setWizardData(prev => ({ ...prev, homeVenue: e.target.value }))}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Venue</option>
                      {venues.map(venue => (
                        <option key={venue} value={venue}>{venue}</option>
                      ))}
                    </select>
                  </div>

                  {/* Contact Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={wizardData.contactEmail}
                        onChange={(e) => setWizardData(prev => ({ ...prev, contactEmail: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="coach@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-3">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={wizardData.contactPhone}
                        onChange={(e) => setWizardData(prev => ({ ...prev, contactPhone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="087 123 4567"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8 space-x-4">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!wizardData.league}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium"
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Coaches (RVR teams only) */}
            {currentStep === 'coaches' && wizardData.teamType === 'rvr' && (
              <motion.div
                key="coaches"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <h2 className="text-2xl font-bold text-gray-900 p-8 pb-6 text-center">
                  Team Coaches
                </h2>
                
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-80">
                  
                  {/* Left: Add Coach Forms */}
                  <div className="p-8 border-r border-gray-200">
                    <div className="space-y-6">
                      
                      {/* Select Existing Coach */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          👨‍🏫 Select Existing Coach
                        </h3>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value && !wizardData.coaches.includes(e.target.value)) {
                              setWizardData(prev => ({
                                ...prev,
                                coaches: [...prev.coaches, e.target.value]
                              }));
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a coach...</option>
                          {coaches.filter(coach => !wizardData.coaches.includes(coach)).map(coach => (
                            <option key={coach} value={coach}>{coach}</option>
                          ))}
                        </select>
                      </div>

                      {/* Add New Coach */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          ➕ Add New Coach
                        </h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="First Name"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              id="newCoachFirst"
                            />
                            <input
                              type="text"
                              placeholder="Last Name"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              id="newCoachLast"
                            />
                          </div>
                          <button
                            onClick={async () => {
                              const firstName = (document.getElementById('newCoachFirst') as HTMLInputElement).value.trim();
                              const lastName = (document.getElementById('newCoachLast') as HTMLInputElement).value.trim();
                              
                              if (firstName && lastName) {
                                try {
                                  const email = `${firstName.toLowerCase().replace(/\\s+/g, '')}@example.com`;
                                  const { error } = await supabase.from('coaches').insert({
                                    first_name: firstName,
                                    last_name: lastName,
                                    email: email
                                  });
                                  
                                  if (!error) {
                                    const fullName = `${firstName} ${lastName}`;
                                    setCoaches([...coaches, fullName]);
                                    setWizardData(prev => ({
                                      ...prev,
                                      coaches: [...prev.coaches, fullName]
                                    }));
                                    
                                    (document.getElementById('newCoachFirst') as HTMLInputElement).value = '';
                                    (document.getElementById('newCoachLast') as HTMLInputElement).value = '';
                                  } else {
                                    alert('Error adding coach: ' + error.message);
                                  }
                                } catch (error) {
                                  alert('Error adding coach: ' + error);
                                }
                              }
                            }}
                            className="w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors border-2 border-dashed border-blue-300"
                          >
                            + Add New Coach to Database
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                        💡 <strong>Tip:</strong> Selected coaches will appear on the right sidebar where you can remove them if needed.
                      </div>
                    </div>
                  </div>

                  {/* Right: Coaches Sidebar */}
                  <div className="bg-gray-50 p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      👨‍🏫 Selected Coaches ({wizardData.coaches.length})
                    </h4>
                    
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {wizardData.coaches.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-3xl mb-2">👨‍🏫</div>
                          <p className="text-gray-500 text-sm">No coaches selected yet</p>
                          <p className="text-gray-400 text-xs mt-1">Select from dropdown or add new</p>
                        </div>
                      ) : (
                        wizardData.coaches.map((coach, index) => (
                          <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                            <span className="font-medium text-gray-800">{coach}</span>
                            <button
                              onClick={() => {
                                setWizardData(prev => ({
                                  ...prev,
                                  coaches: prev.coaches.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-600 hover:text-red-800 transition-colors px-2 py-1 hover:bg-red-50 rounded"
                              title="Remove coach"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center p-8 pt-6 space-x-4 border-t border-gray-200">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={nextStep}
                    className={`px-8 py-3 text-white rounded-lg transition-colors font-medium ${
                      wizardData.teamType === 'rvr' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Squad (RVR teams only) */}
            {currentStep === 'squad' && wizardData.teamType === 'rvr' && (
              <motion.div
                key="squad"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <h2 className="text-2xl font-bold text-gray-900 p-8 pb-6 text-center">
                  Team Squad
                </h2>
                
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-96">
                  
                  {/* Left: Add Player Forms */}
                  <div className="p-8 border-r border-gray-200">
                    <div className="space-y-6">
                      
                      {/* Select Existing Player */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          ⚽ Select Existing Player
                        </h3>
                        <select
                          value=""
                          onChange={(e) => {
                            const selectedPlayer = existingPlayers.find(p => p.id === e.target.value);
                            if (selectedPlayer && !wizardData.players.some(p => p.name === selectedPlayer.name)) {
                              setWizardData(prev => ({
                                ...prev,
                                players: [...prev.players, {
                                  name: selectedPlayer.name,
                                  position: selectedPlayer.position,
                                  isCaptain: false,
                                  isViceCaptain: false
                                }]
                              }));
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="">Select existing player...</option>
                          {existingPlayers
                            .filter(player => !wizardData.players.some(p => p.name === player.name))
                            .map(player => (
                              <option key={player.id} value={player.id}>
                                {player.name} {player.position ? `(${player.position})` : ''}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Add New Player */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          ➕ Add New Player
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-4">
                            <input
                              type="text"
                              placeholder="Player Name"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              id="newPlayerName"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const target = e.target as HTMLInputElement;
                                  if (target.value.trim()) {
                                    setWizardData(prev => ({
                                      ...prev,
                                      players: [...prev.players, {
                                        name: target.value.trim(),
                                        position: '',
                                        isCaptain: false,
                                        isViceCaptain: false
                                      }]
                                    }));
                                    target.value = '';
                                  }
                                }
                              }}
                            />
                            <select
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              id="newPlayerPosition"
                            >
                              <option value="">Select Position (Optional)</option>
                              {positions.map(pos => (
                                <option key={pos} value={pos}>{pos}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                const nameInput = document.getElementById('newPlayerName') as HTMLInputElement;
                                const positionSelect = document.getElementById('newPlayerPosition') as HTMLSelectElement;
                                
                                const playerName = nameInput.value.trim();
                                const playerPosition = positionSelect.value;
                                
                                if (playerName) {
                                  setWizardData(prev => ({
                                    ...prev,
                                    players: [...prev.players, {
                                      name: playerName,
                                      position: playerPosition,
                                      isCaptain: false,
                                      isViceCaptain: false
                                    }]
                                  }));
                                  nameInput.value = '';
                                  positionSelect.value = '';
                                }
                              }}
                              className="w-full py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors border-2 border-dashed border-green-300"
                            >
                              + Add Player
                            </button>
                          </div>
                          
                          <div className="text-xs text-gray-500 bg-green-50 p-3 rounded-lg">
                            💡 <strong>Tip:</strong> Enter name and press Enter, or use the button. Players appear on the right where you can edit details.
                          </div>
                        </div>
                      </div>

                      {/* Player Merge Tool */}
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          🔗 Merge Duplicate Players
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">
                          Found similar names? Select players to merge incorrect spellings.
                        </p>
                        <button
                          onClick={() => {
                            // Simple merge - show existing players that might be duplicates
                            const playerNames = wizardData.players.map(p => p.name.toLowerCase());
                            const possibleDuplicates = existingPlayers.filter(ep => 
                              playerNames.some(pn => 
                                pn.includes(ep.name.toLowerCase().split(' ')[0]) ||
                                ep.name.toLowerCase().includes(pn.split(' ')[0])
                              )
                            );
                            
                            if (possibleDuplicates.length > 0) {
                              alert(`Possible duplicates found: ${possibleDuplicates.map(p => p.name).join(', ')}\n\nUse the existing player dropdown to avoid duplicates.`);
                            } else {
                              alert('No obvious duplicates detected.');
                            }
                          }}
                          className="w-full py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors text-sm"
                        >
                          🔍 Check for Duplicates
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Players Sidebar */}
                  <div className="bg-gray-50 p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      ⚽ Team Squad ({wizardData.players.length})
                    </h4>
                    
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2" style={{scrollbarWidth: 'thin'}}>
                      {wizardData.players.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="text-3xl mb-2">👥</div>
                          <p className="text-gray-500 text-sm">No players added yet</p>
                          <p className="text-gray-400 text-xs mt-1">Add players using the form on the left</p>
                        </div>
                      ) : (
                        wizardData.players.map((player, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1 mr-2">
                                <input
                                  type="text"
                                  value={player.name}
                                  onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                                  placeholder="Player Name"
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                              </div>
                              <button
                                onClick={() => removePlayer(index)}
                                className="text-red-600 hover:text-red-800 transition-colors px-2 py-1 hover:bg-red-50 rounded"
                                title="Remove player"
                              >
                                ✕
                              </button>
                            </div>
                            
                            <div className="flex gap-2 items-center">
                              <select
                                value={player.position}
                                onChange={(e) => updatePlayer(index, 'position', e.target.value)}
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                              >
                                <option value="">Position</option>
                                {positions.map(pos => (
                                  <option key={pos} value={pos}>{pos}</option>
                                ))}
                              </select>
                              
                              <div className="flex gap-1">
                                <label className="flex items-center text-xs" title="Captain">
                                  <input
                                    type="checkbox"
                                    checked={player.isCaptain}
                                    onChange={(e) => updatePlayer(index, 'isCaptain', e.target.checked)}
                                    className="mr-1 w-3 h-3"
                                  />
                                  C
                                </label>
                                <label className="flex items-center text-xs" title="Vice Captain">
                                  <input
                                    type="checkbox"
                                    checked={player.isViceCaptain}
                                    onChange={(e) => updatePlayer(index, 'isViceCaptain', e.target.checked)}
                                    className="mr-1 w-3 h-3"
                                  />
                                  VC
                                </label>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center p-8 pt-6 space-x-4 border-t border-gray-200">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={nextStep}
                    className={`px-8 py-3 text-white rounded-lg transition-colors font-medium ${
                      wizardData.teamType === 'rvr' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    Continue →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Review */}
            {currentStep === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Review & Confirm
                </h2>
                
                <div className="max-w-3xl mx-auto">
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      {wizardData.teamType === 'rvr' ? (
                        <><span className="text-2xl mr-3">⚽</span>RVR Team</>
                      ) : (
                        <><span className="text-2xl mr-3">🏟️</span>Opponent Team</>
                      )}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Basic Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Name:</strong> {wizardData.teamName}</p>
                          <p><strong>Age Group:</strong> {wizardData.ageGroup}</p>
                          <p><strong>Gender:</strong> {wizardData.gender}</p>
                          <p><strong>League:</strong> {wizardData.league}</p>
                          <p><strong>Season:</strong> {wizardData.season}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Contact & Venue</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Home Venue:</strong> {wizardData.homeVenue || 'Not specified'}</p>
                          <p><strong>Email:</strong> {wizardData.contactEmail || 'Not provided'}</p>
                          <p><strong>Phone:</strong> {wizardData.contactPhone || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    {wizardData.teamType === 'rvr' && wizardData.coaches.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-3">Coaches ({wizardData.coaches.length})</h4>
                        <div className="text-sm">
                          <p>{wizardData.coaches.join(', ')}</p>
                        </div>
                      </div>
                    )}

                    {wizardData.teamType === 'rvr' && wizardData.players.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-3">Squad ({wizardData.players.length} players)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {wizardData.players.map((player, index) => (
                            <div key={index} className="flex justify-between">
                              <span>
                                {player.name}
                                {player.isCaptain && <span className="text-blue-600 font-bold ml-1">(C)</span>}
                                {player.isViceCaptain && <span className="text-amber-600 font-bold ml-1">(VC)</span>}
                              </span>
                              <span className="text-gray-500">{player.position}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center mt-8 space-x-4">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={saveTeam}
                    disabled={saving}
                    className={`px-8 py-3 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium ${
                      wizardData.teamType === 'rvr' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    {saving ? (router.query.edit ? 'Updating Team...' : 'Creating Team...') : (router.query.edit ? `Update ${wizardData.teamType === 'rvr' ? 'RVR Team' : 'Opponent'}` : `Create ${wizardData.teamType === 'rvr' ? 'RVR Team' : 'Opponent'}`)}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Complete */}
            {currentStep === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-lg p-8"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {router.query.edit ? 'Team Updated Successfully!' : 'Team Created Successfully!'}
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">
                    {router.query.edit ? `${wizardData.teamName} has been updated` : `${wizardData.teamName} has been added to the system`}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={resetWizard}
                      className="px-8 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors font-medium text-lg"
                    >
                      ➕ Create Another Team
                    </button>
                    <Link
                      href="/match-central"
                      className="inline-flex items-center px-8 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors font-medium text-lg"
                    >
                      🎯 Start Recording Matches
                    </Link>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-4">View and manage teams:</p>
                    <Link
                      href="/match-central#management"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Go to Team Management →
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Teams View */}
          {currentStep !== 'complete' && teams.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Existing Teams ({teams.length})
                </h3>
                <Link
                  href="/match-central#management"
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  View All →
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.slice(0, 6).map(team => (
                  <div key={team.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{team.name}</h4>
                        <p className="text-xs text-gray-600">{team.ageGroup} • {team.league}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        team.isOpponent 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {team.isOpponent ? 'Opponent' : 'RVR'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </StandardLayout>
  );
}