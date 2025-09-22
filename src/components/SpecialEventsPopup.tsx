/**
 * Special Events Popup
 * Shows special events like race nights, bingo, fundraisers etc.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface SpecialEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  venue?: string;
  ticket_price?: number;
  contact_info?: string;
  event_type: 'race_night' | 'bingo' | 'fundraiser' | 'social' | 'other';
  is_active: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const eventIcons = {
  race_night: '🏇',
  bingo: '🎱',
  fundraiser: '💰',
  social: '🎉',
  other: '🎊'
};

// Color cycling array - will cycle through these colors regardless of event type
const colorCycle = [
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-purple-500 to-purple-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
  'from-teal-500 to-teal-600',
  'from-red-500 to-red-600',
  'from-indigo-500 to-indigo-600'
];

export default function SpecialEventsPopup() {
  const [events, setEvents] = useState<SpecialEvent[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkSpecialEvents = async () => {
      try {
        // First try to get from database
        const { data, error } = await supabase
          .from('special_events')
          .select('*')
          .eq('is_active', true)
          .gte('date', new Date().toISOString().split('T')[0])
          .order('priority', { ascending: false })
          .order('date', { ascending: true });

        if (error) {
          console.log('Special events table not found, using fallback events');
          // Fallback to demo events if table doesn't exist
          const fallbackEvents: SpecialEvent[] = [
            {
              id: 'race-night-2025',
              title: 'Race Night 2025',
              description: 'Join us for an exciting evening of virtual horse racing!',
              date: '2025-10-15',
              time: '19:30',
              venue: 'Club House',
              ticket_price: 10,
              contact_info: 'Call John: 087-123-4567',
              event_type: 'race_night',
              is_active: true,
              priority: 'high'
            },
            {
              id: 'christmas-bingo',
              title: 'Christmas Bingo',
              description: 'Christmas bingo with fantastic prizes!',
              date: '2025-12-20',
              time: '20:00',
              venue: 'Main Hall',
              ticket_price: 15,
              contact_info: 'Mary: 086-987-6543',
              event_type: 'bingo',
              is_active: true,
              priority: 'medium'
            }
          ];
          setEvents(fallbackEvents);
        } else if (data && data.length > 0) {
          setEvents(data);
        } else {
          // No events found
          return;
        }

        // Check if user has dismissed events today
        const sessionKey = `special_events_dismissed_${new Date().toDateString()}`;
        const wasDismissed = sessionStorage.getItem(sessionKey);
        
        if (!wasDismissed && (data?.length || 2) > 0) {
          setShowPopup(true);
        }
      } catch (error) {
        console.error('Error checking special events:', error);
      }
    };

    checkSpecialEvents();

    // Rotate through events and colors every 4 seconds
    const rotation = setInterval(() => {
      if (events.length > 1) {
        setCurrentEventIndex((prev) => (prev + 1) % events.length);
      }
      // Always cycle colors regardless of number of events
      setCurrentColorIndex((prev) => (prev + 1) % colorCycle.length);
    }, 4000);

    return () => clearInterval(rotation);
  }, [events.length]);

  const handleDismiss = () => {
    setShowPopup(false);
    setDismissed(true);
    
    // Remember dismissal for today
    const sessionKey = `special_events_dismissed_${new Date().toDateString()}`;
    sessionStorage.setItem(sessionKey, 'true');
  };

  const handleGetTickets = (event: SpecialEvent) => {
    // Could link to ticketing system or contact info
    if (event.contact_info) {
      alert(`Contact: ${event.contact_info}`);
    } else {
      alert('Contact club for tickets: info@rivervalleyrangers.ie');
    }
  };

  if (!showPopup || dismissed || events.length === 0) {
    return null;
  }

  const currentEvent = events[currentEventIndex];
  const currentColor = colorCycle[currentColorIndex];
  const eventDate = new Date(currentEvent.date);
  const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 30 }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
        className="relative max-w-md"
      >
        <div className={`bg-gradient-to-br ${currentColor} text-white rounded-2xl shadow-2xl border-2 border-white/30 overflow-hidden`}>
          {/* Header */}
          <div className="bg-black/20 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎉</span>
              <span className="font-bold text-lg">Special Event</span>
            </div>
            <div className="flex items-center space-x-2">
              {events.length > 1 && (
                <div className="text-xs bg-white/20 rounded-full px-2 py-1">
                  {currentEventIndex + 1}/{events.length}
                </div>
              )}
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-bold text-xl mb-2">
                {currentEvent.title}
              </h3>
              <p className="text-white/90 text-sm leading-relaxed">
                {currentEvent.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="bg-white/10 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/80">📅 Date:</span>
                <span className="font-bold">
                  {eventDate.toLocaleDateString('en-IE', { 
                    weekday: 'short',
                    day: 'numeric', 
                    month: 'short' 
                  })}
                  {daysUntil <= 7 && (
                    <span className="ml-2 text-xs bg-yellow-500/80 rounded-full px-2 py-1">
                      {daysUntil === 0 ? 'TODAY!' : `${daysUntil} days`}
                    </span>
                  )}
                </span>
              </div>
              
              {currentEvent.time && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80">⏰ Time:</span>
                  <span className="font-bold">{currentEvent.time}</span>
                </div>
              )}

              {currentEvent.venue && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80">📍 Venue:</span>
                  <span className="font-bold">{currentEvent.venue}</span>
                </div>
              )}

              {currentEvent.ticket_price && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80">💰 Price:</span>
                  <span className="font-bold">€{currentEvent.ticket_price}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleGetTickets(currentEvent)}
                className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg transition-all border border-white/30"
              >
                Get Tickets
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-white/80 hover:text-white text-sm transition-colors"
              >
                Later
              </button>
            </div>
          </div>

          {/* Animated priority indicator */}
          {currentEvent.priority === 'urgent' && (
            <div className="absolute inset-0 rounded-2xl border-2 border-yellow-300 animate-pulse pointer-events-none"></div>
          )}
        </div>

        {/* Floating priority badge */}
        {currentEvent.priority === 'high' || currentEvent.priority === 'urgent' ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", damping: 15 }}
            className={`absolute -top-2 -right-2 ${
              currentEvent.priority === 'urgent' ? 'bg-red-500' : 'bg-orange-500'
            } text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-white animate-pulse`}
          >
            !
          </motion.div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
}