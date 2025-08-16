"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from "@mui/material";
import Link from "next/link";

interface Match {
  id: string;
  date: string;
  home_away: string;
  our_score: number;
  their_score: number;
  opponents: { name: string }[];
}

export default function DashboardPage() {
  const [lastMatch, setLastMatch] = useState<Match | null>(null);

  useEffect(() => {
    const fetchLastMatch = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("id, date, home_away, our_score, their_score, opponents(name)")
        .order("date", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching last match:", error);
      } else if (data && data.length > 0) {
        setLastMatch(data[0]);
      }
    };

    fetchLastMatch();
  }, []);

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {/* Matches Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Matches" />
          <CardContent>
            {lastMatch ? (
              <>
                <Typography variant="body1">
                  Last Match: {lastMatch.date}
                </Typography>
                <Typography variant="body2">
                  Opponent: {lastMatch.opponents?.[0]?.name ?? "Unknown"}
                </Typography>
                <Typography variant="h6">
                  {lastMatch.our_score} - {lastMatch.their_score}
                </Typography>
              </>
            ) : (
              <Typography variant="body2">No match data available.</Typography>
            )}
            <Button
              component={Link}
              href="/matches"
              variant="contained"
              sx={{ mt: 2 }}
            >
              View All Matches
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Players Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Players" />
          <CardContent>
            <Typography variant="body2">Manage team players.</Typography>
            <Button
              component={Link}
              href="/players"
              variant="contained"
              sx={{ mt: 2 }}
            >
              View Players
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Venues Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Venues" />
          <CardContent>
            <Typography variant="body2">See where matches are played.</Typography>
            <Button
              component={Link}
              href="/venues"
              variant="contained"
              sx={{ mt: 2 }}
            >
              View Venues
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
