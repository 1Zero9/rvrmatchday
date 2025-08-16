"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

const supabase = createClient();

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
  const [nextMatch, setNextMatch] = useState<Match | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(
          `
          id,
          date,
          home_away,
          our_score,
          their_score,
          opponents ( name )
        `
        )
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching matches:", error);
        return;
      }

      if (data && data.length > 0) {
        setLastMatch(data[0]);

        if (data.length > 1) {
          setNextMatch(data[1]);
        }
      }
    };

    fetchMatches();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Match Summary */}
      <Grid container spacing={3} mb={3}>
        {/* Last Match */}
        {lastMatch && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Last Match" />
              <CardContent>
                <Typography variant="h6">
                  {new Date(lastMatch.date).toLocaleDateString()}
                </Typography>
                <Typography>
                  vs{" "}
                  {lastMatch.opponents && lastMatch.opponents.length > 0
                    ? lastMatch.opponents.map((o) => o.name).join(", ")
                    : "Unknown Opponent"}
                </Typography>
                <Typography variant="h6">
                  {lastMatch.our_score} - {lastMatch.their_score}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Next Match */}
        {nextMatch && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Next Match" />
              <CardContent>
                <Typography variant="h6">
                  {new Date(nextMatch.date).toLocaleDateString()}
                </Typography>
                <Typography>
                  vs{" "}
                  {nextMatch.opponents && nextMatch.opponents.length > 0
                    ? nextMatch.opponents.map((o) => o.name).join(", ")
                    : "Unknown Opponent"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Navigation Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Matches" />
            <CardContent>
              <Button href="/matches" variant="contained">
                View Matches
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Players" />
            <CardContent>
              <Button href="/players" variant="contained">
                View Players
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Record Match" />
            <CardContent>
              <Button href="/record-match" variant="contained">
                Record Match
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
