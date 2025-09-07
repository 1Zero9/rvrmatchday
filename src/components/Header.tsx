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
            href: "/match-central", 
            label: "Matches", 
            color: "",
            dropdown: [
              { href: "/match-central", label: "Match Central", desc: "Complete match management hub" },
              { href: "/dashboard", label: "Dashboard", desc: "Club overview dashboard" },
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
              { href: "/about", label: "About Us", desc: "Club history and mission" },
              { href: "/club/values", label: "Our Values", desc: "Core principles and beliefs" },
              { href: "/club/history", label: "History", desc: "Our proud heritage" },
              { href: "/club/committee", label: "Committee", desc: "Meet our committee" },
              { href: "/club/facilities", label: "Facilities", desc: "Our grounds & facilities" }
            ]
          },
          { 
            href: "/teams", 
            label: "Teams", 
            color: "",
            dropdown: [
              { href: "/teams", label: "All Teams", desc: "Overview of all our teams" },
              { href: "/teams/boys", label: "Boys Teams", desc: "Boys football teams" },
              { href: "/teams/girls", label: "Girls Teams", desc: "Girls football teams" },
              { href: "/teams/youth", label: "Youth Teams", desc: "Youth development" },
              { href: "/teams/senior", label: "Senior Teams", desc: "Adult teams" },
              { href: "/teams/inclusive", label: "Inclusive Football", desc: "Football for everyone" },
              { href: "/coach", label: "Coaching Staff", desc: "Meet our coaches" },
              { href: "/join", label: "Join Us", desc: "How to join the club" },
              { href: "/join/trials", label: "Trials", desc: "Book a trial session" },
              { href: "/join/academy", label: "Youth Academy", desc: "Academy program" },
              { href: "/join/inclusive", label: "Join Inclusive", desc: "Inclusive programs" }
            ]
          },
          { 
            href: "/members", 
            label: "Members", 
            color: "",
            dropdown: [
              { href: "/members", label: "Members Hub", desc: "Main member area" },
              { href: "/members/parents", label: "Parents Area", desc: "Information for parents" },
              { href: "/members/faq", label: "FAQ", desc: "Frequently asked questions" },
              { href: "/members/feedback", label: "Feedback", desc: "Share your thoughts" },
              { href: "/login", label: "Member Login", desc: "Access your account" }
            ]
          },
          { 
            href: "/get-involved", 
            label: "More", 
            color: "",
            dropdown: [
              { href: "/news-media", label: "News & Media", desc: "Latest club news" },
              { href: "/news", label: "News", desc: "Club news and updates" },
              { href: "/gallery", label: "Gallery", desc: "Photos and media" },
              { href: "/get-involved", label: "Get Involved", desc: "Ways to help the club" },
              { href: "/get-involved/events", label: "Events", desc: "Club events and activities" },
              { href: "/get-involved/sponsorship", label: "Sponsorship", desc: "Partnership opportunities" },
              { href: "/volunteering", label: "Volunteering", desc: "Volunteer opportunities" },
              { href: "/fundraising", label: "Fundraising", desc: "Support our campaigns" },
              { href: "/shop", label: "Club Shop", desc: "Merchandise and kit" },
              { href: "/boot-room", label: "Boot Room", desc: "Behind the scenes" },
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
            className="md:hidden bg-white shadow-2xl border-t border-gray-100 px-4 py-6 space-y-3 overflow-hidden"
          >
            {/* Main Navigation - Clean Design */}
            <div className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/matchday", label: "Match Day" },
                { href: "/teams/boys", label: "Teams" },
                { href: "/about", label: "About Club" },
                { href: "/join/trials", label: "Join Us" },
                { href: "/contact", label: "Contact" }
              ].map((navItem, index) => (
                <motion.div
                  key={navItem.href}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link 
                    href={navItem.href}
                    onClick={() => setIsOpen(false)}
                    className="block bg-white border border-gray-200 hover:border-club-primary p-4 rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium">{navItem.label}</span>
                      <span className="text-club-primary">→</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Match Central Section - Password Protected */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="pt-4 border-t border-gray-200"
            >
              <div className="bg-gradient-to-r from-club-secondary to-club-secondary-light p-4 rounded-lg text-white">
                <div className="text-center mb-3">
                  <h3 className="font-bold text-sm uppercase tracking-wide">Match Central</h3>
                  <p className="text-xs text-club-secondary-light">Password Protected</p>
                </div>
                <Link 
                  href="/match-central/login"
                  onClick={() => setIsOpen(false)}
                  className="block bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded text-center text-sm font-medium transition-all duration-200"
                >
                  Access Match Central 🔒
                </Link>
              </div>
            </motion.div>

            {/* Join CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="pt-4"
            >
              <Link 
                href="/join/trials" 
                onClick={() => setIsOpen(false)}
                className="block bg-gradient-to-r from-club-primary to-club-primary-dark text-white px-4 py-3 rounded-xl text-center font-bold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
              >
                Join the Club
              </Link>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
