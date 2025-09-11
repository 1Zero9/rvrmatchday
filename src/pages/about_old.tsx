/**
 * About Page - Club Story & Heritage
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * About page converted to glass morphism design system.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';
import GlassPageTemplate from '../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../components/Glass';
import MobileLayout from '../components/MobileLayout';
import MobileAboutPro from '../components/mobile/MobileAboutPro';

export default function About() {
  const quickActions = [
    {
      icon: "📜",
      title: "Our Story",
      description: "44 years of football tradition",
      href: "/club/history",
      gradient: "blue" as const
    },
    {
      icon: "🤝",
      title: "Our Values",
      description: "Community • Development • Excellence",
      href: "/club/values",
      gradient: "green" as const
    },
    {
      icon: "🏟️",
      title: "Our Facilities",
      description: "Training grounds & clubhouse",
      href: "/club/facilities",
      gradient: "purple" as const
    },
    {
      icon: "👨‍🏫",
      title: "Our Team",
      description: "25+ qualified coaches",
      href: "/club/committee",
      gradient: "orange" as const
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
              primary: "#dc2626",
              secondary: "#1e40af"
            }
          }}
        >
          <MobileAboutPro />
        </MobileLayout>
      </div>


              {/* Our Values */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="font-bold text-lg mb-3" style={{color: '#972A4C'}}>Our Values</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: '#972A4C'}}></div>
                    <div>
                      <div className="font-semibold text-gray-900">Community</div>
                      <div className="text-sm text-gray-600">Building lasting friendships and connections</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: '#5E7794'}}></div>
                    <div>
                      <div className="font-semibold text-gray-900">Development</div>
                      <div className="text-sm text-gray-600">Growing skills, confidence, and character</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: '#98C0F0'}}></div>
                    <div>
                      <div className="font-semibold text-gray-900">Excellence</div>
                      <div className="text-sm text-gray-600">Striving for our best in everything we do</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="font-bold text-lg mb-3" style={{color: '#972A4C'}}>Learn More</h2>
                <div className="space-y-2">
                  {[
                    { href: '/club/history', label: 'Our History', desc: '44 years of tradition' },
                    { href: '/teams', label: 'Our Teams', desc: 'From youth to seniors' },
                    { href: '/club/committee', label: 'Meet the Committee', desc: 'The people behind the club' }
                  ].map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block border border-gray-200 hover:border-gray-300 p-3 rounded-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{link.label}</div>
                          <div className="text-sm text-gray-600">{link.desc}</div>
                        </div>
                        <div className="text-xl" style={{color: '#972A4C'}}>→</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Join CTA */}
            <div className="mt-8 text-center">
              <Link 
                href="/join/trials"
                className="inline-block text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{background: 'linear-gradient(to right, #972A4C, #7A2240)'}}
              >
                Join Our Community
              </Link>
            </div>
          </div>
        </StandardLayout>
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
      {/* Navigation Links to Related Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Explore Our Community</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/club/facilities" className="group">
              <div className="bg-blue-50 hover:bg-blue-100 rounded-lg p-4 border-l-4 border-blue-500 transition-all duration-200">
                <h3 className="font-medium text-blue-900 mb-2 group-hover:text-blue-700 flex items-center">
                  <span className="text-xl mr-2">🏰</span>
                  Modern Castle
                </h3>
                <p className="text-sm text-blue-700">Our facilities continue the tradition of community gathering places</p>
              </div>
            </Link>
            
            <Link href="/get-involved/fundraising" className="group">
              <div className="bg-green-50 hover:bg-green-100 rounded-lg p-4 border-l-4 border-green-500 transition-all duration-200">
                <h3 className="font-medium text-green-900 mb-2 group-hover:text-green-700 flex items-center">
                  <span className="text-xl mr-2">🌊</span>
                  Building Legacy
                </h3>
                <p className="text-sm text-green-700">Like ancient builders, we invest in our community's future</p>
              </div>
            </Link>
            
            <Link href="/teams/youth" className="group">
              <div className="bg-purple-50 hover:bg-purple-100 rounded-lg p-4 border-l-4 border-purple-500 transition-all duration-200">
                <h3 className="font-medium text-purple-900 mb-2 group-hover:text-purple-700 flex items-center">
                  <span className="text-xl mr-2">⛪</span>
                  Centers of Learning
                </h3>
                <p className="text-sm text-purple-700">Continuing St. Columba's tradition of youth development</p>
              </div>
            </Link>
          </div>
        </GlassCard>
      </motion.div>

      {/* Club Story - Priority Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16"
      >
        <GlassCard intensity="heavy" className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 text-white p-8 mb-8">
          <h2 className="text-3xl font-bold text-center mb-6">Our Club Story</h2>
          <div className="text-center mb-8">
            <span className="text-6xl">🏆</span>
          </div>
          <p className="text-lg text-slate-200 text-center max-w-4xl mx-auto leading-relaxed mb-6">
            Established in 1981, Rivervalley Rangers AFC has grown from a local youth club into a cornerstone of the Swords community. 
            For over 40 years, we've been dedicated to developing young talent, promoting inclusivity, and bringing families together through football.
          </p>
          <GlassCard intensity="medium" className="bg-blue-800/80 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-center mb-4">FAI Club Mark Accredited</h3>
            <p className="text-blue-100 text-center text-sm">
              We're proud to hold the FAI Club Mark, recognizing our commitment to best practices in governance, 
              management, and administration - creating stronger clubs and a stronger game.
            </p>
          </GlassCard>
        </GlassCard>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          <GlassCard intensity="medium" className="bg-gradient-to-br from-white/80 to-gray-50/80 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission & Programs</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">⚽</span>
                <div>
                  <strong>Boys Teams:</strong> Traditional football development across all age groups
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-pink-500 mr-3 mt-1">🌟</span>
                <div>
                  <strong>New Girls Section:</strong> Expanding opportunities for female players of all ages
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-3 mt-1">🤝</span>
                <div>
                  <strong>Football for All:</strong> Inclusive programs for children with special needs
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">👨‍👩‍👧‍👦</span>
                <div>
                  <strong>Community Programs:</strong> Walking Football, Ladies Fitness, and family activities
                </div>
              </li>
            </ul>
          </GlassCard>

          <GlassCard intensity="medium" className="bg-gradient-to-br from-green-50/80 to-green-100/80 p-8">
            <h3 className="text-2xl font-bold text-green-900 mb-4">Our Achievements</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-2xl font-bold text-green-600">44+</div>
                <div className="text-sm text-gray-600">Years Serving Community</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Players Developed</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-2xl font-bold text-purple-600">15+</div>
                <div className="text-sm text-gray-600">Active Teams</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-2xl font-bold text-orange-600">30+</div>
                <div className="text-sm text-gray-600">Volunteer Coaches</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800 text-center font-medium">
                "Football for All - Developing players, building character, strengthening community" 
                <br />- Club Mission Since 1981
              </p>
            </div>
          </GlassCard>

        </div>
      </motion.div>

      {/* Local Area History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mb-16"
      >
        <GlassCard intensity="heavy" className="bg-gradient-to-r from-amber-900/90 via-amber-800/90 to-amber-900/90 text-white p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">The Historic Area of Swords</h2>
          <p className="text-lg text-amber-100 text-center max-w-4xl mx-auto leading-relaxed">
            Our club calls home one of Ireland's most historically rich areas. From ancient castles to medieval monasteries, 
            Swords has been a center of community life for over a millennium, providing the perfect foundation for our modern football club.
          </p>
        </GlassCard>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 rounded-2xl p-8 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Join Our Football Family</h2>
        <p className="text-xl mb-8 opacity-90">
          Become part of our 44-year legacy of community, development, and excellence
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <GlassActionCard
            icon="👦"
            title="Join Our Teams"
            description="Youth and adult programs"
            href="/join"
            gradient="blue"
            size="lg"
          />
          <GlassActionCard
            icon="🤝"
            title="Get Involved"
            description="Volunteer opportunities"
            href="/get-involved"
            gradient="green"
            size="lg"
          />
          <GlassActionCard
            icon="📞"
            title="Contact Us"
            description="Learn more about the club"
            href="/contact"
            gradient="purple"
            size="lg"
          />
        </div>
      </motion.div>

      </div>
    </GlassPageTemplate>
      </div>
    </div>
  );
}