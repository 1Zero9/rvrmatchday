"use client";

import { Paper, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontFamily: "Raleway, sans-serif" }}>
        Dashboard
      </Typography>
      <Typography color="text.secondary" mt={1}>
        Coach area placeholder. Auth comes in Stage 2.
      </Typography>
    </Paper>
  );
}
