/**
 * Team Management - View and Edit Teams
 * Separated from team setup for better organization
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import { supabase } from "../lib/supabase";
import { Team } from "../types/match-tracker";

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [ageGroupFilter, setAgeGroupFilter] = useState("all");
  const [leagueFilter, setLeagueFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      // Load teams directly from database
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          *,
          players(*)
        `)
        .order('created_at', { ascending: false });
        
      if (teamsError) {
        console.error('Error loading teams from database:', teamsError);
        setTeams([]);
      } else {
        // Transform database data to match Team interface
        const transformedTeams: Team[] = (teamsData || []).map(team => ({
          id: team.id,
          name: team.name,
          ageGroup: team.age_group,
          gender: team.gender,
          season: team.season,
          league: team.league,
          homeKit: team.home_colors || { primary: '#00A651', secondary: '#FFFFFF' },
          awayKit: team.away_colors || { primary: '#001F3F', secondary: '#FFFFFF' },
          isOpponent: team.is_opponent || false,
          homeVenue: team.home_venue,
          contactEmail: team.contact_email,
          contactPhone: team.contact_phone,
          coaches: team.coaches || [],
          notes: team.notes,
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
    } finally {
      setLoading(false);
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

  // Get unique values for filter dropdowns
  const uniqueAgeGroups = [...new Set(teams.map(t => t.ageGroup).filter(Boolean))];
  const uniqueLeagues = [...new Set(teams.map(t => t.league).filter(Boolean))];
  const uniqueGenders = [...new Set(teams.map(t => t.gender).filter(Boolean))];

  const deleteTeam = async (teamId: string) => {
    if (confirm('Are you sure you want to delete this team?')) {
      try {
        // Delete from database
        const { error } = await supabase.from('teams').delete().eq('id', teamId);
        if (error) {
          alert('Error deleting team: ' + error.message);
        } else {
          setTeams(teams.filter(team => team.id !== teamId));
          alert('Team deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Error deleting team');
      }
    }
  };

  if (loading) {
    return (
      <StandardLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading teams...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-6xl mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
            <p className="text-gray-600">View and manage existing teams and opponents</p>
            <div className="flex justify-center items-center gap-4 mt-4">
              <Link
                href="/match-admin"
                className="inline-flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
              >
                ➕ Create New Team
              </Link>
              <Link
                href="/match-central"
                className="inline-flex items-center text-gray-600 hover:text-gray-800"
              >
                ← Back to Match Central
              </Link>
              <button
                onClick={loadTeams}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? '🔄 Loading...' : '🔄 Refresh'}
              </button>
            </div>
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
                  <p className="text-gray-600 mb-4">No RVR teams found</p>
                  <Link
                    href="/match-admin"
                    className="inline-flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                  >
                    ➕ Create RVR Team
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {rvrTeams.map((team) => (
                    <motion.div
                      key={team.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-green-700">{team.name}</h3>
                          <p className="text-sm text-gray-600">
                            {team.ageGroup} • {team.gender} • {team.league}
                          </p>
                          {team.coaches && team.coaches.length > 0 && (
                            <p className="text-sm text-blue-600">
                              Coach(es): {team.coaches.join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            href={`/match-admin?edit=${team.id}`}
                            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => deleteTeam(team.id)}
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      
                      {team.players && team.players.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Squad ({team.players.length} players):
                          </p>
                          <div className="text-sm text-gray-600 space-y-1">
                            {team.players.map(player => (
                              <div key={player.id} className="flex justify-between">
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
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Opponent Teams */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3 text-2xl">🏟️</span>
                Opponent Teams ({opponentTeams.length})
              </h2>
              
              {opponentTeams.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🏟️</div>
                  <p className="text-gray-600 mb-4">No opponent teams found</p>
                  <Link
                    href="/match-admin"
                    className="inline-flex items-center px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors"
                  >
                    ➕ Add Opponent Team
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {opponentTeams.map((team) => (
                    <motion.div
                      key={team.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-orange-700">{team.name}</h3>
                          <p className="text-sm text-gray-600">
                            {team.ageGroup} • {team.gender} • {team.league}
                          </p>
                          {team.homeVenue && (
                            <p className="text-sm text-gray-600">
                              Home: {team.homeVenue}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            href={`/match-admin?edit=${team.id}`}
                            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => deleteTeam(team.id)}
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      
                      {team.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                          <strong>Notes:</strong> {team.notes}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </StandardLayout>
  );
}