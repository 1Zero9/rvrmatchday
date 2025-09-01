/**
 * Match Administration - Simple Wizard
 * Single record setup for RVR teams and opponents
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
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
  coach: string;
  notes: string;
}

export default function MatchAdmin() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [setupType, setSetupType] = useState<SetupType>('rvr-team');
  
  // Single setup form for both RVR teams and opponents
  const [teamSetup, setTeamSetup] = useState<TeamSetup>({
    name: '',
    ageGroup: '',
    gender: 'Mixed',
    league: '',
    homeVenue: '',
    season: '2024-25',
    contactEmail: '',
    contactPhone: '',
    coach: '',
    notes: ''
  });

  // Edit mode
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const loadedTeams = storage.getTeams();
      const loadedMatches = storage.getMatches();
      setTeams(loadedTeams);
      setMatches(loadedMatches);
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
      const newTeam: Team = {
        id: editingTeam ? editingTeam.id : `${setupType === 'rvr-team' ? 'team' : 'opponent'}-${Date.now()}`,
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
        createdAt: editingTeam ? editingTeam.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editingTeam) {
        storage.saveTeam(newTeam);
        setTeams(teams.map(t => t.id === editingTeam.id ? newTeam : t));
        setEditingTeam(null);
        alert(`${setupType === 'rvr-team' ? 'Team' : 'Opponent'} updated successfully!`);
      } else {
        storage.saveTeam(newTeam);
        setTeams([...teams, newTeam]);
        alert(`${setupType === 'rvr-team' ? 'Team' : 'Opponent'} created successfully!`);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving team:', error);
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
      notes: ''
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
      coach: '',
      notes: team.notes || ''
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

  const rvrTeams = teams.filter(team => !team.isOpponent);
  const opponentTeams = teams.filter(team => team.isOpponent);

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
                  </label>
                  <input
                    type="text"
                    required
                    list="age-groups-datalist"
                    value={teamSetup.ageGroup}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, ageGroup: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. U12, U14, Senior"
                  />
                  <datalist id="age-groups-datalist">
                    {getUniqueValues('ageGroup').map(age => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </datalist>
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
                    <option value="Mixed">Mixed</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* League */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    League/Competition
                  </label>
                  <input
                    type="text"
                    list="leagues-datalist"
                    value={teamSetup.league}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, league: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Dublin & District League"
                  />
                  <datalist id="leagues-datalist">
                    {getUniqueValues('league').map(league => (
                      <option key={league} value={league}>{league}</option>
                    ))}
                  </datalist>
                </div>

                {/* Home Venue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {setupType === 'rvr-team' ? 'Home Venue' : 'Their Home Venue'}
                  </label>
                  <input
                    type="text"
                    list="venues-datalist"
                    value={teamSetup.homeVenue}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, homeVenue: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Phoenix Park"
                  />
                  <datalist id="venues-datalist">
                    {getUniqueValues('homeVenue').map(venue => (
                      <option key={venue} value={venue}>{venue}</option>
                    ))}
                  </datalist>
                </div>

                {/* Season */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Season
                  </label>
                  <input
                    type="text"
                    value={teamSetup.season}
                    onChange={(e) => setTeamSetup(prev => ({ ...prev, season: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 2024-25"
                  />
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

                {/* Coach (RVR teams only) */}
                {setupType === 'rvr-team' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coach
                    </label>
                    <input
                      type="text"
                      value={teamSetup.coach}
                      onChange={(e) => setTeamSetup(prev => ({ ...prev, coach: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Coach name"
                    />
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
                  <p className="text-gray-500 text-sm">No RVR teams yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rvrTeams.map((team) => (
                    <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{team.name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editTeam(team)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteTeam(team.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>{team.ageGroup} • {team.gender}</div>
                        {team.league && <div>League: {team.league}</div>}
                        {team.homeVenue && <div>Home: {team.homeVenue}</div>}
                      </div>
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
                  <p className="text-gray-500 text-sm">No opponents yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {opponentTeams.map((team) => (
                    <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{team.name}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editTeam(team)}
                            className="text-blue-500 hover:text-blue-700 p-1"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteTeam(team.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>{team.ageGroup} • {team.gender}</div>
                        {team.league && <div>League: {team.league}</div>}
                        {team.homeVenue && <div>Home: {team.homeVenue}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Quick Stats */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
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
                <div className="text-2xl font-bold text-purple-600">{getUniqueValues('homeVenue').length}</div>
                <div className="text-sm text-gray-600">Venues</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </StandardLayout>
  );
}