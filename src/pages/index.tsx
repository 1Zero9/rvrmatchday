import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a1a2f] text-white">
      {/* Header */}
      <header className="bg-[#2a0d1f] p-6 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">RVR Matchday</h1>
          <nav className="space-x-6">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/app" className="hover:underline">
              App
            </Link>
            <Link href="/admin/edit" className="hover:underline">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <h2 className="text-4xl font-bold mb-4 text-[#b22234]">Welcome to RVR Matchday</h2>
        <p className="max-w-2xl text-lg text-gray-200 mb-6">
          Your one-stop platform for recording, managing, and celebrating our team’s matchday
          performances.
        </p>
        <Link
          href="/app"
          className="bg-[#b22234] text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-[#8c1a27]"
        >
          Go to App
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#2a0d1f] p-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} RVR Matchday. All rights reserved.
      </footer>
    </div>
  );
}
