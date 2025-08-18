import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-center pt-20 pb-20">
      <Image
        src="/images/logo.png"
        alt="RVR Football Club Logo"
        width={200}
        height={200}
        className="mb-6"
      />
      <h1 className="text-4xl font-bold text-[#001F3F]">
        Welcome to RVR Football Club
      </h1>
      <p className="mt-4 text-lg text-gray-700 max-w-xl">
        Building a community on and off the pitch. Explore our matches, players,
        and upcoming events.
      </p>
    </main>
  );
}
