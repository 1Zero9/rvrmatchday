import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import StandardLayout from "../../components/StandardLayout";
import { storage } from "../../lib/match-tracker-storage";
import { Team, TeamSummary } from "../../types/match-tracker";

export default function MatchTrackerDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamSummaries, setTeamSummaries] = useState<TeamSummary[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize sample data on first load
    storage.initializeSampleData();
    
    // Load teams
    const loadedTeams = storage.getTeams();
    setTeams(loadedTeams);
    
    // Load team summaries
    const summaries = loadedTeams
      .map(team => storage.getTeamSummary(team.id))
      .filter(Boolean) as TeamSummary[];
    
    setTeamSummaries(summaries);
    setLoading(false);
  }, []);

  const filteredSummaries = selectedTeam === 'all' 
    ? teamSummaries 
    : teamSummaries.filter(summary => summary.team.id === selectedTeam);

  if (loading) {
    return (
      <StandardLayout title="Match Tracker">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading match tracker...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout title="Match Tracker">
      <div className="min-h-screen bg-gray-50">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-green-700 text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">Match Tracker</h1>
                <p className="text-green-100 lg:text-lg">Track matches, stats, and results for all RVR teams (U12+)</p>
              </div>
              
              <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/match-tracker/new-match"
                  className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors inline-flex items-center justify-center"
                >
                  ⚽ New Match
                </Link>
                <Link
                  href="/match-tracker/teams"
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors inline-flex items-center justify-center"
                >
                  👥 Manage Teams
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Team Filter */}
        <div className="bg-white border-b border-gray-200 sticky top-24 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="text-sm font-medium text-gray-700 flex-shrink-0">
                Filter by Team:
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="flex-1 sm:max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Teams ({teamSummaries.length})</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Season: 2024-25</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {filteredSummaries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚽</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first team.</p>
              <Link
                href="/match-tracker/teams/new"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Add Team
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {filteredSummaries.map((summary, index) => (
                <motion.div
                  key={summary.team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  
                  {/* Team Header */}
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{summary.team.name}</h3>
                        <p className="text-green-100 text-sm">{summary.team.league}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {summary.currentSeason.points} pts
                        </div>
                        <div className="text-sm text-green-100">
                          {summary.currentSeason.played} played
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Season Stats */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {summary.currentSeason.won}
                        </div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">Won</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {summary.currentSeason.drawn}
                        </div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">Drawn</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {summary.currentSeason.lost}
                        </div>
                        <div className="text-xs text-gray-600 uppercase tracking-wide">Lost</div>
                      </div>
                    </div>

                    {/* Goals */}
                    <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-700">
                          {summary.currentSeason.goalsFor}
                        </div>
                        <div className="text-xs text-gray-600">Goals For</div>
                      </div>
                      <div className="text-gray-400">-</div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-700">
                          {summary.currentSeason.goalsAgainst}
                        </div>
                        <div className="text-xs text-gray-600">Goals Against</div>
                      </div>
                    </div>

                    {/* Recent Matches */}
                    {summary.recentMatches.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Results</h4>
                        <div className="space-y-2">
                          {summary.recentMatches.slice(0, 3).map((match) => (
                            <div key={match.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                              <span className="text-gray-600">vs {match.opponent}</span>
                              {match.homeScore !== undefined && match.awayScore !== undefined ? (
                                <span className="font-medium">
                                  {match.isHomeMatch 
                                    ? `${match.homeScore}-${match.awayScore}` 
                                    : `${match.awayScore}-${match.homeScore}`
                                  }
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/match-tracker/teams/${summary.team.id}`}
                        className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/match-tracker/teams/${summary.team.id}/new-match`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Add Match
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StandardLayout>
  );
}