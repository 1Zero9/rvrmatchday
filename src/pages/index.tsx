// src/pages/index.tsx
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-navy-900 to-navy-700 text-white">
      {/* Main content */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 py-16 text-center">
        <Image
          src="/images/logo.png"
          alt="Club Logo"
          width={180}
          height={180}
          className="mb-6"
        />
        <h1 className="text-5xl font-extrabold mb-4">RVR Football Club</h1>
        <p className="text-lg max-w-xl">
          Welcome to the official site of RVR Football Club. Stay up to date
          with fixtures, results, and club news.
        </p>
      </main>
    </div>
  );
}
