import AuthGate from "@/components/AuthGate";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}
