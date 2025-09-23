/**
 * Enhanced Special Events Manager
 * Admin interface for managing special events with image support and custom modals
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../SecureAuth';

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

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium', color: 'bg-green-100 text-green-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
];

export default function SpecialEventsManagerEnhanced() {
  const { isAdmin, user } = useAuth();
  const [events, setEvents] = useState<SpecialEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SpecialEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<SpecialEvent>>({
    title: '',
    description: '',
    excerpt: '',
    date: '',
    time: '',
    end_date: '',
    end_time: '',
    venue: '',
    ticket_price: 0,
    contact_info: '',
    image_url: '',
    event_type: 'other',
    priority: 'medium',
    is_active: true,
    featured: false,
    max_attendees: undefined,
    current_attendees: 0,
    registration_required: false,
    registration_link: '',
    tags: []
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchEvents();
    }
  }, [isAdmin]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('special_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        setError('Database not connected. Using demo events. To use real database, run the migration script.');
        // Demo events
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
        setEvents(demoEvents);
      } else {
        setEvents(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const showConfirmDialog = (title: string, message: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image file size must be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `events-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('event-images')
        .upload(fileName, file);

      if (error) {
        console.warn('Storage upload failed, using base64 fallback:', error);
        return URL.createObjectURL(file);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('event-images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (err) {
      console.warn('Image upload failed, using fallback:', err);
      return URL.createObjectURL(file);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      excerpt: '',
      date: '',
      time: '',
      end_date: '',
      end_time: '',
      venue: '',
      ticket_price: 0,
      contact_info: '',
      image_url: '',
      event_type: 'other',
      priority: 'medium',
      is_active: true,
      featured: false,
      max_attendees: undefined,
      current_attendees: 0,
      registration_required: false,
      registration_link: '',
      tags: []
    });
    setEditingEvent(null);
    setShowForm(false);
    setImageFile(null);
    setImagePreview('');
  };

  const handleEdit = (event: SpecialEvent) => {
    setEditingEvent(event);
    setFormData(event);
    setShowForm(true);
    setImagePreview(event.image_url || '');
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let imageUrl = formData.image_url || '';
      
      // Upload image if a new one was selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const eventData = {
        ...formData,
        image_url: imageUrl,
        ticket_price: formData.ticket_price ? Number(formData.ticket_price) : null,
        updated_at: new Date().toISOString()
      };

      let result;
      if (editingEvent) {
        // Update existing event
        result = await supabase
          .from('special_events')
          .update(eventData)
          .eq('id', editingEvent.id)
          .select();
      } else {
        // Create new event
        result = await supabase
          .from('special_events')
          .insert([{
            ...eventData,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString()
          }])
          .select();
      }

      if (result.error) {
        throw result.error;
      }

      // Reset form and refresh events
      resetForm();
      await fetchEvents();
      
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Check if the special_events table exists.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    const deleteAction = async () => {
      try {
        // Check if it's a demo event
        if (eventId.startsWith('demo-')) {
          // Remove from local demo events
          setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
          return;
        }

        const { error } = await supabase
          .from('special_events')
          .delete()
          .eq('id', eventId);

        if (error) throw error;
        
        await fetchEvents();
      } catch (err) {
        console.error('Error deleting event:', err);
        setError('Failed to delete event');
      }
    };

    showConfirmDialog(
      '🗑️ Delete Event',
      'Are you sure you want to delete this event? This action cannot be undone.',
      deleteAction
    );
  };

  const toggleActive = async (event: SpecialEvent) => {
    const statusAction = async () => {
      try {
        // Check if it's a demo event
        if (event.id.startsWith('demo-')) {
          // Update local demo event
          setEvents(prevEvents => 
            prevEvents.map(e => 
              e.id === event.id ? { ...e, is_active: !e.is_active } : e
            )
          );
          return;
        }

        const { error } = await supabase
          .from('special_events')
          .update({ is_active: !event.is_active })
          .eq('id', event.id);

        if (error) throw error;
        
        await fetchEvents();
      } catch (err) {
        console.error('Error updating event:', err);
        setError('Failed to update event');
      }
    };

    const actionText = event.is_active ? 'deactivate' : 'activate';
    const actionEmoji = event.is_active ? '⏸️' : '▶️';
    
    showConfirmDialog(
      `${actionEmoji} ${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Event`,
      `Are you sure you want to ${actionText} "${event.title}"?`,
      statusAction
    );
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || event.event_type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || event.priority === priorityFilter;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">🎉 Special Events Manager</h2>
            <p className="text-purple-100">Create and manage special events with image support</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            + Add Event
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-6">
          <p className="text-yellow-800 font-semibold">{error}</p>
          <div className="mt-3 text-yellow-700 text-sm space-y-2">
            <p>To set up the database for permanent event storage:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Open Supabase SQL Editor</li>
              <li>Run: <code className="bg-yellow-100 px-1 rounded">database/migrations/create_special_events_table.sql</code></li>
            </ol>
            <p className="text-xs text-yellow-600 mt-2">
              Current demo events can be deleted/edited temporarily but won't persist.
            </p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority.value} value={priority.value}>{priority.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchEvents}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600 mb-4">Create your first special event to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 bg-white border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Event Thumbnail */}
                    {event.image_url ? (
                      <div className="w-20 h-16 flex-shrink-0">
                        <img 
                          src={event.image_url} 
                          alt={event.title}
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-lg">{eventTypes.find(t => t.value === event.event_type)?.icon || '🎊'}</span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                      
                        {/* Event Type Badge */}
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">
                          {eventTypes.find(t => t.value === event.event_type)?.icon} {eventTypes.find(t => t.value === event.event_type)?.label}
                        </span>
                        
                        {/* Priority Badge */}
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          priorities.find(p => p.value === event.priority)?.color
                        }`}>
                          {priorities.find(p => p.value === event.priority)?.label}
                        </span>
                        
                        {/* Status Badge */}
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          event.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {event.is_active ? 'Active' : 'Inactive'}
                        </span>
                        
                        {/* Featured Badge */}
                        {event.featured && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{event.excerpt || event.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                        {event.time && <div>⏰ {event.time}</div>}
                        {event.venue && <div>📍 {event.venue}</div>}
                        {event.ticket_price && <div>💰 €{event.ticket_price}</div>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => toggleActive(event)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                        event.is_active 
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                    >
                      {event.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(event)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Event title..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Type *
                      </label>
                      <select
                        value={formData.event_type}
                        onChange={(e) => setFormData({...formData, event_type: e.target.value as any})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        {eventTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        {priorities.map(priority => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Short Description *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Brief summary of the event..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Description *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Full event description..."
                    />
                  </div>
                  
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Image (Optional)
                    </label>
                    
                    {/* Image Preview */}
                    {(imagePreview || formData.image_url) && (
                      <div className="mb-4">
                        <div className="relative w-full max-w-md">
                          <img 
                            src={imagePreview || formData.image_url} 
                            alt="Event preview" 
                            className="w-full h-48 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setFormData({...formData, image_url: ''});
                              setImageFile(null);
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Upload Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* File Upload */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Upload Image File</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">Max 5MB. JPG, PNG, GIF supported.</p>
                      </div>
                      
                      {/* URL Input */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Or Enter Image URL</label>
                        <input
                          type="url"
                          value={formData.image_url}
                          onChange={(e) => {
                            setFormData({...formData, image_url: e.target.value});
                            if (e.target.value) {
                              setImagePreview(e.target.value);
                              setImageFile(null);
                            }
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                    
                    {uploading && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Uploading image...
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Venue
                      </label>
                      <input
                        type="text"
                        value={formData.venue}
                        onChange={(e) => setFormData({...formData, venue: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Event venue..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ticket Price (€)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.ticket_price}
                        onChange={(e) => setFormData({...formData, ticket_price: Number(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                        Event is active
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                        Featured event
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`${confirmTitle.includes('Delete') ? 'bg-gradient-to-r from-red-500 to-pink-600' : 
                              confirmTitle.includes('Activate') ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                              'bg-gradient-to-r from-blue-500 to-indigo-600'} text-white p-6`}>
                <h3 className="text-xl font-bold">{confirmTitle}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed mb-6">{confirmMessage}</p>
                
                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 px-4 py-3 ${confirmTitle.includes('Delete') ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' : 
                              confirmTitle.includes('Activate') ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' :
                              'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl`}
                  >
                    {confirmTitle.includes('Delete') ? 'Delete' : 
                     confirmTitle.includes('Activate') ? 'Activate' :
                     confirmTitle.includes('Deactivate') ? 'Deactivate' : 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}