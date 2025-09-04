/**
 * Book Astro Page - 3G Pitch Booking
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../components/Glass';

export default function BookAstro() {
  const quickActions = [
    {
      icon: "📅",
      title: "Book Now",
      description: "Reserve your pitch time",
      href: "https://portal.sportskey.com/venues/st-finian-s-astro?mp=true&fbclid=PAZXh0bgNhZW0CMTEAAaes8aDsj2yn2agw_sQyvWJ1UyM6vR_cgWuGwnzLAWTrqsz9MelTJyqcNckiyg_aem_keRy5UZLr6uMrz3Fwiq6yw",
      gradient: "green" as const,
      external: true
    },
    {
      icon: "⚽",
      title: "Pitch Info",
      description: "3G surface, floodlit, all weather",
      href: "#pitch-details",
      gradient: "blue" as const
    },
    {
      icon: "💰",
      title: "Pricing",
      description: "Competitive rates for all users",
      href: "#pricing",
      gradient: "purple" as const
    },
    {
      icon: "📞",
      title: "Contact",
      description: "Need help with booking?",
      href: "/contact",
      gradient: "orange" as const
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Book the Astro"
      heroSubtitle="Reserve Ward Rivervalley All Weather Astro Pitch"
      backgroundImage="/images/hero/astro-ward.png"
      quickActions={quickActions}
      sectionName="ASTRO"
    >
      {/* Main Content */}
      <div className="space-y-12 pb-16">
        
        {/* Booking Information */}
        <GlassCard gradient="dark" className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Premium 3G Astro Pitch
            </h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Our state-of-the-art 3G astro pitch is available for public booking when not in use by River Valley Rangers. 
              Perfect for training sessions, casual games, or competitive matches.
            </p>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 mb-8">
              <a
                href="https://portal.sportskey.com/venues/st-finian-s-astro?mp=true&fbclid=PAZXh0bgNhZW0CMTEAAaes8aDsj2yn2agw_sQyvWJ1UyM6vR_cgWuGwnzLAWTrqsz9MelTJyqcNckiyg_aem_keRy5UZLr6uMrz3Fwiq6yw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="text-2xl mr-3">📅</span>
                Book Astro Pitch Now
                <span className="ml-2">↗️</span>
              </a>
              <p className="text-white/70 text-sm mt-3">
                Powered by SportsKey - Secure online booking system
              </p>
            </div>
          </motion.div>
        </GlassCard>

        {/* Pitch Details */}
        <GlassCard id="pitch-details" gradient="blue" className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Pitch Specifications
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">🌱</span>
                  <div>
                    <h4 className="font-semibold text-white">Premium 3G Surface</h4>
                    <p className="text-white/90 text-sm">FIFA quality artificial grass</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">💡</span>
                  <div>
                    <h4 className="font-semibold text-white">Floodlit</h4>
                    <p className="text-white/90 text-sm">Play day or night</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">🌧️</span>
                  <div>
                    <h4 className="font-semibold text-white">All Weather</h4>
                    <p className="text-white/90 text-sm">Rain or shine availability</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">📏</span>
                  <div>
                    <h4 className="font-semibold text-white">Full Size Pitch</h4>
                    <p className="text-white/90 text-sm">11v11 regulation dimensions</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">🥅</span>
                  <div>
                    <h4 className="font-semibold text-white">Professional Goals</h4>
                    <p className="text-white/90 text-sm">Regulation size goalposts</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-4">🚗</span>
                  <div>
                    <h4 className="font-semibold text-white">Parking</h4>
                    <p className="text-white/90 text-sm">On-site parking available</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </GlassCard>

        {/* Pricing */}
        <GlassCard id="pricing" gradient="purple" className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Booking Rates
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">🌅</div>
                <h4 className="font-bold text-white mb-2">Peak Hours</h4>
                <p className="text-white/80 text-sm mb-3">Evenings & Weekends</p>
                <div className="text-2xl font-bold text-white">€80</div>
                <div className="text-white/70 text-sm">per hour</div>
              </div>
              <div className="text-center bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">☀️</div>
                <h4 className="font-bold text-white mb-2">Off-Peak</h4>
                <p className="text-white/80 text-sm mb-3">Weekday Mornings</p>
                <div className="text-2xl font-bold text-white">€60</div>
                <div className="text-white/70 text-sm">per hour</div>
              </div>
              <div className="text-center bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl mb-3">⚽</div>
                <h4 className="font-bold text-white mb-2">Youth Teams</h4>
                <p className="text-white/80 text-sm mb-3">Under 16s Discount</p>
                <div className="text-2xl font-bold text-white">€45</div>
                <div className="text-white/70 text-sm">per hour</div>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-white/70 text-sm">
                * Prices subject to availability. Block bookings available with discount.
              </p>
            </div>
          </motion.div>
        </GlassCard>

        {/* Booking Process */}
        <GlassCard gradient="orange" className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              How to Book
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-4">1️⃣</div>
                <h4 className="font-semibold text-white mb-2">Check Availability</h4>
                <p className="text-white/90 text-sm">View real-time pitch availability</p>
              </div>
              <div className="text-center bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-4">2️⃣</div>
                <h4 className="font-semibold text-white mb-2">Select Time</h4>
                <p className="text-white/90 text-sm">Choose your preferred slot</p>
              </div>
              <div className="text-center bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-4">3️⃣</div>
                <h4 className="font-semibold text-white mb-2">Pay Online</h4>
                <p className="text-white/90 text-sm">Secure payment processing</p>
              </div>
              <div className="text-center bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl mb-4">4️⃣</div>
                <h4 className="font-semibold text-white mb-2">Play!</h4>
                <p className="text-white/90 text-sm">Enjoy your session</p>
              </div>
            </div>
          </motion.div>
        </GlassCard>

        {/* Location & Access */}
        <GlassCard gradient="blue" className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Location & Access
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <h4 className="font-semibold text-white mb-4 flex items-center">
                  <span className="text-xl mr-3">📍</span>
                  St. Finian's Astro Pitch
                </h4>
                <div className="space-y-3 text-white/90">
                  <p>St. Finian's GAA Club</p>
                  <p>Newcastle Road</p>
                  <p>Swords, Co. Dublin</p>
                  <p className="pt-2">
                    <strong>Access:</strong> Main entrance via Newcastle Road
                  </p>
                </div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <h4 className="font-semibold text-white mb-4 flex items-center">
                  <span className="text-xl mr-3">🕒</span>
                  Booking Hours
                </h4>
                <div className="space-y-2 text-white/90 text-sm">
                  <p><strong>Monday - Friday:</strong> 6:00 AM - 10:00 PM</p>
                  <p><strong>Saturday:</strong> 8:00 AM - 8:00 PM</p>
                  <p><strong>Sunday:</strong> 9:00 AM - 6:00 PM</p>
                  <p className="pt-2 text-white/70">
                    * Subject to River Valley Rangers training and match schedules
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8 pt-6 border-t border-white/20">
              <a
                href="https://portal.sportskey.com/venues/st-finian-s-astro?mp=true&fbclid=PAZXh0bgNhZW0CMTEAAaes8aDsj2yn2agw_sQyvWJ1UyM6vR_cgWuGwnzLAWTrqsz9MelTJyqcNckiyg_aem_keRy5UZLr6uMrz3Fwiq6yw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 bg-green-600/80 hover:bg-green-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 backdrop-blur-sm"
              >
                <span className="text-xl mr-3">🚀</span>
                Start Booking Process
                <span className="ml-2">↗️</span>
              </a>
            </div>
          </motion.div>
        </GlassCard>

        {/* Terms & Conditions */}
        <GlassCard gradient="green" className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              Booking Terms
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-white/90">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <h4 className="font-semibold text-white mb-2">⚠️ Important Notes:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Bookings subject to availability</li>
                  <li>RVR training/matches take priority</li>
                  <li>Minimum 1-hour booking slots</li>
                  <li>Payment required to confirm booking</li>
                </ul>
              </div>
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
                <h4 className="font-semibold text-white mb-2">✅ What's Included:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Premium 3G artificial surface</li>
                  <li>Floodlight usage</li>
                  <li>Goal posts and nets</li>
                  <li>On-site parking</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-6 pt-4 border-t border-white/20">
              <p className="text-white/70 text-xs">
                For enquiries about regular bookings or block discounts, please <Link href="/contact" className="text-green-400 hover:text-green-300 underline">contact us</Link>
              </p>
            </div>
          </motion.div>
        </GlassCard>

      </div>
    </GlassPageTemplate>
  );
}