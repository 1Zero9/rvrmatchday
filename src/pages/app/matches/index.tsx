import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Match {
  id: string;
  date: string;
  home_away: string;
  notes?: string;
  our_score: number;
  their_score: number;
  opponent: { name: string };
  venue: { name: string } | null;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("id, date, home_away, notes, our_score, their_score, opponents(name), venues(name)")
        .order("date", { ascending: false });

      if (!error && data) {
        const mapped: Match[] = (data as Record<string, unknown>[]).map((m) => ({
          id: m["id"] as string,
          date: m["date"] as string,
          home_away: m["home_away"] as string,
          notes: m["notes"] as string | undefined,
          our_score: m["our_score"] as number,
          their_score: m["their_score"] as number,
          opponent: (m["opponents"] as { name: string }[] | null)?.[0] || { name: "Unknown" },
          venue: (m["venues"] as { name: string }[] | null)?.[0] || null,
        }));
        setMatches(mapped);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Matches</h1>
      <ul className="space-y-2">
        {matches.map((match) => (
          <li key={match.id} className="border p-3 rounded">
            <p>
              <strong>{match.date}</strong> – {match.opponent.name} ({match.home_away})
            </p>
            <p>
              Score: {match.our_score} – {match.their_score}
            </p>
            {match.venue && <p>Venue: {match.venue.name}</p>}
            {match.notes && <p className="text-gray-600">Notes: {match.notes}</p>}
          </li>
        ))}
      </ul>
      <Link href="/app" className="block mt-4 text-blue-600 hover:underline">
        ← Back to App
      </Link>
    </div>
  );
}
