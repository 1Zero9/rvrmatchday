import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-rvr-navy text-white">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
