/**
 * Page Maintenance Manager
 * Admin interface for enabling/disabling individual pages for maintenance
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../SecureAuth';
import { AdminEventLogger, ACTIONS, EVENT_TYPES } from '../../lib/adminEventLoggerClient';

interface PageStatus {
  id: string;
  path: string;
  title: string;
  description: string;
  is_enabled: boolean;
  maintenance_reason?: string;
  disabled_at?: string;
  disabled_by?: string;
  section: 'main' | 'about' | 'teams' | 'contact' | 'admin' | 'other';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

// Default pages in the site - includes ALL submenu pages
const defaultPages: Omit<PageStatus, 'id' | 'created_at' | 'updated_at' | 'disabled_at' | 'disabled_by'>[] = [
  // Main Pages
  { path: '/home', title: 'Home', description: 'Main homepage with hero section and overview', section: 'main', priority: 'high', is_enabled: true },
  { path: '/matches', title: 'Matches', description: 'Match fixtures and results', section: 'main', priority: 'high', is_enabled: true },
  { path: '/volunteer', title: 'Volunteer', description: 'Volunteer opportunities', section: 'main', priority: 'medium', is_enabled: true },
  { path: '/gallery', title: 'Gallery', description: 'Photo gallery', section: 'main', priority: 'low', is_enabled: true },
  
  // About Section - All Submenu Pages
  { path: '/about', title: 'About Us', description: 'Main about page with club overview', section: 'about', priority: 'high', is_enabled: true },
  { path: '/about/our-story', title: 'Our Story', description: 'Club history and founding story', section: 'about', priority: 'medium', is_enabled: true },
  { path: '/club/values', title: 'Club Values', description: 'Our core values and principles', section: 'about', priority: 'medium', is_enabled: true },
  { path: '/about/facilities', title: 'Facilities', description: 'Club facilities and grounds information', section: 'about', priority: 'medium', is_enabled: true },
  { path: '/about/achievements', title: 'Achievements', description: 'Club trophies and achievements', section: 'about', priority: 'low', is_enabled: true },
  
  // Teams Section - All Submenu Pages  
  { path: '/teams', title: 'Teams Overview', description: 'General teams information and overview', section: 'teams', priority: 'high', is_enabled: true },
  { path: '/teams/boys', title: 'Boys Teams', description: 'Boys team listings and information', section: 'teams', priority: 'high', is_enabled: true },
  { path: '/teams/girls', title: 'Girls Teams', description: 'Girls team listings and information', section: 'teams', priority: 'high', is_enabled: true },
  { path: '/teams/management', title: 'Team Management', description: 'Coaching staff and team management', section: 'teams', priority: 'medium', is_enabled: true },
  { path: '/teams/academy', title: 'Academy', description: 'Youth academy programs', section: 'teams', priority: 'medium', is_enabled: true },
  
  // Contact Section - All Submenu Pages
  { path: '/contact', title: 'Contact Us', description: 'Main contact page with form', section: 'contact', priority: 'high', is_enabled: true },
  { path: '/contact/directions', title: 'Directions', description: 'How to find and get to the club', section: 'contact', priority: 'medium', is_enabled: true },
  { path: '/join/trials', title: 'Join Trials', description: 'Player trial information and registration', section: 'contact', priority: 'high', is_enabled: true },
  { path: '/join/inclusive', title: 'Inclusive Club', description: 'Inclusivity and accessibility information', section: 'contact', priority: 'medium', is_enabled: true },
  { path: '/get-involved/coaching', title: 'Become a Coach', description: 'Coaching opportunities and requirements', section: 'contact', priority: 'medium', is_enabled: true },
  
  // Get Involved Section  
  { path: '/get-involved/events', title: 'Events', description: 'Upcoming club events and activities', section: 'other', priority: 'medium', is_enabled: true },
  { path: '/fundraising', title: 'Fundraising', description: 'Club fundraising initiatives', section: 'other', priority: 'medium', is_enabled: true },
  
  // Members Section
  { path: '/members', title: 'Members Area', description: 'Member login and main portal', section: 'other', priority: 'medium', is_enabled: true },
  { path: '/members/parents', title: 'Parents Hub', description: 'Information and resources for parents', section: 'other', priority: 'medium', is_enabled: true },
  { path: '/members/feedback', title: 'Member Feedback', description: 'Feedback forms and suggestions', section: 'other', priority: 'low', is_enabled: true },
  { path: '/members/faq', title: 'FAQ', description: 'Frequently asked questions', section: 'other', priority: 'low', is_enabled: true },
  
  // Shop and Other
  { path: '/shop', title: 'Club Shop', description: 'Merchandise and club shop', section: 'other', priority: 'low', is_enabled: true },
  
  // Admin Pages (usually enabled by default)
  { path: '/admin', title: 'Admin Portal', description: 'Main admin dashboard', section: 'admin', priority: 'high', is_enabled: true },
  { path: '/admin/dashboard', title: 'Admin Dashboard', description: 'Unified admin dashboard', section: 'admin', priority: 'high', is_enabled: true }
];

const sections = [
  { value: 'main', label: 'Main Pages', icon: '🏠', color: 'bg-blue-100 text-blue-800' },
  { value: 'about', label: 'About Section', icon: 'ℹ️', color: 'bg-green-100 text-green-800' },
  { value: 'teams', label: 'Teams Section', icon: '⚽', color: 'bg-purple-100 text-purple-800' },
  { value: 'contact', label: 'Contact Section', icon: '📞', color: 'bg-orange-100 text-orange-800' },
  { value: 'admin', label: 'Admin Section', icon: '🔧', color: 'bg-red-100 text-red-800' },
  { value: 'other', label: 'Other Pages', icon: '📄', color: 'bg-gray-100 text-gray-800' }
];

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
];

export default function PageMaintenanceManager() {
  const { isAdmin, user } = useAuth();
  const [pages, setPages] = useState<PageStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageStatus | null>(null);
  const [maintenanceReason, setMaintenanceReason] = useState('');
  
  // Bulk operations state
  const [selectedPages, setSelectedPages] = useState<Set<string>>(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'enable' | 'disable'>('disable');
  const [bulkReason, setBulkReason] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchPageStatuses();
    }
  }, [isAdmin]);

  const fetchPageStatuses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('page_maintenance')
        .select('*')
        .order('section', { ascending: true })
        .order('priority', { ascending: false })
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching page statuses:', error);
        setError('Database not connected. Using default page list. To persist changes, run the migration script.');
        // Initialize with default pages
        const defaultPageStatuses: PageStatus[] = defaultPages.map((page, index) => ({
          ...page,
          id: `default-${index}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        setPages(defaultPageStatuses);
      } else {
        // If no pages in database, initialize with defaults
        if (!data || data.length === 0) {
          await initializeDefaultPages();
        } else {
          setPages(data || []);
        }
        setError(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load page statuses');
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultPages = async () => {
    try {
      const defaultPageStatuses = defaultPages.map(page => ({
        ...page,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('page_maintenance')
        .insert(defaultPageStatuses);

      if (error) {
        console.error('Error initializing default pages:', error);
      } else {
        await fetchPageStatuses();
      }
    } catch (err) {
      console.error('Error initializing pages:', err);
    }
  };

  const togglePageStatus = async (page: PageStatus) => {
    if (!page.is_enabled) {
      // Enabling a page - no reason needed
      await updatePageStatus(page, true);
    } else {
      // Disabling a page - show modal for reason
      setSelectedPage(page);
      setMaintenanceReason('');
      setShowMaintenanceModal(true);
    }
  };

  const updatePageStatus = async (page: PageStatus, isEnabled: boolean, reason?: string) => {
    try {
      const updateData = {
        is_enabled: isEnabled,
        maintenance_reason: isEnabled ? null : reason,
        disabled_at: isEnabled ? null : new Date().toISOString(),
        disabled_by: isEnabled ? null : user?.email || 'admin',
        updated_at: new Date().toISOString()
      };

      // Check if it's a default page (demo mode)
      if (page.id.startsWith('default-')) {
        setPages(prevPages =>
          prevPages.map(p =>
            p.id === page.id ? { ...p, ...updateData } : p
          )
        );
      } else {
        const { error } = await supabase
          .from('page_maintenance')
          .update(updateData)
          .eq('id', page.id);

        if (error) throw error;
        await fetchPageStatuses();
      }

      // Log the page maintenance operation
      if (user?.id) {
        await AdminEventLogger.logEvent({
          adminUserId: user.id,
          eventType: EVENT_TYPES.MAINTENANCE,
          action: isEnabled ? 'enable_page' : 'disable_page',
          targetType: 'page',
          targetId: page.id,
          targetIdentifier: page.title,
          description: `${isEnabled ? 'Enabled' : 'Disabled'} page "${page.title}" for maintenance`,
          details: {
            page_path: page.path,
            page_section: page.section,
            page_priority: page.priority,
            maintenance_reason: reason || null,
            previous_status: page.is_enabled,
            new_status: isEnabled,
            action_type: isEnabled ? 'page_enabled' : 'page_disabled',
            undo_available: true
          },
          status: 'success'
        });
      }

      // Add to unified undo system if available
      const adminActions = (window as any).adminActions;
      if (adminActions && adminActions.addUndoableNotification) {
        const undoAction = {
          type: 'toggle_page_maintenance' as const,
          data: { ...page, previous_status: page.is_enabled },
          table: 'page_maintenance',
          description: `${isEnabled ? 'Enabled' : 'Disabled'} page "${page.title}"`
        };
        
        adminActions.addUndoableNotification(
          `${isEnabled ? '✅' : '🚧'} Page "${page.title}" has been ${isEnabled ? 'enabled' : 'disabled'}`,
          undoAction,
          10000
        );
      }
      
    } catch (err) {
      console.error('Error updating page status:', err);
      setError('Failed to update page status');
      
      // Log the error
      if (user?.id) {
        await AdminEventLogger.logEvent({
          adminUserId: user.id,
          eventType: EVENT_TYPES.MAINTENANCE,
          action: isEnabled ? 'enable_page' : 'disable_page',
          targetType: 'page',
          targetId: page.id,
          targetIdentifier: page.title,
          description: `Failed to ${isEnabled ? 'enable' : 'disable'} page "${page.title}"`,
          details: {
            page_path: page.path,
            attempted_status: isEnabled,
            maintenance_reason: reason || null,
            error: (err as Error).message
          },
          status: 'failed',
          errorMessage: (err as Error).message
        });
      }
    }
  };

  const handleMaintenanceSubmit = async () => {
    if (!selectedPage) return;
    
    if (!maintenanceReason.trim()) {
      alert('Please provide a reason for putting this page under maintenance.');
      return;
    }

    await updatePageStatus(selectedPage, false, maintenanceReason);
    setShowMaintenanceModal(false);
    setSelectedPage(null);
    setMaintenanceReason('');
  };

  // Bulk operations functions
  const togglePageSelection = (pageId: string) => {
    const newSelected = new Set(selectedPages);
    if (newSelected.has(pageId)) {
      newSelected.delete(pageId);
    } else {
      newSelected.add(pageId);
    }
    setSelectedPages(newSelected);
  };

  const selectAllFiltered = () => {
    const allFilteredIds = new Set(filteredPages.map(page => page.id));
    setSelectedPages(allFilteredIds);
  };

  const clearSelection = () => {
    setSelectedPages(new Set());
  };

  const handleBulkAction = (action: 'enable' | 'disable') => {
    if (selectedPages.size === 0) return;
    
    setBulkAction(action);
    setBulkReason('');
    setShowBulkModal(true);
  };

  const executeBulkAction = async () => {
    if (selectedPages.size === 0) return;

    const selectedPagesList = pages.filter(page => selectedPages.has(page.id));
    
    try {
      // Process pages in parallel for better performance
      const promises = selectedPagesList.map(page => 
        updatePageStatus(page, bulkAction === 'enable', bulkAction === 'disable' ? bulkReason : undefined)
      );
      
      await Promise.all(promises);
      
      // Log the bulk operation
      if (user?.id) {
        await AdminEventLogger.logEvent({
          adminUserId: user.id,
          eventType: EVENT_TYPES.MAINTENANCE,
          action: bulkAction === 'enable' ? 'bulk_enable_pages' : 'bulk_disable_pages',
          targetType: 'page',
          targetIdentifier: `${selectedPagesList.length} pages`,
          description: `Bulk ${bulkAction === 'enable' ? 'enabled' : 'disabled'} ${selectedPagesList.length} pages`,
          details: {
            bulk_action: bulkAction,
            pages_affected: selectedPagesList.map(page => ({
              id: page.id,
              title: page.title,
              path: page.path,
              section: page.section
            })),
            total_pages: selectedPagesList.length,
            bulk_reason: bulkAction === 'disable' ? bulkReason : null,
            operation_type: 'bulk_maintenance_operation'
          },
          status: 'success'
        });
      }
      
      // Clear selection and close modal
      setSelectedPages(new Set());
      setShowBulkModal(false);
      setBulkReason('');
      
      // Refresh data
      await fetchPageStatuses();
      
    } catch (error) {
      console.error('Error executing bulk action:', error);
      setError('Failed to execute bulk operation');
      
      // Log the bulk operation error
      if (user?.id) {
        await AdminEventLogger.logEvent({
          adminUserId: user.id,
          eventType: EVENT_TYPES.MAINTENANCE,
          action: bulkAction === 'enable' ? 'bulk_enable_pages' : 'bulk_disable_pages',
          targetType: 'page',
          targetIdentifier: `${selectedPagesList.length} pages`,
          description: `Failed to bulk ${bulkAction} ${selectedPagesList.length} pages`,
          details: {
            bulk_action: bulkAction,
            attempted_pages: selectedPagesList.map(page => ({
              id: page.id,
              title: page.title,
              path: page.path
            })),
            total_pages: selectedPagesList.length,
            error: (error as Error).message
          },
          status: 'failed',
          errorMessage: (error as Error).message
        });
      }
    }
  };

  const getSectionInfo = (section: string) => {
    return sections.find(s => s.value === section) || sections[0];
  };

  const getPriorityInfo = (priority: string) => {
    return priorities.find(p => p.value === priority) || priorities[0];
  };

  // Filter pages
  const filteredPages = pages.filter(page => {
    const matchesSection = selectedSection === 'all' || page.section === selectedSection;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'enabled' && page.is_enabled) ||
                         (statusFilter === 'disabled' && !page.is_enabled);
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSection && matchesStatus && matchesSearch;
  });

  const enabledCount = pages.filter(p => p.is_enabled).length;
  const disabledCount = pages.filter(p => !p.is_enabled).length;

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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">🚧 Page Maintenance Manager</h2>
            <p className="text-indigo-100">Enable or disable individual pages for maintenance</p>
          </div>
          <div className="text-right">
            <div className="text-white/90 text-sm space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>Enabled: {enabledCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span>Disabled: {disabledCount}</span>
              </div>
              <div className="text-xs text-indigo-200">Total: {pages.length} pages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-6">
          <p className="text-yellow-800 font-semibold">{error}</p>
          <div className="mt-3 text-yellow-700 text-sm space-y-2">
            <p>To set up the database for page maintenance:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Open Supabase SQL Editor</li>
              <li>Run: <code className="bg-yellow-100 px-1 rounded">database/migrations/create_page_maintenance_table.sql</code></li>
            </ol>
            <p className="text-xs text-yellow-600 mt-2">
              Current page statuses are temporary and won't persist until the database is set up.
            </p>
          </div>
        </div>
      )}

      {/* Bulk Selection Controls */}
      {selectedPages.size > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-blue-800 font-semibold">
                {selectedPages.size} page{selectedPages.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={clearSelection}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Clear selection
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('enable')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
              >
                ✅ Enable Selected
              </button>
              <button
                onClick={() => handleBulkAction('disable')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
              >
                🚧 Disable Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Pages</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, path, or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Sections</option>
              {sections.map(section => (
                <option key={section.value} value={section.value}>
                  {section.icon} {section.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Pages</option>
              <option value="enabled">✅ Enabled Pages</option>
              <option value="disabled">🚧 Under Maintenance</option>
            </select>
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={selectAllFiltered}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ☑️ Select All
            </button>
            <button
              onClick={fetchPageStatuses}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{enabledCount}</div>
            <div className="text-sm text-gray-600">Pages Enabled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{disabledCount}</div>
            <div className="text-sm text-gray-600">Under Maintenance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredPages.length}</div>
            <div className="text-sm text-gray-600">Shown</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{pages.length}</div>
            <div className="text-sm text-gray-600">Total Pages</div>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading page statuses...</p>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Pages Found</h3>
            <p className="text-gray-600">No pages match your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPages.map((page) => {
              const sectionInfo = getSectionInfo(page.section);
              const priorityInfo = getPriorityInfo(page.priority);
              
              return (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-lg p-4 transition-all ${
                    page.is_enabled 
                      ? 'bg-white border-gray-200 hover:shadow-md' 
                      : 'bg-red-50 border-red-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    {/* Checkbox */}
                    <div className="flex items-start pt-1 mr-4">
                      <input
                        type="checkbox"
                        checked={selectedPages.has(page.id)}
                        onChange={() => togglePageSelection(page.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className={`text-lg font-bold ${page.is_enabled ? 'text-gray-900' : 'text-red-800'}`}>
                          {page.title}
                        </h3>
                        
                        {/* Status Badge */}
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          page.is_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {page.is_enabled ? '✅ Live' : '🚧 Maintenance'}
                        </span>
                        
                        {/* Section Badge */}
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${sectionInfo.color}`}>
                          {sectionInfo.icon} {sectionInfo.label}
                        </span>
                        
                        {/* Priority Badge */}
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${priorityInfo.color}`}>
                          {priorityInfo.label}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600"><strong>Path:</strong> <code className="bg-gray-100 px-1 rounded">{page.path}</code></p>
                          <p className="text-sm text-gray-600 mt-1">{page.description}</p>
                        </div>
                        
                        <div>
                          {!page.is_enabled && (
                            <>
                              {page.maintenance_reason && (
                                <p className="text-sm text-red-600"><strong>Reason:</strong> {page.maintenance_reason}</p>
                              )}
                              {page.disabled_at && (
                                <p className="text-sm text-gray-500"><strong>Disabled:</strong> {new Date(page.disabled_at).toLocaleString()}</p>
                              )}
                              {page.disabled_by && (
                                <p className="text-sm text-gray-500"><strong>By:</strong> {page.disabled_by}</p>
                              )}
                            </>
                          )}
                          <p className="text-sm text-gray-500"><strong>Updated:</strong> {new Date(page.updated_at).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => togglePageStatus(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          page.is_enabled
                            ? 'bg-red-100 hover:bg-red-200 text-red-700'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}
                      >
                        {page.is_enabled ? '🚧 Disable' : '✅ Enable'}
                      </button>
                      
                      <a
                        href={page.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-all"
                      >
                        🔗 View
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Maintenance Reason Modal */}
      <AnimatePresence>
        {showMaintenanceModal && selectedPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMaintenanceModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6">
                <h3 className="text-xl font-bold">🚧 Put Page Under Maintenance</h3>
                <p className="text-red-100 mt-1">{selectedPage.title}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Path:</strong> <code className="bg-gray-100 px-1 rounded">{selectedPage.path}</code>
                  </p>
                  <p className="text-gray-700">
                    <strong>Description:</strong> {selectedPage.description}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={maintenanceReason}
                    onChange={(e) => setMaintenanceReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                    placeholder="Explain why this page is being put under maintenance..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This reason will be shown to users on the maintenance page.
                  </p>
                </div>
                
                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowMaintenanceModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMaintenanceSubmit}
                    disabled={!maintenanceReason.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    Put Under Maintenance
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Bulk Action Modal */}
        {showBulkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBulkModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`${bulkAction === 'enable' ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-orange-600'} text-white p-6`}>
                <h3 className="text-xl font-bold">
                  {bulkAction === 'enable' ? '✅ Enable Multiple Pages' : '🚧 Disable Multiple Pages'}
                </h3>
                <p className="text-white/90 mt-1">
                  {selectedPages.size} page{selectedPages.size !== 1 ? 's' : ''} selected
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Action:</strong> {bulkAction === 'enable' ? 'Enable' : 'Disable'} the following pages:
                  </p>
                  <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-3">
                    {pages.filter(page => selectedPages.has(page.id)).map(page => (
                      <div key={page.id} className="text-sm text-gray-600 mb-1">
                        • {page.title} ({page.path})
                      </div>
                    ))}
                  </div>
                </div>

                {bulkAction === 'disable' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maintenance Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={bulkReason}
                      onChange={(e) => setBulkReason(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="Explain why these pages are being put under maintenance..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This reason will be shown to users on the maintenance page.
                    </p>
                  </div>
                )}
                
                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeBulkAction}
                    disabled={bulkAction === 'disable' && !bulkReason.trim()}
                    className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 ${
                      bulkAction === 'enable' 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                        : 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white'
                    }`}
                  >
                    {bulkAction === 'enable' ? 'Enable Pages' : 'Disable Pages'}
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