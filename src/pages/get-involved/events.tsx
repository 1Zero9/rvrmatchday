import { motion, AnimatePresence } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard } from '../../components/Glass';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface SpecialEvent {
  id: string;
  title: string;
  description: string;
  excerpt?: string;
  date: string;
  time?: string;
  end_date?: string;
  end_time?: string;
  venue?: string;
  ticket_price?: number;
  contact_info?: string;
  image_url?: string;
  event_type: 'race_night' | 'bingo' | 'fundraiser' | 'social' | 'workshop' | 'tournament' | 'meeting' | 'other';
  is_active: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  featured: boolean;
  max_attendees?: number;
  current_attendees?: number;
  registration_required?: boolean;
  registration_link?: string;
  tags?: string[];
  views?: number;
  created_at?: string;
  updated_at?: string;
}

const eventTypes = [
  { value: 'race_night', label: 'Race Night', icon: '🏇' },
  { value: 'bingo', label: 'Bingo', icon: '🎱' },
  { value: 'fundraiser', label: 'Fundraiser', icon: '💰' },
  { value: 'social', label: 'Social Event', icon: '🎉' },
  { value: 'workshop', label: 'Workshop', icon: '🎓' },
  { value: 'tournament', label: 'Tournament', icon: '🏆' },
  { value: 'meeting', label: 'Meeting', icon: '👥' },
  { value: 'other', label: 'Other', icon: '🎊' }
];

