"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
} from "@mui/material";

// Define a type for a Match
type Match = {
  id: string;
  date: string;
  our_score: number;
  their_score: number;
  opponents: { name: string }[];
};

export default function DashboardPage() {
  const [lastMatch, setLastMatch] = useState<Match | null>(null);

  useEffect(() => {
    const fetchLastMatch = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("id, date, our_score, their_score, opponents(name)")
        .order("date", { ascending: false })
        .limit(1);

      if (error) {
        console.error(error);
      } else {
        setLastMatch(data?.[0] || null);
      }
    };

    fetchLastMatch();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Navigation Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Matches" />
            <CardContent>
              <Typography>View and manage matches</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Players" />
            <CardContent>
              <Typography>Manage player roster</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Venues" />
            <CardContent>
              <Typography>Manage match venues</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Last Match Summary */}
      <Card>
        <CardHeader title="Last Match" />
        <CardContent>
          {lastMatch ? (
            <>
              <Typography variant="h6">{lastMatch.date}</Typography>
              <Typography>
                vs {lastMatch.opponents?.[0]?.name ?? "Unknown Opponent"}
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
    </div>
  );
}
