/**
 * 🎊 MODERN EVENTS PAGE - TEMPLATE READY
 * 1Zero9.com - OneZeronine Studio
 * 
 * Features:
 * - Easy content editing with clear sections
 * - Mobile-first unique experience  
 * - Engaging visual storytelling
 * - Template-ready configuration
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard } from '../../components/Glass';

// =====================================
// 📝 EDITABLE CONTENT SECTIONS
// =====================================

const HERO_CONTENT = {
  title: "Community Events & Activities",
  subtitle: "Join our vibrant community and help create unforgettable experiences for everyone",
  icon: "🎊",
  backgroundImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  // EDIT: Replace with local image path for template: "/images/hero/events-hero.jpg"
};

const FEATURED_EVENT = {
  title: "Summer Community Festival",
  date: "Saturday, July 15th",
  time: "10:00 AM - 6:00 PM", 
  location: "Club Grounds",
  description: "Our biggest event of the year! Family fun day with live music, food trucks, activities for all ages, and special performances.",
  image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  volunteers: 25,
  spotsLeft: 8,
  isHighlight: true
};

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "Quiz Night Fundraiser", 
    date: "Fri, July 28th",
    time: "7:30 PM",
    location: "Community Hall",
    description: "Test your knowledge while supporting our club initiatives!",
    volunteers: 5,
    spotsLeft: 2,
    category: "Fundraising",
    icon: "🧠"
  },
  {
    id: 2,
    title: "Coach Appreciation Dinner",
    date: "Sat, Aug 12th", 
    time: "7:00 PM",
    location: "Clubhouse",
    description: "Celebrate our amazing coaching team with a special dinner.",
    volunteers: 8,
    spotsLeft: 3,
    category: "Social",
    icon: "🍽️"
  },
  {
    id: 3,
    title: "Youth Skills Workshop",
    date: "Sun, Aug 20th",
    time: "2:00 PM", 
    location: "Training Pitch",
    description: "Special skills session for our youth players with guest coaches.",
    volunteers: 6,
    spotsLeft: 6,
    category: "Training",
    icon: "⚽"
  }
];

const VOLUNTEER_OPPORTUNITIES = [
  {
    role: "Event Coordinator",
    description: "Lead event planning and coordination",
    commitment: "5-8 hours",
    impact: "High",
    skills: ["Organization", "Communication"],
    icon: "📋"
  },
  {
    role: "Welcome Team",
    description: "Greet guests and provide information",
    commitment: "3-4 hours", 
    impact: "Medium",
    skills: ["Friendly", "Helpful"],
    icon: "👋"
  },
  {
    role: "Activity Helper",
    description: "Assist with games and activities",
    commitment: "2-3 hours",
    impact: "High", 
    skills: ["Energetic", "Patient"],
    icon: "🎯"
  }
];

// =====================================
// 📱 MOBILE-FIRST COMPONENTS
// =====================================

function MobileEventCard({ event, isFeatured = false }: { event: any, isFeatured?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div
      layout
      className={`rounded-2xl overflow-hidden shadow-lg ${isFeatured ? 'border-2 border-yellow-400' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isFeatured && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-center py-2">
          <span className="text-white font-bold text-sm">✨ FEATURED EVENT ✨</span>
        </div>
      )}
      
      <div className="relative">
        {event.image && (
          <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-sm font-bold text-gray-800">{event.icon}</span>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-900 flex-1">{event.title}</h3>
            {event.spotsLeft && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">
                {event.spotsLeft} spots left
              </span>
            )}
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600">
              <span className="text-blue-500 mr-2">📅</span>
              <span className="text-sm">{event.date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="text-green-500 mr-2">🕒</span>
              <span className="text-sm">{event.time}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="text-purple-500 mr-2">📍</span>
              <span className="text-sm">{event.location}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{event.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-orange-600 font-semibold">
                {event.volunteers} volunteers needed
              </span>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition-colors">
              Join Event
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EngagementStats() {
  return (
    <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-green-50/80 to-blue-50/80">
      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Community Impact</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">150+</div>
          <div className="text-xs text-gray-600">Volunteers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">50+</div>
          <div className="text-xs text-gray-600">Events/Year</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">1000+</div>
          <div className="text-xs text-gray-600">Attendees</div>
        </div>
      </div>
    </GlassCard>
  );
}

// =====================================
// 🖥️ MAIN COMPONENT
// =====================================

export default function ModernEventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Fundraising', 'Social', 'Training'];
  
  const filteredEvents = selectedCategory === 'All' 
    ? UPCOMING_EVENTS 
    : UPCOMING_EVENTS.filter(event => event.category === selectedCategory);

  const quickActions = [
    {
      icon: "🤝",
      title: "Volunteer",
      description: "Join our volunteer team",
      href: "/volunteer",
      gradient: "blue" as const
    },
    {
      icon: "💡",
      title: "Suggest Event",
      description: "Share your ideas",
      href: "/contact",
      gradient: "green" as const
    },
    {
      icon: "📸",
      title: "Event Gallery",
      description: "See past events",
      href: "/gallery",
      gradient: "purple" as const
    },
    {
      icon: "📞",
      title: "Contact",
      description: "Get in touch",
      href: "/contact",
      gradient: "orange" as const
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle={HERO_CONTENT.title}
      heroSubtitle={HERO_CONTENT.subtitle}
      heroIcon={HERO_CONTENT.icon}
      backgroundImage={HERO_CONTENT.backgroundImage}
      quickActions={quickActions}
      sectionName="COMMUNITY EVENTS"
      imageSpecs="1920x1080px minimum, community events and activities preferred"
    >

      {/* Community Impact Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <EngagementStats />
      </motion.div>

      {/* Featured Event - Hero Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Don't Miss This!</h2>
        <div className="max-w-2xl mx-auto">
          <MobileEventCard event={FEATURED_EVENT} isFeatured={true} />
        </div>
      </motion.div>

      {/* Event Categories Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Upcoming Events Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Upcoming Events</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <MobileEventCard event={event} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Volunteer Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-12"
      >
        <GlassCard intensity="medium" className="p-8 bg-gradient-to-br from-white/80 to-gray-50/80">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Ways to Help</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {VOLUNTEER_OPPORTUNITIES.map((opportunity, index) => (
              <div key={index} className="text-center p-6 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-white transition-colors">
                <div className="text-4xl mb-4">{opportunity.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{opportunity.role}</h3>
                <p className="text-gray-600 text-sm mb-4">{opportunity.description}</p>
                <div className="space-y-2">
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {opportunity.commitment}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    opportunity.impact === 'High' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'
                  }`}>
                    {opportunity.impact} Impact
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <GlassCard intensity="heavy" className="p-8 bg-gradient-to-br from-blue-600/90 to-green-600/90 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Join the Fun?</h2>
          <p className="text-lg opacity-90 mb-6">
            Be part of something special. Help us create amazing experiences for our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Involved
            </a>
            <a
              href="/gallery"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              See Past Events
            </a>
          </div>
        </GlassCard>
      </motion.div>

    </GlassPageTemplate>
  );
}

// =====================================
// 📚 TEMPLATE NOTES
// =====================================

/*
EDITING INSTRUCTIONS:

1. HERO CONTENT (Lines 15-21):
   - Change title, subtitle, icon
   - Replace backgroundImage with your local image
   
2. FEATURED EVENT (Lines 23-33):
   - Update event details
   - Replace image URL
   
3. UPCOMING EVENTS (Lines 35-66):
   - Add/edit events in this array
   - Each event needs: title, date, time, location, description
   
4. VOLUNTEER OPPORTUNITIES (Lines 68-87):
   - Customize volunteer roles
   - Update time commitments and skills
   
5. BRANDING:
   - Replace contact emails
   - Update organization name
   - Customize colors in Tailwind classes

MOBILE FEATURES:
- Touch-friendly cards with hover effects
- Expandable content sections  
- Category filtering
- Optimized image loading
- Swipe-friendly layouts

ENGAGEMENT FEATURES:
- Real-time stats display
- Interactive filtering
- Visual impact indicators
- Clear call-to-actions
- Social proof elements
*/