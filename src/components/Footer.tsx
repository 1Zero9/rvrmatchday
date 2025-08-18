import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-rvr-navy-dark text-gray-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left: Logo / Name */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-rvr-maroon">
            River Valley Rangers
          </h2>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} River Valley Rangers AFC. All rights
            reserved.
          </p>
        </div>

        {/* Middle: Navigation */}
        <nav className="flex flex-col md:flex-row gap-4 text-sm">
          <Link href="/" className="hover:text-rvr-maroon transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-rvr-maroon transition-colors">
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-rvr-maroon transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/app"
            className="hover:text-rvr-maroon transition-colors"
          >
            App
          </Link>
        </nav>

        {/* Right: Socials */}
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            className="hover:text-rvr-maroon transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            className="hover:text-rvr-maroon transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
