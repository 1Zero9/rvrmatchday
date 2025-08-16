"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ classic Grid import
import Link from "next/link";
import { Match } from "@/types/match";

// Minimal Team type for dashboard
type Team = {
  id: string;
  name: string;
};

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [team, setTeam] = useState<Team | null>(null);
  const [lastMatch, setLastMatch] = useState<Match | null>(null);
  const [nextMatch, setNextMatch] = useState<Match | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("team_id")
        .eq("id", user.id)
        .single();

      if (!profile) return;

      const { data: teamData } = await supabase
        .from("teams")
        .select("*")
        .eq("id", profile.team_id)
        .single();

      setTeam(teamData);

      const { data: last } = await supabase
        .from("matches")
        .select("*, opponents(name)")
        .eq("team_id", profile.team_id)
        .lt("date", new Date().toISOString())
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle();

      setLastMatch(last);

      const { data: next } = await supabase
        .from("matches")
        .select("*, opponents(name)")
        .eq("team_id", profile.team_id)
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(1)
        .maybeSingle();

      setNextMatch(next);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <Typography>Loading…</Typography>;
  }

  if (!user) {
    return <Typography>Redirecting to login…</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h4">
          {team ? `${team.name} Dashboard` : "Dashboard"}
        </Typography>
        <Button variant="outlined" onClick={logout}>
          Log out
        </Button>
      </Stack>

      {/* Navigation Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Matches" />
            <CardContent>
              <Stack spacing={2}>
                <Button component={Link} href="/matches" variant="contained">
                  View Matches
                </Button>
                <Button component={Link} href="/matches/new" variant="outlined">
                  New Match
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Players" />
            <CardContent>
              <Button component={Link} href="/players" variant="contained">
                Manage Players
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Last & Next Matches */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Last Match" />
            <CardContent>
              {lastMatch ? (
                <Button
                  component={Link}
                  href={`/matches/${lastMatch.id}`}
                  variant="outlined"
                  fullWidth
                  sx={{ justifyContent: "flex-start", textAlign: "left" }}
                >
                  <Stack>
                    <Typography>
                      {lastMatch.date
                        ? new Date(lastMatch.date).toLocaleDateString()
                        : "Unknown date"}
                    </Typography>
                    <Typography>
                      vs {lastMatch.opponents?.name || "Unknown Opponent"}
                    </Typography>
                    <Typography variant="h6">
                      {lastMatch.our_score} - {lastMatch.their_score}
                    </Typography>
                  </Stack>
                </Button>
              ) : (
                <Typography>No matches played yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Next Match" />
            <CardContent>
              {nextMatch ? (
                <Button
                  component={Link}
                  href={`/matches/${nextMatch.id}`}
                  variant="outlined"
                  fullWidth
                  sx={{ justifyContent: "flex-start", textAlign: "left" }}
                >
                  <Stack>
                    <Typography>
                      {nextMatch.date
                        ? new Date(nextMatch.date).toLocaleDateString()
                        : "Unknown date"}
                    </Typography>
                    <Typography>
                      vs {nextMatch.opponents?.name || "Unknown Opponent"}
                    </Typography>
                  </Stack>
                </Button>
              ) : (
                <Typography>No upcoming matches scheduled</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
