/**
 * Volunteer Manager Component
 * Admin interface for creating and managing volunteer opportunities
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../SecureAuth';

interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  category: 'coaching' | 'events' | 'administration' | 'fundraising' | 'facilities' | 'youth' | 'general';
  location?: string;
  date?: string;
  time?: string;
  end_date?: string;
  end_time?: string;
  duration_hours?: number;
  required_skills?: string[];
  max_volunteers: number;
  current_signups: number;
  is_active: boolean;
  is_recurring: boolean;
  recurring_pattern?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  requirements?: string;
  benefits?: string;
  image_url?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at?: string;
  updated_at?: string;
}

const categories = [
  { value: 'coaching', label: 'Coaching', icon: '⚽', color: 'bg-green-100 text-green-800' },
  { value: 'events', label: 'Events', icon: '🎉', color: 'bg-purple-100 text-purple-800' },
  { value: 'administration', label: 'Administration', icon: '📋', color: 'bg-blue-100 text-blue-800' },
  { value: 'fundraising', label: 'Fundraising', icon: '💰', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'facilities', label: 'Facilities', icon: '🔧', color: 'bg-gray-100 text-gray-800' },
  { value: 'youth', label: 'Youth', icon: '👦', color: 'bg-pink-100 text-pink-800' },
  { value: 'general', label: 'General', icon: '🤝', color: 'bg-indigo-100 text-indigo-800' }
];

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium', color: 'bg-green-100 text-green-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
];

export default function VolunteerManager() {
  const { isAdmin, user } = useAuth();
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<VolunteerOpportunity>>({
    title: '',
    description: '',
    excerpt: '',
    category: 'general',
    location: '',
    date: '',
    time: '',
    duration_hours: 2,
    required_skills: [],
    max_volunteers: 1,
    is_active: true,
    is_recurring: false,
    contact_person: '',
    contact_email: '',
    requirements: '',
    benefits: '',
    priority: 'medium'
  });

  const [skillInput, setSkillInput] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchOpportunities();
    }
  }, [isAdmin]);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('volunteer_opportunities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching volunteer opportunities:', error);
        setError('Database not connected. Using demo opportunities. To use real database, run the migration script.');
        // Create demo opportunities for development
        const demoOpportunities: VolunteerOpportunity[] = [
          {
            id: 'demo-1',
            title: 'Match Day Assistant Coach',
            description: 'Help our coaching staff during home matches by assisting with equipment setup, player coordination, and sideline support.',
            excerpt: 'Assist coaching staff during home matches with equipment and player support.',
            category: 'coaching',
            location: 'Home Ground',
            date: '2025-10-05',
            time: '13:00',
            duration_hours: 4,
            required_skills: ['basic football knowledge', 'communication skills'],
            max_volunteers: 2,
            current_signups: 1,
            is_active: true,
            is_recurring: false,
            contact_person: 'John Smith',
            contact_email: 'coaching@rvrafc.ie',
            priority: 'high',
            created_at: '2025-09-20T10:00:00Z',
            updated_at: '2025-09-20T10:00:00Z'
          }
        ];
        setOpportunities(demoOpportunities);
      } else {
        setOpportunities(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load volunteer opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const opportunityData = {
        ...formData,
        duration_hours: formData.duration_hours ? Number(formData.duration_hours) : null,
        max_volunteers: Number(formData.max_volunteers),
        updated_at: new Date().toISOString()
      };

      let result;
      if (editingOpportunity) {
        // Update existing opportunity
        result = await supabase
          .from('volunteer_opportunities')
          .update(opportunityData)
          .eq('id', editingOpportunity.id)
          .select();
      } else {
        // Create new opportunity
        result = await supabase
          .from('volunteer_opportunities')
          .insert([{
            ...opportunityData,
            id: crypto.randomUUID(),
            current_signups: 0,
            created_at: new Date().toISOString()
          }])
          .select();
      }

      if (result.error) {
        throw result.error;
      }

      // Reset form and refresh opportunities
      resetForm();
      await fetchOpportunities();
      
    } catch (err) {
      console.error('Error saving volunteer opportunity:', err);
      setError('Failed to save volunteer opportunity. Check if the volunteer_opportunities table exists.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      excerpt: '',
      category: 'general',
      location: '',
      date: '',
      time: '',
      duration_hours: 2,
      required_skills: [],
      max_volunteers: 1,
      is_active: true,
      is_recurring: false,
      contact_person: '',
      contact_email: '',
      requirements: '',
      benefits: '',
      priority: 'medium'
    });
    setSkillInput('');
    setEditingOpportunity(null);
    setShowForm(false);
  };

  const handleEdit = (opportunity: VolunteerOpportunity) => {
    setEditingOpportunity(opportunity);
    setFormData(opportunity);
    setShowForm(true);
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

  const handleDelete = async (opportunityId: string) => {
    const deleteAction = async () => {
      try {
        // Check if it's a demo opportunity
        if (opportunityId.startsWith('demo-')) {
          setOpportunities(prevOpportunities => 
            prevOpportunities.filter(opportunity => opportunity.id !== opportunityId)
          );
          return;
        }

        const { error } = await supabase
          .from('volunteer_opportunities')
          .delete()
          .eq('id', opportunityId);

        if (error) throw error;
        
        await fetchOpportunities();
      } catch (err) {
        console.error('Error deleting opportunity:', err);
        setError('Failed to delete volunteer opportunity');
      }
    };

    showConfirmDialog(
      '🗑️ Delete Volunteer Opportunity',
      'Are you sure you want to delete this volunteer opportunity? This will also delete all associated signups and cannot be undone.',
      deleteAction
    );
  };

  const toggleActive = async (opportunity: VolunteerOpportunity) => {
    const toggleAction = async () => {
      try {
        // Check if it's a demo opportunity
        if (opportunity.id.startsWith('demo-')) {
          setOpportunities(prevOpportunities => 
            prevOpportunities.map(o => 
              o.id === opportunity.id ? { ...o, is_active: !o.is_active } : o
            )
          );
          return;
        }

        const { error } = await supabase
          .from('volunteer_opportunities')
          .update({ is_active: !opportunity.is_active })
          .eq('id', opportunity.id);

        if (error) throw error;
        
        await fetchOpportunities();
      } catch (err) {
        console.error('Error updating opportunity:', err);
        setError('Failed to update volunteer opportunity');
      }
    };

    const actionText = opportunity.is_active ? 'deactivate' : 'activate';
    const actionEmoji = opportunity.is_active ? '⏸️' : '▶️';
    
    showConfirmDialog(
      `${actionEmoji} ${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Opportunity`,
      `Are you sure you want to ${actionText} "${opportunity.title}"?`,
      toggleAction
    );
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.required_skills?.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        required_skills: [...(formData.required_skills || []), skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      required_skills: formData.required_skills?.filter(s => s !== skill) || []
    });
  };

  // Filter opportunities
  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || opportunity.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">🤝 Volunteer Opportunities</h2>
            <p className="text-blue-100">Create and manage volunteer opportunities for club members</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-lg transition-all"
          >
            + Add Opportunity
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-6">
          <p className="text-yellow-800 font-semibold">{error}</p>
          <div className="mt-3 text-yellow-700 text-sm space-y-2">
            <p>To set up the database for volunteer management:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Open Supabase SQL Editor</li>
              <li>Run: <code className="bg-yellow-100 px-1 rounded">database/migrations/create_volunteer_system_tables.sql</code></li>
            </ol>
            <p className="text-xs text-yellow-600 mt-2">
              Current demo opportunities can be edited temporarily but won't persist.
            </p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search opportunities..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchOpportunities}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading opportunities...</p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Opportunities Found</h3>
            <p className="text-gray-600 mb-4">Create your first volunteer opportunity to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Create First Opportunity
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOpportunities.map((opportunity) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border rounded-lg p-4 ${
                  opportunity.is_active ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg font-bold ${opportunity.is_active ? 'text-gray-900' : 'text-gray-600'}`}>
                        {opportunity.title}
                      </h3>
                      
                      {/* Category Badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        categories.find(c => c.value === opportunity.category)?.color
                      }`}>
                        {categories.find(c => c.value === opportunity.category)?.icon} {categories.find(c => c.value === opportunity.category)?.label}
                      </span>
                      
                      {/* Priority Badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        priorities.find(p => p.value === opportunity.priority)?.color
                      }`}>
                        {priorities.find(p => p.value === opportunity.priority)?.label}
                      </span>
                      
                      {/* Status Badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        opportunity.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {opportunity.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{opportunity.excerpt}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      {opportunity.date && <div>📅 {new Date(opportunity.date).toLocaleDateString()}</div>}
                      {opportunity.location && <div>📍 {opportunity.location}</div>}
                      <div>👥 {opportunity.current_signups}/{opportunity.max_volunteers} volunteers</div>
                      {opportunity.duration_hours && <div>⏱️ {opportunity.duration_hours}h</div>}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => toggleActive(opportunity)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                        opportunity.is_active 
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                    >
                      {opportunity.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(opportunity)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(opportunity.id)}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
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
                  {editingOpportunity ? 'Edit Volunteer Opportunity' : 'Create New Volunteer Opportunity'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="e.g., Match Day Assistant Coach"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
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
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        {priorities.map(priority => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Description and Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brief Description (Excerpt) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Brief summary that appears in the volunteer listings..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Detailed description of the volunteer role, responsibilities, and expectations..."
                    />
                  </div>
                  
                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (hours)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={formData.duration_hours}
                        onChange={(e) => setFormData({...formData, duration_hours: Number(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="2.5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Volunteers *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.max_volunteers}
                        onChange={(e) => setFormData({...formData, max_volunteers: Number(e.target.value)})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="1"
                      />
                    </div>
                  </div>
                  
                  {/* Location and Contact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="e.g., Home Ground, Club House"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        value={formData.contact_person}
                        onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Contact name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="contact@rvrafc.ie"
                    />
                  </div>
                  
                  {/* Required Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Required Skills
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Add a skill and press Enter"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.required_skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Requirements and Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Requirements
                      </label>
                      <textarea
                        rows={3}
                        value={formData.requirements}
                        onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Any special requirements or qualifications needed..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Benefits
                      </label>
                      <textarea
                        rows={3}
                        value={formData.benefits}
                        onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="What volunteers get from this opportunity..."
                      />
                    </div>
                  </div>
                  
                  {/* Checkboxes */}
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
                        Opportunity is active and visible to users
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_recurring"
                        checked={formData.is_recurring}
                        onChange={(e) => setFormData({...formData, is_recurring: e.target.checked})}
                        className="mr-2"
                      />
                      <label htmlFor="is_recurring" className="text-sm font-medium text-gray-700">
                        Recurring opportunity
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
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : editingOpportunity ? 'Update Opportunity' : 'Create Opportunity'}
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
                              'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl`}
                  >
                    {confirmTitle.includes('Delete') ? 'Delete' : 'Confirm'}
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