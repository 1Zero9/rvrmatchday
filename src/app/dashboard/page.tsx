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
  minute: number | null;
  scorer: Player | null;
  assist: Player | null;
}

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Recent matches
      const { data: matchesData } = await supabase
        .from("matches")
        .select("id, date, home_away, our_score, their_score, opponents(name)")
        .order("date", { ascending: false })
        .limit(5);

      // 2. Players
      const { data: playersData } = await supabase
        .from("players")
        .select("id, name, position")
        .order("name");

      // 3. Goals (with scorer + assist)
      const { data: goalsData } = await supabase
        .from("goals")
        .select(
          `
            id,
            match_id,
            minute,
            scorer:players!goals_scorer_id_fkey(id, name, position),
            assist:players!goals_assist_id_fkey(id, name, position)
          `
        )
        .order("minute");

      setMatches(matchesData ?? []);
      setPlayers(playersData ?? []);
      setGoals((goalsData as any) ?? []); // cast to loosen type
      setLoading(false);
    };

    fetchData();
  }, []);

  // --- Stats calculations ---
  const wins = matches.filter(
    (m) => (m.our_score ?? 0) > (m.their_score ?? 0)
  ).length;
  const draws = matches.filter(
    (m) => (m.our_score ?? 0) === (m.their_score ?? 0)
  ).length;
  const losses = matches.filter(
    (m) => (m.our_score ?? 0) < (m.their_score ?? 0)
  ).length;
  const gf = matches.reduce((sum, m) => sum + (m.our_score ?? 0), 0);
  const ga = matches.reduce((sum, m) => sum + (m.their_score ?? 0), 0);
  const gd = gf - ga;

  const recentForm = matches
    .slice(0, 5)
    .map((m) =>
      (m.our_score ?? 0) > (m.their_score ?? 0)
        ? "✅"
        : (m.our_score ?? 0) === (m.their_score ?? 0)
        ? "➖"
        : "❌"
    )
    .join(" ");

  // --- Top Scorers ---
  const scorerCount: Record<string, number> = {};
  goals.forEach((g) => {
    if (g.scorer) {
      scorerCount[g.scorer.name] = (scorerCount[g.scorer.name] || 0) + 1;
    }
  });
  const topScorers = Object.entries(scorerCount).sort(
    (a, b) => b[1] - a[1]
  );

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Wins</p>
          <p className="text-xl font-bold text-green-600">{wins}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Draws</p>
          <p className="text-xl font-bold text-yellow-600">{draws}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Losses</p>
          <p className="text-xl font-bold text-red-600">{losses}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">GD</p>
          <p className="text-xl font-bold">{gd}</p>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Recent Matches</h2>
        <ul className="space-y-2">
          {matches.map((m) => {
            const opponent = m.opponents?.[0]?.name ?? "Unknown";
            const result =
              m.home_away === "Home"
                ? `RVR ${m.our_score ?? 0} - ${m.their_score ?? 0} ${opponent}`
                : `${opponent} ${m.their_score ?? 0} - ${m.our_score ?? 0} RVR`;

            return (
              <li
                key={m.id}
                className="border rounded p-2 cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  setExpanded(expanded === m.id ? null : m.id)
                }
              >
                <div className="flex justify-between">
                  <span>{result}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(m.date).toLocaleDateString()}
                  </span>
                </div>
                {expanded === m.id && (
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    {goals.filter((g) => g.match_id === m.id).length === 0 && (
                      <p>No goals recorded</p>
                    )}
                    {goals
                      .filter((g) => g.match_id === m.id)
                      .map((g) => (
                        <p key={g.id}>
                          ⚽ {g.minute ?? "?"}' {g.scorer?.name ?? "Unknown"}
                          {g.assist && (
                            <span className="text-gray-500">
                              {" "}
                              (Assist: {g.assist.name})
                            </span>
                          )}
                        </p>
                      ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Top Scorers */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Top Scorers</h2>
        {topScorers.length === 0 ? (
          <p className="text-sm text-gray-500">No goals recorded yet</p>
        ) : (
          <ul>
            {topScorers.map(([name, count]) => (
              <li key={name}>
                {name} — {count} goals
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Players */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Players</h2>
        <ul className="grid grid-cols-2 gap-2">
          {players.map((p) => (
            <li key={p.id} className="p-2 border rounded">
              <span className="font-medium">{p.name}</span>
              <br />
              <span className="text-sm text-gray-500">{p.position}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

