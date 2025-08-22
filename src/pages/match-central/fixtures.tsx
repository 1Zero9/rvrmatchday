/**
 * Fixtures Landing Page
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Complete fixtures overview with glass morphism design
 */

import { GlassPageTemplate } from '../../components/GlassPageTemplate';
import { GlassCard, GlassActionCard, GlassStats } from '../../components/Glass';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Fixtures() {
  const quickActions = [
    {
      title: "This Week's Fixtures",
      description: "See what's coming up",
      href: "#this-week",
      icon: "📅",
      gradient: "blue"
    },
    {
      title: "My Team's Schedule", 
      description: "Filter by your team",
      href: "#my-team",
      icon: "👥",
      gradient: "green"
    },
    {
      title: "Venue Information",
      description: "Directions & details",
      href: "#venues",
      icon: "📍",
      gradient: "purple"
    },
    {
      title: "Season Calendar",
      description: "Download full schedule",
      href: "#calendar",
      icon: "📲",
      gradient: "orange"
    }
  ];

  const thisWeekFixtures = [
    {
      id: 1,
      date: '2025-01-25',
      time: '14:30',
      team: 'First Team',
      opponent: 'Greenfield FC',
      venue: 'Away - Greenfield Sports Ground',
      league: 'Division 1A',
      importance: 'high'
    },
    {
      id: 2,
      date: '2025-01-26',
      time: '11:00',
      team: 'U16 Boys',
      opponent: 'Hillside Rovers',
      venue: 'Home - Rivervalley Park',
      league: 'Youth League',
      importance: 'medium'
    },
    {
      id: 3,
      date: '2025-01-28',
      time: '19:30',
      team: 'Reserve Team',
      opponent: 'Parkside United',
      venue: 'Home - Rivervalley Park',
      league: 'Division 3B',
      importance: 'medium'
    }
  ];

  const upcomingHighlights = [
    {
      title: "County Cup Quarter-Final",
      team: "U18 Boys",
      date: "February 2nd",
      opponent: "Milltown FC",
      description: "Huge match in our cup run!"
    },
    {
      title: "Top of Table Clash",
      team: "First Team", 
      date: "February 8th",
      opponent: "Riverside United",
      description: "Could decide the league title"
    },
    {
      title: "Derby Day",
      team: "Reserve Team",
      date: "February 15th", 
      opponent: "Valley Rangers",
      description: "Local rivalry match"
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Fixtures & Schedule"
      heroSubtitle="Never miss a match - complete fixture list for all our teams"
      heroIcon="📅"
      backgroundImage="/images/homepg-image1.jpg"
      quickActions={quickActions}
      sectionName="FIXTURES"
    >
      <div className="space-y-12">
        
        {/* This Week's Fixtures */}
        <section id="this-week">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-blue-50/80 to-white/80">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">📅</span>
                This Week's Fixtures
              </h2>
              
              <div className="space-y-4">
                {thisWeekFixtures.map((fixture, index) => (
                  <motion.div
                    key={fixture.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`border-l-4 ${
                      fixture.importance === 'high' ? 'border-red-500' : 
                      fixture.importance === 'medium' ? 'border-yellow-500' : 'border-gray-300'
                    } bg-white/60 backdrop-blur-sm rounded-lg p-6 hover:shadow-md transition-all`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-gray-900 mr-3">{fixture.team}</h3>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {fixture.league}
                          </span>
                        </div>
                        <p className="text-lg text-gray-700 mb-1">vs {fixture.opponent}</p>
                        <p className="text-sm text-gray-600">{fixture.venue}</p>
                      </div>
                      <div className="mt-4 lg:mt-0 lg:text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {new Date(fixture.date).toLocaleDateString('en-GB', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </p>
                        <p className="text-md text-gray-700">{fixture.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Link 
                  href="#full-calendar"
                  className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Full Fixture List
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Upcoming Highlights */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Upcoming Highlights</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingHighlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                >
                  <GlassCard intensity="light" className="p-6 h-full bg-gradient-to-br from-purple-50/80 to-pink-50/80">
                    <div className="text-center mb-4">
                      <div className="text-2xl mb-2">🌟</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{highlight.title}</h3>
                      <p className="text-blue-600 font-semibold">{highlight.team}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-700 font-medium mb-1">{highlight.date}</p>
                      <p className="text-gray-600 mb-3">vs {highlight.opponent}</p>
                      <p className="text-sm text-gray-600">{highlight.description}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Team Filtering Section */}
        <section id="my-team">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-green-50/80 to-white/80">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Filter by Team</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "First Team", count: 12, color: "blue" },
                  { name: "Reserve Team", count: 8, color: "green" },
                  { name: "U18 Boys", count: 15, color: "purple" },
                  { name: "U16 Boys", count: 18, color: "orange" },
                  { name: "U14 Boys", count: 20, color: "red" },
                  { name: "U12 Boys", count: 16, color: "indigo" },
                  { name: "U16 Girls", count: 12, color: "pink" },
                  { name: "U14 Girls", count: 14, color: "cyan" }
                ].map((team, index) => (
                  <motion.div
                    key={team.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + (index * 0.05) }}
                  >
                    <GlassActionCard
                      title={team.name}
                      description={`${team.count} fixtures`}
                      href={`#${team.name.toLowerCase().replace(' ', '-')}`}
                      icon="⚽"
                      gradient={team.color as any}
                      size="sm"
                    />
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Venue Information */}
        <section id="venues">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Venue Information</h2>
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Home Venue */}
              <GlassCard intensity="light" className="p-6 bg-gradient-to-br from-green-50/80 to-white/80">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🏟️</div>
                  <h3 className="text-xl font-bold text-gray-900">Rivervalley Park</h3>
                  <p className="text-green-600 font-semibold">Our Home Ground</p>
                </div>
                <div className="space-y-3 text-sm">
                  <p><strong>Address:</strong> Rivervalley Park, Dublin</p>
                  <p><strong>Facilities:</strong> 2 Full Pitches, Changing Rooms, Spectator Area</p>
                  <p><strong>Parking:</strong> Free on-site parking available</p>
                  <p><strong>Public Transport:</strong> Bus routes 15, 46A, 63</p>
                </div>
                <div className="text-center mt-6">
                  <Link 
                    href="/club/facilities"
                    className="inline-block bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Facilities
                  </Link>
                </div>
              </GlassCard>

              {/* Away Venues */}
              <GlassCard intensity="light" className="p-6 bg-gradient-to-br from-blue-50/80 to-white/80">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🗺️</div>
                  <h3 className="text-xl font-bold text-gray-900">Away Venues</h3>
                  <p className="text-blue-600 font-semibold">Visiting Grounds</p>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="border-b border-gray-200 pb-2">
                    <p><strong>Greenfield Sports Ground</strong></p>
                    <p className="text-gray-600">15 minutes drive • Parking available</p>
                  </div>
                  <div className="border-b border-gray-200 pb-2">
                    <p><strong>Hillside Park</strong></p>
                    <p className="text-gray-600">20 minutes drive • Limited parking</p>
                  </div>
                  <div>
                    <p><strong>Parkside Community Ground</strong></p>
                    <p className="text-gray-600">10 minutes drive • Street parking</p>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <Link 
                    href="#directions"
                    className="inline-block bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Directions
                  </Link>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        </section>

        {/* Calendar Integration */}
        <section id="calendar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <GlassCard intensity="medium" className="p-8 text-center bg-gradient-to-br from-purple-50/80 to-white/80">
              <div className="text-6xl mb-6">📲</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Never Miss a Match</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                Download our fixtures to your phone calendar and get automatic reminders for upcoming matches.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="#download-ical"
                  className="bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  📅 Download Calendar
                </Link>
                <Link 
                  href="#notifications"
                  className="bg-orange-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  🔔 Match Notifications
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </section>

      </div>
    </GlassPageTemplate>
  );
}