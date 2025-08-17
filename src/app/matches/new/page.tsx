"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Opponent {
  id: string;
  name: string;
}

export default function NewMatchPage() {
  const router = useRouter();
  const [opponents, setOpponents] = useState<Opponent[]>([]);
  const [date, setDate] = useState("");
  const [opponentId, setOpponentId] = useState("");
  const [homeAway, setHomeAway] = useState("Home");
  const [loading, setLoading] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);

  // Fetch opponents
  useEffect(() => {
    const fetchOpponents = async () => {
      const { data, error } = await supabase
        .from("opponents")
        .select("id, name")
        .order("name");

      if (error) console.error("Error fetching opponents:", error);
      else setOpponents(data || []);
    };
    fetchOpponents();
  }, []);

  // Fetch team_id for logged-in user
  useEffect(() => {
    const fetchTeam = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Error getting user:", userError);
        return;
      }
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("team_id")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setTeamId(data?.team_id || null);
      }
    };

    fetchTeam();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) {
      alert("No team linked to your profile!");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("matches")
      .insert([
        {
          team_id: teamId,
          date,
          opponent_id: opponentId,
          home_away: homeAway,
        },
      ])
      .select("id")
      .single();

    setLoading(false);

    if (error) {
      console.error("Error inserting match:", error);
      alert("Failed to create match");
    } else {
      router.push(`/matches/${data.id}/record`);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create New Match</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Opponent */}
        <div>
          <label className="block text-sm font-medium mb-1">Opponent</label>
          <select
            value={opponentId}
            onChange={(e) => setOpponentId(e.target.value)}
            required
            className="w-full border rounded p-2"
          >
            <option value="">Select opponent...</option>
            {opponents.map((opp) => (
              <option key={opp.id} value={opp.id}>
                {opp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Home/Away */}
        <div>
          <label className="block text-sm font-medium mb-1">Home / Away</label>
          <select
            value={homeAway}
            onChange={(e) => setHomeAway(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="Home">Home</option>
            <option value="Away">Away</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !teamId}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Match"}
        </button>
      </form>
    </div>
  );
}
