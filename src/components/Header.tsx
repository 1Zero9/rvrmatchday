import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-[#001f3f] text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + title */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/images/logo.png"
              alt="Club Logo"
              className="h-8 w-8"
            />
            <span className="font-bold text-lg">RVR Football</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/about" className="hover:text-gray-300">About</Link>
            <Link href="/news" className="hover:text-gray-300">News</Link>
            <Link href="/teams" className="hover:text-gray-300">Teams</Link>
            <Link href="/matches" className="hover:text-gray-300">Matches</Link>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          </nav>

          {/* Mobile button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="md:hidden bg-[#001f3f] text-white px-4 py-2 space-y-2">
          <Link href="/" className="block hover:text-gray-300">Home</Link>
          <Link href="/about" className="block hover:text-gray-300">About</Link>
          <Link href="/news" className="block hover:text-gray-300">News</Link>
          <Link href="/teams" className="block hover:text-gray-300">Teams</Link>
          <Link href="/matches" className="block hover:text-gray-300">Matches</Link>
          <Link href="/contact" className="block hover:text-gray-300">Contact</Link>
        </nav>
      )}
    </header>
  );
}
