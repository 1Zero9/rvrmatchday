import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import StandardLayout from "../../components/StandardLayout";
import { storage } from "../../lib/match-tracker-storage";
import { Match, MatchType, Team } from "../../types/match-tracker";

export default function NewMatch() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [formData, setFormData] = useState({
    teamId: '',
    opponent: '',
    matchType: 'League' as MatchType,
    isHomeMatch: true,
    venue: '',
    scheduledDate: '',
    scheduledTime: '',
    referee: '',
    weather: '',
    temperature: '',
    pitchCondition: 'Good' as 'Excellent' | 'Good' | 'Fair' | 'Poor'
  });

  // Load teams on component mount
  React.useEffect(() => {
    const loadedTeams = storage.getTeams();
    setTeams(loadedTeams);
    
    // Pre-select first team if available
    if (loadedTeams.length > 0 && !formData.teamId) {
      setFormData(prev => ({ ...prev, teamId: loadedTeams[0].id }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Combine date and time
      const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);

      const match: Match = {
        id: `match-${Date.now()}`,
        teamId: formData.teamId,
        opponent: formData.opponent,
        matchType: formData.matchType,
        isHomeMatch: formData.isHomeMatch,
        venue: formData.venue || (formData.isHomeMatch ? 'Home Ground' : 'Away Ground'),
        scheduledDate: scheduledDateTime,
        status: 'Scheduled',
        referee: formData.referee || undefined,
        weather: formData.weather || undefined,
        temperature: formData.temperature ? parseInt(formData.temperature) : undefined,
        pitchCond: formData.pitchCondition,
        recordedBy: 'admin-1', // TODO: Use actual logged-in user
        createdAt: new Date(),
        updatedAt: new Date()
      };

      storage.saveMatch(match);
      
      // Redirect to match recording interface
      router.push(`/matches/${match.id}/record`);
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Error creating match. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <StandardLayout title="New Match">
      <div className="min-h-screen bg-gray-50">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Create New Match</h1>
                <p className="text-green-100 mt-1">Set up a match for tracking</p>
              </div>
              <Link
                href="/match-central#tracker"
                className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
              >
                ← Back
              </Link>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
            
            {/* Match Details */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Match Details</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team *
                  </label>
                  <select
                    required
                    value={formData.teamId}
                    onChange={(e) => updateFormData('teamId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select Team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opponent *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.opponent}
                    onChange={(e) => updateFormData('opponent', e.target.value)}
                    placeholder="e.g., Greenfield FC"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Match Type *
                  </label>
                  <select
                    required
                    value={formData.matchType}
                    onChange={(e) => updateFormData('matchType', e.target.value as MatchType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="League">League</option>
                    <option value="Cup">Cup</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Tournament">Tournament</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Type *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.isHomeMatch}
                        onChange={() => updateFormData('isHomeMatch', true)}
                        className="mr-2"
                      />
                      Home
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!formData.isHomeMatch}
                        onChange={() => updateFormData('isHomeMatch', false)}
                        className="mr-2"
                      />
                      Away
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => updateFormData('venue', e.target.value)}
                  placeholder={formData.isHomeMatch ? "Home Ground" : "Away Ground"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Schedule */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => updateFormData('scheduledDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kick-off Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.scheduledTime}
                    onChange={(e) => updateFormData('scheduledTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Match Conditions */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Match Conditions</h2>
              
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referee
                  </label>
                  <input
                    type="text"
                    value={formData.referee}
                    onChange={(e) => updateFormData('referee', e.target.value)}
                    placeholder="Referee name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weather
                  </label>
                  <input
                    type="text"
                    value={formData.weather}
                    onChange={(e) => updateFormData('weather', e.target.value)}
                    placeholder="e.g., Sunny, Rainy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => updateFormData('temperature', e.target.value)}
                    placeholder="e.g., 18"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pitch Condition *
                </label>
                <select
                  required
                  value={formData.pitchCondition}
                  onChange={(e) => updateFormData('pitchCondition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 max-w-md"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving || !formData.teamId || !formData.opponent}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  saving || !formData.teamId || !formData.opponent
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {saving ? 'Creating Match...' : 'Create & Start Recording'}
              </button>
              <Link
                href="/match-central#tracker"
                className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </StandardLayout>
  );
}