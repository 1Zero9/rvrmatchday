import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function Login() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      if (session) {
        window.location.href = "/";
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const email = prompt("Enter your email:");
    if (!email) return;
    await supabase.auth.signInWithOtp({ email });
    alert("Check your email for a magic link!");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Login with Magic Link
      </button>
    </div>
  );
}
