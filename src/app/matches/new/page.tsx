"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";

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
      router.push(`/app/matches/${data.id}/record`);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Match
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Date"
          type="date"
          fullWidth
          required
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="opponent-label">Opponent</InputLabel>
          <Select
            labelId="opponent-label"
            value={opponentId}
            onChange={(e) => setOpponentId(e.target.value)}
            required
          >
            {opponents.map((opp) => (
              <MenuItem key={opp.id} value={opp.id}>
                {opp.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="homeaway-label">Home / Away</InputLabel>
          <Select
            labelId="homeaway-label"
            value={homeAway}
            onChange={(e) => setHomeAway(e.target.value)}
            required
          >
            <MenuItem value="Home">Home</MenuItem>
            <MenuItem value="Away">Away</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 3 }}>
          <Button type="submit" variant="contained" disabled={loading || !teamId} fullWidth>
            {loading ? "Creating..." : "Create Match"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
