import type { Metadata } from "next";
import { Open_Sans, Raleway } from "next/font/google";
import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";
import { Container } from "@mui/material";

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-body" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "RVR Matchday",
  description: "River Valley Rangers — match management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${openSans.variable} ${raleway.variable}`}>
      <body style={{ margin: 0, fontFamily: "var(--font-body)" }}>
        <Providers>
          <NavBar />
          <Container sx={{ py: 3 }}>
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}