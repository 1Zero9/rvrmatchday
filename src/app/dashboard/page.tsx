"use client";

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Match } from "@/types/match";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    return (
      <Typography>
        You must be logged in to view this page.{" "}
        <Link href="/login">Login</Link>
      </Typography>
    );
  }

  const matches: Match[] = [
    {
      id: "1",
      team_id: "our-team",
      date: "2025-08-10",
      opponent_id: "blue-united",
      home_away: "Home",
      our_score: 2,
      their_score: 1,
      opponents: [{ name: "Blue United" }],
    },
    {
      id: "2",
      team_id: "our-team",
      date: "2025-08-15",
      opponent_id: "red-rovers",
      home_away: "Away",
      our_score: 3,
      their_score: 3,
      opponents: [{ name: "Red Rovers" }],
    },
  ];

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {/* Matches Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Matches" />
          <CardContent>
            {matches.map((match) => (
              <Typography key={match.id} sx={{ mb: 1 }}>
                {match.date}: {match.opponents?.[0]?.name ?? "Unknown"} —{" "}
                {match.our_score} : {match.their_score}
              </Typography>
            ))}
            <Button
              variant="contained"
              component={Link}
              href="/record-match"
              sx={{ mt: 2 }}
            >
              Record New Match
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Account Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Account" />
          <CardContent>
            <Typography>Email: {user.email}</Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={logout}
              sx={{ mt: 2 }}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
