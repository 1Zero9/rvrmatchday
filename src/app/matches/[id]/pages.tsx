"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";

interface MatchDetail {
  id: string;
  date: string;
  home_away: "Home" | "Away";
  our_score: number;
  their_score: number;
  notes: string | null;
  opponents: { name: string }[];
  leagues?: { name: string }[];
  venues?: { name: string }[];
}

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      if (!params?.id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("matches")
        .select(
          `
          id,
          date,
          home_away,
          our_score,
          their_score,
          notes,
          opponents(name),
          leagues(name),
          venues(name)
        `
        )
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching match:", error);
      } else {
        setMatch(data);
      }

      setLoading(false);
    };

    fetchMatch();
  }, [params?.id]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!match) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h6">Match not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {match.opponents?.[0]?.name || "Unknown Opponent"}
        </Typography>

        <Typography variant="body1">
          Date: {new Date(match.date).toLocaleDateString()}
        </Typography>

        <Typography variant="body1">
          Location: {match.home_away}{" "}
          {match.venues?.[0]?.name ? `at ${match.venues[0].name}` : ""}
        </Typography>

        {match.leagues?.[0]?.name && (
          <Typography variant="body1">League: {match.leagues[0].name}</Typography>
        )}

        <Box sx={{ my: 2 }}>
          <Typography variant="h5">
            Score: {match.our_score} - {match.their_score}
          </Typography>
        </Box>

        {match.notes && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Notes: {match.notes}
          </Typography>
        )}

        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => router.push(`/matches/${match.id}/record`)} // ✅
          >
            Record Events
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.push("/matches")} // ✅
          >
            Back to Matches
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
