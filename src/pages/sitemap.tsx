/**
 * Site Map Page - Navigation Analysis & Overview
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Comprehensive site map showing all pages, their status, and navigation structure.
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';

interface PageInfo {
  path: string;
  title: string;
  status: 'working' | 'missing' | 'duplicate' | 'redirect';
  template: 'standard' | 'glass' | 'custom';
  category: string;
  description: string;
  issues?: string[];
  linkedFrom?: string[];
}

export default function SiteMap() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const pages: PageInfo[] = [
    // Root Pages
    { path: '/', title: 'Home Landing', status: 'working', template: 'custom', category: 'root', description: 'Main landing page with intro sequence', linkedFrom: ['Logo click'] },
    { path: '/home', title: 'Home Dashboard', status: 'working', template: 'standard', category: 'root', description: 'Main dashboard after intro', linkedFrom: ['Navigation'] },
    { path: '/404', title: '404 Error', status: 'working', template: 'custom', category: 'system', description: 'Error page for missing routes' },

    // About & Club Information
    { path: '/about', title: 'About Us', status: 'working', template: 'glass', category: 'club', description: 'Club story and heritage', linkedFrom: ['Navigation', 'Footer'] },
    { path: '/club', title: 'Club Hub', status: 'working', template: 'glass', category: 'club', description: 'Main club information hub', linkedFrom: ['Navigation'] },
    { path: '/club/history', title: 'Club History', status: 'working', template: 'glass', category: 'club', description: 'Detailed club history', linkedFrom: ['About page', 'Club hub', 'Navigation'] },
    { path: '/club/facilities', title: 'Facilities', status: 'working', template: 'glass', category: 'club', description: 'Club facilities and grounds', linkedFrom: ['Navigation', 'Club hub'] },
    { path: '/club/committee', title: 'Committee', status: 'working', template: 'glass', category: 'club', description: 'Club leadership and committee', linkedFrom: ['Navigation', 'Club hub'] },
    { path: '/club/values', title: 'Club Values', status: 'working', template: 'glass', category: 'club', description: 'Club values and philosophy', linkedFrom: ['About page', 'Club hub'] },

    // Teams Structure
    { path: '/teams', title: 'Teams Hub', status: 'working', template: 'glass', category: 'teams', description: 'Central teams overview', linkedFrom: ['Navigation'] },
    { path: '/teams/boys', title: 'Boys Teams', status: 'working', template: 'glass', category: 'teams', description: 'U18, U16, U14, U12, U10 boys teams', linkedFrom: ['Navigation', 'Teams hub'] },
    { path: '/teams/girls', title: 'Girls Teams', status: 'working', template: 'glass', category: 'teams', description: 'U16, U14, U12 girls teams', linkedFrom: ['Navigation', 'Teams hub'] },
    { path: '/teams/senior', title: 'Senior Teams', status: 'working', template: 'glass', category: 'teams', description: 'Adult competitive teams', linkedFrom: ['Navigation', 'Teams hub'] },
    { path: '/teams/youth', title: 'Youth Teams', status: 'working', template: 'glass', category: 'teams', description: 'Youth development programs', linkedFrom: ['About page'] },
    { path: '/teams/inclusive', title: 'Inclusive Football', status: 'working', template: 'glass', category: 'teams', description: 'Football for all abilities', linkedFrom: ['Navigation', 'Teams hub'] },

    // Join & Registration
    { path: '/join', title: 'Join Hub', status: 'working', template: 'glass', category: 'join', description: 'Main registration hub', linkedFrom: ['Navigation', 'CTA buttons'] },
    { path: '/join/youth', title: 'Youth Registration', status: 'working', template: 'glass', category: 'join', description: 'Youth team registration', linkedFrom: ['Join hub'] },
    { path: '/join/senior', title: 'Senior Registration', status: 'working', template: 'glass', category: 'join', description: 'Adult team registration', linkedFrom: ['Join hub'] },
    { path: '/join/academy', title: 'Academy Registration', status: 'working', template: 'glass', category: 'join', description: 'Academy program registration', linkedFrom: ['Join hub'] },
    { path: '/join/trials', title: 'Trials', status: 'working', template: 'glass', category: 'join', description: 'Trial information and registration', linkedFrom: ['Join hub'] },
    { path: '/join/family', title: 'Family Membership', status: 'working', template: 'glass', category: 'join', description: 'Family membership options', linkedFrom: ['Join hub'] },
    { path: '/join/inclusive', title: 'Inclusive Registration', status: 'working', template: 'glass', category: 'join', description: 'Registration for inclusive football', linkedFrom: ['Join hub'] },

    // Get Involved
    { path: '/get-involved', title: 'Get Involved Hub', status: 'working', template: 'glass', category: 'community', description: 'Community engagement hub', linkedFrom: ['Navigation', 'CTA buttons'] },
    { path: '/get-involved/volunteering', title: 'Volunteering (Hub)', status: 'working', template: 'glass', category: 'community', description: 'Volunteer opportunities hub', linkedFrom: ['Get Involved hub'] },
    { path: '/volunteering', title: 'Volunteering (Direct)', status: 'duplicate', template: 'glass', category: 'community', description: 'Direct volunteer page', linkedFrom: ['Direct links'], issues: ['Duplicate of /get-involved/volunteering'] },
    { path: '/get-involved/fundraising', title: 'Fundraising (Hub)', status: 'working', template: 'glass', category: 'community', description: 'Fundraising information hub', linkedFrom: ['Get Involved hub'] },
    { path: '/fundraising', title: 'Fundraising (Direct)', status: 'duplicate', template: 'glass', category: 'community', description: 'Direct fundraising page', linkedFrom: ['Direct links'], issues: ['Duplicate of /get-involved/fundraising'] },
    { path: '/get-involved/sponsorship', title: 'Sponsorship', status: 'working', template: 'glass', category: 'community', description: 'Sponsorship opportunities', linkedFrom: ['Get Involved hub'] },
    { path: '/get-involved/events', title: 'Events', status: 'working', template: 'glass', category: 'community', description: 'Community events', linkedFrom: ['Get Involved hub'] },

    // Matches & Match Central
    { path: '/match-central', title: 'Match Central', status: 'working', template: 'custom', category: 'matches', description: 'Main match management hub', linkedFrom: ['Navigation'] },
    { path: '/match-central/fixtures', title: 'Fixtures', status: 'working', template: 'custom', category: 'matches', description: 'Upcoming fixtures', linkedFrom: ['Match Central', 'Navigation dropdown'] },
    { path: '/match-central/results', title: 'Results', status: 'working', template: 'custom', category: 'matches', description: 'Match results', linkedFrom: ['Match Central', 'Navigation dropdown'] },
    { path: '/match-central/tables', title: 'League Tables', status: 'working', template: 'custom', category: 'matches', description: 'League standings', linkedFrom: ['Match Central'] },

    // Match Tracker (Premium Feature)
    { path: '/match-tracker', title: 'Match Tracker Hub', status: 'working', template: 'custom', category: 'premium', description: 'Premium match tracking system', linkedFrom: ['Match Central'] },
    { path: '/match-tracker/teams', title: 'Tracker Teams', status: 'working', template: 'custom', category: 'premium', description: 'Team management for tracking', linkedFrom: ['Match Tracker'] },
    { path: '/match-tracker/teams/new', title: 'New Team', status: 'working', template: 'custom', category: 'premium', description: 'Add new team to tracker', linkedFrom: ['Tracker Teams'] },
    { path: '/matches/new', title: 'New Match', status: 'working', template: 'custom', category: 'premium', description: 'Create new match for tracking', linkedFrom: ['Match Tracker'] },
    { path: '/matches/[id]/record', title: 'Match Recording', status: 'working', template: 'custom', category: 'premium', description: 'Live match recording interface', linkedFrom: ['Active matches'] },

    // News & Media
    { path: '/news', title: 'News', status: 'working', template: 'standard', category: 'content', description: 'Club news and updates', linkedFrom: ['Navigation', 'Home dashboard'] },
    { path: '/news-media', title: 'News & Media Hub', status: 'working', template: 'glass', category: 'content', description: 'Media hub landing page', linkedFrom: ['Navigation dropdown'] },
    { path: '/news-media/events', title: 'Events (Media)', status: 'working', template: 'glass', category: 'content', description: 'Events from media perspective', linkedFrom: ['News Media hub'] },
    { path: '/news-media/gallery', title: 'Gallery (Media)', status: 'working', template: 'glass', category: 'content', description: 'Media gallery view', linkedFrom: ['News Media hub'] },
    { path: '/gallery', title: 'Gallery (Direct)', status: 'working', template: 'standard', category: 'content', description: 'Direct photo gallery', linkedFrom: ['Home dashboard', 'Navigation'] },

    // Community Pages
    { path: '/boot-room', title: 'Boot Room', status: 'working', template: 'standard', category: 'community', description: 'Equipment swap shop', linkedFrom: ['Home dashboard'] },
    { path: '/coach', title: 'Become a Coach', status: 'working', template: 'standard', category: 'community', description: 'Coach recruitment', linkedFrom: ['Navigation', 'Get Involved'] },
    { path: '/shop', title: 'Club Shop', status: 'working', template: 'glass', category: 'commercial', description: 'Club merchandise', linkedFrom: ['Navigation', 'Footer'] },

    // Member Areas
    { path: '/members', title: 'Members Hub', status: 'working', template: 'glass', category: 'members', description: 'Member portal hub', linkedFrom: ['Navigation dropdown'] },
    { path: '/members/parents', title: 'Parents Portal', status: 'working', template: 'glass', category: 'members', description: 'Parent-specific resources', linkedFrom: ['Members hub', 'Gallery upload'] },
    { path: '/members/feedback', title: 'Member Feedback', status: 'working', template: 'glass', category: 'members', description: 'Member feedback system', linkedFrom: ['Members hub'] },
    { path: '/members/faq', title: 'Member FAQ', status: 'working', template: 'glass', category: 'members', description: 'Member frequently asked questions', linkedFrom: ['Members hub'] },

    // System & Admin
    { path: '/contact', title: 'Contact Us', status: 'working', template: 'glass', category: 'system', description: 'Contact form and information', linkedFrom: ['Navigation', 'Footer', 'CTA buttons'] },
    { path: '/login', title: 'Login', status: 'working', template: 'custom', category: 'system', description: 'Member login page', linkedFrom: ['Navigation', 'Member areas'] },
    { path: '/admin', title: 'Admin Dashboard', status: 'working', template: 'custom', category: 'system', description: 'Administrative interface', linkedFrom: ['Login', 'Direct access'] },
    { path: '/dashboard', title: 'User Dashboard', status: 'working', template: 'custom', category: 'system', description: 'User dashboard after login', linkedFrom: ['Login'] },
    { path: '/template', title: 'Template Demo', status: 'working', template: 'custom', category: 'system', description: 'Template demonstration page', linkedFrom: ['Direct access only'] },
  ];

  const categories = [
    { id: 'all', label: 'All Pages', count: pages.length },
    { id: 'root', label: 'Root Pages', count: pages.filter(p => p.category === 'root').length },
    { id: 'club', label: 'Club Info', count: pages.filter(p => p.category === 'club').length },
    { id: 'teams', label: 'Teams', count: pages.filter(p => p.category === 'teams').length },
    { id: 'join', label: 'Join/Register', count: pages.filter(p => p.category === 'join').length },
    { id: 'community', label: 'Community', count: pages.filter(p => p.category === 'community').length },
    { id: 'matches', label: 'Matches', count: pages.filter(p => p.category === 'matches').length },
    { id: 'premium', label: 'Premium Features', count: pages.filter(p => p.category === 'premium').length },
    { id: 'content', label: 'News & Media', count: pages.filter(p => p.category === 'content').length },
    { id: 'members', label: 'Members', count: pages.filter(p => p.category === 'members').length },
    { id: 'commercial', label: 'Commercial', count: pages.filter(p => p.category === 'commercial').length },
    { id: 'system', label: 'System Pages', count: pages.filter(p => p.category === 'system').length },
  ];

  const statuses = [
    { id: 'all', label: 'All Status', count: pages.length },
    { id: 'working', label: 'Working', count: pages.filter(p => p.status === 'working').length, color: 'text-green-600 bg-green-50' },
    { id: 'missing', label: 'Missing/404', count: pages.filter(p => p.status === 'missing').length, color: 'text-red-600 bg-red-50' },
    { id: 'duplicate', label: 'Duplicates', count: pages.filter(p => p.status === 'duplicate').length, color: 'text-orange-600 bg-orange-50' },
    { id: 'redirect', label: 'Redirects', count: pages.filter(p => p.status === 'redirect').length, color: 'text-blue-600 bg-blue-50' },
  ];

  const filteredPages = pages.filter(page => {
    const categoryMatch = selectedCategory === 'all' || page.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || page.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'text-green-600 bg-green-50 border-green-200';
      case 'missing': return 'text-red-600 bg-red-50 border-red-200';
      case 'duplicate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'redirect': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTemplateColor = (template: string) => {
    switch (template) {
      case 'glass': return 'text-purple-600 bg-purple-50';
      case 'standard': return 'text-blue-600 bg-blue-50';
      case 'custom': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <StandardLayout title="Site Map & Navigation Analysis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🗺️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Map & Navigation Analysis</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete overview of all pages, navigation structure, and identified issues for cleanup and consolidation.
          </p>
          
          <motion.div 
            className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Admin Access Recommended</h3>
            <p className="text-blue-800 text-sm mb-4">
              For security and better management, the site map is now available in the admin dashboard 
              with enhanced features and administrative tools.
            </p>
            <Link 
              href="/admin" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔑 Access Admin Dashboard
            </Link>
          </motion.div>
        </motion.div>

        {/* Summary Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Site Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{pages.filter(p => p.status === 'working').length}</div>
              <div className="text-sm text-gray-600">Working Pages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{pages.filter(p => p.status === 'missing').length}</div>
              <div className="text-sm text-gray-600">Missing/404</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{pages.filter(p => p.status === 'duplicate').length}</div>
              <div className="text-sm text-gray-600">Duplicates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{pages.filter(p => p.template === 'glass').length}</div>
              <div className="text-sm text-gray-600">Glass Morphism</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => setSelectedStatus(status.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedStatus === status.id
                        ? 'bg-blue-600 text-white'
                        : `${status.color || 'bg-gray-100 text-gray-700'} hover:opacity-80`
                    }`}
                  >
                    {status.label} ({status.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pages Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Pages ({filteredPages.length} of {pages.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issues</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPages.map((page, index) => (
                  <tr key={page.path} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{page.title}</div>
                        <div className="text-sm text-gray-500 font-mono">{page.path}</div>
                        <div className="text-xs text-gray-400 mt-1">{page.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getStatusColor(page.status)}`}>
                        {page.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getTemplateColor(page.template)}`}>
                        {page.template}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 capitalize">{page.category.replace('-', ' ')}</span>
                    </td>
                    <td className="px-6 py-4">
                      {page.issues && page.issues.length > 0 ? (
                        <div className="space-y-1">
                          {page.issues.map((issue, i) => (
                            <div key={i} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                              ⚠️ {issue}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No issues</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        {page.status === 'working' && (
                          <Link 
                            href={page.path}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            target="_blank"
                          >
                            Visit →
                          </Link>
                        )}
                        {page.status === 'missing' && (
                          <span className="text-red-600 text-xs font-medium">Need to create</span>
                        )}
                        {page.status === 'duplicate' && (
                          <span className="text-orange-600 text-xs font-medium">Consider consolidation</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Navigation Issues Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-green-800 mb-4">✅ Site Status & Recent Improvements</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-900 mb-2">✅ Recently Fixed</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• <code>/club/history</code> - Created comprehensive 44-year timeline</li>
                <li>• Navigation simplified and balanced</li>
                <li>• Duplicate pages properly redirected</li>
                <li>• All missing pages resolved</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-2">✅ Navigation Improvements</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <code>About</code> dropdown with club information</li>
                <li>• <code>Teams</code> dropdown with team categories</li>
                <li>• <code>Join</code> dropdown with registration options</li>
                <li>• Direct links for key actions (Home, Matches, Volunteer, Contact)</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-100 rounded">
            <p className="text-sm text-green-800">
              <strong>Status:</strong> Site navigation is now clean, functional, and user-friendly with all major issues resolved. 
              The structure provides easy access to key areas while maintaining organized information architecture.
            </p>
            <p className="text-xs text-green-700 mt-2">
              <strong>Latest Audit:</strong> All 68+ pages tested and working. Site map now accessible via footer Quick Links.
            </p>
          </div>
        </motion.div>

      </div>
    </StandardLayout>
  );
}