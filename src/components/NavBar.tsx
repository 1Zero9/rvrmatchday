"use client";

import Link from "next/link";
import Image from "next/image";
import { AppBar, Toolbar, Typography, Stack, Button } from "@mui/material";

export default function NavBar() {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image src="/logo.png" alt="RVR" width={40} height={40} style={{ borderRadius: 999 }} />
        </Link>

        <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "Raleway, sans-serif" }}>
          RVR Matchday
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button component={Link} href="/" color="inherit">Home</Button>
          <Button component={Link} href="/dashboard" color="inherit">Dashboard</Button>
          <Button component={Link} href="/login" variant="outlined" color="inherit">Login</Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
