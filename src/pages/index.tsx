import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Rivervalley Rovers</h1>
      <p className="text-lg text-gray-600 mb-6">
        Welcome to the official club site.  
        Fixtures, results, and updates for players & parents.
      </p>
      <Link
        href="/app"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Go to Scorekeeper App
      </Link>
    </div>
  );
}
