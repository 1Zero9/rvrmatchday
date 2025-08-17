import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

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
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">RVR U12 Scorekeeper</h1>
        <Link
          href="/matches/new"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-600"
        >
          Record Match
        </Link>
      </header>

      {/* Stats Row */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="px-4 py-2 bg-white rounded-lg shadow text-center">
          <p className="font-semibold">1</p>
          <p className="text-sm text-gray-500">Played</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg shadow text-center">
          <p className="font-semibold text-green-600">1-0-0</p>
          <p className="text-sm text-gray-500">W-D-L</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg shadow text-center">
          <p className="font-semibold">2/1</p>
          <p className="text-sm text-gray-500">GF/GA</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg shadow text-center">
          <p className="font-semibold">1</p>
          <p className="text-sm text-gray-500">GD</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg shadow text-center">
          <p className="font-semibold text-green-600">100%</p>
          <p className="text-sm text-gray-500">Win %</p>
        </div>
      </div>

      {/* League Form */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-600">League form</span>
        <span className="bg-green-500 text-white font-bold rounded-full px-3 py-1">
          W
        </span>
      </div>

      {/* Last Match Card */}
      <div className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
        <div>
          <p className="text-gray-700 font-semibold">12 Aug 2025 · Home</p>
          <p className="text-blue-600">
            vs Swords Celtic @ Rivervalley Park
          </p>
          <p className="text-sm text-gray-500">
            DDSL U12 Major Boys Sat
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">2–1</p>
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mt-1"></span>
        </div>
      </div>
    </div>
  );
}
