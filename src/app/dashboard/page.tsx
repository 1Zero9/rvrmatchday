"use client";

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ use Grid (not Grid2)
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
      date: "2025-08-10",
      homeTeamId: "home1",
      awayTeamId: "away1",
      ourScore: 2,
      theirScore: 1,
      opponents: [{ name: "Blue United" }],
    },
    {
      id: "2",
      date: "2025-08-15",
      homeTeamId: "home2",
      awayTeamId: "away2",
      ourScore: 3,
      theirScore: 3,
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
                {match.date}: {match.opponents[0].name} — {match.ourScore} :{" "}
                {match.theirScore}
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
