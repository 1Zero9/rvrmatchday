import Link from "next/link";

export default function AppHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">App Dashboard</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/app/matches" className="text-blue-600 hover:underline">
            Matches
          </Link>
        </li>
        <li>
          <Link href="/app/club" className="text-blue-600 hover:underline">
            Club
          </Link>
        </li>
        <li>
          <Link href="/app/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </li>
      </ul>
    </div>
  );
}
