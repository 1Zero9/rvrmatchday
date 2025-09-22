/**
 * Ticket Modal Component
 * Shows detailed ticket information in a modal with blurred background
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: SpecialEvent;
}

export default function TicketModal({ isOpen, onClose, event }: TicketModalProps) {
  const eventDate = new Date(event.date);
  const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Blurred Background Overlay */}
        <motion.div
          initial={{ backdropFilter: 'blur(0px)' }}
          animate={{ backdropFilter: 'blur(12px)' }}
          exit={{ backdropFilter: 'blur(0px)' }}
          className="absolute inset-0 bg-black/40"
        />
        
        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Event Image/Icon */}
          <div className="bg-gradient-to-r from-club-primary to-club-secondary text-white p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-6xl mb-2">🎟️</div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <p className="text-white/90 text-lg">{event.description}</p>
          </div>

          {/* Event Details */}
          <div className="p-6">
            <div className="grid gap-4 mb-6">
              {/* Date and Time */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl">📅</div>
                <div>
                  <div className="font-bold text-gray-900">
                    {eventDate.toLocaleDateString('en-IE', { 
                      weekday: 'long',
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  {event.time && (
                    <div className="text-gray-600">{event.time}</div>
                  )}
                  {daysUntil <= 7 && (
                    <div className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-bold ${
                      daysUntil === 0 ? 'bg-red-100 text-red-800' : 
                      daysUntil <= 3 ? 'bg-orange-100 text-orange-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {daysUntil === 0 ? 'TODAY!' : `${daysUntil} days to go`}
                    </div>
                  )}
                </div>
              </div>

              {/* Venue */}
              {event.venue && (
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl">📍</div>
                  <div>
                    <div className="font-bold text-gray-900">Venue</div>
                    <div className="text-gray-600">{event.venue}</div>
                  </div>
                </div>
              )}

              {/* Price */}
              {event.ticket_price && (
                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl">💰</div>
                  <div>
                    <div className="font-bold text-gray-900">Ticket Price</div>
                    <div className="text-2xl font-bold text-green-600">€{event.ticket_price}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                <span className="text-xl mr-2">📞</span>
                Get Your Tickets
              </h3>
              {event.contact_info ? (
                <div className="text-gray-700">
                  <p>{event.contact_info}</p>
                </div>
              ) : (
                <div className="text-gray-700">
                  <p>Contact the club for tickets:</p>
                  <p className="font-semibold">📧 info@rivervalleyrangers.ie</p>
                  <p className="font-semibold">📱 Call the clubhouse</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (event.contact_info) {
                    // Try to extract phone number and call
                    const phoneMatch = event.contact_info.match(/(\d{3}[-\s]?\d{3}[-\s]?\d{4})/);
                    if (phoneMatch) {
                      window.location.href = `tel:${phoneMatch[1].replace(/[-\s]/g, '')}`;
                    } else {
                      // Fallback to showing contact info
                      navigator.clipboard.writeText(event.contact_info);
                      alert('Contact information copied to clipboard!');
                    }
                  } else {
                    // Default club email
                    window.location.href = 'mailto:info@rivervalleyrangers.ie?subject=' + encodeURIComponent(`Tickets for ${event.title}`);
                  }
                }}
                className="flex-1 bg-club-primary hover:bg-club-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>📧</span>
                <span>Contact for Tickets</span>
              </button>
              
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-semibold transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}