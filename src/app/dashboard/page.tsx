"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Match {
  id: string;
  date: string;
  home_away: string;
  our_score: number | null;
  their_score: number | null;
  opponents: { name: string }[];
}

interface Player {
  id: string;
  name: string;
  position: string;
}

interface Goal {
  id: string;
  scorer_id: string | null;
  assist_id: string | null;
}

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Recent matches
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select("id, date, home_away, our_score, their_score, opponents(name)")
        .order("date", { ascending: false })
        .limit(5);

      if (matchesError) console.error("Error fetching matches:", matchesError);

      // 2. Players
      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .select("id, name, position")
        .order("name");

      if (playersError) console.error("Error fetching players:", playersError);

      // 3. Goals
      const { data: goalsData, error: goalsError } = await supabase
        .from("goals")
        .select("id, scorer_id, assist_id");

      if (goalsError) console.error("Error fetching goals:", goalsError);

      setMatches(matchesData || []);
      setPlayers(playersData || []);
      setGoals(goalsData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  // --- Stats calculations ---
  const totalGoals = goals.length;
  const totalAssists = goals.filter((g) => g.assist_id).length;

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Matches */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Recent Matches</h2>
          <ul className="space-y-2">
            {matches.map((m) => (
              <li key={m.id} className="flex flex-col">
                <span className="font-medium">
                  {m.home_away === "Home"
                    ? `RVR ${m.our_score ?? 0} - ${m.their_score ?? 0} ${m.opponents?.[0]?.name}`
                    : `${m.opponents?.[0]?.name} ${m.their_score ?? 0} - ${m.our_score ?? 0} RVR`}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(m.date).toLocaleDateString()}
                </span>
              </li>
            ))}
            {matches.length === 0 && (
              <li className="text-sm text-gray-500">No matches yet</li>
            )}
          </ul>
        </div>

        {/* Players */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Players</h2>
          <ul className="space-y-2">
            {players.map((p) => (
              <li key={p.id} className="flex flex-col">
                <span className="font-medium">{p.name}</span>
                <span className="text-sm text-gray-500">{p.position}</span>
              </li>
            ))}
            {players.length === 0 && (
              <li className="text-sm text-gray-500">No players yet</li>
            )}
          </ul>
        </div>

        {/* Stats */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Stats</h2>
          <p>Goals: {totalGoals}</p>
          <p>Assists: {totalAssists}</p>
        </div>
      </div>
    </div>
  );
}
