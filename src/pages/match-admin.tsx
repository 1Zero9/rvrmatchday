/**
 * Match Administration - Simple Wizard
 * Single record setup for RVR teams and opponents
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import { supabase } from "../lib/supabase";
import { storage } from "../lib/match-tracker-storage";
import { Team, Match } from "../types/match-tracker";

type SetupType = 'rvr-team' | 'opponent';

interface TeamSetup {
  id?: string;
  name: string;
  ageGroup: string;
  gender: 'Male' | 'Female' | 'Mixed';
  league: string;
  homeVenue: string;
  season: string;
  contactEmail: string;
  contactPhone: string;
  coaches: string[];
  notes: string;
  squad: { firstName: string; position: string; isCaptain?: boolean; isViceCaptain?: boolean; }[];
}

export default function MatchAdmin() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [setupType, setSetupType] = useState<SetupType>('rvr-team');
  
  // Reference data from database
  const [positions, setPositions] = useState<string[]>([]);
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [leagues, setLeagues] = useState<string[]>([]);
  const [venues, setVenues] = useState<string[]>([]);
  const [coaches, setCoaches] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<string[]>(['2024/25', '2025/26', '2026/27']);
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [ageGroupFilter, setAgeGroupFilter] = useState("all");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  
  // Single setup form for both RVR teams and opponents
  const [teamSetup, setTeamSetup] = useState<TeamSetup>({
    name: '',
    ageGroup: '',
    gender: 'Male',
    league: '',
    homeVenue: '',
    season: '2024/25',
    contactEmail: '',
    contactPhone: '',
    coaches: [],
    notes: '',
    squad: []
  });

  // Edit mode
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  // Load reference data from database
  const loadReferenceData = async () => {
    try {
      const [positionsData, ageGroupsData, leaguesData, venuesData, coachesData] = await Promise.all([
        supabase.from('player_positions').select('name').eq('is_active', true).order('name'),
        supabase.from('age_groups').select('name').eq('is_active', true).order('name'),
        supabase.from('leagues').select('name').order('name'),
        supabase.from('venues').select('name').order('name'),
        supabase.from('coaches').select('*').order('id')
      ]);

      setPositions(positionsData.data?.map(p => p.name) || ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']);
      setAgeGroups(ageGroupsData.data?.map(a => a.name) || ['U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13']);
      setLeagues(leaguesData.data?.map(l => l.name) || ['Cork Schoolboys League', 'Friendly']);
      setVenues(venuesData.data?.map(v => v.name) || ['Riverstown Park']);
      setCoaches(coachesData.data?.map(c => c.name || c.full_name || c.first_name + ' ' + (c.last_name || '') || 'Coach') || ['John Smith', 'Mary O\'Connor']);
    } catch (error) {
      console.error('Error loading reference data:', error);
      // Fallback to hardcoded values
      setPositions(['Goalkeeper', 'Defender', 'Midfielder', 'Forward']);
      setAgeGroups(['U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13']);
      setLeagues(['Cork Schoolboys League', 'Friendly']);
      setVenues(['Riverstown Park']);
      setCoaches(['John Smith', 'Mary O\'Connor']);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teamsData, matchesData] = await Promise.all([
        storage.getTeams(),
        storage.getMatches()
      ]);
      setTeams(teamsData);
      setMatches(matchesData);
      
      // Load reference data
      await loadReferenceData();
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for dropdowns from existing data
  const getUniqueValues = (field: keyof Team) => {
    return [...new Set(teams.map(t => t[field]).filter(Boolean))];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const teamId = editingTeam ? editingTeam.id : crypto.randomUUID();
      
      const newTeam: Team = {
        id: teamId,
        name: teamSetup.name,
        ageGroup: teamSetup.ageGroup,
        gender: teamSetup.gender,
        season: teamSetup.season,
        league: teamSetup.league,
        homeKit: { primary: setupType === 'rvr-team' ? '#00A651' : '#FF0000', secondary: '#FFFFFF' },
        awayKit: { primary: setupType === 'rvr-team' ? '#001F3F' : '#000000', secondary: '#FFFFFF' },
        isOpponent: setupType === 'opponent',
        homeVenue: teamSetup.homeVenue,
        contactEmail: teamSetup.contactEmail,
        contactPhone: teamSetup.contactPhone,
        notes: teamSetup.notes,
        coachIds: [],
        assistantCoachIds: [],
        players: teamSetup.squad.map((player, index) => ({
          id: crypto.randomUUID(),
          teamId: teamId,
          name: player.firstName,
          position: player.position,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        createdAt: editingTeam ? editingTeam.createdAt : new Date(),
        updatedAt: new Date()
      };

      console.log('Saving team to database:', newTeam);
      
      // Direct Supabase save (bypass storage layer)
      const { data: savedTeam, error: teamError } = await supabase
        .from('teams')
        .upsert({
          id: newTeam.id,
          name: newTeam.name,
          short_name: newTeam.name,
          season: newTeam.season || '2024-25',
          home_colors: newTeam.homeKit,
          away_colors: newTeam.awayKit,
          is_opponent: newTeam.isOpponent || false,
          age_group: newTeam.ageGroup,
          gender: newTeam.gender,
          league: newTeam.league,
          home_venue: newTeam.homeVenue,
          contact_email: newTeam.contactEmail,
          contact_phone: newTeam.contactPhone,
          notes: newTeam.notes,
          is_active: true,
          is_public: true
        }, { onConflict: 'id' })
        .select();

      if (teamError) {
        throw new Error(`Database error: ${teamError.message}`);
      }

      console.log('Team saved to database:', savedTeam);

      // Save players directly to database
      if (newTeam.players && newTeam.players.length > 0) {
        const playersToSave = newTeam.players.map(player => ({
          id: player.id,
          team_id: newTeam.id,
          first_name: player.name,
          jersey_number: player.number,
          position: player.position,
          is_active: player.isActive !== false
        }));

        const { error: playersError } = await supabase
          .from('players')
          .upsert(playersToSave, { onConflict: 'id' });

        if (playersError) {
          throw new Error(`Players save error: ${playersError.message}`);
        }
        
        console.log('Players saved to database:', playersToSave.length);
      }
      
      if (editingTeam) {
        setTeams(teams.map(t => t.id === editingTeam.id ? newTeam : t));
        setEditingTeam(null);
        alert(`${setupType === 'rvr-team' ? 'Team' : 'Opponent'} updated successfully!`);
      } else {
        setTeams([...teams, newTeam]);
        alert(`${setupType === 'rvr-team' ? 'Team' : 'Opponent'} created successfully!`);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving team:', error);
      alert(`Error saving team: ${error.message}`);
      alert('Error saving. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setTeamSetup({
      name: '',
      ageGroup: '',
      gender: 'Mixed',
      league: '',
      homeVenue: '',
      season: '2024-25',
      contactEmail: '',
      contactPhone: '',
      coach: '',
      notes: '',
      squad: []
    });
  };

  const editTeam = (team: Team) => {
    setEditingTeam(team);
    setSetupType(team.isOpponent ? 'opponent' : 'rvr-team');
    setTeamSetup({
      id: team.id,
      name: team.name,
      ageGroup: team.ageGroup || '',
      gender: team.gender || 'Mixed',
      league: team.league || '',
      homeVenue: team.homeVenue || '',
      season: team.season || '2024-25',
      contactEmail: team.contactEmail || '',
      contactPhone: team.contactPhone || '',
      coaches: Array.isArray(team.coaches) ? team.coaches : (team.coach ? [team.coach] : []),
      notes: team.notes || '',
      squad: team.players?.map(p => ({ firstName: p.name, position: p.position || '', isCaptain: p.isCaptain || false, isViceCaptain: p.isViceCaptain || false })) || []
    });
    
    // Scroll to top and highlight the form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const cancelEdit = () => {
    setEditingTeam(null);
    resetForm();
  };

  const deleteTeam = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      storage.deleteTeam(teamId);
      setTeams(teams.filter(team => team.id !== teamId));
    }
  };

  // Filter teams based on search and filters
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgeGroup = ageGroupFilter === "all" || team.ageGroup === ageGroupFilter;
    const matchesLeague = leagueFilter === "all" || team.league === leagueFilter;
    const matchesGender = genderFilter === "all" || team.gender === genderFilter;
    
    return matchesSearch && matchesAgeGroup && matchesLeague && matchesGender;
  });

  const rvrTeams = filteredTeams.filter(team => !team.isOpponent);
  const opponentTeams = filteredTeams.filter(team => team.isOpponent);
  
  // Get unique values for filters
  const uniqueAgeGroups = [...new Set(teams.map(t => t.ageGroup).filter(Boolean))];
  const uniqueLeagues = [...new Set(teams.map(t => t.league).filter(Boolean))];
  const uniqueGenders = [...new Set(teams.map(t => t.gender).filter(Boolean))];

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">Loading Administration...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Match Administration</h1>
            <p className="text-gray-600">Simple setup for teams and opponents</p>
            <Link
              href="/match-central"
              className="inline-flex items-center mt-4 text-gray-600 hover:text-gray-800"
            >
              ← Back to Match Central
            </Link>
          </div>

          {/* Setup Type Selector */}
          <div className={`bg-white rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 ${
            editingTeam ? 'ring-4 ring-blue-200 bg-blue-50' : ''
          }`}>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              {editingTeam ? (
                <>
                  <span className="mr-3 text-2xl">✏️</span>
                  Editing: {editingTeam.name}
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {editingTeam.isOpponent ? 'Opponent' : 'RVR Team'}
                  </span>
                </>
              ) : (
                <>
                  <span className="mr-3 text-2xl">➕</span>
                  Add New Team
                </>
              )}
            </h2>
            
            {/* Team Type Selector - always show to allow correction */}
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setSetupType('rvr-team')}
                className={`flex-1 px-6 py-4 rounded-lg font-medium transition-colors ${
                  setupType === 'rvr-team'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚽ RVR Team
              </button>
              <button
                type="button"
                onClick={() => setSetupType('opponent')}
                className={`flex-1 px-6 py-4 rounded-lg font-medium transition-colors ${
                  setupType === 'opponent'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏟️ Opponent Team
              </button>
            </div>
            
            {editingTeam && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Tip:</strong> Use the toggle above to change this team from {editingTeam.isOpponent ? 'Opponent' : 'RVR Team'} to {editingTeam.isOpponent ? 'RVR Team' : 'Opponent'} if needed.
                </p>
              </div>
            )}

            {/* Single Team Setup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Team Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={teamSetup.name}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={setupType === 'rvr-team' ? 'e.g. RVR U12 Boys' : 'e.g. Celtic Tigers FC'}
                  />
                </div>

                {/* Age Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Group *
                    <button
                      type="button"
                      onClick={async () => {
                        const newAge = prompt('Enter new age group (e.g. U19):');
                        if (newAge) {
                          const { error } = await supabase.from('age_groups').insert({ name: newAge });
                          if (!error) {
                            setAgeGroups([...ageGroups, newAge]);
                            setTeamSetup(prev => ({ ...prev, ageGroup: newAge }));
                          } else {
                            alert('Error adding age group: ' + error.message);
                          }
                        }
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add New
                    </button>
                    {teamSetup.ageGroup && (
                      <button
                        type="button"
                        onClick={async () => {
                          const editedAge = prompt('Edit age group:', teamSetup.ageGroup);
                          if (editedAge && editedAge !== teamSetup.ageGroup) {
                            const { error } = await supabase.from('age_groups').update({ name: editedAge }).eq('name', teamSetup.ageGroup);
                            if (!error) {
                              const updatedAgeGroups = ageGroups.map(a => a === teamSetup.ageGroup ? editedAge : a);
                              setAgeGroups(updatedAgeGroups);
                              setTeamSetup(prev => ({ ...prev, ageGroup: editedAge }));
                            } else {
                              alert('Error updating age group: ' + error.message);
                            }
                          }
                        }}
                        className="ml-2 text-amber-600 hover:text-amber-800 text-sm"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {teamSetup.ageGroup && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Delete age group "${teamSetup.ageGroup}"? This cannot be undone.`)) {
                            const { error } = await supabase.from('age_groups').delete().eq('name', teamSetup.ageGroup);
                            if (!error) {
                              const updatedAgeGroups = ageGroups.filter(a => a !== teamSetup.ageGroup);
                              setAgeGroups(updatedAgeGroups);
                              setTeamSetup(prev => ({ ...prev, ageGroup: '' }));
                            } else {
                              alert('Error deleting age group: ' + error.message);
                            }
                          }
                        }}
                        className="ml-2 text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </label>
                  <select
                    required
                    value={teamSetup.ageGroup}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, ageGroup: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Age Group</option>
                    {ageGroups.map(age => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={teamSetup.gender}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, gender: e.target.value as 'Male' | 'Female' | 'Mixed' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select below</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                {/* League */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    League/Competition
                    <button
                      type="button"
                      onClick={async () => {
                        const newLeague = prompt('Enter new league/competition:');
                        if (newLeague) {
                          // Generate a short_name from the full name
                          const shortName = newLeague.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
                          const currentSeason = new Date().getFullYear() + '-' + (new Date().getFullYear() + 1);
                          const { error } = await supabase.from('leagues').insert({ 
                            name: newLeague,
                            short_name: shortName,
                            season: currentSeason
                          });
                          if (!error) {
                            setLeagues([...leagues, newLeague]);
                            setTeamSetup(prev => ({ ...prev, league: newLeague }));
                          } else {
                            alert('Error adding league: ' + error.message);
                          }
                        }
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add New
                    </button>
                    {teamSetup.league && (
                      <button
                        type="button"
                        onClick={async () => {
                          const editedLeague = prompt('Edit league name:', teamSetup.league);
                          if (editedLeague && editedLeague !== teamSetup.league) {
                            const shortName = editedLeague.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
                            const { error } = await supabase.from('leagues')
                              .update({ 
                                name: editedLeague,
                                short_name: shortName
                              })
                              .eq('name', teamSetup.league);
                            
                            if (!error) {
                              const updatedLeagues = leagues.map(l => l === teamSetup.league ? editedLeague : l);
                              setLeagues(updatedLeagues);
                              setTeamSetup(prev => ({ ...prev, league: editedLeague }));
                            } else {
                              alert('Error updating league: ' + error.message);
                            }
                          }
                        }}
                        className="ml-2 text-amber-600 hover:text-amber-800 text-sm"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {teamSetup.league && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Delete league "${teamSetup.league}"? This cannot be undone.`)) {
                            const { error } = await supabase.from('leagues').delete().eq('name', teamSetup.league);
                            if (!error) {
                              const updatedLeagues = leagues.filter(l => l !== teamSetup.league);
                              setLeagues(updatedLeagues);
                              setTeamSetup(prev => ({ ...prev, league: '' }));
                            } else {
                              alert('Error deleting league: ' + error.message);
                            }
                          }
                        }}
                        className="ml-2 text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </label>
                  <select
                    value={teamSetup.league}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, league: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select League</option>
                    {leagues.map(league => (
                      <option key={league} value={league}>{league}</option>
                    ))}
                  </select>
                </div>

                {/* Home Venue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {setupType === 'rvr-team' ? 'Home Venue' : 'Their Home Venue'}
                    <button
                      type="button"
                      onClick={async () => {
                        const newVenue = prompt('Enter new venue:');
                        if (newVenue) {
                          const { error } = await supabase.from('venues').insert({ name: newVenue });
                          if (!error) {
                            setVenues([...venues, newVenue]);
                            setTeamSetup(prev => ({ ...prev, homeVenue: newVenue }));
                          } else {
                            alert('Error adding venue: ' + error.message);
                          }
                        }
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add New
                    </button>
                    {teamSetup.homeVenue && (
                      <button
                        type="button"
                        onClick={async () => {
                          const editedVenue = prompt('Edit venue name:', teamSetup.homeVenue);
                          if (editedVenue && editedVenue !== teamSetup.homeVenue) {
                            const { error } = await supabase.from('venues')
                              .update({ name: editedVenue })
                              .eq('name', teamSetup.homeVenue);
                            
                            if (!error) {
                              const updatedVenues = venues.map(v => v === teamSetup.homeVenue ? editedVenue : v);
                              setVenues(updatedVenues);
                              setTeamSetup(prev => ({ ...prev, homeVenue: editedVenue }));
                            } else {
                              alert('Error updating venue: ' + error.message);
                            }
                          }
                        }}
                        className="ml-2 text-amber-600 hover:text-amber-800 text-sm"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {teamSetup.homeVenue && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Delete venue "${teamSetup.homeVenue}"? This cannot be undone.`)) {
                            const { error } = await supabase.from('venues').delete().eq('name', teamSetup.homeVenue);
                            if (!error) {
                              const updatedVenues = venues.filter(v => v !== teamSetup.homeVenue);
                              setVenues(updatedVenues);
                              setTeamSetup(prev => ({ ...prev, homeVenue: '' }));
                            } else {
                              alert('Error deleting venue: ' + error.message);
                            }
                          }
                        }}
                        className="ml-2 text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </label>
                  <select
                    value={teamSetup.homeVenue}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, homeVenue: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Venue</option>
                    {venues.map(venue => (
                      <option key={venue} value={venue}>{venue}</option>
                    ))}
                  </select>
                </div>

                {/* Season */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Season
                    <button
                      type="button"
                      onClick={() => {
                        const newSeason = prompt('Enter new season (e.g. 2027/28):');
                        if (newSeason && !seasons.includes(newSeason)) {
                          setSeasons([...seasons, newSeason]);
                          setTeamSetup(prev => ({ ...prev, season: newSeason }));
                        }
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      + Add New
                    </button>
                    {teamSetup.season && (
                      <button
                        type="button"
                        onClick={() => {
                          const editedSeason = prompt('Edit season:', teamSetup.season);
                          if (editedSeason && editedSeason !== teamSetup.season) {
                            const updatedSeasons = seasons.map(s => s === teamSetup.season ? editedSeason : s);
                            setSeasons(updatedSeasons);
                            setTeamSetup(prev => ({ ...prev, season: editedSeason }));
                          }
                        }}
                        className="ml-2 text-amber-600 hover:text-amber-800 text-sm"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {teamSetup.season && seasons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete season "${teamSetup.season}"? This cannot be undone.`)) {
                            const updatedSeasons = seasons.filter(s => s !== teamSetup.season);
                            setSeasons(updatedSeasons);
                            setTeamSetup(prev => ({ ...prev, season: '' }));
                          }
                        }}
                        className="ml-2 text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </label>
                  <select
                    value={teamSetup.season}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, season: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Season</option>
                    {seasons.map(season => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={teamSetup.contactEmail}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="team@example.com"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={teamSetup.contactPhone}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+353 xx xxx xxxx"
                  />
                </div>

                {/* Coaches (RVR teams only) */}
                {setupType === 'rvr-team' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coaches (Select Multiple)
                      <button
                        type="button"
                        onClick={async () => {
                          const newCoach = prompt('Enter new coach name:');
                          if (newCoach) {
                            // Parse full name into first_name and last_name
                            const nameParts = newCoach.trim().split(' ');
                            const firstName = nameParts[0] || newCoach;
                            const lastName = nameParts.slice(1).join(' ') || '';
                            
                            const { error } = await supabase.from('coaches').insert({ 
                              first_name: firstName,
                              last_name: lastName,
                              name: newCoach // Include full name if column exists
                            });
                            if (!error) {
                              setCoaches([...coaches, newCoach]);
                            } else {
                              alert('Error adding coach: ' + error.message);
                            }
                          }
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add New
                      </button>
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-gray-50">
                      {coaches.map(coach => (
                        <label key={coach} className="flex items-center space-x-3 cursor-pointer hover:bg-white p-2 rounded">
                          <input
                            type="checkbox"
                            checked={teamSetup.coaches.includes(coach)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTeamSetup(prev => ({ ...prev, coaches: [...prev.coaches, coach] }));
                              } else {
                                setTeamSetup(prev => ({ ...prev, coaches: prev.coaches.filter(c => c !== coach) }));
                              }
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700 font-medium">{coach}</span>
                          <div className="ml-auto flex space-x-1">
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.preventDefault();
                                const editedCoach = prompt('Edit coach name:', coach);
                                if (editedCoach && editedCoach !== coach) {
                                  // Parse full name into first_name and last_name
                                  const nameParts = editedCoach.trim().split(' ');
                                  const firstName = nameParts[0] || editedCoach;
                                  const lastName = nameParts.slice(1).join(' ') || '';
                                  
                                  const { error } = await supabase.from('coaches')
                                    .update({ 
                                      first_name: firstName,
                                      last_name: lastName,
                                      name: editedCoach 
                                    })
                                    .eq('name', coach);
                                  
                                  if (!error) {
                                    const updatedCoaches = coaches.map(c => c === coach ? editedCoach : c);
                                    setCoaches(updatedCoaches);
                                    const updatedTeamCoaches = teamSetup.coaches.map(c => c === coach ? editedCoach : c);
                                    setTeamSetup(prev => ({ ...prev, coaches: updatedTeamCoaches }));
                                  } else {
                                    alert('Error updating coach: ' + error.message);
                                  }
                                }
                              }}
                              className="text-xs text-amber-600 hover:text-amber-800"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.preventDefault();
                                if (confirm(`Delete coach "${coach}"? This cannot be undone.`)) {
                                  const { error } = await supabase.from('coaches').delete().eq('name', coach);
                                  if (!error) {
                                    const updatedCoaches = coaches.filter(c => c !== coach);
                                    setCoaches(updatedCoaches);
                                    const updatedTeamCoaches = teamSetup.coaches.filter(c => c !== coach);
                                    setTeamSetup(prev => ({ ...prev, coaches: updatedTeamCoaches }));
                                  } else {
                                    alert('Error deleting coach: ' + error.message);
                                  }
                                }
                              }}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              🗑️
                            </button>
                          </div>
                        </label>
                      ))}
                      {coaches.length === 0 && (
                        <p className="text-gray-500 text-sm">No coaches available. Click "+ Add New" to add coaches.</p>
                      )}
                    </div>
                    {teamSetup.coaches.length > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {teamSetup.coaches.join(', ')}
                      </p>
                    )}
                  </div>
                )}

                {/* Squad Setup - Only for RVR teams */}
                {setupType === 'rvr-team' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Squad Players (First Names Only - GDPR Compliant)
                      <div className="inline-flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={async () => {
                            const newPosition = prompt('Enter new player position:');
                            if (newPosition) {
                              const { error } = await supabase.from('player_positions').insert({ name: newPosition });
                              if (!error) {
                                setPositions([...positions, newPosition]);
                              } else {
                                alert('Error adding position: ' + error.message);
                              }
                            }
                          }}
                          className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          + Add Position
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const positionToEdit = prompt('Which position to edit?', positions[0]);
                            if (positionToEdit && positions.includes(positionToEdit)) {
                              const editedPosition = prompt('Edit position name:', positionToEdit);
                              if (editedPosition && editedPosition !== positionToEdit) {
                                const { error } = await supabase.from('player_positions').update({ name: editedPosition }).eq('name', positionToEdit);
                                if (!error) {
                                  const updatedPositions = positions.map(p => p === positionToEdit ? editedPosition : p);
                                  setPositions(updatedPositions);
                                } else {
                                  alert('Error updating position: ' + error.message);
                                }
                              }
                            }
                          }}
                          className="ml-1 text-amber-600 hover:text-amber-800 text-sm"
                        >
                          ✏️ Edit Position
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const positionToDelete = prompt('Which position to delete?', positions[0]);
                            if (positionToDelete && positions.includes(positionToDelete)) {
                              if (confirm(`Delete position "${positionToDelete}"? This cannot be undone.`)) {
                                const { error } = await supabase.from('player_positions').delete().eq('name', positionToDelete);
                                if (!error) {
                                  const updatedPositions = positions.filter(p => p !== positionToDelete);
                                  setPositions(updatedPositions);
                                } else {
                                  alert('Error deleting position: ' + error.message);
                                }
                              }
                            }
                          }}
                          className="ml-1 text-red-600 hover:text-red-800 text-sm"
                        >
                          🗑️ Delete Position
                        </button>
                      </div>
                    </label>
                    <div className="space-y-3">
                      {teamSetup.squad.map((player, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg space-y-2">
                          <div className="flex gap-3 items-center">
                            <input
                              type="text"
                              placeholder="First name"
                              value={player.firstName}
                              onChange={(e) => {
                                const newSquad = [...teamSetup.squad];
                                newSquad[index].firstName = e.target.value;
                                setTeamSetup(prev => ({ ...prev, squad: newSquad }));
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                              value={player.position}
                              onChange={(e) => {
                                const newSquad = [...teamSetup.squad];
                                newSquad[index].position = e.target.value;
                                setTeamSetup(prev => ({ ...prev, squad: newSquad }));
                              }}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Position</option>
                              {positions.map(position => (
                                <option key={position} value={position}>{position}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                const newSquad = teamSetup.squad.filter((_, i) => i !== index);
                                setTeamSetup(prev => ({ ...prev, squad: newSquad }));
                              }}
                              className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={player.isCaptain || false}
                                onChange={(e) => {
                                  const newSquad = [...teamSetup.squad];
                                  if (e.target.checked) {
                                    // Only one captain allowed - uncheck others
                                    newSquad.forEach((p, i) => {
                                      if (i !== index) p.isCaptain = false;
                                    });
                                  }
                                  newSquad[index].isCaptain = e.target.checked;
                                  setTeamSetup(prev => ({ ...prev, squad: newSquad }));
                                }}
                                className="rounded text-blue-600"
                              />
                              <span className="text-blue-600 font-medium">Captain (C)</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={player.isViceCaptain || false}
                                onChange={(e) => {
                                  const newSquad = [...teamSetup.squad];
                                  if (e.target.checked) {
                                    // Only one vice-captain allowed - uncheck others
                                    newSquad.forEach((p, i) => {
                                      if (i !== index) p.isViceCaptain = false;
                                    });
                                  }
                                  newSquad[index].isViceCaptain = e.target.checked;
                                  setTeamSetup(prev => ({ ...prev, squad: newSquad }));
                                }}
                                className="rounded text-amber-600"
                              />
                              <span className="text-amber-600 font-medium">Vice-Captain (VC)</span>
                            </label>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => {
                          setTeamSetup(prev => ({
                            ...prev,
                            squad: [...prev.squad, { firstName: '', position: '', isCaptain: false, isViceCaptain: false }]
                          }));
                        }}
                        className="w-full px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        <span>➕</span>
                        <span>Add Player</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={teamSetup.notes}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Additional information..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                {editingTeam && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    ❌ Cancel Edit
                  </button>
                )}
                
                <div className="flex gap-3 ml-auto">
                  <button
                    type="submit"
                    disabled={saving || !teamSetup.name || !teamSetup.ageGroup}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      setupType === 'rvr-team'
                        ? 'bg-green-600 hover:bg-green-700 disabled:bg-gray-300'
                        : 'bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300'
                    } text-white`}
                  >
                    {saving ? 'Saving...' : editingTeam ? 'Update' : 'Create'} {setupType === 'rvr-team' ? 'Team' : 'Opponent'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-3 text-xl">🔍</span>
              Filter Teams
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Teams
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Search by name..."
                />
              </div>

              {/* Age Group Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Group
                </label>
                <select
                  value={ageGroupFilter}
                  onChange={(e) => setAgeGroupFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Age Groups</option>
                  {uniqueAgeGroups.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
              </div>

              {/* League Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  League
                </label>
                <select
                  value={leagueFilter}
                  onChange={(e) => setLeagueFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Leagues</option>
                  {uniqueLeagues.map(league => (
                    <option key={league} value={league}>{league}</option>
                  ))}
                </select>
              </div>

              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">All Genders</option>
                  {uniqueGenders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Results Summary */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{rvrTeams.length}</span> RVR teams and <span className="font-semibold">{opponentTeams.length}</span> opponents
                {(searchTerm || ageGroupFilter !== "all" || leagueFilter !== "all" || genderFilter !== "all") && 
                  ` (filtered from ${teams.length} total teams)`
                }
              </p>
            </div>
          </div>

          {/* Teams Lists */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* RVR Teams */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3 text-2xl">⚽</span>
                RVR Teams ({rvrTeams.length})
              </h2>
              
              {rvrTeams.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">⚽</div>
                  <p className="text-gray-500 text-sm">
                    {teams.filter(t => !t.isOpponent).length === 0 
                      ? "No RVR teams yet"
                      : "No teams match your filters"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rvrTeams.map((team) => (
                    <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{team.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              RVR Team
                            </span>
                            {team.season && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {team.season}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editTeam(team)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                            title="Edit Team"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteTeam(team.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete Team"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        {team.ageGroup && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">🎯</span>
                            {team.ageGroup} • {team.gender || 'Mixed'}
                          </div>
                        )}
                        {team.league && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">🏆</span>
                            {team.league}
                          </div>
                        )}
                        {team.homeVenue && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">🏠</span>
                            {team.homeVenue}
                          </div>
                        )}
                        {team.players && team.players.length > 0 && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">👥</span>
                            {team.players.length} players
                          </div>
                        )}
                        {team.contactEmail && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">📧</span>
                            {team.contactEmail}
                          </div>
                        )}
                      </div>

                      {team.notes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          {team.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Opponent Teams */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3 text-2xl">🏟️</span>
                Opponents ({opponentTeams.length})
              </h2>
              
              {opponentTeams.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🏟️</div>
                  <p className="text-gray-500 text-sm">
                    {teams.filter(t => t.isOpponent).length === 0 
                      ? "No opponents yet"
                      : "No opponents match your filters"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {opponentTeams.map((team) => (
                    <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{team.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                              Opponent
                            </span>
                            {team.season && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {team.season}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editTeam(team)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                            title="Edit Team"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteTeam(team.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete Team"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        {team.ageGroup && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">🎯</span>
                            {team.ageGroup} • {team.gender || 'Mixed'}
                          </div>
                        )}
                        {team.league && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">🏆</span>
                            {team.league}
                          </div>
                        )}
                        {team.homeVenue && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">🏠</span>
                            {team.homeVenue}
                          </div>
                        )}
                        {team.contactEmail && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">📧</span>
                            {team.contactEmail}
                          </div>
                        )}
                        {team.contactPhone && (
                          <div className="flex items-center">
                            <span className="font-medium mr-2">📞</span>
                            {team.contactPhone}
                          </div>
                        )}
                      </div>

                      {team.notes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          {team.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Quick Stats */}
          <div className="mt-8 mb-16 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{rvrTeams.length}</div>
                <div className="text-sm text-gray-600">RVR Teams</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{opponentTeams.length}</div>
                <div className="text-sm text-gray-600">Opponents</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{getUniqueValues('league').length}</div>
                <div className="text-sm text-gray-600">Leagues</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {teams.reduce((sum, team) => sum + (team.players?.length || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Players</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </StandardLayout>
  );
}