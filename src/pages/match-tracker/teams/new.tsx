import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import StandardLayout from "../../../components/StandardLayout";
import { storage } from "../../../lib/match-tracker-storage";
import { Team, AgeGroup } from "../../../types/match-tracker";

export default function NewTeam() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    ageGroup: 'U12' as AgeGroup,
    gender: 'Boys' as 'Boys' | 'Girls' | 'Mixed',
    league: '',
    season: '2024-25',
    homeKitPrimary: '#00A651',
    homeKitSecondary: '#FFFFFF',
    awayKitPrimary: '#001F3F',
    awayKitSecondary: '#FFFFFF'
  });

  const ageGroups: AgeGroup[] = ['U12', 'U13', 'U14', 'U15', 'U16', 'U17', 'U18', 'Senior'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const team: Team = {
        id: `team-${Date.now()}`,
        name: formData.name,
        ageGroup: formData.ageGroup,
        gender: formData.gender,
        coachIds: [],
        assistantCoachIds: [],
        season: formData.season,
        league: formData.league,
        homeKit: {
          primary: formData.homeKitPrimary,
          secondary: formData.homeKitSecondary
        },
        awayKit: {
          primary: formData.awayKitPrimary,
          secondary: formData.awayKitSecondary
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      storage.saveTeam(team);
      router.push('/match-tracker/teams');
    } catch (error) {
      console.error('Error saving team:', error);
      alert('Error saving team. Please try again.');
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
    <StandardLayout title="Add New Team">
      <div className="min-h-screen bg-gray-50">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Team</h1>
                <p className="text-gray-600 mt-1">Create a new team for match tracking (U12+)</p>
              </div>
              <Link
                href="/match-tracker/teams"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                ← Cancel
              </Link>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="e.g., RVR U12 Boys"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Group *
                  </label>
                  <select
                    required
                    value={formData.ageGroup}
                    onChange={(e) => updateFormData('ageGroup', e.target.value as AgeGroup)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {ageGroups.map(age => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => updateFormData('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Season *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.season}
                    onChange={(e) => updateFormData('season', e.target.value)}
                    placeholder="e.g., 2024-25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  League *
                </label>
                <input
                  type="text"
                  required
                  value={formData.league}
                  onChange={(e) => updateFormData('league', e.target.value)}
                  placeholder="e.g., Dublin & District Schoolboys League U12"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Kit Colors */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kit Colors</h2>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Home Kit</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={formData.homeKitPrimary}
                          onChange={(e) => updateFormData('homeKitPrimary', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.homeKitPrimary}
                          onChange={(e) => updateFormData('homeKitPrimary', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Secondary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={formData.homeKitSecondary}
                          onChange={(e) => updateFormData('homeKitSecondary', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.homeKitSecondary}
                          onChange={(e) => updateFormData('homeKitSecondary', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Away Kit</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Primary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={formData.awayKitPrimary}
                          onChange={(e) => updateFormData('awayKitPrimary', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.awayKitPrimary}
                          onChange={(e) => updateFormData('awayKitPrimary', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Secondary Color</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={formData.awayKitSecondary}
                          onChange={(e) => updateFormData('awayKitSecondary', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.awayKitSecondary}
                          onChange={(e) => updateFormData('awayKitSecondary', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  saving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {saving ? 'Creating Team...' : 'Create Team'}
              </button>
              <Link
                href="/match-tracker/teams"
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