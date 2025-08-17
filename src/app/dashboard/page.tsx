// src/app/dashboard/page.tsx
"use client";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Matches Card */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Matches</h2>
          <ul className="space-y-2">
            <li className="flex flex-col">
              <span className="font-medium">RVR 2 - 1 Opponents</span>
              <span className="text-sm text-gray-500">12 Aug 2025</span>
            </li>
            <li className="flex flex-col">
              <span className="font-medium">RVR 0 - 0 City Juniors</span>
              <span className="text-sm text-gray-500">5 Aug 2025</span>
            </li>
          </ul>
        </div>

        {/* Players Card */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Players</h2>
          <ul className="space-y-2">
            <li className="flex flex-col">
              <span className="font-medium">Alice Smith</span>
              <span className="text-sm text-gray-500">Forward</span>
            </li>
            <li className="flex flex-col">
              <span className="font-medium">Bob Johnson</span>
              <span className="text-sm text-gray-500">Midfield</span>
            </li>
          </ul>
        </div>

        {/* Stats Card */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Stats</h2>
          <p>Goals: 12</p>
          <p>Assists: 7</p>
          <p>Clean Sheets: 3</p>
        </div>
      </div>
    </div>
  );
}
