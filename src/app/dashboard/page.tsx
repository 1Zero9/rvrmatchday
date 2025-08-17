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
  match_id: string;
  minute: number;
  scorer: Player | null;
  assist: Player | null;
}

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Matches
      const { data: matchesData, error: matchesError } = await supabase
        .from("matches")
        .select("id, date, home_away, our_score, their_score, opponents(name)")
        .order("date", { ascending: false });

      if (matchesError) console.error("Error fetching matches:", matchesError);

      // 2. Players
      const { data: playersData, error: playersError } = await supabase
        .from("players")
        .select("id, name, position")
        .order("name");

      if (playersError) console.error("Error fetching players:", playersError);

      // 3. Goals with scorer + assist
      const { data: goalsData, error: goalsError } = await supabase
        .from("goals")
        .select("id, match_id, minute, scorer:players(id,name), assist:players(id,name)")
        .order("minute");

      if (goalsError) console.error("Error fetching goals:", goalsError);

      setMatches(matchesData || []);
      setPlayers(playersData || []);
      setGoals(goalsData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  // --- Season stats ---
  let wins = 0,
    draws = 0,
    losses = 0,
    goalsFor = 0,
    goalsAgainst = 0;

  matches.forEach((m) => {
    const us = m.our_score ?? 0;
    const them = m.their_score ?? 0;

    goalsFor += us;
    goalsAgainst += them;

    if (us > them) wins++;
    else if (us === them) draws++;
    else losses++;
  });

  const goalDiff = goalsFor - goalsAgainst;

  // --- Top scorers ---
  const scorerCounts: Record<string, number> = {};
  goals.forEach((g) => {
    if (g.scorer?.id) {
      scorerCounts[g.scorer.id] = (scorerCounts[g.scorer.id] || 0) + 1;
    }
  });

  const topScorers = players
    .map((p) => ({
      ...p,
      goals: scorerCounts[p.id] || 0,
    }))
    .filter((p) => p.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);

  // --- Recent form strip (last 5) ---
  const recentForm = matches.slice(0, 5).map((m) => {
    const us = m.our_score ?? 0;
    const them = m.their_score ?? 0;
    if (us > them) return "✅";
    if (us === them) return "➖";
    return "❌";
  });

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Season Stats Overview */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-wrap gap-6">
        <div>
          <p className="font-semibold">Wins</p>
          <p>{wins}</p>
        </div>
        <div>
          <p className="font-semibold">Draws</p>
          <p>{draws}</p>
        </div>
        <div>
          <p className="font-semibold">Losses</p>
          <p>{losses}</p>
        </div>
        <div>
          <p className="font-semibold">GF</p>
          <p>{goalsFor}</p>
        </div>
        <div>
          <p className="font-semibold">GA</p>
          <p>{goalsAgainst}</p>
        </div>
        <div>
          <p className="font-semibold">GD</p>
          <p>{goalDiff}</p>
        </div>
        <div>
          <p className="font-semibold">Form</p>
          <p>{recentForm.join(" ") || "-"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Matches */}
        <div className="bg-white shadow rounded-lg p-4 col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent Matches</h2>
          <ul className="space-y-3">
            {matches.slice(0, 5).map((m) => {
              const us = m.our_score ?? 0;
              const them = m.their_score ?? 0;
              const result = us > them ? "win" : us === them ? "draw" : "loss";

              const matchGoals = goals.filter((g) => g.match_id === m.id);

              return (
                <li key={m.id}>
                  {/* Match header */}
                  <div
                    className="flex justify-between items-center cursor-pointer border rounded-lg px-3 py-2 hover:bg-gray-50"
                    onClick={() =>
                      setExpandedMatch(expandedMatch === m.id ? null : m.id)
                    }
                  >
                    <span className="font-medium">
                      {m.home_away === "Home"
                        ? `RVR ${us} - ${them} ${m.opponents?.[0]?.name}`
                        : `${m.opponents?.[0]?.name} ${them} - ${us} RVR`}
                    </span>
                    <span>
                      {result === "win" && "✅"}
                      {result === "draw" && "➖"}
                      {result === "loss" && "❌"}
                    </span>
                  </div>

                  {/* Expanded details */}
                  {expandedMatch === m.id && (
                    <div className="mt-2 ml-3 text-sm text-gray-600 space-y-2">
                      <p>Date: {new Date(m.date).toLocaleDateString()}</p>
                      <p>Home/Away: {m.home_away}</p>
                      <div>
                        <p className="font-semibold">Goals</p>
                        {matchGoals.length > 0 ? (
                          <ul className="list-disc ml-5">
                            {matchGoals.map((g) => (
                              <li key={g.id}>
                                {`${g.minute}' - ${g.scorer?.name || "Unknown"}`}
                                {g.assist && (
                                  <span className="text-gray-500">
                                    {" "}
                                    (Assist: {g.assist.name})
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>No goals recorded</p>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
            {matches.length === 0 && (
              <li className="text-sm text-gray-500">No matches yet</li>
            )}
          </ul>
        </div>

        {/* Top Scorers */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Top Scorers</h2>
          <ul className="space-y-2">
            {topScorers.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.name}</span>
                <span className="font-medium">{p.goals}</span>
              </li>
            ))}
            {topScorers.length === 0 && (
              <li className="text-sm text-gray-500">No goals recorded yet</li>
            )}
          </ul>
        </div>
      </div>

      {/* Players */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Players</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {players.map((p) => (
            <li
              key={p.id}
              className="flex justify-between border-b pb-1 text-sm"
            >
              <span>{p.name}</span>
              <span className="text-gray-500">{p.position}</span>
            </li>
          ))}
          {players.length === 0 && (
            <li className="text-sm text-gray-500">No players yet</li>
          )}
        </ul>
      </div>
    </div>
  );
}
