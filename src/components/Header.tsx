import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import UserNotification from "./UserNotification";
import { useAuth } from "./SecureAuth";

interface HeaderProps {
  currentSection?: string;
}

export default function Header({ currentSection = "public" }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, profile } = useAuth();

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
          { href: "/matchday", label: "MatchDay", color: "" },
          { 
            href: "/matchday", 
            label: "Matches", 
            color: "",
            dropdown: [
              { href: "/login?returnTo=/match-central", label: "🔒 Match Central", desc: "Secure match management system" },
              { href: "/welcome", label: "Dashboard", desc: "User dashboard" },
              { href: "/login?returnTo=/match-central", label: "Fixtures", desc: "Upcoming matches & schedule" },
              { href: "/login?returnTo=/match-central", label: "Results", desc: "Latest match results" },
              { href: "/login?returnTo=/match-central", label: "Tables", desc: "League standings" },
              { href: "/login?returnTo=/match-recorder", label: "🎯 Match Recorder", desc: "Authorized match recording" },
              { href: "/matchday", label: "🌐 Public MatchDay", desc: "Public match information" }
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
  
  // Get role-based header styling
  const getRoleHeaderStyle = () => {
    if (!user || !profile) {
      // Default for non-logged in users
      return {
        classes: isKidsSection 
          ? `bg-gradient-to-r from-kids-yellow via-kids-orange to-kids-purple ${isScrolled ? 'backdrop-blur-sm' : ''}`
          : `bg-club-primary/90 backdrop-blur-md border-b border-white/10 ${isScrolled ? 'bg-club-primary/95 shadow-xl backdrop-blur-lg' : ''} transition-all duration-300`,
        style: isKidsSection ? {} : {
          backgroundImage: 'url(/images/headerbg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      };
    }

    // Role-based header colors for logged-in users
    const roleStyles = {
      'admin': {
        classes: `bg-gradient-to-r from-red-600 to-red-700 border-b-4 border-red-800 ${isScrolled ? 'from-red-700 to-red-800 shadow-2xl' : ''} transition-all duration-300`,
        style: {}
      },
      'editor': {
        classes: `bg-gradient-to-r from-purple-600 to-purple-700 border-b-4 border-purple-800 ${isScrolled ? 'from-purple-700 to-purple-800 shadow-2xl' : ''} transition-all duration-300`,
        style: {}
      },
      'coach': {
        classes: `bg-gradient-to-r from-green-600 to-green-700 border-b-4 border-green-800 ${isScrolled ? 'from-green-700 to-green-800 shadow-2xl' : ''} transition-all duration-300`,
        style: {}
      },
      'manager': {
        classes: `bg-gradient-to-r from-blue-600 to-blue-700 border-b-4 border-blue-800 ${isScrolled ? 'from-blue-700 to-blue-800 shadow-2xl' : ''} transition-all duration-300`,
        style: {}
      },
      'parent': {
        classes: `bg-gradient-to-r from-orange-600 to-orange-700 border-b-4 border-orange-800 ${isScrolled ? 'from-orange-700 to-orange-800 shadow-2xl' : ''} transition-all duration-300`,
        style: {}
      },
      'volunteer': {
        classes: `bg-gradient-to-r from-teal-600 to-teal-700 border-b-4 border-teal-800 ${isScrolled ? 'from-teal-700 to-teal-800 shadow-2xl' : ''} transition-all duration-300`,
        style: {}
      }
    };

    return roleStyles[profile.role?.toLowerCase()] || roleStyles['admin'];
  };

  const { classes: headerClasses, style: headerStyle } = getRoleHeaderStyle();
  const textColorClass = 'text-white text-shadow font-semibold'; // Always white text with role colors

  return (
    <>
      {/* Mobile Header - Clean Design for All Pages */}
      <div className="block md:hidden">
        <div className={`fixed top-0 left-0 w-full z-50 shadow-lg text-white ${headerClasses}`} style={headerStyle}>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
                <img 
                  src="/images/logo.png" 
                  alt="Club Logo" 
                  className="h-8 w-8" 
                />
                <span className="font-bold text-white">RVR AFC</span>
              </Link>
            </div>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white text-2xl focus:outline-none"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-lg border-t border-gray-100 overflow-hidden"
              >
                <div className="px-4 py-6 space-y-3">
                  {[
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
                        className="block bg-white border border-gray-200 p-4 rounded-lg transition-all duration-200 hover:shadow-sm"
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#972A4C'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 font-medium">{navItem.label}</span>
                          <span style={{color: '#972A4C'}}>→</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}

                  {/* Match Central Section */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="p-4 rounded-lg text-white" style={{background: 'linear-gradient(to right, #5E7794, #7A92AD)'}}>
                      <div className="text-center mb-3">
                        <h3 className="font-bold text-sm uppercase tracking-wide">Match Central</h3>
                        <p className="text-xs text-blue-200">Password Protected</p>
                      </div>
                      <Link 
                        href="/login?returnTo=/match-central"
                        onClick={() => setIsOpen(false)}
                        className="block bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded text-center text-sm font-medium transition-all duration-200"
                      >
                        Access Match Central 🔒
                      </Link>
                    </div>
                  </div>

                  {/* Join CTA */}
                  <div className="pt-4">
                    <Link 
                      href="/join/trials" 
                      onClick={() => setIsOpen(false)}
                      className="block text-white px-4 py-3 rounded-xl text-center font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{background: 'linear-gradient(to right, #972A4C, #7A2240)'}}
                    >
                      Join the Club
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop Header */}
      <header
        className={`hidden md:block fixed top-0 left-0 w-full z-50 ${headerClasses}`}
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
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="flex items-center">
                <Link 
                  href={item.href} 
                  className={`hover:text-white/80 transition-colors duration-200 font-medium px-3 py-2 rounded ${
                    item.color || textColorClass
                  } ${isKidsSection ? 'text-lg font-bold' : 'drop-shadow-sm'}`}
                >
                  {item.label}
                </Link>
                {(item as any).dropdown && (
                  <span className={`ml-1 text-xs transition-transform duration-200 group-hover:rotate-180 ${
                    item.color || textColorClass
                  }`}>
                    ▼
                  </span>
                )}
              </div>
              
              {/* Dropdown Menu - More Responsive */}
              {(item as any).dropdown && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    {(item as any).dropdown.map((dropItem: any, dropIndex: number) => (
                      <Link
                        key={dropItem.href}
                        href={dropItem.href}
                        className="block px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-b last:border-b-0 transition-colors duration-150"
                      >
                        <div className="font-semibold text-sm text-gray-900">{dropItem.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{dropItem.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </nav>

        {/* User Notification & Action Buttons */}
        <div className="flex items-center space-x-4">
          <UserNotification />
          
          <div className="hidden md:flex space-x-3">
            {currentSection === "public" && (
              <>
                <Link href="/login" className="bg-primary-600 px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-white">
                  Coaches
                </Link>
                <Link href="/login" className="bg-accent-teal px-4 py-2 rounded-lg hover:bg-accent-teal/80 transition-colors font-semibold">
                  Members
                </Link>
                <Link href="/kids" className="bg-kids-orange px-4 py-2 rounded-lg hover:bg-kids-orange/80 transition-colors font-semibold">
                  Kids Zone
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
    </>
  );
}
