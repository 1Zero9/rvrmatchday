import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <h1 className="text-6xl font-extrabold text-rvr-maroon mb-6">404</h1>
      <p className="text-xl text-gray-300 mb-8">
        Oops! The page dribbled out of bounds. ⚽
      </p>

      <img
        src="/images/ball-lost.png"
        alt="Football lost"
        className="w-40 h-40 mb-8 animate-bounce"
      />

      <Link
        href="/"
        className="bg-rvr-maroon hover:bg-rvr-maroon-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Back to Kickoff
      </Link>
    </div>
  );
}

