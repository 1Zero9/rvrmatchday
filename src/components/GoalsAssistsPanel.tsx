"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Player } from "@/types/match";
import {
  Paper,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

type Props = {
  matchId: string;
  players: Player[];
};

export default function GoalsAssistsPanel({ matchId, players }: Props) {
  const [minute, setMinute] = useState<number>(0);
  const [scorerId, setScorerId] = useState<string>("");
  const [assistId, setAssistId] = useState<string>("");

  const handleSubmit = async () => {
    if (!scorerId) return;
    const { error } = await supabase.from("goals").insert({
      match_id: matchId,
      minute,
      scorer_id: scorerId,
      assist_id: assistId || null,
    });
    if (error) console.error("Error saving goal:", error.message);
    setMinute(0);
    setScorerId("");
    setAssistId("");
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Record Goal
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Minute"
          type="number"
          value={minute}
          onChange={(e) => setMinute(parseInt(e.target.value))}
        />
        <TextField
          select
          label="Scorer"
          value={scorerId}
          onChange={(e) => setScorerId(e.target.value)}
        >
          {players.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              #{p.shirt} {p.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Assist (optional)"
          value={assistId}
          onChange={(e) => setAssistId(e.target.value)}
        >
          <MenuItem value="">None</MenuItem>
          {players.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              #{p.shirt} {p.name}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleSubmit}>
          Save Goal
        </Button>
      </Stack>
    </Paper>
  );
}
