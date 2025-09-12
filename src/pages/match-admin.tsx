/**
 * Match Administration - User-Friendly Team Setup Wizard
 * Simple step-by-step process for creating RVR teams and opponents
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import MobileBottomNav from "../components/MobileBottomNav";
import { supabase } from "../lib/supabase";
import { Team } from "../types/match-tracker";
import { getTeamColorClasses } from "../lib/team-colors";

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
  
  // Opponent-specific fields
  primaryMatchTypes: string[]; // Types of matches this opponent typically plays
  competitionLevel: string; // Level of competition (e.g., Amateur, Semi-Pro, Professional)
  
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
  const [newPlayerPosition, setNewPlayerPosition] = useState<string>('');

  // Generate season options dynamically
  const generateSeasonOptions = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    
    // Football season typically starts in September and ends in May
    // If it's September or later, we're in the new season
    // If it's before September, we're still in the previous season
    let currentSeasonStartYear: number;
    if (currentMonth >= 9) { // September or later
      currentSeasonStartYear = currentYear;
    } else { // Before September
      currentSeasonStartYear = currentYear - 1;
    }
    
    const currentSeason = `${currentSeasonStartYear}/${(currentSeasonStartYear + 1).toString().slice(-2)}`;
    const nextSeason = `${currentSeasonStartYear + 1}/${(currentSeasonStartYear + 2).toString().slice(-2)}`;
    const previousSeason = `${currentSeasonStartYear - 1}/${currentSeasonStartYear.toString().slice(-2)}`;
    
    return {
      current: currentSeason,
      next: nextSeason,
      previous: previousSeason,
      options: [
        { value: currentSeason, label: `${currentSeason} (Current Season)`, isCurrent: true },
        { value: nextSeason, label: `${nextSeason} (Next Season)`, isFuture: true },
        { value: previousSeason, label: `${previousSeason} (Previous Season - Retrospective Only)`, isPast: true }
      ]
    };
  };
  
  const [wizardData, setWizardData] = useState<WizardData>(() => {
    const seasons = generateSeasonOptions();
    return {
      teamType: 'rvr',
      teamName: '',
      ageGroup: '',
      gender: 'Male',
      league: '',
      season: seasons.current,
      homeVenue: '',
      coaches: [],
      contactEmail: '',
      contactPhone: '',
      notes: '',
      primaryMatchTypes: [],
      competitionLevel: '',
      players: []
    };
  });

  // Get dynamic color scheme based on gender selection
  const getWizardColors = () => {
    if (wizardData.teamType === 'rvr' && wizardData.gender === 'Female') {
      return getTeamColorClasses('RVR Girls');
    } else if (wizardData.teamType === 'rvr') {
      return getTeamColorClasses('RVR');
    } else {
      return getTeamColorClasses('Opponent');
    }
  };

  const wizardColors = getWizardColors();

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
          season: teamToEdit.season || generateSeasonOptions().current,
          homeVenue: teamToEdit.homeVenue || '',
          coaches: Array.isArray(teamToEdit.coaches) ? teamToEdit.coaches : [],
          contactEmail: teamToEdit.contactEmail || '',
          contactPhone: teamToEdit.contactPhone || '',
          notes: teamToEdit.notes || '',
          primaryMatchTypes: (teamToEdit as any).primaryMatchTypes || (teamToEdit as any).primary_match_types || [],
          competitionLevel: (teamToEdit as any).competitionLevel || (teamToEdit as any).competition_level || '',
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

  // Show validation when entering steps with mandatory fields
  useEffect(() => {
    if (currentStep === 'basic' || currentStep === 'details') {
      const timer = setTimeout(() => {
        setShowValidation(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowValidation(false);
    }
  }, [currentStep]);

  const loadReferenceData = async () => {
    try {
      // Load age groups from database
      const { data: ageGroupsData, error: ageGroupsError } = await supabase
        .from('age_groups')
        .select('name')
        .order('sort_order');
      
      if (!ageGroupsError && ageGroupsData && ageGroupsData.length > 0) {
        setAgeGroups(ageGroupsData.map(ag => ag.name));
      } else {
        // If table doesn't exist or is empty, create it and populate with defaults
        if (ageGroupsError) {
          console.log('Age groups table error:', ageGroupsError);
          // Try to create the table and insert default values
          const { error: createError } = await supabase
            .from('age_groups')
            .insert([
              { name: 'U8', sort_order: 1 },
              { name: 'U10', sort_order: 2 },
              { name: 'U12', sort_order: 3 },
              { name: 'U14', sort_order: 4 },
              { name: 'U16', sort_order: 5 },
              { name: 'U18', sort_order: 6 },
              { name: 'Senior', sort_order: 7 },
              { name: 'Vets', sort_order: 8 }
            ]);
          
          if (!createError) {
            // Reload the data
            const { data: newAgeGroupsData } = await supabase
              .from('age_groups')
              .select('name')
              .order('sort_order');
            if (newAgeGroupsData) {
              setAgeGroups(newAgeGroupsData.map(ag => ag.name));
            }
          }
        }
        
        // Fallback
        const fallbackAgeGroups = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18', 'Senior', 'Vets'];
        setAgeGroups(fallbackAgeGroups);
      }

      // Load leagues from database
      const { data: leaguesData, error: leaguesError } = await supabase
        .from('leagues')
        .select('name')
        .order('name');
      
      if (!leaguesError && leaguesData) {
        setLeagues(leaguesData.map(league => league.name));
      } else {
        // Fallback if table doesn't exist
        const fallbackLeagues = ['Dublin & District Schoolboys League', 'DDSL Premier', 'DDSL Div 1', 'DDSL Div 2', 'Friendly'];
        setLeagues(fallbackLeagues);
      }

      // Load venues from database
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('name')
        .order('name');
      
      if (!venuesError && venuesData) {
        setVenues(venuesData.map(venue => venue.name));
      } else {
        // Fallback if table doesn't exist
        const fallbackVenues = ['St. Finian\'s GAA', 'Ward River Valley Pitch', 'Away Venue'];
        setVenues(fallbackVenues);
      }

      // Load positions from database
      const { data: positionsData, error: positionsError } = await supabase
        .from('positions')
        .select('name')
        .order('sort_order');
      
      if (!positionsError && positionsData) {
        setPositions(positionsData.map(pos => pos.name));
      } else {
        // Fallback if table doesn't exist
        const fallbackPositions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Substitute'];
        setPositions(fallbackPositions);
      }
      
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

  // Function to save a new venue to the database
  const saveVenueToDatabase = async (venueName: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('venues')
        .insert({ name: venueName, created_at: new Date() });
      
      if (error) {
        console.error('Error saving venue to database:', error);
        // If it's a duplicate key error or unique constraint violation, consider it successful
        if (error.code === '23505') {
          console.log('Venue already exists in database, continuing...');
          return true;
        }
        return false;
      }
      
      console.log('✅ Successfully saved venue to database:', venueName);
      return true;
    } catch (error) {
      console.error('Unexpected error saving venue:', error);
      return false;
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

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showValidation, setShowValidation] = useState(false);

  // Helper function to check if field should show as invalid
  const isFieldInvalid = (fieldName: string): boolean => {
    if (!showValidation) return false;
    
    switch (fieldName) {
      case 'teamName':
        return currentStep === 'basic' && !wizardData.teamName.trim();
      case 'ageGroup':
        return currentStep === 'basic' && !wizardData.ageGroup;
      case 'league':
        return currentStep === 'details' && !wizardData.league;
      case 'homeVenue':
        return currentStep === 'details' && !wizardData.homeVenue;
      default:
        return false;
    }
  };

  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 'basic':
        if (!wizardData.teamName.trim()) {
          errors.teamName = 'Team name is required';
        }
        if (!wizardData.ageGroup) {
          errors.ageGroup = 'Age group is required';
        }
        break;
      
      case 'details':
        if (!wizardData.league) {
          errors.league = 'League is required';
        }
        if (!wizardData.homeVenue) {
          errors.homeVenue = 'Home venue is required';
        }
        break;
    }

    setValidationErrors(errors);
    setShowValidation(true); // Show validation highlights
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      return; // Don't proceed if validation fails
    }

    const steps: WizardStep[] = ['type', 'basic', 'details', 'coaches', 'squad', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
      const nextStepName = steps[currentIndex + 1];
      // Reset validation when moving to next step
      setShowValidation(false);
      setValidationErrors({});
      
      // Skip coaches and squad steps for opponent teams
      if ((nextStepName === 'coaches' || nextStepName === 'squad') && wizardData.teamType === 'opponent') {
        setCurrentStep('review');
      } else {
        setCurrentStep(nextStepName);
      }
      
      // Show validation for mandatory fields on new step after a brief delay
      setTimeout(() => {
        setShowValidation(true);
      }, 500);
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

  const cancelWizard = () => {
    if (confirm('Are you sure you want to cancel? All progress will be lost.')) {
      router.push('/match-central');
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
      console.log('Starting team save process...');
      const editTeamId = router.query.edit as string;
      const isEditing = Boolean(editTeamId);
      
      console.log('Team save mode:', isEditing ? 'EDIT' : 'CREATE');
      console.log('Edit Team ID:', editTeamId);
      
      // Start with minimal data to test what works
      const baseTeamData = {
        name: wizardData.teamName,
        age_group: wizardData.ageGroup,
        gender: wizardData.gender,
        league: wizardData.league,
        season: wizardData.season
      };

      // Add optional fields only if they have values  
      if (wizardData.homeVenue) {
        baseTeamData.home_venue = wizardData.homeVenue;
      }
      if (wizardData.contactEmail) {
        baseTeamData.contact_email = wizardData.contactEmail;
      }
      if (wizardData.contactPhone) {
        baseTeamData.contact_phone = wizardData.contactPhone;
      }
      if (wizardData.notes) {
        baseTeamData.notes = wizardData.notes;
      }
      if (wizardData.coaches && wizardData.coaches.length > 0) {
        baseTeamData.coaches = wizardData.coaches;
      }
      
      // Add team type
      baseTeamData.is_opponent = wizardData.teamType === 'opponent';
      
      // Add opponent-specific fields
      if (wizardData.teamType === 'opponent') {
        if (wizardData.competitionLevel) {
          baseTeamData.competition_level = wizardData.competitionLevel;
        }
        if (wizardData.primaryMatchTypes && wizardData.primaryMatchTypes.length > 0) {
          baseTeamData.primary_match_types = wizardData.primaryMatchTypes;
        }
      }

      // For editing, add the ID
      const teamData = isEditing ? { ...baseTeamData, id: editTeamId } : baseTeamData;

      console.log('Team data to save:', teamData);

      console.log('Attempting to save team to database...');
      let teamResult, teamError;
      
      if (isEditing) {
        console.log('Updating existing team...');
        const { data, error } = await supabase
          .from('teams')
          .update(teamData)
          .eq('id', editTeamId)
          .select();
        teamResult = data;
        teamError = error;
      } else {
        console.log('Creating new team...');
        const { data, error } = await supabase
          .from('teams')
          .insert([teamData])
          .select();
        teamResult = data;  
        teamError = error;
      }
      
      console.log('Team save result:', teamResult);
      
      if (teamError) {
        console.error('Team save error details:', teamError);
        throw new Error(`Team save error: ${teamError.message}${teamError.details ? ` - ${teamError.details}` : ''}${teamError.hint ? ` (Hint: ${teamError.hint})` : ''}`);
      }

      // Get the team ID for new records
      const teamId = isEditing ? editTeamId : (teamResult && teamResult[0] ? teamResult[0].id : null);
      console.log('Final team ID:', teamId);
      
      if (!teamId) {
        throw new Error('Failed to get team ID after save');
      }

      console.log('Team saved successfully!');

      // Save players for RVR teams
      if (wizardData.teamType === 'rvr' && wizardData.players.length > 0) {
        console.log(`Saving ${wizardData.players.length} players for RVR team...`);
        
        if (isEditing) {
          console.log('Updating existing players for edit mode...');
          
          // Get existing players for this team
          const { data: existingPlayers, error: fetchError } = await supabase
            .from('players')
            .select('id, first_name, position, is_captain, is_vice_captain')
            .eq('team_id', teamId);
          
          if (fetchError) {
            console.error('Error fetching existing players:', fetchError);
            throw new Error(`Failed to fetch existing players: ${fetchError.message}`);
          }
          
          console.log('Existing players:', existingPlayers);
          
          // Create a map of existing players by name for quick lookup
          const existingPlayerMap = new Map();
          (existingPlayers || []).forEach(player => {
            existingPlayerMap.set(player.first_name, player);
          });
          
          // Process each new player - update existing or create new
          for (const player of wizardData.players) {
            const existingPlayer = existingPlayerMap.get(player.name);
            
            if (existingPlayer) {
              // Update existing player
              console.log(`Updating existing player: ${player.name}`);
              const { error: updateError } = await supabase
                .from('players')
                .update({
                  position: player.position || null,
                  is_captain: player.isCaptain || false,
                  is_vice_captain: player.isViceCaptain || false,
                  is_active: true
                })
                .eq('id', existingPlayer.id);
              
              if (updateError) {
                console.error(`Error updating player ${player.name}:`, updateError);
              }
              
              // Remove from map so we know it was processed
              existingPlayerMap.delete(player.name);
            } else {
              // Create new player
              console.log(`Creating new player: ${player.name}`);
              const { error: insertError } = await supabase
                .from('players')
                .insert({
                  id: crypto.randomUUID(),
                  team_id: teamId,
                  first_name: player.name,
                  position: player.position || null,
                  is_active: true,
                  is_captain: player.isCaptain || false,
                  is_vice_captain: player.isViceCaptain || false
                });
              
              if (insertError) {
                console.error(`Error creating player ${player.name}:`, insertError);
              }
            }
          }
          
          // Mark remaining existing players as inactive (they were removed from the roster)
          for (const [playerName, existingPlayer] of existingPlayerMap) {
            console.log(`Marking player as inactive: ${playerName}`);
            const { error: deactivateError } = await supabase
              .from('players')
              .update({ is_active: false })
              .eq('id', existingPlayer.id);
            
            if (deactivateError) {
              console.error(`Error deactivating player ${playerName}:`, deactivateError);
            }
          }
          
          console.log('Player updates completed successfully');
        } else {
          // Creating new team - use the original insert logic
          const playersData = wizardData.players.map(player => ({
            id: crypto.randomUUID(),
            team_id: teamId,
            first_name: player.name,
            position: player.position || null,
            is_active: true,
            is_captain: player.isCaptain || false,
            is_vice_captain: player.isViceCaptain || false
          }));

          console.log('Players data to save:', playersData);

          const { data: playersResult, error: playersError } = await supabase.from('players').insert(playersData);
        
          console.log('Players save result:', playersResult);
          
          if (playersError) {
            console.error('Error saving players:', playersError);
            throw new Error(`Failed to save players: ${playersError.message}`);
          }
        }
        
        console.log('Players saved successfully!');
      }

      await loadTeams();
      setCurrentStep('complete');
    } catch (error) {
      console.error('Error saving team:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Error saving team: ${errorMessage}\n\nPlease check the browser console for more details and try again.`);
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
      season: generateSeasonOptions().current,
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
    <div>
      <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 pb-32 md:pb-20">
        <div className="max-w-4xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-8 relative">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Team Setup Wizard</h1>
            <p className="text-xl text-gray-600">Simple 4-step process to add teams and opponents</p>
            <Link 
              href="/admin" 
              className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 text-sm flex items-center space-x-1 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-all"
              title="Admin Tools & Diagnostics"
            >
              <span>🔧</span>
              <span>Tools</span>
            </Link>
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
                className={`h-3 rounded-full transition-all duration-300 ${wizardColors.background}`}
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
                        ? `${wizardColors.border} ${wizardColors.lightBackground}` 
                        : `border-gray-300 hover:${wizardColors.border}`
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-4">⚽</div>
                      <h3 className={`text-xl font-bold ${wizardColors.text} mb-2`}>RVR Team</h3>
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
                <div className="flex justify-center mt-8">
                  <button
                    onClick={cancelWizard}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
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
                      {validationErrors.teamName && <span className="text-red-500 ml-2">({validationErrors.teamName})</span>}
                    </label>
                    <input
                      type="text"
                      value={wizardData.teamName}
                      onChange={(e) => {
                        setWizardData(prev => ({ ...prev, teamName: e.target.value }));
                        // Clear validation error when user starts typing
                        if (validationErrors.teamName) {
                          setValidationErrors(prev => ({ ...prev, teamName: '' }));
                        }
                      }}
                      className={`w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-current ${
                        isFieldInvalid('teamName')
                          ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="e.g., RVR U14 Boys"
                    />
                  </div>

                  {/* Age Group */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Age Group *
                      {validationErrors.ageGroup && <span className="text-red-500 ml-2">({validationErrors.ageGroup})</span>}
                    </label>
                    <div className="relative">
                      <select
                        value={wizardData.ageGroup}
                        onChange={(e) => {
                          setWizardData(prev => ({ ...prev, ageGroup: e.target.value }));
                          // Clear validation error when user selects an option
                          if (validationErrors.ageGroup && e.target.value) {
                            setValidationErrors(prev => ({ ...prev, ageGroup: '' }));
                          }
                        }}
                        className={`w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-current pr-12 ${
                          isFieldInvalid('ageGroup')
                            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                            : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Age Group</option>
                        {ageGroups.map(age => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                        <option value="__ADD_NEW__" className="text-blue-600 font-medium">➕ Add New Age Group...</option>
                      </select>
                      
                      {/* Inline Add Modal - Shows when "Add New" is selected */}
                      {wizardData.ageGroup === '__ADD_NEW__' && (
                        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter new age group (e.g. U20)"
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              id="newAgeGroupInline"
                              autoFocus
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const input = e.target as HTMLInputElement;
                                  const value = input.value.trim();
                                  if (value && !ageGroups.includes(value)) {
                                    setAgeGroups([...ageGroups, value]);
                                    setWizardData(prev => ({ ...prev, ageGroup: value }));
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById('newAgeGroupInline') as HTMLInputElement;
                                const value = input.value.trim();
                                if (value && !ageGroups.includes(value)) {
                                  setAgeGroups([...ageGroups, value]);
                                  setWizardData(prev => ({ ...prev, ageGroup: value }));
                                }
                              }}
                              className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setWizardData(prev => ({ ...prev, ageGroup: '' }))}
                              className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {ageGroups.length} options available
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
                              ? `${wizardColors.border} ${wizardColors.lightBackground} ${wizardColors.text}`
                              : `border-gray-300 hover:${wizardColors.border}`
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
                    onClick={cancelWizard}
                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!wizardData.teamName || !wizardData.ageGroup}
                    className={`px-8 py-3 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium ${wizardColors.background} hover:opacity-90`}
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
                      {validationErrors.league && <span className="text-red-500 ml-2">({validationErrors.league})</span>}
                    </label>
                    <div className="relative">
                      <select
                        value={wizardData.league}
                        onChange={(e) => {
                          setWizardData(prev => ({ ...prev, league: e.target.value }));
                          // Clear validation error when user selects an option
                          if (validationErrors.league && e.target.value) {
                            setValidationErrors(prev => ({ ...prev, league: '' }));
                          }
                        }}
                        className={`w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-current ${
                          isFieldInvalid('league')
                            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                            : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select League</option>
                        {leagues.map(league => (
                          <option key={league} value={league}>{league}</option>
                        ))}
                        <option value="__ADD_NEW__" className="text-blue-600 font-medium">➕ Add New League...</option>
                      </select>
                      
                      {/* Inline Add Modal */}
                      {wizardData.league === '__ADD_NEW__' && (
                        <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter new league (e.g. Local Cup)"
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              id="newLeagueInline"
                              autoFocus
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const input = e.target as HTMLInputElement;
                                  const value = input.value.trim();
                                  if (value && !leagues.includes(value)) {
                                    setLeagues([...leagues, value]);
                                    setWizardData(prev => ({ ...prev, league: value }));
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById('newLeagueInline') as HTMLInputElement;
                                const value = input.value.trim();
                                if (value && !leagues.includes(value)) {
                                  setLeagues([...leagues, value]);
                                  setWizardData(prev => ({ ...prev, league: value }));
                                }
                              }}
                              className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setWizardData(prev => ({ ...prev, league: '' }))}
                              className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Season */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Season *
                    </label>
                    <select
                      value={wizardData.season}
                      onChange={(e) => setWizardData(prev => ({ ...prev, season: e.target.value }))}
                      className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-current"
                    >
                      {generateSeasonOptions().options.map(season => (
                        <option 
                          key={season.value} 
                          value={season.value}
                          className={
                            season.isCurrent ? 'font-bold text-green-700' :
                            season.isFuture ? 'text-blue-700' :
                            season.isPast ? 'text-gray-600' : ''
                          }
                        >
                          {season.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      <strong>Note:</strong> Most teams should use the current season. Previous season is for retrospective data entry only.
                    </p>
                  </div>

                  {/* Home Venue */}
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-3">
                      Home Venue *
                      {validationErrors.homeVenue && <span className="text-red-500 ml-2">({validationErrors.homeVenue})</span>}
                    </label>
                    <div className="space-y-2">
                      <div className="relative">
                        <select
                          value={wizardData.homeVenue}
                          onChange={(e) => {
                            const value = e.target.value;
                            setWizardData(prev => ({ ...prev, homeVenue: value }));
                            // Clear validation error when user selects an option
                            if (validationErrors.homeVenue && value && value !== '__ADD_NEW__') {
                              setValidationErrors(prev => ({ ...prev, homeVenue: '' }));
                            }
                          }}
                          className={`w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-current ${
                            isFieldInvalid('homeVenue')
                              ? 'border-red-500 bg-red-50 focus:ring-red-500' 
                              : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select Venue</option>
                          {venues.map(venue => (
                            <option key={venue} value={venue}>{venue}</option>
                          ))}
                          <option value="__ADD_NEW__" className="text-blue-600 font-medium">➕ Add New Venue...</option>
                        </select>
                        
                        {wizardData.homeVenue === '__ADD_NEW__' && (
                          <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                            <div className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Enter venue name (e.g. Local Sports Ground)..."
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                                onKeyPress={async (e) => {
                                  if (e.key === 'Enter') {
                                    const input = e.target as HTMLInputElement;
                                    const value = input.value.trim();
                                    if (value && !venues.includes(value)) {
                                      // Save to database first
                                      const saved = await saveVenueToDatabase(value);
                                      if (saved) {
                                        setVenues([...venues, value]);
                                        setWizardData(prev => ({ ...prev, homeVenue: value }));
                                        input.value = '';
                                      } else {
                                        alert('Failed to save venue to database. Please try again.');
                                      }
                                    } else if (value && venues.includes(value)) {
                                      setWizardData(prev => ({ ...prev, homeVenue: value }));
                                      input.value = '';
                                    }
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={async () => {
                                  const input = document.querySelector('input[placeholder*="venue name"]') as HTMLInputElement;
                                  const value = input?.value.trim();
                                  if (value && !venues.includes(value)) {
                                    // Save to database first
                                    const saved = await saveVenueToDatabase(value);
                                    if (saved) {
                                      setVenues([...venues, value]);
                                      setWizardData(prev => ({ ...prev, homeVenue: value }));
                                      input.value = '';
                                    } else {
                                      alert('Failed to save venue to database. Please try again.');
                                    }
                                  } else if (value && venues.includes(value)) {
                                    setWizardData(prev => ({ ...prev, homeVenue: value }));
                                    input.value = '';
                                  }
                                }}
                                className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                Add
                              </button>
                              <button
                                type="button"
                                onClick={() => setWizardData(prev => ({ ...prev, homeVenue: '' }))}
                                className="px-3 py-2 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                    </div>
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-current"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-current"
                        placeholder="087 123 4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Opponent-specific Classification Fields */}
                {wizardData.teamType === 'opponent' && (
                  <div className="max-w-2xl mx-auto mt-8 p-6 bg-orange-50 border border-orange-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                      <span className="mr-2">🎯</span>
                      Opponent Classification
                    </h3>
                    <p className="text-sm text-orange-700 mb-4">
                      Help categorize this opponent team for better match scheduling and organization.
                    </p>
                    
                    <div className="space-y-4">
                      {/* Competition Level */}
                      <div>
                        <label className="block text-sm font-medium text-orange-800 mb-2">
                          Competition Level
                        </label>
                        <select
                          value={wizardData.competitionLevel}
                          onChange={(e) => setWizardData(prev => ({ ...prev, competitionLevel: e.target.value }))}
                          className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                        >
                          <option value="">Select Level</option>
                          <option value="Youth/Juvenile">Youth/Juvenile</option>
                          <option value="Amateur">Amateur</option>
                          <option value="Semi-Professional">Semi-Professional</option>
                          <option value="Professional">Professional</option>
                          <option value="International">International</option>
                        </select>
                      </div>

                      {/* Primary Match Types */}
                      <div>
                        <label className="block text-sm font-medium text-orange-800 mb-2">
                          Primary Match Types
                          <span className="text-xs text-orange-600 block font-normal">What types of matches does this team typically play?</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['League', 'Cup', 'Friendly', 'Tournament', 'Playoff', 'Exhibition'].map(matchType => (
                            <label key={matchType} className="flex items-center space-x-2 p-2 border border-orange-200 rounded hover:bg-orange-100 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={wizardData.primaryMatchTypes.includes(matchType)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setWizardData(prev => ({
                                      ...prev,
                                      primaryMatchTypes: [...prev.primaryMatchTypes, matchType]
                                    }));
                                  } else {
                                    setWizardData(prev => ({
                                      ...prev,
                                      primaryMatchTypes: prev.primaryMatchTypes.filter(type => type !== matchType)
                                    }));
                                  }
                                }}
                                className="text-orange-600 rounded focus:ring-orange-500"
                              />
                              <span className="text-sm text-orange-800">{matchType}</span>
                            </label>
                          ))}
                        </div>
                        {wizardData.primaryMatchTypes.length > 0 && (
                          <div className="mt-2 text-xs text-orange-600">
                            Selected: {wizardData.primaryMatchTypes.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center mt-8 space-x-4">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={cancelWizard}
                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!wizardData.league}
                    className={`px-8 py-3 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium ${wizardColors.background} hover:opacity-90`}
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
                    className={`px-8 py-3 text-white rounded-lg transition-colors font-medium ${wizardColors.background} hover:opacity-90`}
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-current"
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
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-current"
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
                            <div className="relative">
                              <select
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-current"
                                id="newPlayerPosition"
                                value={newPlayerPosition || ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setNewPlayerPosition(value);
                                }}
                              >
                                <option value="">Select Position (Optional)</option>
                                {positions.map(pos => (
                                  <option key={pos} value={pos}>{pos}</option>
                                ))}
                                <option value="__ADD_NEW__" className="text-blue-600 font-medium">➕ Add New Position...</option>
                              </select>
                              
                              {newPlayerPosition === '__ADD_NEW__' && (
                                <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                  <div className="flex gap-2 items-center">
                                    <input
                                      type="text"
                                      placeholder="Enter position name (e.g. Centre Back)..."
                                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      autoFocus
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          const input = e.target as HTMLInputElement;
                                          const value = input.value.trim();
                                          if (value && !positions.includes(value)) {
                                            setPositions([...positions, value]);
                                            setNewPlayerPosition(value);
                                          }
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const input = document.querySelector('input[placeholder*="position name"]') as HTMLInputElement;
                                        const value = input?.value.trim();
                                        if (value && !positions.includes(value)) {
                                          setPositions([...positions, value]);
                                          setNewPlayerPosition(value);
                                        }
                                      }}
                                      className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                      Add
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setNewPlayerPosition('')}
                                      className="px-3 py-2 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                            
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
                                    disabled={!player.isCaptain && wizardData.players.some(p => p.isCaptain)}
                                    onChange={(e) => updatePlayer(index, 'isCaptain', e.target.checked)}
                                    className={`mr-1 w-3 h-3 ${!player.isCaptain && wizardData.players.some(p => p.isCaptain) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  />
                                  <span className={!player.isCaptain && wizardData.players.some(p => p.isCaptain) ? 'opacity-50' : ''}>C</span>
                                </label>
                                <label className="flex items-center text-xs" title="Vice Captain">
                                  <input
                                    type="checkbox"
                                    checked={player.isViceCaptain}
                                    disabled={!player.isViceCaptain && wizardData.players.some(p => p.isViceCaptain)}
                                    onChange={(e) => updatePlayer(index, 'isViceCaptain', e.target.checked)}
                                    className={`mr-1 w-3 h-3 ${!player.isViceCaptain && wizardData.players.some(p => p.isViceCaptain) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  />
                                  <span className={!player.isViceCaptain && wizardData.players.some(p => p.isViceCaptain) ? 'opacity-50' : ''}>VC</span>
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
                    className={`px-8 py-3 text-white rounded-lg transition-colors font-medium ${wizardColors.background} hover:opacity-90`}
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
                    onClick={cancelWizard}
                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
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
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}