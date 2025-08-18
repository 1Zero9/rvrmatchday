import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Match {
  id: string;
  match_date: string;
  home_away: string;
  status: string;
  notes?: string;
  our_score: number;
  their_score: number;
  opponents: { name: string };
  venues: { name: string } | null;
  teams: { name: string };
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(`
          id, 
          match_date, 
          home_away, 
          status,
          notes, 
          our_score, 
          their_score, 
          opponents(name), 
          venues(name),
          teams(name)
        `)
        .order("match_date", { ascending: false });

      if (!error && data) {
        setMatches(data as Match[]);
      } else if (error) {
        console.error('Error fetching matches:', error);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Matches</h1>
      <div className="space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No matches found.</p>
            <Link href="/demo" className="text-blue-600 hover:underline">
              Create some sample data to get started
            </Link>
          </div>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">
                    {match.teams.name} vs {match.opponents.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {new Date(match.match_date).toLocaleDateString()} ({match.home_away})
                  </p>
                  {match.venues && <p className="text-gray-600 text-sm">📍 {match.venues.name}</p>}
                </div>
                <div className="text-right">
                  {match.status === 'finished' ? (
                    <div className="text-2xl font-bold text-primary-600">
                      {match.our_score} - {match.their_score}
                    </div>
                  ) : (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      match.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      match.status === 'live' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </div>
                  )}
                </div>
              </div>
              {match.notes && (
                <p className="text-gray-700 text-sm mt-2 italic bg-gray-50 p-2 rounded">
                  💬 {match.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
      <Link href="/app" className="block mt-4 text-blue-600 hover:underline">
        ← Back to App
      </Link>
    </div>
  );
}
