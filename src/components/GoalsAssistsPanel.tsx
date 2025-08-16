"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Player } from "@/types/match";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

interface Props {
  matchId: string;
  players: Player[];
}

export default function GoalsAssistsPanel({ matchId, players }: Props) {
  const [scorerId, setScorerId] = useState("");
  const [assistId, setAssistId] = useState("");
  const [minute, setMinute] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("goals").insert([
      {
        match_id: matchId,
        player_id: scorerId,
        assist_id: assistId || null,
        minute: Number(minute),
        team_id: players.find((p) => p.id === scorerId)?.team_id, // ✅ set automatically
      },
    ]);

    if (error) {
      console.error("Error inserting goal:", error);
    } else {
      setScorerId("");
      setAssistId("");
      setMinute("");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Record Goal
      </Typography>

      {/* Scorer */}
      <TextField
        select
        label="Scorer"
        value={scorerId}
        onChange={(e) => setScorerId(e.target.value)}
        fullWidth
        required
        margin="normal"
      >
        {players.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.number ? `#${p.number} ` : ""}{p.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Assist */}
      <TextField
        select
        label="Assist (optional)"
        value={assistId}
        onChange={(e) => setAssistId(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="">None</MenuItem>
        {players.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.number ? `#${p.number} ` : ""}{p.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Minute */}
      <TextField
        label="Minute"
        type="number"
        value={minute}
        onChange={(e) => setMinute(e.target.value)}
        fullWidth
        required
        margin="normal"
      />

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Add Goal
      </Button>
    </Box>
  );
}
