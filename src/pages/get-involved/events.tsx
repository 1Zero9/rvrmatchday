import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard } from '../../components/Glass';

export default function GetInvolvedEvents() {
  const quickActions = [
    {
      icon: "🤝",
      title: "Volunteering",
      description: "Help with club activities",
      href: "/get-involved/volunteering",
      gradient: "blue" as const
    },
    {
      icon: "💰",
      title: "Fundraising",
      description: "Support our initiatives",
      href: "/get-involved/fundraising",
      gradient: "green" as const
    },
    {
      icon: "🏆",
      title: "Sponsorship",
      description: "Partner with our club",
      href: "/get-involved/sponsorship",
      gradient: "purple" as const
    },
    {
      icon: "📞",
      title: "Contact Us",
      description: "Get involved today",
      href: "/contact",
      gradient: "orange" as const
    }
  ];

  const upcomingEvents = [
    {
      title: "Community Fun Day",
      date: "Saturday, March 15th",
      time: "11:00 AM - 4:00 PM",
      location: "Club Grounds",
      description: "Family fun day with activities, food stalls, and mini tournaments. All welcome!",
      volunteers: "15 volunteers needed",
      contact: "events@rvrafc.ie",
      icon: "🎉"
    },
    {
      title: "Quiz Night Fundraiser",
      date: "Friday, March 28th",
      time: "7:30 PM - 10:30 PM",
      location: "Swords Castle Hotel",
      description: "Annual quiz night to raise funds for new equipment and facilities.",
      volunteers: "5 volunteers needed",
      contact: "fundraising@rvrafc.ie",
      icon: "🧠"
    },
    {
      title: "Coach Appreciation Evening",
      date: "Saturday, April 12th",
      time: "7:00 PM - 11:00 PM",
      location: "Clubhouse",
      description: "Annual dinner to recognize our dedicated coaching staff.",
      volunteers: "8 volunteers needed",
      contact: "committee@rvrafc.ie",
      icon: "🍽️"
    }
  ];

  const eventVolunteerRoles = [
    {
      role: "Event Setup Crew",
      description: "Help set up venues, equipment, and decorations before events",
      timeCommitment: "2-3 hours before events",
      icon: "🔧"
    },
    {
      role: "Registration & Welcome",
      description: "Greet attendees, handle registrations, and provide information",
      timeCommitment: "During event hours",
      icon: "👋"
    },
    {
      role: "Food & Beverage Team",
      description: "Help with catering setup, serving, and cleanup",
      timeCommitment: "4-5 hours during events",
      icon: "🍽️"
    },
    {
      role: "Activity Coordinators",
      description: "Run games, activities, and competitions during events",
      timeCommitment: "3-4 hours during events",
      icon: "🎯"
    },
    {
      role: "Cleanup Crew",
      description: "Help pack down and clean up after events finish",
      timeCommitment: "1-2 hours after events",
      icon: "🧹"
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="Club Events & Activities"
      heroSubtitle="Join our community events and help create memorable experiences for everyone"
      heroIcon="🎊"
      quickActions={quickActions}
      sectionName="CLUB EVENTS"
      imageSpecs="1920x1080px minimum, community events and activities preferred"
    >

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Upcoming Events</h2>
        
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80 h-full">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{event.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <span className="text-blue-600 mr-2">📅</span>
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-green-600 mr-2">🕒</span>
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-purple-600 mr-2">📍</span>
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-orange-600 font-semibold">{event.volunteers}</span>
                    <a 
                      href={`mailto:${event.contact}`}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Volunteer
                    </a>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Volunteer Roles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Event Volunteer Opportunities</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventVolunteerRoles.map((role, index) => (
              <div key={index} className="text-center p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                <div className="text-3xl mb-3">{role.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.role}</h3>
                <p className="text-gray-600 text-sm mb-3">{role.description}</p>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  {role.timeCommitment}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* How to Get Involved */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-12"
      >
        <GlassCard intensity="heavy" className="p-8 bg-gradient-to-br from-blue-600/90 to-green-600/90 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">How to Get Involved</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">Sign Up</h3>
              <p className="text-sm opacity-90">Contact us or email the event organizer to volunteer</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-semibold mb-2">Join In</h3>
              <p className="text-sm opacity-90">Attend our volunteer briefing before each event</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-lg font-semibold mb-2">Have Fun</h3>
              <p className="text-sm opacity-90">Meet new people and help create great experiences</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Contact Us to Volunteer
            </a>
          </div>
        </GlassCard>
      </motion.div>

      {/* Past Events Gallery Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-gray-50/80 to-blue-50/80 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">See Our Events in Action</h2>
          <p className="text-gray-600 mb-6">
            Check out photos and highlights from our recent community events and activities.
          </p>
          <a
            href="/gallery"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            View Event Gallery
          </a>
        </GlassCard>
      </motion.div>

    </GlassPageTemplate>
  );
}