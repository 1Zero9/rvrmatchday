import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-rvr-navy text-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-rvr-navy-dark py-16 text-center">
        <h1 className="text-4xl font-extrabold text-rvr-maroon mb-4">
          Contact Us
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-300">
          Have a question about River Valley Rangers? Get in touch with us
          below.
        </p>
      </section>

      {/* Contact Content */}
      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 space-y-10">
        {/* Club Info */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-rvr-maroon mb-3">
            Club Information
          </h2>
          <p className="text-gray-200 mb-2">
            📍 Home Ground: River Valley Park, Swords, Co. Dublin
          </p>
          <p className="text-gray-200 mb-2">📧 Email: info@rivervalleyrangersafc.com</p>
          <p className="text-gray-200">📱 Social: Facebook | Instagram</p>
        </section>

        {/* Contact Form */}
        <section>
          <h2 className="text-2xl font-bold text-rvr-maroon mb-3 text-center">
            Send Us a Message
          </h2>
          <form className="grid gap-6 max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Your Name"
              className="px-4 py-3 rounded-lg bg-rvr-navy-dark text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-rvr-maroon"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="px-4 py-3 rounded-lg bg-rvr-navy-dark text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-rvr-maroon"
              required
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="px-4 py-3 rounded-lg bg-rvr-navy-dark text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-rvr-maroon"
              required
            />
            <button
              type="submit"
              className="bg-rvr-maroon hover:bg-rvr-maroon-dark px-6 py-3 rounded-lg font-semibold"
            >
              Send Message
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
