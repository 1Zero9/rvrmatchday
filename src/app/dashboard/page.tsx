"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Match } from "@/types/match";

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2"; // ✅ Stable Grid2 API in MUI v7
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("date", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching matches:", error);
      } else {
        setMatches(data || []);
      }
    };

    if (user) {
      fetchMatches();
    }
  }, [user]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    return (
      <Typography>
        You are not logged in. Please{" "}
        <Link href="/login" style={{ color: "blue" }}>
          login
        </Link>
        .
      </Typography>
    );
  }

  const lastMatch = matches.length > 0 ? matches[0] : null;

  return (
    <Grid2 container spacing={3} sx={{ p: 3 }}>
      {/* Matches Card */}
      <Grid2 xs={12} md={4}>
        <Card>
          <CardHeader title="Matches" />
          <CardContent>
            {lastMatch ? (
              <>
                <Typography variant="h6">{lastMatch.opponent}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(lastMatch.date).toLocaleDateString()}
                </Typography>
                <Typography variant="h6">
                  {lastMatch.our_score} - {lastMatch.their_score}
                </Typography>
              </>
            ) : (
              <Typography>No matches found.</Typography>
            )}
          </CardContent>
        </Card>
      </Grid2>

      {/* User Info Card */}
      <Grid2 xs={12} md={4}>
        <Card>
          <CardHeader title="User Info" />
          <CardContent>
            <Typography>Email: {user.email}</Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
              onClick={logout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </Grid2>

      {/* Quick Links Card */}
      <Grid2 xs={12} md={4}>
        <Card>
          <CardHeader title="Quick Links" />
          <CardContent>
            <Button
              variant="contained"
              component={Link}
              href="/record-match"
              sx={{ mb: 1 }}
              fullWidth
            >
              Record Match
            </Button>
            <Button
              variant="outlined"
              component={Link}
              href="/players"
              fullWidth
            >
              Manage Players
            </Button>
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}
