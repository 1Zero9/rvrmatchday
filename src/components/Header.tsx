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

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Navigation items with dropdowns
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
          { 
            href: "/match-central/fixtures", 
            label: "Matches", 
            color: "",
            dropdown: [
              { href: "/match-central/fixtures", label: "Fixtures", desc: "Upcoming matches & schedule" },
              { href: "/match-central/results", label: "Results", desc: "Latest match results" },
              { href: "/match-central/tables", label: "Tables", desc: "League standings" },
              { href: "/tracker", label: "🎯 Match Tracker", desc: "Authenticated tracker dashboard" },
              { href: "/secure-match-recorder", label: "🔒 Secure Recorder", desc: "Authorized match recording" }
            ]
          },
          { 
            href: "/club", 
            label: "Club", 
            color: "",
            dropdown: [
              { href: "/club", label: "Overview", desc: "About our club" },
              { href: "/club/committee", label: "Committee", desc: "Meet our committee" },
              { href: "/club/facilities", label: "Facilities", desc: "Our grounds & facilities" }
            ]
          },
          { 
            href: "/join", 
            label: "Join", 
            color: "",
            dropdown: [
              { href: "/join", label: "Overview", desc: "How to join the club" },
              { href: "/join/youth", label: "Youth Teams", desc: "Join our youth teams" },
              { href: "/join/senior", label: "Senior Teams", desc: "Join our senior teams" },
              { href: "/join/trials", label: "Trials", desc: "Book a trial session" }
            ]
          },
          { 
            href: "/members", 
            label: "Members", 
            color: "",
            dropdown: [
              { href: "/members", label: "Member Area", desc: "Members only content" },
              { href: "/members/parents", label: "Parents Info", desc: "Information for parents" }
            ]
          },
          { 
            href: "/news-media", 
            label: "More", 
            color: "",
            dropdown: [
              { href: "/news-media", label: "News & Media", desc: "Latest club news" },
              { href: "/get-involved", label: "Get Involved", desc: "Volunteer & support us" },
              { href: "/contact", label: "Contact", desc: "Get in touch with us" }
            ]
          }
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
    : `bg-club-primary/90 backdrop-blur-md border-b border-white/10 ${isScrolled ? 'bg-club-primary/95 shadow-xl backdrop-blur-lg' : ''} transition-all duration-300`;
  
  const textColorClass = 'text-white text-shadow'; // Always white text with image background

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 ${headerClasses}`}
      style={headerStyle}
    >
      {/* Glass morphism overlay for better text readability */}
      <div className={`absolute inset-0 ${isKidsSection ? '' : 'bg-gradient-to-r from-white/5 to-white/10'} transition-all duration-300`}></div>
      
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
              className="relative group"
              onMouseEnter={() => (item as any).dropdown && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center">
                <Link 
                  href={item.href} 
                  className={`hover:text-accent-teal transition-colors duration-300 font-medium ${
                    item.color || textColorClass
                  } ${isKidsSection ? 'text-lg font-bold' : 'drop-shadow-sm'}`}
                >
                  {item.label}
                </Link>
                {(item as any).dropdown && (
                  <button 
                    className={`ml-1 text-xs hover:text-accent-teal transition-colors ${
                      item.color || textColorClass
                    }`}
                  >
                    ▼
                  </button>
                )}
              </div>
              
              {/* Dropdown Menu */}
              {(item as any).dropdown && activeDropdown === item.label && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50"
                >
                  <div className="py-2">
                    {(item as any).dropdown.map((dropItem: any, dropIndex: number) => (
                      <Link
                        key={dropItem.href}
                        href={dropItem.href}
                        className="block px-4 py-3 text-gray-800 hover:bg-gray-100 border-b last:border-b-0"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="font-semibold text-sm">{dropItem.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{dropItem.desc}</div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
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

      {/* Mobile Nav - Simplified */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden ${headerClasses} px-4 pb-6 space-y-2 overflow-hidden`}
          >
            {/* Mobile - Key items with better styling */}
            {[
              { href: "/", label: "🏠 Home", delay: 0 },
              { href: "/match-central/fixtures", label: "⚽ Fixtures", delay: 0.1 },
              { href: "/club", label: "🏛️ Club", delay: 0.2 },
              { href: "/join", label: "🚀 Join Us", delay: 0.25 },
              { href: "/contact", label: "📞 Contact", delay: 0.3 }
            ].map((navItem, index) => (
              <motion.div
                key={navItem.href}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navItem.delay }}
                className="block"
              >
                <Link 
                  href={navItem.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 px-2 text-lg font-medium hover:text-accent-teal hover:bg-white/10 rounded-lg transition-all ${textColorClass} drop-shadow-sm`}
                >
                  {navItem.label}
                </Link>
              </motion.div>
            ))}
            
            {currentSection === "public" && (
              <div className="pt-4 space-y-2">
                <Link 
                  href="/members/login" 
                  onClick={() => setIsOpen(false)}
                  className="block bg-accent-teal px-4 py-2 rounded-lg text-center font-semibold text-sm"
                >
                  Members Login
                </Link>
              </div>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
