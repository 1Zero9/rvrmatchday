/**
 * Bookmark-Style Page Manager
 * Interface similar to Chrome/Edge bookmark manager
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Page {
  id: string;
  title: string;
  slug: string;
  menu_group_name: string;
  menu_group_display_name: string;
  menu_group_icon: string;
  status: string;
  parent_id?: string;
  nav_id?: string; // navigation_structure.id - needed for proper parent-child relationships
}

interface PageFolder {
  id: string;
  title: string;
  slug: string;
  isFolder: boolean;
  children: PageFolder[];
  pages: Page[];
  level: number;
}

interface MenuGroup {
  id: string;
  name: string;
  display_name: string;
  icon: string;
  color: string;
}

interface Template {
  id: string;
  name: string;
  display_name: string;
  template_type: string;
}

export default function BookmarkPageManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['all']));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'page' | 'folder'>('page');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pagesResponse, groupsResponse, templatesResponse] = await Promise.all([
        fetch('/api/navigation/hierarchy'), // Use new hierarchy API
        fetch('/api/menu-groups?active_only=true'),
        fetch('/api/page-templates')
      ]);

      const [pagesData, groupsData, templatesData] = await Promise.all([
        pagesResponse.json(),
        groupsResponse.json(),
        templatesResponse.json()
      ]);

      if (pagesData.success) {
        setPages(pagesData.data || []);
      } else {
        console.error('Pages API failed:', pagesData);
      }
      
      if (groupsData.success) {
        setMenuGroups(groupsData.data || []);
      } else {
        console.error('Menu groups API failed:', groupsData);
      }

      if (templatesData.success) {
        setTemplates(templatesData.data || []);
      } else {
        console.error('Templates API failed:', templatesData);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const movePage = async (pageId: string, newMenuGroupId: string) => {
    try {
      const response = await fetch('/api/navigation/update-page-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_id: pageId,
          menu_group_id: newMenuGroupId,
          is_visible: true
        })
      });

      const data = await response.json();
      if (data.success) {
        await loadData();
        showToast('Page moved successfully!', 'success');
      } else {
        showToast('Failed to move page: ' + data.error, 'error');
      }
    } catch (error) {
      console.error('Error moving page:', error);
      showToast('Failed to move page', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    // Simple alert for now - can be enhanced later
    alert(message);
  };

  const togglePageMaintenance = async (pageId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'maintenance' ? 'published' : 'maintenance';
    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        await loadData();
        showToast(`Page ${newStatus === 'maintenance' ? 'disabled' : 'enabled'} successfully!`, 'success');
      } else {
        showToast('Failed to update page status: ' + data.error, 'error');
      }
    } catch (error) {
      console.error('Error updating page status:', error);
      showToast('Failed to update page status', 'error');
    }
  };

  const createNewPage = async (title: string, menuGroupId: string, templateId: string, parentId?: string) => {
    try {
      const slug = '/' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description: `Auto-created page: ${title}`,
          template_id: templateId,
          status: 'draft',
          menu_group_id: menuGroupId,
          parent_id: parentId
        })
      });

      const data = await response.json();
      if (data.success) {
        await loadData();
        showToast('Page created successfully!', 'success');
        setShowCreateModal(false);
      } else {
        showToast('Failed to create page: ' + data.error, 'error');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      showToast('Failed to create page', 'error');
    }
  };

  // Build hierarchical folder structure using proper navigation structure relationships
  const buildFolderStructure = (): PageFolder[] => {
    const folderMap = new Map<string, PageFolder>();
    
    // Create folders for each menu group
    menuGroups.forEach(group => {
      folderMap.set(group.name, {
        id: group.id,
        title: group.display_name,
        slug: group.name,
        isFolder: true,
        children: [],
        pages: [],
        level: 0
      });
    });

    // Create navigation structure map for proper parent-child relationships
    const navMap = new Map<string, Page>();
    const childrenMap = new Map<string, Page[]>();
    
    // Build navigation maps
    pages.forEach(page => {
      if (page.nav_id) {
        navMap.set(page.nav_id, page);
      }
      
      // Group by parent navigation ID
      const parentKey = page.parent_id || 'root';
      if (!childrenMap.has(parentKey)) {
        childrenMap.set(parentKey, []);
      }
      childrenMap.get(parentKey)!.push(page);
    });

    // Minimal logging for navigation analysis
    
    // Add root pages to their menu group folders
    const rootPages = childrenMap.get('root') || [];
    rootPages.forEach(page => {
      const folder = folderMap.get(page.menu_group_name);
      if (folder) {
        folder.pages.push(page);
      }
    });

    // Process child pages - now we can properly match navigation structure IDs
    childrenMap.forEach((childPages, parentNavId) => {
      if (parentNavId !== 'root') {
        // Find the parent page by navigation structure ID
        const parentPage = navMap.get(parentNavId);
        
        if (parentPage) {
          const parentFolder = folderMap.get(parentPage.menu_group_name);
          if (parentFolder) {
            // Find or create subfolder for parent page
            let subfolder = parentFolder.children.find(c => c.slug === parentPage.slug);
            if (!subfolder) {
              subfolder = {
                id: parentPage.id,
                title: parentPage.title,
                slug: parentPage.slug,
                isFolder: true,
                children: [],
                pages: [],
                level: 1
              };
              parentFolder.children.push(subfolder);
              
              // Remove parent page from the main folder since it now has children
              parentFolder.pages = parentFolder.pages.filter(p => p.id !== parentPage.id);
            }
            
            // Add all child pages to the subfolder
            childPages.forEach(childPage => {
              subfolder!.pages.push(childPage);
            });
          }
        } else {
          // Add orphaned children to their respective root folders
          childPages.forEach(childPage => {
            const folder = folderMap.get(childPage.menu_group_name);
            if (folder) {
              folder.pages.push(childPage);
            }
          });
        }
      }
    });

    return Array.from(folderMap.values());
  };

  const folderStructure = buildFolderStructure();
  
  // Debug: Log the folder structure (minimal logging)
  React.useEffect(() => {
    if (!isLoading && pages.length > 0) {
      console.log(`Page Manager loaded: ${pages.length} pages, ${folderStructure.length} folders`);
    }
  }, [isLoading, pages.length]);

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    
    let matchesFolder = false;
    if (selectedFolder === 'all') {
      matchesFolder = true;
    } else {
      // Check if it matches a menu group
      matchesFolder = page.menu_group_name === selectedFolder;
      
      // Check if it matches a subfolder (parent page slug)
      if (!matchesFolder) {
        const parentPage = pages.find(p => p.id === page.parent_id);
        matchesFolder = parentPage?.slug === selectedFolder;
      }
    }
    
    return matchesSearch && matchesFolder && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar - Folders (like bookmark folders) */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">📁 Site Folders</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* All Pages */}
          <div
            className={`flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
              selectedFolder === 'all' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' : 'text-gray-700'
            }`}
            onClick={() => setSelectedFolder('all')}
          >
            <span className="mr-2">📄</span>
            <span className="flex-1">All Pages</span>
            <span className="text-xs text-gray-500">{pages.length}</span>
          </div>

          {/* Hierarchical Folder Structure */}
          {folderStructure.map(folder => {
            const isExpanded = expandedFolders.has(folder.slug);
            const totalPages = folder.pages.length + folder.children.reduce((sum, child) => sum + child.pages.length, 0);
            
            return (
              <div key={folder.id}>
                {/* Main Folder */}
                <div
                  className={`flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    selectedFolder === folder.slug ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' : 'text-gray-700'
                  }`}
                  onClick={() => setSelectedFolder(folder.slug)}
                >
                  {folder.children.length > 0 && (
                    <button
                      className="mr-1 p-0.5 hover:bg-gray-200 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newExpanded = new Set(expandedFolders);
                        if (isExpanded) {
                          newExpanded.delete(folder.slug);
                        } else {
                          newExpanded.add(folder.slug);
                        }
                        setExpandedFolders(newExpanded);
                      }}
                    >
                      <svg 
                        className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                  <span className="mr-2">📁</span>
                  <span className="flex-1">{folder.title}</span>
                  <span className="text-xs text-gray-500">{totalPages}</span>
                </div>

                {/* Subfolders */}
                {isExpanded && folder.children.map(subfolder => (
                  <div
                    key={subfolder.id}
                    className={`flex items-center pl-8 pr-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      selectedFolder === subfolder.slug ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' : 'text-gray-600'
                    }`}
                    onClick={() => setSelectedFolder(subfolder.slug)}
                  >
                    <span className="mr-2">📄</span>
                    <span className="flex-1">{subfolder.title}</span>
                    <span className="text-xs text-gray-500">{subfolder.pages.length}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {(() => {
                  if (selectedFolder === 'all') return '📄 All Pages';
                  
                  // Check if it's a menu group
                  const menuGroup = menuGroups.find(g => g.name === selectedFolder);
                  if (menuGroup) {
                    return `${menuGroup.icon} ${menuGroup.display_name}`;
                  }
                  
                  // Check if it's a subfolder (page slug)
                  const parentPage = pages.find(p => p.slug === selectedFolder);
                  if (parentPage) {
                    const parentMenuGroup = menuGroups.find(g => g.name === parentPage.menu_group_name);
                    return `📄 ${parentPage.title} (${parentMenuGroup?.display_name})`;
                  }
                  
                  return '📁 Unknown Folder';
                })()}
              </h1>
              <span className="text-sm text-gray-500">
                {filteredPages.length} page{filteredPages.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="maintenance">Maintenance</option>
                <option value="archived">Archived</option>
              </select>
              
              {/* Create Buttons */}
              <button
                onClick={() => { setCreateType('page'); setShowCreateModal(true); }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
              >
                ➕ New Page
              </button>
              
              <button
                onClick={() => { setCreateType('folder'); setShowCreateModal(true); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
              >
                📁 New Folder
              </button>
              
              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Pages List */}
        <div className="flex-1 overflow-y-auto bg-white">
          {filteredPages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <span className="text-4xl mb-2">📭</span>
              <p>No pages found</p>
              {searchTerm && <p className="text-sm">Try a different search term</p>}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPages.map(page => (
                <motion.div
                  key={page.id}
                  className="flex items-center p-4 hover:bg-gray-50 group"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Page Icon */}
                  <div className="mr-3">
                    <span className="text-lg">🔗</span>
                  </div>

                  {/* Page Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 truncate">{page.title}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        page.status === 'published' ? 'bg-green-100 text-green-800' :
                        page.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        page.status === 'maintenance' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {page.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{page.slug}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-400">
                      <span className="mr-1">{page.menu_group_icon}</span>
                      <span>{page.menu_group_display_name}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                    {/* Maintenance Toggle */}
                    <button
                      onClick={() => togglePageMaintenance(page.id, page.status)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        page.status === 'maintenance' 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                      title={page.status === 'maintenance' ? 'Enable page' : 'Disable page'}
                    >
                      {page.status === 'maintenance' ? '✅ Enable' : '🚧 Disable'}
                    </button>
                    
                    {/* Move Dropdown */}
                    <div className="relative">
                      <select
                        onChange={(e) => {
                          if (e.target.value && e.target.value !== page.menu_group_name) {
                            const selectedGroup = menuGroups.find(g => g.name === e.target.value);
                            if (selectedGroup) {
                              movePage(page.id, selectedGroup.id);
                            }
                          }
                          e.target.value = ''; // Reset selection
                        }}
                        className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>Move to...</option>
                        {menuGroups
                          .filter(group => group.name !== page.menu_group_name)
                          .map(group => (
                          <option key={group.id} value={group.name}>
                            {group.icon} {group.display_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Visit Link */}
                    <a
                      href={page.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm transition-opacity"
                      title="Visit page"
                    >
                      🔗
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {pages.filter(p => p.status === 'published').length} published, 
              {pages.filter(p => p.status === 'maintenance').length} maintenance, 
              {pages.length} total pages
            </span>
            <span>
              {menuGroups.length} folders
            </span>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {createType === 'page' ? '📄 Create New Page' : '📁 Create New Folder'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const title = formData.get('title') as string;
              const menuGroup = formData.get('menuGroup') as string;
              const template = formData.get('template') as string;
              
              if (title && menuGroup && template) {
                if (createType === 'page') {
                  createNewPage(title, menuGroup, template);
                } else {
                  // For folders, create a parent page that will act as a folder
                  createNewPage(title, menuGroup, template);
                }
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {createType === 'page' ? 'Page' : 'Folder'} Name
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={`Enter ${createType} name...`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Menu Group
                  </label>
                  <select
                    name="menuGroup"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Template
                  </label>
                  <select
                    name="template"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select template...</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.display_name} ({template.template_type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create {createType === 'page' ? 'Page' : 'Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}