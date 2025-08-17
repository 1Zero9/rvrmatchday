import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Match {
  id: string;
  date: string;
  home_away: string;
  notes: string | null;
  opponents: { name: string } | null;
  venues: { name: string } | null;
  our_score: number;
  their_score: number;
}

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("id, date, home_away, notes, our_score, their_score, opponents(name), venues(name)")
        .order("date", { ascending: false });
      if (!error && data) setMatches(data as Match[]);
    };
    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Matches</h1>
        <Link
          href="/app/matches/new"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600"
        >
          ➕ Record New Match
        </Link>
      </div>

      {matches.length === 0 ? (
        <p>No matches yet</p>
      ) : (
        <ul className="space-y-3">
          {matches.map((m) => (
            <li key={m.id} className="bg-white p-4 rounded-lg shadow flex justify-between">
              <div>
                <p className="font-semibold">{m.date} · {m.home_away}</p>
                <p className="text-gray-600">
                  vs {m.opponents?.name} @ {m.venues?.name || "TBD"}
                </p>
                {m.notes && <p className="text-sm text-gray-500">{m.notes}</p>}
              </div>
              <div className="text-right font-bold text-lg">
                {m.our_score} – {m.their_score}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
