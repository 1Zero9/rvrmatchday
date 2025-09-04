/**
 * Match Tracker Dashboard with Authentication
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Authenticated match tracker dashboard for team management.
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Head from "next/head";
import TrackerAuthWrapper from "../components/TrackerAuthWrapper";
import { supabase } from "../lib/supabase";
import { Team, TeamSummary, Match } from "../types/match-tracker";
import { TrackerUser, hasPermission, canAccessTeam, PERMISSIONS } from "../lib/tracker-auth";
import { SupabaseTrackerUser, hasPermission as supabaseHasPermission, canAccessTeam as supabaseCanAccessTeam } from "../lib/supabase-auth";

export default function TrackerDashboard() {
  return (
    <>
      <Head>
        <title>Match Tracker | RVR FC</title>
        <meta name="description" content="RVR Football Club match tracking system" />
      </Head>

      <TrackerAuthWrapper requiresAuth={true}>
        {(user: SupabaseTrackerUser) => <TrackerContent user={user} />}
      </TrackerAuthWrapper>
    </>
  );
}

function TrackerContent({ user }: { user: SupabaseTrackerUser }) {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<TeamSummary[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'matches'>('overview');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`*, players(*)`)
        .order('created_at', { ascending: false });

      if (teamsError) {
        console.error('Error loading teams:', teamsError);
        setTeams([]);
      } else {
        const allTeams: Team[] = teamsData?.map(team => ({
          id: team.id,
          name: team.team_name,
          category: team.age_group || 'Unknown',
          isOpponent: team.team_type === 'opponent',
          homeVenue: team.home_venue || 'St. Finian\'s GAA',
          league: team.league || 'Local',
          players: team.players?.map((p: any) => ({
            id: p.id,
            name: p.player_name,
            position: p.position || 'Field Player'
          })) || [],
          createdAt: new Date(team.created_at),
          updatedAt: new Date(team.updated_at || team.created_at),
          homeKit: { primary: '#009639', secondary: '#FFFFFF' },
          awayKit: { primary: '#FFFFFF', secondary: '#009639' },
          ageGroup: team.age_group || 'Open',
          gender: 'Mixed'
        })) || [];
        
        const accessibleTeams = user.teams.includes('*') 
          ? allTeams 
          : allTeams.filter(team => supabaseCanAccessTeam(user, team.id));
        
        setTeams(accessibleTeams);
      }

      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: false });

      if (matchesError) {
        console.error('Error loading matches:', matchesError);
        setMatches([]);
      } else {
        const allMatches: Match[] = matchesData?.map(match => ({
          id: match.id,
          teamId: match.team_id,
          opponent: match.opponent,
          scheduledDate: new Date(match.match_date),
          venue: match.venue || 'St. Finian\'s GAA',
          isHomeMatch: match.is_home_match || false,
          matchType: match.match_type || 'Friendly',
          status: match.status || 'Scheduled',
          homeScore: match.home_score,
          awayScore: match.away_score
        })) || [];
        
        const accessibleMatches = user.teams.includes('*')
          ? allMatches
          : allMatches.filter(match => supabaseCanAccessTeam(user, match.teamId));
        
        setMatches(accessibleMatches);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingMatches = () => {
    return matches
      .filter(match => match.status === 'Scheduled')
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      .slice(0, 5);
  };

  const getRecentMatches = () => {
    return matches
      .filter(match => match.status === 'Finished')
      .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
      .slice(0, 5);
  };

  const getLiveMatches = () => {
    return matches.filter(match => match.status === 'Live');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-club-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tracker...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-club-primary to-club-secondary text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-full mb-6">
                <span className="text-4xl">🎯</span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Match Tracker Dashboard</h1>
              <p className="text-club-accent text-xl max-w-2xl mx-auto">
                Welcome back, {user.full_name}! Track matches, record events, and analyze performance.
              </p>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center"
              >
                <div className="text-3xl mb-2">👥</div>
                <div className="text-2xl font-bold">{teams.length}</div>
                <div className="text-sm text-club-accent">Teams</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center"
              >
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-bold">{getUpcomingMatches().length}</div>
                <div className="text-sm text-club-accent">Upcoming</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center"
              >
                <div className="text-3xl mb-2">🔴</div>
                <div className="text-2xl font-bold">{getLiveMatches().length}</div>
                <div className="text-sm text-club-accent">Live Now</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center"
              >
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold">{getRecentMatches().length}</div>
                <div className="text-sm text-club-accent">Completed</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {supabaseHasPermission(user, 'create_matches') && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/matches/new?tracker=true')}
                className="bg-club-primary hover:bg-club-secondary text-white p-6 rounded-xl transition-all group"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">➕</div>
                  <h3 className="text-lg font-bold mb-2">New Match</h3>
                  <p className="text-sm text-club-accent">Create and schedule a new match</p>
                </div>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/match-central#tracker')}
              className="bg-club-accent hover:bg-blue-200 text-gray-900 p-6 rounded-xl transition-all group"
            >
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📊</div>
                <h3 className="text-lg font-bold mb-2">Match Central</h3>
                <p className="text-sm text-gray-600">View all matches and statistics</p>
              </div>
            </motion.button>

            {supabaseHasPermission(user, 'manage_teams') && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/admin#team-management')}
                className="bg-club-secondary hover:bg-club-primary text-white p-6 rounded-xl transition-all group"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👥</div>
                  <h3 className="text-lg font-bold mb-2">Manage Teams</h3>
                  <p className="text-sm text-club-neutral">Add teams and players</p>
                </div>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Live Matches */}
        {getLiveMatches().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="animate-pulse text-red-500 mr-2">🔴</span>
              Live Matches
            </h2>
            <div className="space-y-4">
              {getLiveMatches().map((match, index) => {
                const team = teams.find(t => t.id === match.teamId);
                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-red-700">
                          {team?.name || 'Unknown Team'} vs {match.opponent}
                        </h3>
                        <p className="text-gray-600">{match.venue} • {match.matchType}</p>
                        {(match.homeScore !== undefined && match.awayScore !== undefined) && (
                          <p className="text-xl font-bold text-red-600 mt-2">
                            Score: {match.isHomeMatch ? `${match.homeScore} - ${match.awayScore}` : `${match.awayScore} - ${match.homeScore}`}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        {supabaseHasPermission(user, 'record_events') && (
                          <button
                            onClick={() => router.push(`/matches/${match.id}/record`)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            🔴 Record Live
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Upcoming Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Matches</h2>
          {getUpcomingMatches().length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-2">No Upcoming Matches</h3>
              <p className="text-gray-600 mb-6">Create your first match to get started</p>
              {supabaseHasPermission(user, 'create_matches') && (
                <button
                  onClick={() => router.push('/matches/new?tracker=true')}
                  className="bg-club-primary hover:bg-club-secondary text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Create Match
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {getUpcomingMatches().map((match, index) => {
                const team = teams.find(t => t.id === match.teamId);
                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold">
                          {team?.name || 'Unknown Team'} vs {match.opponent}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>📍 {match.venue}</span>
                          <span>📅 {new Date(match.scheduledDate).toLocaleDateString()}</span>
                          <span>🕐 {new Date(match.scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className="px-2 py-1 bg-club-accent/20 text-club-primary rounded-full text-xs">
                            {match.matchType}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        {supabaseHasPermission(user, 'record_events') && (
                          <button
                            onClick={() => router.push(`/matches/${match.id}/record`)}
                            className="bg-club-primary hover:bg-club-secondary text-white px-4 py-2 rounded-lg font-medium transition-colors"
                          >
                            ▶️ Start Recording
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Teams Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Teams</h2>
          {teams.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">No Teams Found</h3>
              <p className="text-gray-600 mb-6">You don't have access to any teams yet</p>
              <p className="text-sm text-gray-500">Contact an administrator to get team access</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team, index) => {
                const summary = teamSummaries.find(s => s.teamId === team.id);
                return (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                        backgroundColor: team.homeKit.primary + '20',
                        color: team.homeKit.primary
                      }}>
                        <span className="font-bold text-lg">{team.name.substring(0, 2)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold">{team.name}</h3>
                        <p className="text-sm text-gray-600">{team.ageGroup} • {team.gender}</p>
                      </div>
                    </div>
                    
                    {summary && (
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <div className="font-bold text-lg">{summary.matchesPlayed}</div>
                          <div className="text-gray-600">Played</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-green-600">{summary.wins}</div>
                          <div className="text-gray-600">Wins</div>
                        </div>
                        <div>
                          <div className="font-bold text-lg text-red-600">{summary.losses}</div>
                          <div className="text-gray-600">Losses</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => router.push(`/admin#team-management`)}
                        className="w-full text-club-primary hover:text-club-secondary font-medium text-sm transition-colors"
                      >
                        Manage Team →
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}