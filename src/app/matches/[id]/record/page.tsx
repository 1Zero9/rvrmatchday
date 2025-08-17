// src/app/record-match/[id]/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Match, GoalEvent, Player } from "@/types/match";
import GoalsAssistsPanel from "@/components/GoalsAssistsPanel";

export default function RecordMatchPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params?.id as string;

  const [match, setMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<GoalEvent[]>([]);
  const [score, setScore] = useState({ us: 0, them: 0 });
  const eventsEndRef = useRef<HTMLDivElement>(null);

  // --- Update score helper
  const updateScore = useCallback(
    (goals: GoalEvent[]) => {
      let us = 0;
      let them = 0;

      goals.forEach((g) => {
        if (g.team_id === match?.team_id) us += 1;
        else them += 1;
      });

      setScore({ us, them });
    },
    [match?.team_id]
  );

  // Fetch match, players, and goals
  useEffect(() => {
    if (!matchId) return;

    const fetchData = async () => {
      // 1. Fetch match
      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .select("*, opponents(name)")
        .eq("id", matchId)
        .single();

      if (matchError) {
        console.error("Error fetching match:", matchError);
        return;
      }
      setMatch(matchData);

      // 2. Fetch players
      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select("*")
        .eq("team_id", matchData.team_id);

      if (playerError) {
        console.error("Error fetching players:", playerError);
      } else {
        setPlayers(playerData || []);
      }

      // 3. Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from("goals")
        .select("*, scorer:players(*), assist:players(*)")
        .eq("match_id", matchId)
        .order("minute");

      if (goalsError) {
        console.error("Error fetching goals:", goalsError);
      } else {
        setEvents(goalsData || []);
        updateScore(goalsData || []);
      }
    };

    fetchData();
  }, [matchId, updateScore]);

  // Subscribe to realtime goals
  useEffect(() => {
    if (!matchId) return;

    const channel = supabase
      .channel("goals-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "goals",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newGoal = payload.new as GoalEvent;
          setEvents((prev) => {
            const updated = [...prev, newGoal];
            updateScore(updated);
            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, match?.team_id, updateScore]);

  // Auto-scroll events log
  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  if (!match) {
    return <div className="text-center mt-10">Loading match...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Scoreboard */}
      <div className="bg-blue-900 text-white p-4 text-center rounded-lg">
        <h2 className="text-xl font-semibold">
          {match.home_away === "Home"
            ? `Us ${score.us} - ${score.them} ${match.opponents?.[0]?.name}`
            : `${match.opponents?.[0]?.name} ${score.them} - ${score.us} Us`}
        </h2>
      </div>

      {/* Goal/Assist Input Panel */}
      <GoalsAssistsPanel matchId={matchId} players={players} />

      {/* Events Log */}
      <div className="bg-white shadow rounded-lg p-4 max-h-72 overflow-auto">
        <h3 className="text-lg font-semibold mb-2">Events Log</h3>
        <ul className="space-y-2">
          {events.map((event, idx) => (
            <li key={idx} className="border-b pb-1">
              <span className="font-medium">
                {event.minute}' Goal: {event.scorer?.name}
              </span>
              {event.assist && (
                <span className="text-sm text-gray-500 ml-2">
                  (Assist: {event.assist.name})
                </span>
              )}
            </li>
          ))}
          <div ref={eventsEndRef} />
        </ul>
      </div>

      {/* Back button */}
      <button
        onClick={() => router.push(`/matches/${matchId}`)}
        className="px-4 py-2 border rounded-lg hover:bg-gray-100"
      >
        Back to Match
      </button>
    </div>
  );
}
