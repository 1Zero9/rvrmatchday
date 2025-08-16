"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  ListItemButton,
} from "@mui/material";

interface MatchRow {
  id: string;
  date: string;
  home_away: "Home" | "Away";
  our_score: number;
  their_score: number;
  opponents: { name: string }[]; // Supabase returns arrays
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user's team_id and matches
  useEffect(() => {
    const fetchTeamAndMatches = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Error fetching user:", userError);
        setLoading(false);
        return;
      }

      // Get team_id from profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("team_id")
        .eq("id", user.id)
        .single();

      if (profileError || !profile?.team_id) {
        console.error("Error fetching profile/team_id:", profileError);
        setLoading(false);
        return;
      }

      // Get matches for this team
      const { data, error } = await supabase
        .from("matches")
        .select("id, date, home_away, our_score, their_score, opponents(name)")
        .eq("team_id", profile.team_id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching matches:", error);
      } else {
        setMatches(data || []);
      }

      setLoading(false);
    };

    fetchTeamAndMatches();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Matches</Typography>
        {/* ✅ Fixed path */}
        <Button variant="contained" onClick={() => router.push("/matches/new")}>
          New Match
        </Button>
      </Box>

      {matches.length === 0 ? (
        <Typography>No matches yet.</Typography>
      ) : (
        <List>
          {matches.map((match) => (
            <ListItem
              key={match.id}
              disablePadding
              sx={{ borderBottom: "1px solid #eee" }}
            >
              {/* ✅ Fixed path */}
              <ListItemButton onClick={() => router.push(`/matches/${match.id}`)}>
                <ListItemText
                  primary={`${match.date} vs ${match.opponents?.[0]?.name || "Unknown"} (${match.home_away})`}
                  secondary={`Score: ${match.our_score} - ${match.their_score}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}