export default function GetInvolvedEvents() {
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSpecialEvents();
  }, []);

  const fetchSpecialEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('special_events')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching special events:', error);
        setError('Database connection failed. Using demo events.');
        // Create demo events for development
        const demoEvents: SpecialEvent[] = [
          {
            id: 'demo-1',
            title: 'Annual Fundraising Race Night',
            description: 'Join us for an exciting evening of horse racing entertainment! Place your bets on our virtual races while enjoying food, drinks, and great company. All proceeds support our youth academy programs.',
            excerpt: 'Virtual horse racing with food, drinks and prizes. Supporting youth academy programs.',
            date: '2025-11-15',
            time: '19:00',
            venue: 'Club House Main Hall',
            ticket_price: 15.00,
            event_type: 'race_night',
            priority: 'high',
            is_active: true,
            featured: true,
            image_url: '/images/homepg-image1.jpg',
            tags: ['fundraising', 'racing', 'social', 'food'],
            views: 89,
            created_at: '2025-09-20T10:00:00Z',
            updated_at: '2025-09-20T10:00:00Z'
          },
          {
            id: 'demo-2',
            title: 'Monthly Bingo Night',
            description: 'Come join our monthly bingo session with fantastic prizes and refreshments available. All ages welcome for a fun family evening out.',
            excerpt: 'Monthly bingo with great prizes and refreshments. Family-friendly event.',
            date: '2025-10-12',
            time: '20:00',
            venue: 'Club House',
            ticket_price: 8.00,
            event_type: 'bingo',
            priority: 'medium',
            is_active: true,
            featured: false,
            image_url: '/images/homepage-hero.jpg',
            tags: ['bingo', 'family', 'prizes', 'monthly'],
            views: 156,
            created_at: '2025-09-18T15:30:00Z',
            updated_at: '2025-09-18T15:30:00Z'
          }
        ];
        setSpecialEvents(demoEvents);
      } else {
        setSpecialEvents(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load special events');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event: SpecialEvent) => {
    setSelectedEvent(event);
    // Update view count
    setSpecialEvents(prevEvents => 
      prevEvents.map(e => 
        e.id === event.id ? { ...e, views: (e.views || 0) + 1 } : e
      )
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeInfo = (type: string) => {
    return eventTypes.find(t => t.value === type) || eventTypes[eventTypes.length - 1];
  };
  const quickActions = [
    {
      icon: "🤝",
      title: "Volunteering",
      description: "Help with club activities",
      href: "/volunteer",
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
      backgroundImage="https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      quickActions={quickActions}
      sectionName="CLUB EVENTS"
      imageSpecs="1920x1080px minimum, community events and activities preferred"
    >

      {/* Special Events from Database */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Special Events</h2>
        
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-center">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading special events...</p>
          </div>
        ) : specialEvents.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Special Events</h3>
            <p className="text-gray-600">Check back soon for upcoming special events!</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {specialEvents.map((event, index) => {
              const eventTypeInfo = getEventTypeInfo(event.event_type);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80 h-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    {event.image_url && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={event.image_url} 
                          alt={event.title}
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">{eventTypeInfo.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      {event.featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <span className="text-blue-600 mr-2">📅</span>
                        <span className="text-sm">{formatDate(event.date)}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center text-gray-600">
                          <span className="text-green-600 mr-2">🕒</span>
                          <span className="text-sm">{event.time}</span>
                        </div>
                      )}
                      {event.venue && (
                        <div className="flex items-center text-gray-600">
                          <span className="text-purple-600 mr-2">📍</span>
                          <span className="text-sm">{event.venue}</span>
                        </div>
                      )}
                      {event.ticket_price && (
                        <div className="flex items-center text-gray-600">
                          <span className="text-orange-600 mr-2">💰</span>
                          <span className="text-sm">€{event.ticket_price}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{event.excerpt || event.description.substring(0, 100) + '...'}</p>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">👁️ {event.views || 0} views</span>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Static Volunteer Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Community Events</h2>
        
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

      {/* Special Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with image */}
              {selectedEvent.image_url && (
                <div className="relative h-48 rounded-t-2xl overflow-hidden">
                  <img 
                    src={selectedEvent.image_url} 
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-all"
                  >
                    ×
                  </button>
                  {selectedEvent.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-400/90 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                        ⭐ Featured Event
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {!selectedEvent.image_url && (
                <div className="flex justify-between items-center p-6 border-b">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getEventTypeInfo(selectedEvent.event_type).icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                      {selectedEvent.featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured Event
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="p-6">
                {selectedEvent.image_url && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{getEventTypeInfo(selectedEvent.event_type).icon}</span>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  </div>
                )}
                
                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <span className="text-blue-600 mr-3 text-lg">📅</span>
                      <div>
                        <span className="font-medium">Date:</span>
                        <br />
                        <span className="text-sm">{formatDate(selectedEvent.date)}</span>
                      </div>
                    </div>
                    
                    {selectedEvent.time && (
                      <div className="flex items-center text-gray-600">
                        <span className="text-green-600 mr-3 text-lg">🕒</span>
                        <div>
                          <span className="font-medium">Time:</span>
                          <br />
                          <span className="text-sm">{selectedEvent.time}</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedEvent.venue && (
                      <div className="flex items-center text-gray-600">
                        <span className="text-purple-600 mr-3 text-lg">📍</span>
                        <div>
                          <span className="font-medium">Venue:</span>
                          <br />
                          <span className="text-sm">{selectedEvent.venue}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {selectedEvent.ticket_price && (
                      <div className="flex items-center text-gray-600">
                        <span className="text-orange-600 mr-3 text-lg">💰</span>
                        <div>
                          <span className="font-medium">Price:</span>
                          <br />
                          <span className="text-sm">€{selectedEvent.ticket_price}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-600">
                      <span className="text-pink-600 mr-3 text-lg">🎯</span>
                      <div>
                        <span className="font-medium">Type:</span>
                        <br />
                        <span className="text-sm">{getEventTypeInfo(selectedEvent.event_type).label}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <span className="text-cyan-600 mr-3 text-lg">👁️</span>
                      <div>
                        <span className="font-medium">Views:</span>
                        <br />
                        <span className="text-sm">{selectedEvent.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Event</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
                </div>
                
                {/* Tags */}
                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Contact Info */}
                {selectedEvent.contact_info && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                    <p className="text-gray-700">{selectedEvent.contact_info}</p>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all"
                  >
                    Close
                  </button>
                  <a
                    href="/contact"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all text-center"
                  >
                    Get Involved
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </GlassPageTemplate>
  );
}