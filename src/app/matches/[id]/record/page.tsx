"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Match, GoalEvent, Player } from "@/types/match";
import GoalsAssistsPanel from "@/components/GoalsAssistsPanel";
import {
  Paper,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  Slide,
} from "@mui/material";
import { keyframes } from "@emotion/react";

// --- Animations ---
const flashGreen = keyframes`
  0% { background-color: #003366; }
  30% { background-color: #228B22; }
  100% { background-color: #003366; }
`;

const flashRed = keyframes`
  0% { background-color: #003366; }
  30% { background-color: #B22222; }
  100% { background-color: #003366; }
`;

export default function RecordMatchPage() {
  const params = useParams();
  const matchId = params?.id as string;

  const [match, setMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<GoalEvent[]>([]);
  const [score, setScore] = useState({ us: 0, them: 0 });
  const [flash, setFlash] = useState<"green" | "red" | null>(null);
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
          triggerFlash(newGoal.team_id === match?.team_id ? "green" : "red");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, match?.team_id, updateScore]);

  // Trigger flash animation
  const triggerFlash = (color: "green" | "red") => {
    setFlash(color);
    setTimeout(() => setFlash(null), 1000);
  };

  // Auto-scroll events log
  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  if (!match) {
    return (
      <Typography variant="h6" sx={{ mt: 4, textAlign: "center" }}>
        Loading match...
      </Typography>
    );
  }

  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      {/* Scoreboard */}
      <Paper
        sx={{
          p: 2,
          textAlign: "center",
          backgroundColor: "#003366",
          color: "white",
          animation:
            flash === "green"
              ? `${flashGreen} 1s ease`
              : flash === "red"
              ? `${flashRed} 1s ease`
              : "none",
        }}
      >
        <Typography variant="h5">
          {match.home_away === "Home"
            ? `Us ${score.us} - ${score.them} ${match.opponents?.name}`
            : `${match.opponents?.name} ${score.them} - ${score.us} Us`}
        </Typography>
      </Paper>

      {/* Goal/Assist Input Panel */}
      <GoalsAssistsPanel matchId={matchId} players={players} />

      {/* Events Log */}
      <Paper sx={{ p: 2, maxHeight: 300, overflow: "auto" }}>
        <Typography variant="h6">Events Log</Typography>
        <List>
          {events.map((event, idx) => (
            <Slide key={idx} direction="up" in mountOnEnter unmountOnExit>
              <ListItem>
                <ListItemText
                  primary={`${event.minute}' Goal: ${event.scorer?.name}`}
                  secondary={event.assist ? `Assist: ${event.assist.name}` : ""}
                />
              </ListItem>
            </Slide>
          ))}
          <div ref={eventsEndRef} />
        </List>
      </Paper>
    </Stack>
  );
}
