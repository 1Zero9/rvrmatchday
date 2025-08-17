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
  venue?: { name: string };
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(
          `id, date, home_away, notes, our_score, their_score,
           opponents(name), venues(name)`
        )
        .order("date", { ascending: false });

      if (!error && data) {
        // map Supabase’s array result to single objects
        const mapped = data.map((m: any) => ({
          id: m.id,
          date: m.date,
          home_away: m.home_away,
          notes: m.notes,
          our_score: m.our_score,
          their_score: m.their_score,
          opponent: m.opponents?.[0] || { name: "Unknown" },
          venue: m.venues?.[0] || null,
        }));
        setMatches(mapped as Match[]);
      } else {
        console.error(error);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Matches</h1>
      <ul className="space-y-3">
        {matches.map((match) => (
          <li key={match.id} className="border p-4 rounded">
            <p className="font-semibold">
              {match.date} – {match.home_away}
            </p>
            <p>
              Score: {match.our_score} - {match.their_score}
            </p>
            <p>Opponent: {match.opponent?.name}</p>
            {match.venue && <p>Venue: {match.venue.name}</p>}
            {match.notes && <p className="text-sm text-gray-600">{match.notes}</p>}
            <Link href={`/app/matches/${match.id}`} className="text-blue-600">
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
