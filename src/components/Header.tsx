"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-maroon text-white fixed w-full top-0 left-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo + Title */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/images/logo.png"
            alt="Club Logo"
            className="h-10 w-10 object-contain"
          />
          <span className="font-bold text-lg">RVR Football Club</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-200">
            Home
          </Link>
          <Link href="/app/teams" className="hover:text-gray-200">
            Teams
          </Link>
          <Link href="/app/news" className="hover:text-gray-200">
            News
          </Link>
          <Link href="/app/contact" className="hover:text-gray-200">
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden bg-maroon text-white p-4 space-y-3">
          <Link href="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/app/teams" onClick={() => setIsOpen(false)}>
            Teams
          </Link>
          <Link href="/app/news" onClick={() => setIsOpen(false)}>
            News
          </Link>
          <Link href="/app/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
}
