import type { AppProps } from "next/app";
import "@/styles/globals.css";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isHome = router.pathname === "/";

  return (
    <Layout>
      <main className={isHome ? "bg-[#001f3f] text-white" : "bg-white text-black"}>
        <Component {...pageProps} />
      </main>
    </Layout>
  );
}
