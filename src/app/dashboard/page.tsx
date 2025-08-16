"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

import Grid2 from "@mui/material/Unstable_Grid2"; // ✅ Grid2 import
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface MatchRow {
  id: string;
  date: string;
  home_away: string;
  our_score: number;
  their_score: number;
  opponents: { name: string }[];
}

export default function DashboardPage() {
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("id, date, home_away, our_score, their_score, opponents(name)")
        .order("date", { ascending: false })
        .limit(5);

      if (error) {
        console.error(error);
      } else {
        setMatches(data || []);
      }
      setLoading(false);
    };

    fetchMatches();
  }, []);

  const lastMatch = matches[0];

  return (
    <Grid2 container spacing={3} mb={3}>
      {/* Matches Card */}
      <Grid2 xs={12} md={4}>
        <Card>
          <CardHeader title="Matches" />
          <CardContent>
            {loading && <Typography>Loading...</Typography>}
            {!loading && lastMatch ? (
              <>
                <Typography variant="h6">
                  Last Match: {new Date(lastMatch.date).toLocaleDateString()}
                </Typography>
                <Typography>
                  vs{" "}
                  {lastMatch.opponents && lastMatch.opponents.length > 0
                    ? lastMatch.opponents[0].name
                    : "Unknown Opponent"}
                </Typography>
                <Typography variant="h6">
                  {lastMatch.our_score} - {lastMatch.their_s
