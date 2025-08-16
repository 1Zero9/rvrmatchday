"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Paper, TextField, Button, Stack, Typography, Alert } from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const router = useRouter();
  const params = useSearchParams();
  const nextPath = useMemo(() => params.get("next") || "/dashboard", [params]);

  useEffect(() => {
    // if already signed in, bounce to nextPath
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace(nextPath);
    })();
  }, [router, nextPath]);

  async function sendLink() {
    setErr(null); setMsg(null); setSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${location.origin}${nextPath}` },
      });
      if (error) throw error;
      setMsg("Check your email for the login link.");
    } catch (e: any) {
      setErr(e?.message || "Failed to send link");
    } finally {
      setSending(false);
    }
  }

  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "calc(100vh - 64px)" }}>
      <Paper sx={{ p: 3, minWidth: 360 }}>
        <Typography variant="h5" sx={{ fontFamily: "Raleway, sans-serif" }}>
          Coach Login
        </Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
          We’ll send a one-time link to your email.
        </Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            type="email"
            label="Email"
            placeholder="coach@club.ie"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={sendLink} disabled={!email || sending}>
            {sending ? "Sending…" : "Send magic link"}
          </Button>

          {msg && <Alert severity="success">{msg}</Alert>}
          {err && <Alert severity="error">{err}</Alert>}

          <Button variant="text" onClick={() => router.push("/")}>Back</Button>
        </Stack>
      </Paper>
    </main>
  );
}
