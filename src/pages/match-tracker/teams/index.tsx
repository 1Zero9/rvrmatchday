import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import StandardLayout from "../../../components/StandardLayout";
import { storage } from "../../../lib/match-tracker-storage";
import { Team } from "../../../types/match-tracker";

export default function TeamsManagement() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = () => {
    const loadedTeams = storage.getTeams();
    setTeams(loadedTeams);
    setLoading(false);
  };

  const deleteTeam = (teamId: string) => {
    if (confirm('Are you sure you want to delete this team? This will also delete all associated matches and data.')) {
      storage.deleteTeam(teamId);
      loadTeams();
    }
  };

  if (loading) {
    return (
      <StandardLayout title="Teams Management">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading teams...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout title="Teams Management">
      <div className="min-h-screen bg-gray-50">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Teams Management</h1>
                <p className="text-gray-600 mt-1">Manage all RVR teams (U12 and above)</p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-3">
                <Link
                  href="/match-tracker"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  ← Back to Dashboard
                </Link>
                <Link
                  href="/match-tracker/teams/new"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  + Add Team
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Teams List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {teams.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
              <p className="text-gray-600 mb-6">Create your first team to get started with match tracking.</p>
              <Link
                href="/match-tracker/teams/new"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Add First Team
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  
                  {/* Team Header */}
                  <div 
                    className="h-24 relative"
                    style={{
                      background: `linear-gradient(135deg, ${team.homeKit.primary} 0%, ${team.homeKit.secondary} 100%)`
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold">{team.name}</h3>
                      <p className="text-sm opacity-90">{team.ageGroup} • {team.gender}</p>
                    </div>
                  </div>

                  {/* Team Details */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-20">League:</span>
                        <span className="text-gray-900">{team.league}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-20">Season:</span>
                        <span className="text-gray-900">{team.season}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-20">Coaches:</span>
                        <span className="text-gray-900">{team.coachIds.length + team.assistantCoachIds.length}</span>
                      </div>
                    </div>

                    {/* Kit Colors */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Kit Colors</h4>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: team.homeKit.primary }}
                          ></div>
                          <span className="text-xs text-gray-600">Home</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: team.awayKit.primary }}
                          ></div>
                          <span className="text-xs text-gray-600">Away</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href={`/match-tracker/teams/${team.id}`}
                        className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        View
                      </Link>
                      <Link
                        href={`/match-tracker/teams/${team.id}/edit`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteTeam(team.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        🗑️
                      </button>
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