import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabase';

interface Match {
  id: string;
  match_date: string;
  status: string;
  home_away: string;
  our_score: number;
  their_score: number;
  notes?: string;
  teams: { name: string };
  opponents: { name: string };
  venues: { name: string };
}

export default function Demo() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [seedStatus, setSeedStatus] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          match_date,
          status,
          home_away,
          our_score,
          their_score,
          notes,
          teams(name),
          opponents(name),
          venues(name)
        `)
        .order('match_date', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    setSeedStatus('Creating sample data...');
    try {
      const response = await fetch('/api/seed-data', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        setSeedStatus('Sample data created successfully!');
        fetchMatches(); // Refresh the matches
      } else {
        setSeedStatus(`Error: ${result.message}`);
      }
    } catch (error) {
      setSeedStatus('Failed to create sample data');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-primary-800 mb-6">
              🎉 Database Demo & Testing
            </h1>

            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-800">Database Successfully Set Up!</h3>
              </div>
              <p className="text-green-700 mb-4">
                Your football club database is now ready with all tables, relationships, and security policies in place.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-3 bg-white rounded">
                  <div className="font-semibold text-primary-600">Teams</div>
                  <div className="text-gray-600">Age groups & squads</div>
                </div>
                <div className="text-center p-3 bg-white rounded">
                  <div className="font-semibold text-primary-600">Matches</div>
                  <div className="text-gray-600">Fixtures & results</div>
                </div>
                <div className="text-center p-3 bg-white rounded">
                  <div className="font-semibold text-primary-600">Players</div>
                  <div className="text-gray-600">Profiles & stats</div>
                </div>
                <div className="text-center p-3 bg-white rounded">
                  <div className="font-semibold text-primary-600">Events</div>
                  <div className="text-gray-600">Training & social</div>
                </div>
              </div>
            </div>

            {/* Sample Data Creation */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Create Sample Data</h2>
              <p className="text-gray-600 mb-4">
                Add some sample teams, matches, and news to test the functionality.
              </p>
              <button 
                onClick={createSampleData}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
              >
                Generate Sample Data
              </button>
              {seedStatus && (
                <div className={`mt-4 p-3 rounded ${
                  seedStatus.includes('Error') ? 'bg-red-50 text-red-700' : 
                  seedStatus.includes('success') ? 'bg-green-50 text-green-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {seedStatus}
                </div>
              )}
            </div>

            {/* Matches Display */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Recent Matches</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading matches...</p>
                </div>
              ) : matches.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No matches found. Try creating sample data first!
                </div>
              ) : (
                <div className="grid gap-4">
                  {matches.map((match) => (
                    <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {match.teams.name} vs {match.opponents.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {formatDate(match.match_date)} • {match.venues.name} ({match.home_away})
                          </p>
                        </div>
                        <div className="text-right">
                          {match.status === 'finished' ? (
                            <div className="text-2xl font-bold text-primary-600">
                              {match.our_score} - {match.their_score}
                            </div>
                          ) : (
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              match.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              match.status === 'live' ? 'bg-green-100 text-green-800 animate-pulse' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                            </div>
                          )}
                        </div>
                      </div>
                      {match.notes && (
                        <p className="text-gray-700 text-sm mt-2 italic">"{match.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">🚀 What's Next?</h3>
              <div className="space-y-3 text-blue-700">
                <div>• <strong>Homepage:</strong> Go to <a href="/" className="underline">homepage</a> to see your new multi-audience landing page</div>
                <div>• <strong>Matches:</strong> Visit <a href="/app/matches" className="underline">/app/matches</a> to see the match management system</div>
                <div>• <strong>Kids Zone:</strong> Check out the fun kids section (coming soon!)</div>
                <div>• <strong>Admin Dashboard:</strong> Build out team management and player registration</div>
                <div>• <strong>Customize:</strong> Update colors, branding, and content to match your club</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}