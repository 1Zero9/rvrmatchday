import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  currentSection?: string;
}

export default function Header({ currentSection = "public" }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Modern scroll behavior - header stays visible but changes background
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Different navigation based on section
  const getNavItems = () => {
    switch (currentSection) {
      case "kids":
        return [
          { href: "/", label: "🏠 Home", color: "text-kids-yellow" },
          { href: "/kids", label: "⚽ Kids Zone", color: "text-kids-orange" },
          { href: "/kids/games", label: "🎮 Games", color: "text-kids-purple" },
          { href: "/kids/achievements", label: "🏆 My Trophies", color: "text-kids-lime" },
        ];
      case "members":
        return [
          { href: "/", label: "Home", color: "" },
          { href: "/members", label: "Clubhouse", color: "" },
          { href: "/members/matches", label: "Matches", color: "" },
          { href: "/members/teams", label: "My Teams", color: "" },
          { href: "/members/calendar", label: "Calendar", color: "" },
        ];
      case "admin":
        return [
          { href: "/", label: "Home", color: "" },
          { href: "/admin", label: "Dashboard", color: "" },
          { href: "/admin/matches", label: "Manage Matches", color: "" },
          { href: "/admin/teams", label: "Teams", color: "" },
          { href: "/admin/users", label: "Members", color: "" },
        ];
      default: // public
        return [
          { href: "/", label: "Home", color: "" },
          { href: "/about", label: "About", color: "" },
          { href: "/teams", label: "Teams", color: "" },
          { href: "/join", label: "Join Us", color: "" },
          { href: "/contact", label: "Contact", color: "" },
        ];
    }
  };

  const navItems = getNavItems();
  const isKidsSection = currentSection === "kids";
  
  // Header with background image and overlay for readability
  const headerStyle = isKidsSection 
    ? {} 
    : {
        backgroundImage: 'url(/images/headerbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };

  const headerClasses = isKidsSection 
    ? `bg-gradient-to-r from-kids-yellow via-kids-orange to-kids-purple ${isScrolled ? 'backdrop-blur-sm' : ''}`
    : `bg-club-navy ${isScrolled ? 'backdrop-blur-sm shadow-lg' : ''} transition-all duration-300`;
  
  const textColorClass = 'text-white'; // Always white text with image background

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 ${headerClasses}`}
      style={headerStyle}
    >
      {/* Semi-transparent overlay for better text readability */}
      <div className={`absolute inset-0 ${isKidsSection ? '' : 'bg-black/30'} transition-all duration-300`}></div>
      
      <div className={`relative z-10 max-w-6xl mx-auto flex items-center justify-between p-4 ${textColorClass}`}>
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <motion.img 
            src="/images/logo.png" 
            alt="Club Logo" 
            className="h-12 w-12 group-hover:scale-110 transition-transform duration-300" 
            whileHover={{ rotate: isKidsSection ? 360 : 0 }}
            transition={{ duration: 0.6 }}
          />
          <div className="flex flex-col">
            <span className={`font-bold text-lg ${isKidsSection ? 'font-display text-xl' : 'drop-shadow-sm'}`}>
              Rivervalley Rangers AFC
            </span>
            {isKidsSection && (
              <span className="text-xs text-kids-yellow">Kids Zone!</span>
            )}
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={item.href} 
                className={`hover:text-accent-teal transition-colors duration-300 font-medium ${
                  item.color || textColorClass
                } ${isKidsSection ? 'text-lg font-bold' : 'drop-shadow-sm'}`}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex space-x-3">
          {currentSection === "public" && (
            <>
              <Link href="/coach/login" className="bg-primary-600 px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-white">
                Coaches
              </Link>
              <Link href="/members/login" className="bg-accent-teal px-4 py-2 rounded-lg hover:bg-accent-teal/80 transition-colors font-semibold">
                Members
              </Link>
              <Link href="/kids" className="bg-kids-orange px-4 py-2 rounded-lg hover:bg-kids-orange/80 transition-colors font-semibold">
                Kids Zone
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden focus:outline-none z-60"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-2xl"
          >
            {isOpen ? "✕" : "☰"}
          </motion.div>
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden ${headerClasses} px-4 pb-6 space-y-4 overflow-hidden`}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="block"
              >
                <Link 
                  href={item.href} 
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 text-lg font-medium hover:text-accent-teal transition-colors ${
                    item.color || textColorClass
                  } ${isKidsSection ? '' : 'drop-shadow-sm'}`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
            {currentSection === "public" && (
              <div className="pt-4 space-y-2">
                <Link 
                  href="/coach/login" 
                  onClick={() => setIsOpen(false)}
                  className="block bg-primary-600 px-4 py-3 rounded-lg text-center font-semibold text-white"
                >
                  Coach Login
                </Link>
                <Link 
                  href="/members/login" 
                  onClick={() => setIsOpen(false)}
                  className="block bg-accent-teal px-4 py-3 rounded-lg text-center font-semibold"
                >
                  Members Login
                </Link>
                <Link 
                  href="/kids" 
                  onClick={() => setIsOpen(false)}
                  className="block bg-kids-orange px-4 py-3 rounded-lg text-center font-semibold"
                >
                  Kids Zone
                </Link>
              </div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
