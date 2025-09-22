/**
 * 🏠 MODULAR HOME PAGE - TEMPLATE READY
 * 1Zero9.com - OneZeronine Studio
 * 
 * Features:
 * - Uses centralized content management
 * - Easy editing with clear content sections
 * - Mobile-first responsive design
 * - Template-ready for any organization
 */

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import StandardLayout from "../components/StandardLayout";
import MobileLayout from "../components/MobileLayout";
import MobileHomePro from "../components/mobile/MobileHomePro";
import AdminNotificationPopup from "../components/AdminNotificationPopup";
import { useAuth } from "../components/SecureAuth";

// Import our content management system
import {
  getOrganization,
  getHeroContent,
  getHomeContent,
  getQuickActions,
  getSEOConfig,
  replaceTemplatePlaceholders
} from "../lib/content-helpers";

// =====================================
// 📝 EDITABLE CONTENT SECTIONS
// =====================================

const HERO_SECTION = {
  video: {
    src: "/videos/hero/home-hero.mp4", // EDIT: Replace with your video
    fallbackImage: "/images/hero/home-hero.jpg", // EDIT: Replace with your image
    overlayOpacity: "bg-black/40" // EDIT: Adjust overlay darkness
  },
  
  content: {
    // These will be populated from content management system
    // But can be overridden here if needed
    customTitle: null, // Set to override content system
    customSubtitle: null, // Set to override content system
  }
};

const WELCOME_SECTION = {
  overrideContent: false, // Set to true to use custom content below
  customContent: {
    title: "Welcome to Our Community",
    description: "Custom description if you want to override the content system",
    stats: [
      { number: "1000+", label: "Members" },
      { number: "20+", label: "Years" },
      { number: "200+", label: "Events" },
      { number: "100+", label: "Achievements" }
    ]
  }
};

const FEATURES_HIGHLIGHT = {
  title: "Why Choose Us",
  subtitle: "Discover what makes our community special",
  items: [
    {
      icon: "🌟",
      title: "Excellence", 
      description: "We strive for the highest standards in everything we do",
      color: "blue"
    },
    {
      icon: "🤝",
      title: "Community",
      description: "Building lasting relationships and supporting each other",
      color: "green"
    },
    {
      icon: "📈", 
      title: "Growth",
      description: "Continuous improvement and personal development opportunities",
      color: "purple"
    }
  ]
};

// =====================================
// 🧩 COMPONENT FUNCTIONS
// =====================================

