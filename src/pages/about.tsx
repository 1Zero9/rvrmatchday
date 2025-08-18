import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-rvr-navy text-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-rvr-navy-dark py-16 text-center">
        <h1 className="text-4xl font-extrabold text-rvr-maroon mb-4">
          About River Valley Rangers
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-300">
          Since 1981, River Valley Rangers Football Club has been more than just
          a team. We are a community, a family, and a place where passion for
          football thrives.
        </p>
      </section>

      {/* Content Section */}
      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 space-y-10">
        <section>
          <h2 className="text-2xl font-bold text-rvr-maroon mb-3">
            Our Mission
          </h2>
          <p className="text-gray-200 leading-relaxed">
            Our mission is simple: to foster a love for the game of football in
            players of all ages, genders, and abilities. We believe in teamwork,
            respect, and dedication — both on and off the pitch.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-rvr-maroon mb-3">
            Community First
          </h2>
          <p className="text-gray-200 leading-relaxed">
            River Valley Rangers are deeply rooted in our community. We organise
            local events, encourage youth participation, and create opportunities
            for volunteers to be part of our football family.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-rvr-maroon mb-3">
            A Proud History
          </h2>
          <p className="text-gray-200 leading-relaxed">
            Founded in 1981, the club has grown from humble beginnings into a
            respected football organisation. With countless matches, trophies, and
            memories, our journey continues — stronger than ever.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
