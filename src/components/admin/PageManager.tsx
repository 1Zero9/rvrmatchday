/**
 * Page Manager - Comprehensive CMS-like page management system
 * Bookmark manager-style interface for creating, organizing, and managing pages
 * 
 * Features:
 * - Page creation with template selection
 * - Drag-and-drop navigation organization  
 * - Menu group management
 * - Page editing and status management
 * - Hierarchical page structure
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../Glass';

interface PageTemplate {
  id: string;
  name: string;
  display_name: string;
  description: string;
  template_type: string;
  preview_image?: string;
}

interface MenuGroup {
  id: string;
  name: string;
  display_name: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  page_count?: number;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  template_name: string;
  template_display_name: string;
  menu_group_name: string;
  menu_group_display_name: string;
  menu_group_icon: string;
  is_visible: boolean;
  parent_page_id?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

interface NavigationItem {
  id: string;
  page_id: string;
  title: string;
  slug: string;
  menu_group_id: string;
  menu_group_name: string;
  parent_id?: string;
  sort_order: number;
  is_visible: boolean;
  icon?: string;
  children?: NavigationItem[];
}

export default function PageManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [navigationStructure, setNavigationStructure] = useState<NavigationItem[]>([]);
  
  // UI State
  const [activeView, setActiveView] = useState<'grid' | 'list' | 'tree'>('grid');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [selectedPageForNav, setSelectedPageForNav] = useState<Page | null>(null);

  // Form state for new page
  const [newPageForm, setNewPageForm] = useState({
    title: '',
    slug: '',
    description: '',
    menu_group_id: '',
    template_props: {},
    status: 'draft' as const
  });

  // Form state for editing page
  const [editPageForm, setEditPageForm] = useState({
    title: '',
    slug: '',
    description: '',
    status: 'draft' as const,
    menu_group_id: '',
    is_visible: true,
    template_props: {},
    parent_page_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadPages(),
        loadTemplates(),
        loadMenuGroups(),
        loadNavigationStructure()
      ]);
    } catch (error) {
      console.error('Error loading page manager data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPages = async () => {
    try {
      const params = new URLSearchParams({
        include_navigation: 'true',
        status: statusFilter !== 'all' ? statusFilter : 'all'
      });
      
      if (selectedGroup !== 'all') {
        params.set('menu_group', selectedGroup);
      }
      
      if (searchTerm) {
        params.set('search', searchTerm);
      }

      const response = await fetch(`/api/pages?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setPages(data.data || []);
      } else {
        console.log('Pages API response:', data);
        setPages([]); // Set empty array if API fails
      }
    } catch (error) {
      console.error('Error loading pages:', error);
      setPages([]); // Set empty array on error
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/page-templates?active_only=true');
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.data || []);
      } else {
        console.log('Templates API response:', data);
        setTemplates([]); // Set empty array if API fails
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates([]); // Set empty array on error
    }
  };

  const loadMenuGroups = async () => {
    try {
      const response = await fetch('/api/menu-groups?active_only=true&include_page_count=true');
      const data = await response.json();
      
      if (data.success) {
        setMenuGroups(data.data || []);
      } else {
        console.log('Menu groups API response:', data);
        setMenuGroups([]); // Set empty array if API fails
      }
    } catch (error) {
      console.error('Error loading menu groups:', error);
      setMenuGroups([]); // Set empty array on error
    }
  };

  const loadNavigationStructure = async () => {
    try {
      const response = await fetch('/api/navigation');
      const data = await response.json();
      
      if (data.success) {
        setNavigationStructure(data.data || []);
      } else {
        console.log('Navigation API response:', data);
        setNavigationStructure([]); // Set empty array if API fails
      }
    } catch (error) {
      console.error('Error loading navigation structure:', error);
      setNavigationStructure([]); // Set empty array on error
    }
  };

  const handleCreatePage = async () => {
    if (!selectedTemplate || !newPageForm.title || !newPageForm.slug) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPageForm,
          template_id: selectedTemplate.id,
          template_props: {
            backgroundImage: '',
            ...newPageForm.template_props
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowCreateModal(false);
        setShowTemplateSelector(false);
        setSelectedTemplate(null);
        setNewPageForm({
          title: '',
          slug: '',
          description: '',
          menu_group_id: '',
          template_props: {},
          status: 'draft'
        });
        loadData();
      } else {
        alert(data.error || 'Failed to create page');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Failed to create page');
    }
  };

  const handleImportExisting = async () => {
    if (!confirm('This will import all existing pages from your site. Continue?')) {
      return;
    }

    setIsLoading(true);
    try {
      // First try quick setup to ensure tables exist with data
      const setupResponse = await fetch('/api/pages/quick-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const setupData = await setupResponse.json();
      if (!setupResponse.ok) {
        if (setupData.suggestion && setupData.suggestion.includes('manually')) {
          alert(`Database setup required!\n\n${setupData.message}\n\nPlease:\n1. Go to your Supabase dashboard\n2. Run the SQL from database/page-management-schema.sql\n3. Then try importing again`);
          return;
        }
      }

      // Now try to import existing pages
      const response = await fetch('/api/pages/import-existing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Successfully imported ${data.imported_pages} pages and ${data.navigation_items} navigation items!`);
        if (data.errors && data.errors.length > 0) {
          console.warn('Import warnings:', data.errors);
        }
        loadData();
      } else {
        alert(data.error || 'Failed to import existing pages');
      }
    } catch (error) {
      console.error('Error importing pages:', error);
      alert('Failed to import existing pages. Database setup may be required.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleEditPage = (page: Page) => {
    // Find the menu group for this page
    const menuGroup = menuGroups.find(mg => mg.display_name === page.menu_group_display_name);
    
    setEditPageForm({
      title: page.title,
      slug: page.slug,
      description: page.description || '',
      status: page.status as 'draft' | 'published',
      menu_group_id: menuGroup?.id || '',
      is_visible: page.is_visible,
      template_props: {},
      parent_page_id: page.parent_page_id || ''
    });
    setEditingPage(page);
    setShowEditModal(true);
  };

  const handleUpdatePage = async () => {
    if (!editingPage) return;

    try {
      // Update the page basic info
      const pageResponse = await fetch(`/api/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editPageForm.title,
          description: editPageForm.description,
          status: editPageForm.status,
        })
      });

      const pageData = await pageResponse.json();
      
      if (!pageData.success) {
        alert(pageData.error || 'Failed to update page');
        return;
      }

      // Update navigation if menu group or parent changed
      if (editPageForm.menu_group_id) {
        // Resolve parent page ID to navigation structure ID
        let parentNavId = null;
        if (editPageForm.parent_page_id) {
          // Find the navigation structure ID for the parent page
          const parentNavRecord = navigationStructure.find(nav => nav.page_id === editPageForm.parent_page_id);
          if (parentNavRecord) {
            parentNavId = parentNavRecord.id;
          }
        }

        const navResponse = await fetch('/api/navigation/update-page-menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_id: editingPage.id,
            menu_group_id: editPageForm.menu_group_id,
            is_visible: editPageForm.is_visible,
            parent_id: parentNavId
          })
        });

        const navData = await navResponse.json();
        if (!navData.success) {
          console.warn('Failed to update navigation:', navData.error);
        }
      }

      setShowEditModal(false);
      setEditingPage(null);
      loadData();
      alert('Page updated successfully!');
    } catch (error) {
      console.error('Error updating page:', error);
      alert('Failed to update page');
    }
  };

  const handleViewNavigation = (page: Page) => {
    setSelectedPageForNav(page);
    setShowNavigationModal(true);
  };

  const handleDeletePage = async (page: Page) => {
    if (!confirm(`Are you sure you want to delete "${page.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/pages/${page.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (data.success) {
        loadData();
        alert('Page deleted successfully!');
      } else {
        alert(data.error || 'Failed to delete page');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  };

  const handleTitleChange = (title: string) => {
    setNewPageForm(prev => ({
      ...prev,
      title,
      slug: generateSlugFromTitle(title)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTemplateTypeColor = (type: string) => {
    switch (type) {
      case 'glass':
        return 'bg-purple-100 text-purple-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'custom':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesGroup = selectedGroup === 'all' || page.menu_group_name === selectedGroup;
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesSearch = !searchTerm || 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesGroup && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Page Manager</h2>
          <p className="text-sm text-gray-500 mt-1">
            Create, organize, and manage your website pages
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {pages.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleImportExisting}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              📥 Import Existing Site
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTemplateSelector(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            ✨ Create New Page
          </motion.button>
        </div>
      </div>

      {/* Stats Overview */}
      <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-blue-50/80 to-purple-50/80">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{pages.length}</div>
            <div className="text-sm text-gray-600">Total Pages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {pages.filter(p => p.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {pages.filter(p => p.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600">Drafts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{menuGroups.length}</div>
            <div className="text-sm text-gray-600">Menu Groups</div>
          </div>
        </div>
      </GlassCard>

      {/* Controls */}
      <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            </div>

            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Groups</option>
              {menuGroups.map(group => (
                <option key={group.id} value={group.name}>
                  {group.icon} {group.display_name} ({group.page_count || 0})
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveView('grid')}
              className={`p-2 rounded-lg transition-colors ${
                activeView === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ⚏
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`p-2 rounded-lg transition-colors ${
                activeView === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ☰
            </button>
            <button
              onClick={() => setActiveView('tree')}
              className={`p-2 rounded-lg transition-colors ${
                activeView === 'tree' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🌳
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredPages.length} of {pages.length} pages
      </div>

      {/* Database Setup Message */}
      {pages.length === 0 && !isLoading && (
        <GlassCard intensity="medium" className="p-8 text-center bg-gradient-to-br from-blue-50/80 to-purple-50/80">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Welcome to Page Manager!
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            This powerful system will show all your existing pages ({filteredPages.length > 0 ? `${filteredPages.length} found` : '85+ pages'}) 
            and let you organize them with drag-and-drop navigation management.
          </p>
          <div className="text-sm text-gray-500 mb-6">
            <strong>Your Site Structure:</strong>
            <div className="mt-2 text-left max-w-lg mx-auto">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>🏠 Home & Landing</div>
                <div>ℹ️ About Club (History, Committee, etc.)</div>
                <div>⚽ Teams (Boys, Girls, Youth, Senior)</div>
                <div>🥅 Matches (Fixtures, Results, Tables)</div>
                <div>📰 News & Media</div>
                <div>🤝 Get Involved (Volunteering, etc.)</div>
                <div>👥 Members (Parents, FAQ, etc.)</div>
                <div>📞 Contact & Join</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Click "Import Existing Site" to load all your pages into the management system.
            </p>
            {templates.length === 0 && (
              <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <strong>Note:</strong> If you see a database setup message, the SQL schema needs to be run first. 
                The import process will guide you through this.
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Pages Content */}
      <AnimatePresence mode="wait">
        {activeView === 'grid' && pages.length > 0 && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredPages.map((page) => (
              <motion.div
                key={page.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{page.menu_group_icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {page.title}
                        </h3>
                        <p className="text-xs text-gray-500">/{page.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(page.status)}`}>
                        {page.status}
                      </span>
                      {!page.is_visible && (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {page.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className={`px-2 py-1 rounded ${getTemplateTypeColor(page.template_name)}`}>
                      {page.template_display_name}
                    </span>
                    <span>{page.menu_group_display_name}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditPage(page)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleViewNavigation(page)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="View Navigation"
                    >
                      🧭
                    </button>
                    <button 
                      onClick={() => handleDeletePage(page)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      title="Delete Page"
                    >
                      🗑️
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeView === 'list' && pages.length > 0 && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard intensity="medium" className="bg-gradient-to-br from-white/80 to-gray-50/80">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Page
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Template
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Menu Group
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Updated
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPages.map((page) => (
                      <tr key={page.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{page.menu_group_icon}</span>
                            <div>
                              <div className="font-medium text-gray-900">{page.title}</div>
                              <div className="text-sm text-gray-500">/{page.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(page.status)}`}>
                            {page.status}
                          </span>
                          {!page.is_visible && (
                            <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                              Hidden
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${getTemplateTypeColor(page.template_name)}`}>
                            {page.template_display_name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {page.menu_group_display_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(page.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => handleEditPage(page)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleViewNavigation(page)}
                              className="text-gray-600 hover:text-blue-600 transition-colors"
                              title="View Navigation"
                            >
                              Nav
                            </button>
                            <button 
                              onClick={() => handleDeletePage(page)}
                              className="text-gray-600 hover:text-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeView === 'tree' && pages.length > 0 && (
          <motion.div
            key="tree"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🌳</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Navigation Tree View
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag-and-drop navigation management coming soon!
                </p>
                <div className="text-sm text-gray-500">
                  This will show the hierarchical structure of your pages with drag-and-drop reordering.
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Selector Modal */}
      <AnimatePresence>
        {showTemplateSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTemplateSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Choose a Template</h3>
                <button
                  onClick={() => setShowTemplateSelector(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowTemplateSelector(false);
                      setShowCreateModal(true);
                    }}
                    className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${getTemplateTypeColor(template.template_type)}`}>
                        {template.template_type}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {template.display_name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      {template.description}
                    </p>
                    <div className="text-sm text-blue-600 font-medium">
                      Select Template →
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Page Modal */}
      <AnimatePresence>
        {showCreateModal && selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Create New Page</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Using: {selectedTemplate.display_name}
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={newPageForm.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter page title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-2">/</span>
                    <input
                      type="text"
                      value={newPageForm.slug}
                      onChange={(e) => setNewPageForm(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="page-url-slug"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newPageForm.description}
                    onChange={(e) => setNewPageForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the page..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menu Group *
                  </label>
                  <select
                    value={newPageForm.menu_group_id}
                    onChange={(e) => setNewPageForm(prev => ({ ...prev, menu_group_id: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select menu group...</option>
                    {menuGroups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.icon} {group.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newPageForm.status}
                    onChange={(e) => setNewPageForm(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePage}
                    disabled={!newPageForm.title || !newPageForm.slug || !newPageForm.menu_group_id}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Page
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Page Modal */}
      <AnimatePresence>
        {showEditModal && editingPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Edit Page</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingPage.slug}
                  </p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={editPageForm.title}
                    onChange={(e) => setEditPageForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editPageForm.description}
                    onChange={(e) => setEditPageForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the page..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Menu Group
                  </label>
                  <select
                    value={editPageForm.menu_group_id}
                    onChange={(e) => setEditPageForm(prev => ({ ...prev, menu_group_id: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select menu group...</option>
                    {menuGroups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.icon} {group.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editPageForm.status}
                    onChange={(e) => setEditPageForm(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Page (Optional)
                  </label>
                  <select
                    value={editPageForm.parent_page_id}
                    onChange={(e) => setEditPageForm(prev => ({ ...prev, parent_page_id: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No parent (top level page)</option>
                    {pages
                      .filter(p => p.id !== editingPage?.id) // Don't allow self as parent
                      .filter(p => editPageForm.menu_group_id ? p.menu_group_display_name === menuGroups.find(mg => mg.id === editPageForm.menu_group_id)?.display_name : true)
                      .map(page => (
                      <option key={page.id} value={page.id}>
                        {page.menu_group_icon} {page.title} ({page.slug})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Make this page a subpage of another page (creates hierarchical structure)
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_visible"
                    checked={editPageForm.is_visible}
                    onChange={(e) => setEditPageForm(prev => ({ ...prev, is_visible: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_visible" className="text-sm font-medium text-gray-700">
                    Visible in navigation
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdatePage}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Page
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Modal */}
      <AnimatePresence>
        {showNavigationModal && selectedPageForNav && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNavigationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Page Navigation</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedPageForNav.title} ({selectedPageForNav.slug})
                  </p>
                </div>
                <button
                  onClick={() => setShowNavigationModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Current Navigation Info */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Current Navigation</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Menu Group:</strong> {selectedPageForNav.menu_group_icon} {selectedPageForNav.menu_group_display_name}</div>
                    <div><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedPageForNav.status)}`}>{selectedPageForNav.status}</span></div>
                    <div><strong>Visible:</strong> {selectedPageForNav.is_visible ? '✅ Yes' : '❌ No'}</div>
                    <div><strong>Template:</strong> {selectedPageForNav.template_display_name}</div>
                    <div><strong>URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{selectedPageForNav.slug}</code></div>
                  </div>
                </div>

                {/* Links to this page */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">🔗 Links to this page</h4>
                  <div className="text-sm text-gray-600">
                    <p>Navigation: {selectedPageForNav.menu_group_display_name} menu</p>
                    <p>Direct URL: <code className="bg-white px-2 py-1 rounded border">{selectedPageForNav.slug}</code></p>
                    {selectedPageForNav.slug.includes('/') && (
                      <p>Parent: <code className="bg-white px-2 py-1 rounded border">{selectedPageForNav.slug.substring(0, selectedPageForNav.slug.lastIndexOf('/')) || '/'}</code></p>
                    )}
                  </div>
                </div>

                {/* Links from this page */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">🎯 Links from this page</h4>
                  <div className="text-sm text-green-700">
                    <p>This page can link to any other page in the site</p>
                    <p>Use the content editor to add internal links</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Use the edit button to change menu group or visibility
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowNavigationModal(false);
                        handleEditPage(selectedPageForNav);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Page
                    </button>
                    <button
                      onClick={() => window.open(selectedPageForNav.slug, '_blank')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      View Page
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}