"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import Grid from "@mui/material/Grid";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  CircularProgress,
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
  const [lastMatch, setLastMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastMatch = async () => {
      try {
        const supabase = createClient();
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
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLastMatch();
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Navigation Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Matches" />
            <CardContent>
              {loading ? (
                <CircularProgress />
              ) : lastMatch ? (
                <>
                  <Typography variant="h6">
                    Last Match – {new Date(lastMatch.date).toLocaleDateString()}
                  </Typography>
                  <Typography>
                    vs{" "}
                    {lastMatch.opponents && lastMatch.opponents.length > 0
                      ? lastMatch.opponents[0].name
                      : "Unknown Opponent"}
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
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Players" />
            <CardContent>
              <Typography>Player stats will go here.</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Venues" />
            <CardContent>
              <Typography>Venue info will go here.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
