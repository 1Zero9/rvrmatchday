"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Match, GoalEvent, Player } from "@/types/match";
import GoalsAssistsPanel from "@/components/GoalsAssistsPanel";
import { Paper, Typography, Stack, List, ListItem, ListItemText, Slide } from "@mui/material";
import { keyframes } from "@emotion/react";
import GoalsAssistsPanel from "@/components/GoalsAssistsPanel";
import { mockPlayers } from "@/lib/mockData";

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
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<GoalEvent[]>([]);
  const [flash, setFlash] = useState<"none" | "green" | "red">("none");
  const lastScores = useRef<{ our: number; their: number }>({ our: 0, their: 0 });

  // load match + players
  useEffect(() => {
    const loadData = async () => {
      const { data: match } = await supabase
        .from("matches")
        .select("*, opponents(name)")
        .order("date", { ascending: false })
        .limit(1)
        .single();
      setCurrentMatch(match);

      if (match) {
        const { data: pls } = await supabase
          .from("players")
          .select("*")
          .eq("team_id", match.team_id)
          .order("shirt");
        setPlayers(pls || []);

        const { data: evts } = await supabase
          .from("goals")
          .select("*, scorer:players!scorer_id(name), assist:players!assist_id(name)")
          .eq("match_id", match.id)
          .order("minute");
        setEvents(evts || []);
      }
    };

    loadData();

    // realtime goals
    const sub = supabase
      .channel("goals-stream")
      .on("postgres_changes", { event: "*", schema: "public", table: "goals" }, (payload) => {
        console.log("Realtime goal change:", payload);
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  // flash animation when score changes
  useEffect(() => {
    if (!currentMatch) return;

    if (currentMatch.our_score > lastScores.current.our) {
      setFlash("green");
    } else if (currentMatch.their_score > lastScores.current.their) {
      setFlash("red");
    }

    lastScores.current = {
      our: currentMatch.our_score,
      their: currentMatch.their_score,
    };

    const t = setTimeout(() => setFlash("none"), 1000);
    return () => clearTimeout(t);
  }, [currentMatch]);

  if (!currentMatch) return <Typography>Loading match...</Typography>;

  return (
    <Stack spacing={3}>
      {/* Scoreboard */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          textAlign: "center",
          background: "#003366",
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
          Score: Us {currentMatch.our_score} - {currentMatch.their_score} {currentMatch.opponents?.name}
        </Typography>
      </Paper>

      {/* Events log */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Match Events</Typography>
        <List>
          {events.map((ev, i) => (
            <Slide
              key={ev.id}
              direction="up"
              in
              mountOnEnter
              unmountOnExit
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <ListItem>
                <ListItemText
                  primary={`⚽ ${ev.minute}' ${ev.scorer?.name}`}
                  secondary={ev.assist ? `Assist: ${ev.assist.name}` : undefined}
                />
              </ListItem>
            </Slide>
          ))}
        </List>
      </Paper>

      {/* Input panel */}
      <GoalsAssistsPanel matchId={currentMatch.id} players={players} />
    </Stack>
  );
}
