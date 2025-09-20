import type { AppProps } from "next/app";
import Head from "next/head";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      <Component {...pageProps} />
      <SpeedInsights />
    </>
  );
}
