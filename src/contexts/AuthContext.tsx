"use client";

import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// default context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// custom hook
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
