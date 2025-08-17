import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Match {
  id: string;
  date: string;
  home_away: string;
  notes: string | null;
  our_score: number;
  their_score: number;
  opponents: { name: string } | null;
  venues: { name: string } | null;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(
          `
          id,
          date,
          home_away,
          notes,
          our_score,
          their_score,
          opponents!matches_opponent_id_fkey ( name ),
          venues!matches_venue_id_fkey ( name )
        `
        )
        .order("date", { ascending: false });

      if (!error && data) {
        setMatches(data as Match[]);
      } else {
        console.error(error);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Matches</h1>
      {matches.length === 0 ? (
        <p>No matches recorded yet.</p>
      ) : (
        <ul className="space-y-4">
          {matches.map((m) => (
            <li
              key={m.id}
              className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between">
                <span className="font-semibold">{m.date}</span>
                <span className="text-gray-500">{m.home_away}</span>
              </div>
              <div className="mt-2">
                <p className="text-gray-700">
                  {m.our_score} - {m.their_score}
                </p>
                <p className="text-gray-600">
                  vs {m.opponents?.name || "Unknown"} @ {m.venues?.name || "TBD"}
                </p>
              </div>
              {m.notes && <p className="mt-2 text-sm text-gray-500">{m.notes}</p>}
              <div className="mt-3">
                <Link
                  href={`/app/matches/${m.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
