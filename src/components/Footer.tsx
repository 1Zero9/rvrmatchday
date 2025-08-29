import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const threshold = 300; // Show after scrolling 300px
      setIsVisible(scrolled > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const footerSections = [
    {
      title: "Quick Links",
      icon: "🔗",
      links: [
        { href: "/match-central", label: "Match Central" },
        { href: "/teams", label: "Our Teams" },
        { href: "/join", label: "Join Us" },
        { href: "/contact", label: "Contact" }
      ]
    },
    {
      title: "Get Involved",
      icon: "🤝",
      links: [
        { href: "/volunteering", label: "Volunteering" },
        { href: "/fundraising", label: "Fundraising" },
        { href: "/get-involved/events", label: "Events" },
        { href: "/shop", label: "Club Shop" }
      ]
    },
    {
      title: "Members",
      icon: "👥",
      links: [
        { href: "/members", label: "Member Hub" },
        { href: "/members/parents", label: "Parents Area" },
        { href: "/members/faq", label: "FAQ" },
        { href: "/login", label: "Login" }
      ]
    }
  ];

  const sponsors = [
    { name: "Local Business 1", logo: "/images/sponsor1.png" },
    { name: "Local Business 2", logo: "/images/sponsor2.png" },
    { name: "Local Business 3", logo: "/images/sponsor3.png" },
    { name: "Local Business 4", logo: "/images/sponsor4.png" }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Compact Footer Bar */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-club-primary backdrop-blur-md border-t border-club-secondary/50"
          >
            <div className="max-w-7xl mx-auto px-6 py-3">
              <div className="flex items-center justify-between">
                {/* Left - Logo and Club Name */}
                <div className="flex items-center space-x-3">
                  <Image src="/images/logo.png" alt="Club Logo" width={32} height={32} />
                  <div>
                    <h3 className="font-bold text-white text-sm">Rivervalley Rangers AFC</h3>
                    <p className="text-gray-300 text-xs">Building Community Through Football</p>
                  </div>
                </div>

                {/* Center - Quick Actions Desktop / Mobile Message */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm px-3 py-1 rounded hover:bg-white/10">
                    ⚽ Match Central
                  </Link>
                  <Link href="/join" className="bg-club-accent hover:bg-club-secondary text-white text-sm px-3 py-1 rounded transition-colors">
                    Join Club
                  </Link>
                  <Link href="/shop" className="text-gray-300 hover:text-white transition-colors text-sm px-3 py-1 rounded hover:bg-white/10">
                    🛒 Shop
                  </Link>
                </div>
                
                {/* Mobile - Desktop Recommendation */}
                <div className="md:hidden flex items-center space-x-2 text-yellow-400 text-xs bg-yellow-400/10 px-3 py-1 rounded">
                  <span>💻</span>
                  <span>Best viewed on desktop</span>
                </div>

                {/* Right - Expand/Collapse Button */}
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors bg-white/10 px-3 py-2 rounded"
                >
                  <span className="text-sm">More Info</span>
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    ⌄
                  </motion.span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Expanded Footer Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-16 left-0 right-0 z-40 bg-club-secondary backdrop-blur-md border-t border-club-primary/50 overflow-hidden"
              >
                <div className="max-w-7xl mx-auto px-6 py-8">
                  
                  {/* Main Footer Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {footerSections.map((section, index) => (
                      <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <h4 className="text-white font-semibold mb-4 flex items-center">
                          <span className="mr-2">{section.icon}</span>
                          {section.title}
                        </h4>
                        <ul className="space-y-2">
                          {section.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="text-gray-300 hover:text-white transition-colors text-sm hover:underline"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>

                  {/* Sponsors Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="border-t border-club-primary/30 pt-8 mb-8"
                  >
                    <h4 className="text-white font-semibold mb-4 flex items-center">
                      <span className="mr-2">🤝</span>
                      Our Supporters & Sponsors
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {sponsors.map((sponsor, index) => (
                        <motion.div
                          key={sponsor.name}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                          className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center"
                        >
                          <div className="text-gray-600 text-center">
                            <div className="text-2xl mb-2">🏢</div>
                            <p className="text-xs font-medium">{sponsor.name}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <Link href="/sponsors" className="text-club-accent hover:text-white text-sm hover:underline">
                        Interested in sponsoring us? Learn more →
                      </Link>
                    </div>
                  </motion.div>

                  {/* Club Info & Contact */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="border-t border-club-primary/30 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8"
                  >
                    {/* Contact Info */}
                    <div>
                      <h4 className="text-white font-semibold mb-4 flex items-center">
                        <span className="mr-2">📞</span>
                        Get In Touch
                      </h4>
                      <div className="space-y-2 text-gray-300 text-sm">
                        <p className="flex items-center"><span className="mr-2">📧</span> info@rvrafc.ie</p>
                        <p className="flex items-center"><span className="mr-2">📱</span> +353 86 123 4567</p>
                        <p className="flex items-center"><span className="mr-2">📍</span> Rivervalley Park, Dublin</p>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div>
                      <h4 className="text-white font-semibold mb-4 flex items-center">
                        <span className="mr-2">📱</span>
                        Follow Us
                      </h4>
                      <div className="flex space-x-4">
                        <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                          <span className="text-xl">📘</span>
                        </a>
                        <a href="#" className="text-gray-300 hover:text-pink-400 transition-colors">
                          <span className="text-xl">📸</span>
                        </a>
                        <a href="#" className="text-gray-300 hover:text-blue-300 transition-colors">
                          <span className="text-xl">🐦</span>
                        </a>
                        <a href="#" className="text-gray-300 hover:text-red-400 transition-colors">
                          <span className="text-xl">📺</span>
                        </a>
                      </div>
                    </div>

                    {/* Important Links */}
                    <div>
                      <h4 className="text-white font-semibold mb-4 flex items-center">
                        <span className="mr-2">⚖️</span>
                        Important
                      </h4>
                      <div className="space-y-2">
                        <Link href="/privacy" className="block text-gray-300 hover:text-white text-sm transition-colors">
                          Privacy Policy
                        </Link>
                        <Link href="/terms" className="block text-gray-300 hover:text-white text-sm transition-colors">
                          Terms of Service
                        </Link>
                        <Link href="/safeguarding" className="block text-gray-300 hover:text-white text-sm transition-colors">
                          Child Protection
                        </Link>
                        <Link 
                          href="/admin" 
                          className="text-gray-400 hover:text-white transition-colors text-sm flex items-center"
                          title="Admin Dashboard"
                        >
                          <span className="mr-1 text-xs">🔒</span> Admin Access
                        </Link>
                      </div>
                    </div>
                  </motion.div>

                  {/* Bottom Copyright */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                    className="border-t border-club-primary/30 pt-6 mt-8 text-center text-club-neutral text-xs"
                  >
                    <p>© {currentYear} Rivervalley Rangers AFC • Building Community Through Football</p>
                    <p className="mt-1">Registered in Ireland • Club Registration: AFC-2025-001</p>
                    <p className="mt-2 text-yellow-400">💻 For the best experience, view this site on desktop</p>
                  </motion.div>
                  
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
