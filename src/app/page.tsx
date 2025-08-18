import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-rvr-navy text-white">
      {/* Hero Section */}
      <section className="relative w-full h-[70vh] flex items-center justify-center bg-rvr-navy">
        <div className="absolute inset-0">
          <Image
            src="/assets/home/hero-placeholder.jpg"
            alt="Club Hero"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative text-center z-10">
          <h1 className="text-5xl font-extrabold mb-4 text-rvr-maroon">
            River Valley Rangers FC
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-200 mb-6">
            Building community through football since 1981.
          </p>
          <Link
            href="/app"
            className="bg-rvr-maroon hover:bg-rvr-maroon-dark text-white font-semibold px-6 py-3 rounded-lg shadow"
          >
            Enter Matchday App
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-rvr-navy-dark">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-xl font-bold mb-2 text-rvr-maroon">Our Teams</h3>
            <p className="text-gray-300">
              From youth to seniors, boys, girls, and inclusive programmes —
              football for everyone.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-rvr-maroon">
              Community Spirit
            </h3>
            <p className="text-gray-300">
              Supporting our local community through sport, events, and
              volunteer opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-rvr-maroon">
              Proud History
            </h3>
            <p className="text-gray-300">
              Established in 1981 — over 40 years of passion, dedication, and
              football excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="py-16 bg-rvr-navy">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-rvr-maroon">
            Our Sponsors
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <Image
              src="/assets/sponsors/sponsor1.png"
              alt="Sponsor 1"
              width={150}
              height={80}
            />
            <Image
              src="/assets/sponsors/sponsor2.png"
              alt="Sponsor 2"
              width={150}
              height={80}
            />
            <Image
              src="/assets/sponsors/sponsor3.png"
              alt="Sponsor 3"
              width={150}
              height={80}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
