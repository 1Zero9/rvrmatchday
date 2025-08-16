"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Button, Typography, Stack } from "@mui/material";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // if no user and not loading, redirect to login
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!user) {
    // we’ll redirect, but return placeholder for SSR safety
    return <Typography>Redirecting to login…</Typography>;
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Welcome, {user.email}</Typography>
      <Button variant="contained" onClick={logout}>
        Log out
      </Button>
    </Stack>
  );
}