function HeroSection() {
  const [showVideo, setShowVideo] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  
  // Get content from our content management system
  const heroContent = getHeroContent('home');
  const organization = getOrganization();
  
  // Use custom content if specified, otherwise use content system
  const title = HERO_SECTION.content.customTitle || heroContent.title;
  const subtitle = HERO_SECTION.content.customSubtitle || heroContent.subtitle;
  
  const handleVideoEnd = () => {
    setVideoEnded(true);
    setTimeout(() => setShowVideo(false), 500);
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        {/* Video Background */}
        {showVideo && (
          <motion.video
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
            animate={{ opacity: videoEnded ? 0 : 1 }}
            transition={{ duration: 1 }}
          >
            <source src={HERO_SECTION.video.src} type="video/mp4" />
          </motion.video>
        )}
        
        {/* Fallback Image */}
        <motion.img 
          src={HERO_SECTION.video.fallbackImage}
          alt={`${organization.name} - Hero Image`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: showVideo ? 0 : 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 ${HERO_SECTION.video.overlayOpacity}`}></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {replaceTemplatePlaceholders(title)}
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl mb-8 opacity-90"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {replaceTemplatePlaceholders(subtitle)}
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {heroContent.cta && (
            <>
              <Link
                href={heroContent.cta.primary.href}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                {heroContent.cta.primary.text}
              </Link>
              <Link
                href={heroContent.cta.secondary.href}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                {heroContent.cta.secondary.text}
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function WelcomeSection() {
  // Get content from content system or use override
  const homeContent = getHomeContent();
  const organization = getOrganization();
  
  const content = WELCOME_SECTION.overrideContent 
    ? WELCOME_SECTION.customContent 
    : homeContent.welcomeSection;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {replaceTemplatePlaceholders(content.title)}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {replaceTemplatePlaceholders(content.description)}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {content.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {FEATURES_HIGHLIGHT.title}
          </h2>
          <p className="text-xl text-gray-600">
            {FEATURES_HIGHLIGHT.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES_HIGHLIGHT.items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickActionsSection() {
  const quickActions = getQuickActions('home');
  
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Started Today
          </h2>
          <p className="text-xl text-white opacity-90">
            Choose how you'd like to connect with our community
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href={action.href}
                className="block p-6 bg-white rounded-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-4 text-center">{action.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {action.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =====================================
// 🖥️ MAIN COMPONENT
// =====================================

export default function ModularHomePage() {
  const { isAdmin, user } = useAuth();
  const [showFloatingScroll, setShowFloatingScroll] = useState(false);
  
  // Get SEO configuration
  const seoConfig = getSEOConfig('home');
  const organization = getOrganization();

  // Handle scroll to show/hide floating scroll button
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        setShowFloatingScroll(scrollPosition > heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNextSection = () => {
    const sections = document.querySelectorAll('section');
    const currentScrollY = window.scrollY;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop;
      
      if (sectionTop > currentScrollY + 100) {
        section.scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  };

  return (
    <>
      {/* Mobile Version */}
      <div className="block md:hidden">
        <MobileLayout 
          currentPage="/home"
          showNavigation={false}
          clubData={{
            name: organization.shortName,
            logo: "/images/logo.png",
            established: organization.established,
            colors: {
              primary: "#972A4C",
              secondary: "#5E7794", 
              accent: "#98C0F0",
              neutral: "#B6B7B6"
            }
          }}
        >
          <MobileHomePro />
        </MobileLayout>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <StandardLayout currentPage="/home">
          <main>
            {/* Admin Tools - Only show for logged-in admins */}
            {isAdmin && user && (
              <div className="fixed top-6 left-6 z-50 flex flex-col space-y-4">
                {/* Bright Tools CTA */}
                <motion.div
                  initial={{ opacity: 0, x: -100, y: -50 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <Link 
                    href="/admin" 
                    className="text-black hover:text-gray-800 text-sm flex items-center space-x-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 px-5 py-3 rounded-full shadow-2xl border-2 border-yellow-600 hover:border-yellow-700 hover:shadow-2xl transition-all animate-pulse font-bold"
                    title="Admin Tools & Diagnostics"
                    style={{
                      boxShadow: '0 0 25px rgba(255, 235, 59, 0.8), 0 6px 20px rgba(0, 0, 0, 0.4)'
                    }}
                  >
                    <span className="animate-bounce text-xl">🛠️</span>
                    <span className="font-black uppercase tracking-wide text-base">ADMIN TOOLS</span>
                  </Link>
                </motion.div>

                {/* Admin Notification Popup */}
                <div className="relative">
                  <AdminNotificationPopup />
                </div>
              </div>
            )}

            {/* Page Sections */}
            <HeroSection />
            <WelcomeSection />
            <FeaturesSection />
            <QuickActionsSection />

            {/* Floating Scroll Button */}
            {showFloatingScroll && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-8 right-8 z-50"
              >
                <button
                  onClick={scrollToNextSection}
                  className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-4 shadow-2xl hover:bg-white/30 transition-all duration-300 cursor-pointer group relative overflow-hidden hover:shadow-blue-400/50 hover:shadow-2xl"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-green-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  
                  <svg className="w-6 h-6 text-gray-900 group-hover:text-blue-600 transition-colors relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </motion.div>
            )}
          </main>
        </StandardLayout>
      </div>
    </>
  );
}

// =====================================
// 📚 TEMPLATE EDITING GUIDE
// =====================================

/*
EASY EDITING INSTRUCTIONS:

1. HERO SECTION (Lines 25-42):
   - Replace video/image paths with your media
   - Adjust overlay opacity for readability
   - Override title/subtitle if needed

2. WELCOME SECTION (Lines 44-58):
   - Set overrideContent: true to use custom stats
   - Update numbers and labels for your organization
   - Modify title and description

3. FEATURES SECTION (Lines 60-80):
   - Change title and subtitle
   - Update the 3 feature items with your content
   - Customize icons and colors

4. ORGANIZATION DATA:
   - Edit /src/config/content.ts for global changes
   - This affects all pages automatically

5. SEO & META:
   - All handled automatically from content system
   - Customize in content.ts if needed

CONTENT MANAGEMENT:
- Main content is in /src/config/content.ts
- Override specific sections using the constants above
- Use replaceTemplatePlaceholders() for dynamic content
- All branding updates in one place

MOBILE EXPERIENCE:
- Uses separate MobileHomePro component
- Fully responsive design
- Touch-optimized interactions
*/