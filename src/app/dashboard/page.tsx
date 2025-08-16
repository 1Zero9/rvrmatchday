"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // ✅ FIXED
import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from "@mui/material";

interface Match {
  id: string;
  date: string;
  home_away: string;
  our_score: number;
  their_score: number;
  opponents: { name: string }[];
}

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("id, date, home_away, our_score, their_score, opponents(name)")
        .order("date", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching matches:", error);
      } else {
        setMatches(data || []);
      }
      setLoading(false);
    };

    fetchMatches();
  }, []);

  const lastMatch = matches[0];

  return (
    <Grid container spacing={3} mb={3}>
      {/* Matches Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Matches" />
          <CardContent>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : matches.length === 0 ? (
              <Typography>No matches found</Typography>
            ) : (
              <>
                <Typography variant="h6">
                  Last Match: {lastMatch?.date}
                </Typography>
                <Typography>
                  vs{" "}
                  {lastMatch?.opponents && lastMatch.opponents.length > 0
                    ? lastMatch.opponents[0].name
                    : "Unknown Opponent"}
                </Typography>
                <Typography variant="h6">
                  {lastMatch?.our_score} - {lastMatch?.their_score}
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 2 }}
                  href="/matches"
                >
                  View All Matches
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Players Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Players" />
          <CardContent>
            <Typography variant="h6">Coming soon…</Typography>
            <Button
              variant="contained"
              size="small"
              sx={{ mt: 2 }}
              href="/players"
            >
              View Players
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Training Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Training" />
          <CardContent>
            <Typography variant="h6">Coming soon…</Typography>
            <Button
              variant="contained"
              size="small"
              sx={{ mt: 2 }}
              href="/training"
            >
              View Training
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
