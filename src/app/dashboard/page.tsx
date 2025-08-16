"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, Typography } from "@mui/material";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading…</p>;
  if (!user) return null; // redirecting

  return (
    <main style={{ padding: 20 }}>
      <Typography variant="h4">Welcome, {user.email}</Typography>
      <Button onClick={logout} sx={{ mt: 2 }} variant="contained" color="secondary">
        Logout
      </Button>
    </main>
  );
}
