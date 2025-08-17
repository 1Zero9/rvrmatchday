import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
      } else {
        setUser(data.user);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">RVR Matchday</h1>
      {user ? (
        <p className="text-lg">Welcome, {user.email}</p>
      ) : (
        <p>Loading...</p>
      )}

      <div className="mt-6 grid gap-4">
        <a href="/matches" className="p-4 bg-blue-100 rounded-lg shadow">
          📋 Matches
        </a>
        <a href="/club" className="p-4 bg-green-100 rounded-lg shadow">
          🏟️ Club Info
        </a>
      </div>
    </div>
  );
}
