"use client";

import { Paper, Typography } from "@mui/material";

export default function LoginPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontFamily: "Raleway, sans-serif" }}>
        Coach Login
      </Typography>
      <Typography color="text.secondary" mt={1}>
        We’ll add Supabase magic link in Stage 2.
      </Typography>
    </Paper>
  );
}
