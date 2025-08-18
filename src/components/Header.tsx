import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  // Debounced scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (Math.abs(currentScroll - lastScroll) < 20) return; // sensitivity
      if (currentScroll > lastScroll && currentScroll > 100) {
        setShow(false); // scrolling down
      } else {
        setShow(true); // scrolling up
      }
      setLastScroll(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 bg-[#001F3F] ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4 text-white">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img src="/images/logo.png" alt="Club Logo" className="h-10 w-10" />
          <span className="font-bold text-lg">RVR FC</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/teams">Teams</Link>
          <Link href="/app/matches">Matches</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden bg-[#001F3F] text-white px-4 pb-4 space-y-2">
          <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/teams" onClick={() => setIsOpen(false)}>Teams</Link>
          <Link href="/app/matches" onClick={() => setIsOpen(false)}>Matches</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
        </nav>
      )}
    </header>
  );
}
