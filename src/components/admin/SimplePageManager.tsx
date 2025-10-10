/**
 * Simple Page Manager - Easy to use page organization tool
 * Simplified interface for moving pages between menu groups
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
}

interface MenuGroup {
  id: string;
  name: string;
  display_name: string;
  icon: string;
  color: string;
}

export default function SimplePageManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load pages and menu groups
      const [pagesResponse, groupsResponse] = await Promise.all([
        fetch('/api/pages?include_navigation=true&status=published'),
        fetch('/api/menu-groups?active_only=true')
      ]);

      const [pagesData, groupsData] = await Promise.all([
        pagesResponse.json(),
        groupsResponse.json()
      ]);

      if (pagesData.success) setPages(pagesData.data || []);
      if (groupsData.success) setMenuGroups(groupsData.data || []);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const movePage = async (pageId: string, newMenuGroupId: string) => {
    try {
      // Update navigation
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
        loadData(); // Refresh the data
        alert('Page moved successfully!');
      } else {
        alert('Failed to move page: ' + data.error);
      }
    } catch (error) {
      console.error('Error moving page:', error);
      alert('Failed to move page');
    }
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPages = menuGroups.map(group => ({
    ...group,
    pages: filteredPages.filter(page => page.menu_group_name === group.name)
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">📄 Simple Page Manager</h1>
        <p className="text-gray-600">Drag pages between menu groups to reorganize your site navigation</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Menu Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupedPages.map(group => (
          <motion.div
            key={group.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Group Header */}
            <div className={`p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200`}>
              <h3 className="font-semibold text-gray-900 flex items-center">
                <span className="text-lg mr-2">{group.icon}</span>
                {group.display_name}
                <span className="ml-auto bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {group.pages.length}
                </span>
              </h3>
            </div>

            {/* Pages List */}
            <div className="p-2 min-h-[200px] max-h-[400px] overflow-y-auto">
              {group.pages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <p>No pages in this group</p>
                  <p className="text-sm">Drag pages here to organize</p>
                </div>
              ) : (
                group.pages.map(page => (
                  <motion.div
                    key={page.id}
                    className="group p-3 rounded-lg hover:bg-gray-50 cursor-move border border-transparent hover:border-gray-200 mb-2"
                    whileHover={{ scale: 1.02 }}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', JSON.stringify({
                        pageId: page.id,
                        pageTitle: page.title
                      }));
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                          {page.title}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">{page.slug}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {page.status}
                        </span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Quick Move Buttons */}
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex flex-wrap gap-1">
                        {menuGroups
                          .filter(mg => mg.name !== group.name)
                          .slice(0, 3)
                          .map(targetGroup => (
                          <button
                            key={targetGroup.id}
                            onClick={() => movePage(page.id, targetGroup.id)}
                            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded transition-colors"
                            title={`Move to ${targetGroup.display_name}`}
                          >
                            {targetGroup.icon} {targetGroup.display_name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Drop Zone */}
            <div
              className="p-4 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-500"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('bg-blue-50', 'border-blue-200');
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('bg-blue-50', 'border-blue-200');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('bg-blue-50', 'border-blue-200');
                
                try {
                  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                  movePage(data.pageId, group.id);
                } catch (error) {
                  console.error('Error dropping page:', error);
                }
              }}
            >
              Drop pages here to move to {group.display_name}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">📊 Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total Pages:</span>
            <span className="ml-2 font-semibold">{pages.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Menu Groups:</span>
            <span className="ml-2 font-semibold">{menuGroups.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Published:</span>
            <span className="ml-2 font-semibold">{pages.filter(p => p.status === 'published').length}</span>
          </div>
          <div>
            <span className="text-gray-600">Filtered:</span>
            <span className="ml-2 font-semibold">{filteredPages.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}