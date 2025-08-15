"use client";

import Image from "next/image";
import Link from "next/link";
import { Box, Paper, Typography, Stack, Button } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #005C99, #0099CC)",
      }}
    >
      <Paper elevation={6} sx={{ p: 4, textAlign: "center", maxWidth: 680, background: "rgba(255,255,255,0.95)" }}>
        <Image src="/logo.png" alt="RVR" width={120} height={120} />
        <Typography variant="h3" mt={2} sx={{ fontFamily: "Raleway, sans-serif" }}>
          River Valley Rangers
        </Typography>
        <Typography mt={0.5} color="text.secondary">
          Founded 1981
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mt={3}
          justifyContent="center"
        >
          <Button component={Link} href="/dashboard" variant="contained" color="primary">
            Go to Dashboard
          </Button>
          <Button component={Link} href="/login" variant="outlined" color="primary">
            Coach Login
          </Button>
        </Stack>

        <Typography mt={3}>
          <a href="https://www.rvrfc.ie" style={{ color: "#005C99", textDecoration: "underline" }}>
            www.rvrfc.ie
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}
