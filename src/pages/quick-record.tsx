import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import StandardLayout from "../components/StandardLayout";
import { supabase } from "../lib/supabase";
import { Team } from "../types/match-tracker";

export default function QuickRecord() {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Quick match form
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [opponent, setOpponent] = useState<string>('');
  const [venue, setVenue] = useState<string>('St. Finian\'s GAA');
  const [isHomeMatch, setIsHomeMatch] = useState<boolean>(true);
  const [matchType, setMatchType] = useState<string>('Friendly');
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select('*')
        .eq('is_active', true)
        .eq('is_opponent', false)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error loading teams:', error);
        return;
      }

      const loadedTeams: Team[] = teamsData?.map(team => ({
        id: team.id,
        name: team.name,
        ageGroup: team.age_group || 'Open',
        gender: team.gender || 'Mixed',
        season: team.season || '2024-25',
        league: team.league || 'Unassigned',
        homeVenue: team.home_venue || 'St. Finian\'s GAA',
        contactEmail: team.contact_email || '',
        contactPhone: team.contact_phone || '',
        coaches: Array.isArray(team.coaches) ? team.coaches : (team.coaches ? [team.coaches] : []),
        notes: team.notes || '',
        homeKit: { primary: '#009639', secondary: '#FFFFFF' },
        awayKit: { primary: '#FFFFFF', secondary: '#009639' },
        isOpponent: false,
        isActive: true,
        players: [],
        createdAt: new Date(team.created_at),
        updatedAt: new Date(team.updated_at || team.created_at)
      })) || [];

      setTeams(loadedTeams);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const recordQuickMatch = async () => {
    if (!selectedTeam || !opponent) {
      alert('Please select a team and enter opponent name');
      return;
    }

    setLoading(true);
    
    try {
      // Create match record in database
      const matchDate = new Date();
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .insert({
          team_id: selectedTeam,
          opponent: opponent,
          scheduled_date: matchDate.toISOString(),
          match_type: matchType,
          is_home_match: isHomeMatch,
          status: 'Finished',
          home_score: homeScore,
          away_score: awayScore,
          venue: venue,
          notes: notes,
        })
        .select()
        .single();

      if (matchError) {
        console.error('Error creating match:', matchError);
        alert('Error recording match. Please try again.');
        return;
      }

      alert(`Match recorded successfully!\n${teams.find(t => t.id === selectedTeam)?.name} vs ${opponent}: ${homeScore}-${awayScore}`);
      
      // Reset form
      setSelectedTeam('');
      setOpponent('');
      setHomeScore(0);
      setAwayScore(0);
      setNotes('');
      setVenue('St. Finian\'s GAA');
      setIsHomeMatch(true);
      setMatchType('Friendly');

    } catch (error) {
      console.error('Error recording quick match:', error);
      alert('Error recording match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                ← Back to Home
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              Quick Record Match
            </h1>
            <p className="text-sm text-gray-600 text-center mt-1">
              Record a match that already happened
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            
            {/* Team Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Team</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your team...</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
            </div>

            {/* Opponent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opponent</label>
              <input
                type="text"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                placeholder="Enter opponent team name..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Match Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Match Type</label>
                <select
                  value={matchType}
                  onChange={(e) => setMatchType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Friendly">Friendly</option>
                  <option value="League">League</option>
                  <option value="Cup">Cup</option>
                  <option value="Tournament">Tournament</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Home/Away</label>
                <select
                  value={isHomeMatch ? 'home' : 'away'}
                  onChange={(e) => setIsHomeMatch(e.target.value === 'home')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="home">Home</option>
                  <option value="away">Away</option>
                </select>
              </div>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Score */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Final Score</h3>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 mb-2">
                    {selectedTeam ? teams.find(t => t.id === selectedTeam)?.name || 'Your Team' : 'Your Team'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                      className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold"
                    >
                      -
                    </button>
                    <span className="text-4xl font-bold text-blue-600 w-16 text-center">
                      {isHomeMatch ? homeScore : awayScore}
                    </span>
                    <button
                      onClick={() => setHomeScore(homeScore + 1)}
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="text-2xl font-bold text-gray-400">-</div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 mb-2">{opponent || 'Opponent'}</div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                      className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold"
                    >
                      -
                    </button>
                    <span className="text-4xl font-bold text-red-600 w-16 text-center">
                      {isHomeMatch ? awayScore : homeScore}
                    </span>
                    <button
                      onClick={() => setAwayScore(awayScore + 1)}
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add match notes, scorers, highlights..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Record Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={recordQuickMatch}
              disabled={loading || !selectedTeam || !opponent}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-md transition-all"
            >
              {loading ? 'Recording...' : '✅ Record Match'}
            </motion.button>

            {/* View Results Link */}
            <div className="text-center">
              <button
                onClick={() => router.push('/match-central#results')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View Match Results →
              </button>
            </div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}