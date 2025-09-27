/**
 * About Page - Club Story & Heritage (Clean Professional Version)
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * About page converted to glass morphism design system with professional mobile.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';
import GlassPageTemplate from '../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../components/Glass';
import MobileLayout from '../components/MobileLayout';
import MobileAboutPro from '../components/mobile/MobileAboutPro';
import InlineEditor from '../components/InlineEditor';
import MaintenanceWrapper from '../components/MaintenanceWrapper';

function About() {
  const quickActions = [
    {
      icon: "🏛️",
      title: "Club Info",
      description: "Learn more about our club",
      href: "/club",
      gradient: "blue" as const
    },
    {
      icon: "⚽",
      title: "Join Us",
      description: "Start your football journey",
      href: "/join/trials",
      gradient: "green" as const
    }
  ];

  return (
    <div>
      {/* Mobile Version - Professional */}
      <div className="block md:hidden">
        <MobileLayout 
          currentPage="/about"
          clubData={{
            name: "RVR AFC", 
            logo: "/images/logo.png",
            established: "1981",
            colors: {
              primary: "#972A4C",
              secondary: "#5E7794",
              accent: "#98C0F0",
              neutral: "#B6B7B6"
            }
          }}
        >
          <MobileAboutPro />
        </MobileLayout>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <GlassPageTemplate
          heroTitle="About Rivervalley Rangers"
          heroSubtitle="From Ancient Swords to Modern Football • A Thousand Years of Community Spirit"
          heroIcon="🏰"
          backgroundImage="/images/hero/cornerflag.png"
          quickActions={quickActions}
          sectionName="ABOUT"
          imageSpecs="1920x1080px minimum, club heritage and community activities preferred"
        >
          <div className="pb-16">
            {/* Our Story Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-16"
            >
              <GlassCard className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
                  <div className="w-20 h-1 bg-club-primary mx-auto rounded-full"></div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <InlineEditor
                      contentKey="about_story_content"
                      initialContent={`Founded in 1981, Rivervalley Rangers AFC has been at the heart of our community for over 40 years. What started as a small local club has grown into one of the region's most respected football organizations.

We pride ourselves on developing not just great football players, but great people. Our commitment to community, development, and excellence drives everything we do.

Today, with over 350 active players across 18 teams, we continue to provide opportunities for players of all ages and abilities to experience the joy of football.`}
                      type="textarea"
                      className="text-lg"
                      placeholder="Our story content..."
                      renderMarkdown={false}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md">
                      <div className="text-3xl font-bold text-club-primary mb-2">350+</div>
                      <div className="text-gray-600 text-sm">Active Players</div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md">
                      <div className="text-3xl font-bold text-club-primary mb-2">18</div>
                      <div className="text-gray-600 text-sm">Teams</div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md">
                      <div className="text-3xl font-bold text-club-primary mb-2">25</div>
                      <div className="text-gray-600 text-sm">Qualified Coaches</div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md">
                      <div className="text-3xl font-bold text-club-primary mb-2">44</div>
                      <div className="text-gray-600 text-sm">Years Experience</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Values - Simplified */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-16"
            >
              <GlassCard className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">What We Stand For</h3>
                <InlineEditor
                  contentKey="about_values_simple"
                  initialContent="Community • Development • Excellence • Respect. These four pillars guide everything we do at Rivervalley Rangers AFC."
                  className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed"
                  placeholder="Our values..."
                />
              </GlassCard>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <GlassCard className="p-8 text-center">
                <InlineEditor
                  contentKey="about_cta_block"
                  initialContent={`**Ready to Join Our Story?**

Be part of Dublin's most welcoming football community. All ages and abilities welcome.`}
                  type="textarea"
                  className="text-center"
                  placeholder="Call to action content..."
                  renderMarkdown={true}
                />
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/join/trials"
                    className="bg-club-primary hover:bg-club-primary-dark text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Book a Trial
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30"
                  >
                    Get in Touch
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </GlassPageTemplate>
      </div>
    </div>
  );
}

// Export with maintenance wrapper
export default function AboutPage() {
  return (
    <MaintenanceWrapper pagePath="/about" fallbackTitle="About Us">
      <About />
    </MaintenanceWrapper>
  );
}