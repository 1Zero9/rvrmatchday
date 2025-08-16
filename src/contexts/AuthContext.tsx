"use client";

import { createContext, useContext } from "react";

export interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;   // ✅ added logout
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},        // ✅ default no-op
});

export const useAuth = () => useContext(AuthContext);
