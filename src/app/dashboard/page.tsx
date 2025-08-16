"use client";

import { Paper, Typography, Button, Stack } from "@mui/material";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" sx={{ fontFamily: "Raleway, sans-serif" }}>
          Dashboard
        </Typography>
        <Button variant="outlined" onClick={signOut}>Sign out</Button>
      </Stack>

      <Typography color="text.secondary" mt={1}>
        You are signed in. Next we’ll add the Record Match screen.
      </Typography>
    </Paper>
  );
}
