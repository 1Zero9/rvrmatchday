/**
 * Parents Area - Resources and Information for Parents
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Parents page converted to glass morphism design system with friendly, casual approach.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../../components/Glass';

export default function ParentsArea() {
  const quickActions = [
    {
      icon: "📅",
      title: "Match Schedule",
      description: "Never miss a game!",
      href: "/match-central/fixtures",
      gradient: "blue" as const
    },
    {
      icon: "⚽",
      title: "Team Info",
      description: "Training times & coaches",
      href: "/teams/youth",
      gradient: "green" as const
    },
    {
      icon: "📝",
      title: "Registration",
      description: "Forms & sign-ups",
      href: "/join/trials",
      gradient: "purple" as const
    },
    {
      icon: "👥",
      title: "Parent Groups",
      description: "WhatsApp & communities",
      href: "#communications",
      gradient: "orange" as const
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Hey Parents! 😊"
      heroSubtitle="Everything you need to support your little footballer • We're here to help! 💚"
      heroIcon="👨‍👩‍👧‍👦"
      quickActions={quickActions}
      sectionName="PARENTS"
      imageSpecs="1200x600px recommended, family-friendly football moments preferred"
      heroSize="compact"
    >

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2">
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">🎆</span>
                Quick Access for Busy Parents
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <GlassActionCard
                  icon="📅"
                  title="Fixtures & Results"
                  description="Never miss a match again!"
                  href="/match-central/fixtures"
                  gradient="blue"
                />
                
                <GlassActionCard
                  icon="⚽"
                  title="Youth Teams"
                  description="Training schedules & team info"
                  href="/teams/youth"
                  gradient="green"
                />
                
                <GlassActionCard
                  icon="📝"
                  title="Registration Forms"
                  description="Easy online sign-ups"
                  href="/join/trials"
                  gradient="purple"
                />
                
                <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/80 rounded-xl p-6 border border-orange-200 backdrop-blur">
                  <div className="text-3xl mb-3 text-center">📱</div>
                  <h3 className="font-semibold text-orange-900 text-center mb-2">Team Communications</h3>
                  <p className="text-orange-700 text-sm text-center">WhatsApp groups & email updates</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Parent Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">📚</span>
                Parent Resources & Tips
              </h2>
              
              <div className="space-y-6">
                <GlassCard intensity="light" className="border-l-4 border-blue-500 pl-6 bg-gradient-to-br from-blue-50/60 to-blue-100/60">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="mr-2">🎯</span>
                    Youth Football Development Guide
                  </h3>
                  <p className="text-gray-600 mb-3">Understanding age-appropriate development stages and how to support your child's football journey 😊</p>
                  <div className="space-y-2">
                    <p className="text-sm text-blue-600">• Age 6-8: Fun, participation, and basic skills ⚔️</p>
                    <p className="text-sm text-blue-600">• Age 9-12: Technique development and teamwork 🤝</p>
                    <p className="text-sm text-blue-600">• Age 13-16: Tactical understanding and competition 🎮</p>
                    <p className="text-sm text-blue-600">• Age 17+: Performance and pathway planning 🚀</p>
                  </div>
                </GlassCard>
                
                <GlassCard intensity="light" className="border-l-4 border-green-500 pl-6 bg-gradient-to-br from-green-50/60 to-green-100/60">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="mr-2">🎉</span>
                    Match Day Guidelines
                  </h3>
                  <p className="text-gray-600 mb-3">How to best support your child and team during matches 🎆</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1 flex items-center">
                        <span className="mr-1">✅</span> Do:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Encourage all players 📣</li>
                        <li>• Respect the referee 🙏</li>
                        <li>• Stay in designated areas 📍</li>
                        <li>• Focus on effort and fun 😄</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-700 mb-1 flex items-center">
                        <span className="mr-1">❌</span> Don't:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Coach from the sideline 🙅</li>
                        <li>• Criticize players or officials 😐</li>
                        <li>• Focus solely on winning 🏆</li>
                        <li>• Enter the field of play ⚠️</li>
                      </ul>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard intensity="light" className="border-l-4 border-purple-500 pl-6 bg-gradient-to-br from-purple-50/60 to-purple-100/60">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="mr-2">🌡️</span>
                    Health & Safety Information
                  </h3>
                  <p className="text-gray-600 mb-3">Important health and safety guidelines for youth players 😌</p>
                  <div className="bg-purple-100/80 rounded-lg p-4">
                    <ul className="text-sm text-purple-700 space-y-2">
                      <li>• Medical forms must be kept up to date 📝</li>
                      <li>• Inform coaches of any injuries or concerns 🩹</li>
                      <li>• Ensure proper hydration before and after training 💧</li>
                      <li>• Appropriate clothing for weather conditions 🌦️</li>
                      <li>• Emergency contact details must be current 📞</li>
                    </ul>
                  </div>
                </GlassCard>
              </div>
            </GlassCard>
          </motion.div>

          {/* Communication Channels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            id="communications"
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3">📱</span>
                Stay Connected with Other Parents!
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">💬</span>
                    WhatsApp Groups
                  </h3>
                  <div className="space-y-3 text-sm">
                    <GlassCard intensity="light" className="bg-green-50/80 rounded-lg p-3">
                      <p className="font-medium text-green-900 flex items-center">
                        <span className="mr-2">👶</span> U10 Parents
                      </p>
                      <p className="text-green-700">Quick updates and match reminders</p>
                    </GlassCard>
                    <GlassCard intensity="light" className="bg-green-50/80 rounded-lg p-3">
                      <p className="font-medium text-green-900 flex items-center">
                        <span className="mr-2">🧒</span> U12 Parents
                      </p>
                      <p className="text-green-700">Training schedules and team news</p>
                    </GlassCard>
                    <GlassCard intensity="light" className="bg-green-50/80 rounded-lg p-3">
                      <p className="font-medium text-green-900 flex items-center">
                        <span className="mr-2">👥</span> Youth Parents General
                      </p>
                      <p className="text-green-700">Club-wide announcements</p>
                    </GlassCard>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">📧</span>
                    Email Updates
                  </h3>
                  <div className="space-y-3 text-sm">
                    <GlassCard intensity="light" className="bg-blue-50/80 rounded-lg p-3">
                      <p className="font-medium text-blue-900 flex items-center">
                        <span className="mr-2">📰</span> Weekly Newsletter
                      </p>
                      <p className="text-blue-700">Every Sunday evening 🌅</p>
                    </GlassCard>
                    <GlassCard intensity="light" className="bg-blue-50/80 rounded-lg p-3">
                      <p className="font-medium text-blue-900 flex items-center">
                        <span className="mr-2">⚽</span> Match Reports
                      </p>
                      <p className="text-blue-700">After every fixture 📝</p>
                    </GlassCard>
                    <GlassCard intensity="light" className="bg-blue-50/80 rounded-lg p-3">
                      <p className="font-medium text-blue-900 flex items-center">
                        <span className="mr-2">🎉</span> Club Events
                      </p>
                      <p className="text-blue-700">Special events and fundraisers</p>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          
          {/* Members Area Navigation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👨‍👩‍👧‍👦</span>
                Members Area
              </h3>
              <nav className="space-y-2">
                <div className="bg-gradient-to-r from-blue-50/80 to-green-50/80 text-blue-700 px-3 py-2 rounded font-medium backdrop-blur">
                  🎆 Parents Area
                </div>
                <Link href="/contact" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50/80 transition-colors">
                  📞 Coach Contact
                </Link>
                <Link href="/contact" className="block text-gray-600 hover:text-blue-600 px-3 py-2 rounded hover:bg-gray-50/80 transition-colors">
                  💬 General Inquiries
                </Link>
              </nav>
            </GlassCard>
          </motion.div>

          {/* Important Contacts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6"
          >
            <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📦</span>
                Important Contacts
              </h3>
              <div className="space-y-4 text-sm">
                <GlassCard intensity="light" className="p-3 bg-gradient-to-br from-blue-50/60 to-blue-100/60">
                  <p className="font-medium text-gray-900 flex items-center">
                    <span className="mr-2">⚽</span> Youth Coordinator
                  </p>
                  <p className="text-gray-600">Sarah O'Connor</p>
                  <p className="text-blue-600">youth@rvrfc.com</p>
                  <p className="text-gray-500">+353 1 123 4567</p>
                </GlassCard>
                <GlassCard intensity="light" className="p-3 bg-gradient-to-br from-purple-50/60 to-purple-100/60">
                  <p className="font-medium text-gray-900 flex items-center">
                    <span className="mr-2">🚪</span> Safeguarding Officer
                  </p>
                  <p className="text-gray-600">Maria Walsh</p>
                  <p className="text-purple-600">safeguarding@rvrfc.com</p>
                  <p className="text-gray-500">+353 1 123 4571</p>
                </GlassCard>
                <GlassCard intensity="light" className="p-3 bg-gradient-to-br from-green-50/60 to-green-100/60">
                  <p className="font-medium text-gray-900 flex items-center">
                    <span className="mr-2">📄</span> Club Secretary
                  </p>
                  <p className="text-gray-600">John Murphy</p>
                  <p className="text-green-600">secretary@rvrfc.com</p>
                  <p className="text-gray-500">+353 1 123 4560</p>
                </GlassCard>
              </div>
            </GlassCard>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-6"
          >
            <GlassCard intensity="medium" className="bg-gradient-to-br from-orange-50/80 to-red-50/80 rounded-lg p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🎉</span>
                Upcoming Parent Events
              </h3>
              <div className="space-y-3 text-sm">
                <GlassCard intensity="light" className="bg-white/80 rounded-lg p-3">
                  <p className="font-medium text-orange-900 flex items-center">
                    <span className="mr-2">☕</span> Parent Coffee Morning
                  </p>
                  <p className="text-orange-700">Saturday 9:30 AM 😊</p>
                  <p className="text-xs text-gray-600">Clubhouse - All welcome!</p>
                </GlassCard>
                <GlassCard intensity="light" className="bg-white/80 rounded-lg p-3">
                  <p className="font-medium text-red-900 flex items-center">
                    <span className="mr-2">📋</span> AGM Meeting
                  </p>
                  <p className="text-red-700">Thursday 7:00 PM 💼</p>
                  <p className="text-xs text-gray-600">Important club decisions</p>
                </GlassCard>
                <GlassCard intensity="light" className="bg-white/80 rounded-lg p-3">
                  <p className="font-medium text-blue-900 flex items-center">
                    <span className="mr-2">🎆</span> Family Fun Day
                  </p>
                  <p className="text-blue-700">Sunday 12:00 PM 🎉</p>
                  <p className="text-xs text-gray-600">Fundraising event 🎈</p>
                </GlassCard>
              </div>
            </GlassCard>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">❓</span>
                Frequently Asked Questions
              </h3>
              <div className="space-y-3 text-sm">
                <details className="cursor-pointer">
                  <summary className="font-medium text-gray-700 hover:text-blue-600 flex items-center">
                    <span className="mr-2">⏰</span> When are training sessions?
                  </summary>
                  <p className="text-gray-600 mt-2 pl-6">Training times vary by age group. Check the team page for specific schedules 📅</p>
                </details>
                <details className="cursor-pointer">
                  <summary className="font-medium text-gray-700 hover:text-blue-600 flex items-center">
                    <span className="mr-2">👟</span> What equipment is needed?
                  </summary>
                  <p className="text-gray-600 mt-2 pl-6">Football boots, shin pads, and weather-appropriate clothing. Kit is provided by the club ⚽</p>
                </details>
                <details className="cursor-pointer">
                  <summary className="font-medium text-gray-700 hover:text-blue-600 flex items-center">
                    <span className="mr-2">🤝</span> How do I volunteer to help?
                  </summary>
                  <p className="text-gray-600 mt-2 pl-6">Contact your team manager or visit our Get Involved section for volunteer opportunities 😊</p>
                </details>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

    </GlassPageTemplate>
  );
}