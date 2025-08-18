"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-rvr-navy shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-rvr-maroon">
          River Valley Rangers
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-white font-medium">
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
            className="bg-rvr-maroon hover:bg-rvr-maroon-dark px-4 py-2 rounded-lg transition-colors"
          >
            App
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <nav className="md:hidden bg-rvr-navy-dark px-6 py-4 space-y-4 text-white font-medium">
          <Link
            href="/"
            className="block hover:text-rvr-maroon"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block hover:text-rvr-maroon"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block hover:text-rvr-maroon"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/app"
            className="block bg-rvr-maroon hover:bg-rvr-maroon-dark px-4 py-2 rounded-lg"
            onClick={() => setIsOpen(false)}
          >
            App
          </Link>
        </nav>
      )}
    </header>
  );
}
