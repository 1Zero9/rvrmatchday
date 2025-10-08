/**
 * Unified Admin Dashboard - Single Window Interface
 * Inspired by Microsoft Defender, Office 365 Admin Center
 * Role-based sidebar with all admin functionality in one interface
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/SecureAuth';
import { RequireAuth } from '../../components/SecureAuth';

// Import all admin components
import UnifiedAccountManagement from '../../components/UnifiedAccountManagement';
import NewsManager from '../../components/admin/NewsManager';
import SpecialEventsManagerEnhanced from '../../components/admin/SpecialEventsManagerEnhanced';
import SpecialEventsManager from '../../components/admin/SpecialEventsManager';
import VolunteerManager from '../../components/admin/VolunteerManager';
import VolunteerSignupManager from '../../components/admin/VolunteerSignupManager';
import PageMaintenanceManager from '../../components/admin/PageMaintenanceManager';
import SiteStatusReport from '../../components/admin/SiteStatusReport';
import AdminTodoList from '../../components/AdminTodoList';
import AdminSiteMap from '../../components/AdminSiteMap';
import AdminChangelog from '../../components/AdminChangelog';
import SessionRecording from '../../components/SessionRecording';
import CardAuthorityManager from '../../components/CardAuthorityManager';
import AdminEventLogDashboard from '../../components/AdminEventLogDashboard';
import MobileSettings from '../../components/admin/MobileSettings';
import { supabase } from '../../lib/supabase';

interface AdminSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  requiredRoles: ('admin' | 'parent' | 'editor')[];
  color: string;
  component: React.ComponentType;
  badge?: string;
}

interface NotificationToast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  undoAction?: UndoAction;
  countdown?: number;
}

interface UndoAction {
  type: 'delete_user' | 'update_user' | 'create_user' | 'delete_article' | 'update_article' | 'delete_event' | 'update_event' | 'create_event';
  data: any;
  table: string;
  description: string;
}

// Duplicate Cleaner Component
function DuplicateCleanerComponent() {
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);

  const findDuplicates = async () => {
    setLoading(true);
    try {
      const { data: matches, error } = await supabase
        .from('matches')
        .select('*');

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      // Find duplicates by comparing home_team, away_team, scheduled_date
      const seen = new Map();
      const duplicateGroups = [];

      matches.forEach(match => {
        const key = `${match.home_team}-${match.away_team}-${match.scheduled_date}`;
        if (seen.has(key)) {
          seen.get(key).push(match);
        } else {
          seen.set(key, [match]);
        }
      });

      // Filter to only groups with more than one match
      seen.forEach((group, key) => {
        if (group.length > 1) {
          duplicateGroups.push({ key, matches: group });
        }
      });

      setDuplicates(duplicateGroups);
    } catch (error) {
      console.error('Error finding duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button
          onClick={findDuplicates}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Scanning...' : '🔍 Find Duplicates'}
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {duplicates.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-red-600">Found {duplicates.length} duplicate groups:</h4>
            {duplicates.map((group, index) => (
              <div key={index} className="border border-red-200 rounded p-3 bg-red-50">
                <p className="font-medium text-sm text-red-800 mb-2">{group.key}</p>
                <div className="space-y-1">
                  {group.matches.map(match => (
                    <div key={match.id} className="text-xs text-gray-600 flex justify-between">
                      <span>ID: {match.id} | Status: {match.status}</span>
                      <span>{new Date(match.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {duplicates.length === 0 && !loading && (
          <p className="text-green-600 text-sm">✅ No duplicates found</p>
        )}
      </div>
    </div>
  );
}

// System Tools Component for inline use
function SystemToolsComponent() {
  const [dbStats, setDbStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">🔗 Quick Admin Links</h3>
          <div className="space-y-2">
            <Link href="/user-management" className="block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-center text-sm">
              👥 User Management
            </Link>
            <Link href="/match-central-secure" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center text-sm">
              ⚽ Match Central
            </Link>
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener" className="block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-center text-sm">
              🗄️ Database Dashboard
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">📊 System Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="text-green-600 font-medium">Online</span>
            </div>
            <div className="flex justify-between">
              <span>Auth Service:</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Storage:</span>
              <span className="text-green-600 font-medium">Available</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3">⚡ Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
              Clear Cache
            </button>
            <button className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm">
              Backup Data
            </button>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm">
              Check Health
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component Wrappers to remove headers from existing components
function WrappedUnifiedAccountManagement() {
  return <UnifiedAccountManagement />;
}

function WrappedNewsManager() {
  return <NewsManager />;
}

function WrappedSpecialEventsManager() {
  return <SpecialEventsManager />;
}

function WrappedVolunteerManager() {
  return <VolunteerManager />;
}

function WrappedVolunteerSignupManager() {
  return <VolunteerSignupManager />;
}

function WrappedPageMaintenanceManager() {
  return <PageMaintenanceManager />;
}

function WrappedAdminTodoList() {
  return <AdminTodoList />;
}

function WrappedAdminSiteMap() {
  return <AdminSiteMap />;
}

function WrappedSiteStatusReport() {
  return <SiteStatusReport />;
}

function WrappedAdminChangelog() {
  return <AdminChangelog />;
}

function WrappedSessionRecording() {
  return <SessionRecording />;
}

function WrappedMobileSettings() {
  return <MobileSettings />;
}

function WrappedAdminEventLogDashboard() {
  return <AdminEventLogDashboard />;
}

// Consolidated Hub Components
function ContentHubComponent() {
  const [activeTab, setActiveTab] = useState('news');
  
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'news' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📰 News & Articles
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'events' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎉 Special Events
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'mobile' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📱 Mobile Settings
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'news' && <WrappedNewsManager />}
        {activeTab === 'events' && <WrappedSpecialEventsManager />}
        {activeTab === 'mobile' && <WrappedMobileSettings />}
      </div>
    </div>
  );
}

function PeopleHubComponent() {
  const [activeTab, setActiveTab] = useState('users');
  
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'users' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👥 User Management
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'volunteers' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🤝 Volunteers
          </button>
          <button
            onClick={() => setActiveTab('signups')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'signups' 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Applications
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'users' && <WrappedUnifiedAccountManagement />}
        {activeTab === 'volunteers' && <WrappedVolunteerManager />}
        {activeTab === 'signups' && <WrappedVolunteerSignupManager />}
      </div>
    </div>
  );
}

function SystemHubComponent() {
  const [activeTab, setActiveTab] = useState('status');
  
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'status' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📊 System Status
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tools' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🛠️ System Tools
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'maintenance' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🚧 Maintenance
          </button>
          <button
            onClick={() => setActiveTab('duplicates')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'duplicates' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔍 Duplicates
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'status' && <WrappedSiteStatusReport />}
        {activeTab === 'tools' && <SystemToolsComponent />}
        {activeTab === 'maintenance' && <WrappedPageMaintenanceManager />}
        {activeTab === 'duplicates' && <DuplicateCleanerComponent />}
      </div>
    </div>
  );
}

function DevelopmentHubComponent() {
  const [activeTab, setActiveTab] = useState('tasks');
  
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'tasks' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✅ Task Management
          </button>
          <button
            onClick={() => setActiveTab('changelog')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'changelog' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 Changelog
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'sitemap' 
                ? 'bg-slate-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🗺️ Site Map
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'sessions' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎥 Sessions
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {activeTab === 'tasks' && <WrappedAdminTodoList />}
        {activeTab === 'changelog' && <WrappedAdminChangelog />}
        {activeTab === 'sitemap' && <WrappedAdminSiteMap />}
        {activeTab === 'sessions' && <WrappedSessionRecording />}
      </div>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingRequests: 0,
    totalMatches: 0,
    recentMatches: 0,
    newsArticles: 0,
    specialEvents: 0,
    volunteerOpportunities: 0,
    pendingVolunteers: 0,
    systemHealth: '100%',
    totalPages: 0,
    disabledPages: 0
  });
  const [disabledPagesList, setDisabledPagesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const statsData = { ...stats };

      // Fetch user statistics
      const { data: users, error: usersError } = await supabase
        .from('tracker_users')
        .select('id, is_active');
      
      if (!usersError && users) {
        statsData.totalUsers = users.length;
        statsData.activeUsers = users.filter(u => u.is_active).length;
      }

      // Fetch pending account requests
      const { data: requests, error: requestsError } = await supabase
        .from('account_requests')
        .select('id')
        .eq('status', 'pending');
      
      if (!requestsError && requests) {
        statsData.pendingRequests = requests.length;
      }

      // Fetch match statistics
      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .select('id, created_at, status');
      
      if (!matchesError && matches) {
        statsData.totalMatches = matches.length;
        // Recent matches (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        statsData.recentMatches = matches.filter(m => 
          new Date(m.created_at) > thirtyDaysAgo
        ).length;
      }

      // Fetch news/articles count (assuming you have a news table)
      try {
        const { count: newsCount, error: newsError } = await supabase
          .from('news')
          .select('*', { count: 'exact', head: true });
        
        if (!newsError) {
          statsData.newsArticles = newsCount || 0;
        }
      } catch (e) {
        // News table might not exist yet
        statsData.newsArticles = 0;
      }

      // Fetch special events count
      try {
        const { count: eventsCount, error: eventsError } = await supabase
          .from('special_events')
          .select('*', { count: 'exact', head: true })
          .eq('active', true);
        
        if (!eventsError) {
          statsData.specialEvents = eventsCount || 0;
        }
      } catch (e) {
        // Special events table might not exist yet
        statsData.specialEvents = 0;
      }

      // Fetch volunteer statistics
      try {
        const { count: volunteerCount, error: volunteerError } = await supabase
          .from('volunteer_opportunities')
          .select('*', { count: 'exact', head: true })
          .eq('active', true);
        
        if (!volunteerError) {
          statsData.volunteerOpportunities = volunteerCount || 0;
        }

        const { count: pendingVolCount, error: pendingVolError } = await supabase
          .from('volunteer_signups')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        
        if (!pendingVolError) {
          statsData.pendingVolunteers = pendingVolCount || 0;
        }
      } catch (e) {
        // Volunteer tables might not exist yet
        statsData.volunteerOpportunities = 0;
        statsData.pendingVolunteers = 0;
      }

      // Fetch maintenance statistics
      try {
        const response = await fetch('/api/maintenance/list-all');
        if (response.ok) {
          const pages = await response.json();
          const disabledPages = pages.filter(page => !page.is_enabled);
          statsData.totalPages = pages.length;
          statsData.disabledPages = disabledPages.length;
          setDisabledPagesList(disabledPages);
        }
      } catch (e) {
        // Maintenance table might not exist yet
        statsData.totalPages = 0;
        statsData.disabledPages = 0;
        setDisabledPagesList([]);
      }

      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.full_name}</h3>
        <p className="text-gray-600">Here's what's happening with your RVR system</p>
        <button
          onClick={fetchDashboardStats}
          className="mt-3 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh Stats
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">
                {loading ? '...' : stats.totalUsers}
              </p>
              <p className="text-xs text-gray-500">
                {stats.activeUsers} active
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Requests</p>
              <p className="text-3xl font-bold text-orange-600">
                {loading ? '...' : stats.pendingRequests}
              </p>
              <p className="text-xs text-gray-500">
                Account requests
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Matches</p>
              <p className="text-3xl font-bold text-green-600">
                {loading ? '...' : stats.totalMatches}
              </p>
              <p className="text-xs text-gray-500">
                {stats.recentMatches} recent
              </p>
            </div>
            <div className="text-4xl">⚽</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">News Articles</p>
              <p className="text-3xl font-bold text-purple-600">
                {loading ? '...' : stats.newsArticles}
              </p>
              <p className="text-xs text-gray-500">
                Published articles
              </p>
            </div>
            <div className="text-4xl">📰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Special Events</p>
              <p className="text-3xl font-bold text-pink-600">
                {loading ? '...' : stats.specialEvents}
              </p>
              <p className="text-xs text-gray-500">
                Active events
              </p>
            </div>
            <div className="text-4xl">🎉</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Volunteers</p>
              <p className="text-3xl font-bold text-indigo-600">
                {loading ? '...' : stats.volunteerOpportunities}
              </p>
              <p className="text-xs text-gray-500">
                {stats.pendingVolunteers} pending
              </p>
            </div>
            <div className="text-4xl">🤝</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">System Health</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.systemHealth}
              </p>
              <p className="text-xs text-gray-500">
                All systems operational
              </p>
            </div>
            <div className="text-4xl">💚</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Page Maintenance</p>
              <p className="text-3xl font-bold text-orange-600">
                {loading ? '...' : stats.disabledPages}
              </p>
              <p className="text-xs text-gray-500">
                {stats.totalPages - stats.disabledPages} of {stats.totalPages} enabled
              </p>
            </div>
            <div className="text-4xl">🚧</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Database</p>
              <p className="text-3xl font-bold text-teal-600">
                Online
              </p>
              <p className="text-xs text-gray-500">
                Supabase connected
              </p>
            </div>
            <div className="text-4xl">🗄️</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="text-sm">
                <p className="text-gray-900">New user registered: John Smith</p>
                <p className="text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="text-sm">
                <p className="text-gray-900">Event published: Summer Training Camp</p>
                <p className="text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="text-sm">
                <p className="text-gray-900">News article updated: Match Results</p>
                <p className="text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">🚧 Disabled Pages</h3>
            {stats.disabledPages > 0 && (
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {stats.disabledPages} disabled
              </span>
            )}
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading...</p>
              </div>
            ) : disabledPagesList.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-sm text-gray-500">All pages are enabled</p>
              </div>
            ) : (
              disabledPagesList.slice(0, 5).map((page, index) => (
                <div key={index} className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-800">{page.title}</p>
                      <p className="text-sm text-orange-600">{page.path}</p>
                      {page.maintenance_reason && (
                        <p className="text-xs text-orange-500 mt-1">{page.maintenance_reason}</p>
                      )}
                    </div>
                    <div className="text-orange-400">🚧</div>
                  </div>
                </div>
              ))
            )}
            {disabledPagesList.length > 5 && (
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  and {disabledPagesList.length - 5} more disabled pages
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UnifiedAdminDashboard() {
  const { user: authUser, profile, isAdmin } = useAuth();
  
  // Use profile data which has the correct role information
  const user = profile || authUser;
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [undoHistory, setUndoHistory] = useState<UndoAction[]>([]);

  // Define all admin sections with role-based access - CONSOLIDATED
  const adminSections: AdminSection[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: '🏠',
      description: 'System overview and analytics',
      requiredRoles: ['admin', 'parent', 'editor'],
      color: 'bg-gradient-to-r from-blue-600 to-blue-800',
      component: DashboardOverview
    },
    {
      id: 'content-hub',
      title: 'Content Hub',
      icon: '📝',
      description: 'News, events, and mobile app content management',
      requiredRoles: ['admin', 'editor'],
      color: 'bg-gradient-to-r from-green-600 to-emerald-700',
      component: ContentHubComponent
    },
    {
      id: 'people-hub',
      title: 'People Hub',
      icon: '👥',
      description: 'Users, volunteers, and applications management',
      requiredRoles: ['admin', 'parent'],
      color: 'bg-gradient-to-r from-emerald-600 to-teal-700',
      component: PeopleHubComponent
    },
    {
      id: 'system-hub',
      title: 'System Hub',
      icon: '🛠️',
      description: 'Tools, status, maintenance, and system utilities',
      requiredRoles: ['admin'],
      color: 'bg-gradient-to-r from-gray-600 to-slate-700',
      component: SystemHubComponent
    },
    {
      id: 'development-hub',
      title: 'Development Hub',
      icon: '💻',
      description: 'Tasks, changelog, site map, and development tools',
      requiredRoles: ['admin', 'editor'],
      color: 'bg-gradient-to-r from-cyan-600 to-blue-700',
      component: DevelopmentHubComponent
    },
    {
      id: 'card-authority',
      title: 'Card Authority',
      icon: '🟥',
      description: 'Manage red card submissions to football authority',
      requiredRoles: ['admin'],
      color: 'bg-gradient-to-r from-red-600 to-red-800',
      component: CardAuthorityManager
    },
    {
      id: 'event-logs',
      title: 'Audit Logs',
      icon: '📜',
      description: 'Comprehensive audit trail and security monitoring',
      requiredRoles: ['admin'],
      color: 'bg-gradient-to-r from-slate-600 to-zinc-700',
      component: WrappedAdminEventLogDashboard
    }
  ];

  // Filter sections based on user role with fallback
  const availableSections = adminSections.filter(section => {
    // If no user, show dashboard only
    if (!user) return section.id === 'dashboard';
    
    // If user has admin role (or undefined role, assume admin for dev)
    if (!user.role || user.role === 'admin') return true;
    
    // Otherwise check if user role is in required roles
    return section.requiredRoles.includes(user?.role as any);
  });


  // Get current section component
  const currentSectionData = availableSections.find(s => s.id === activeSection);
  const CurrentComponent = currentSectionData?.component || DashboardOverview;

  // Undo system
  const performUndo = async (undoAction: UndoAction) => {
    try {
      let success = false;
      
      switch (undoAction.type) {
        case 'delete_user':
          // Restore deleted user
          const { error: restoreUserError } = await supabase
            .from('tracker_users')
            .insert([undoAction.data]);
          success = !restoreUserError;
          break;
          
        case 'update_user':
          // Restore previous user data
          const { error: updateUserError } = await supabase
            .from('tracker_users')
            .update(undoAction.data.oldData)
            .eq('id', undoAction.data.userId);
          success = !updateUserError;
          break;
          
        case 'create_user':
          // Remove the created user
          const { error: deleteUserError } = await supabase
            .from('tracker_users')
            .delete()
            .eq('id', undoAction.data.userId);
          success = !deleteUserError;
          break;

        case 'delete_article':
          // Restore deleted article
          const { error: restoreArticleError } = await supabase
            .from('news_articles')
            .insert([undoAction.data]);
          success = !restoreArticleError;
          break;

        case 'delete_event':
          // Restore deleted special event
          const { error: restoreEventError } = await supabase
            .from('special_events')
            .insert([undoAction.data]);
          success = !restoreEventError;
          break;
          
        default:
          // Handle other action types as needed
          console.warn('Undo not implemented for action type:', undoAction.type);
      }
      
      if (success) {
        addNotification({
          type: 'success',
          message: `✅ Undo successful: ${undoAction.description}`,
        });
        
        // Refresh the current page component if it's user management
        if (activeSection === 'users') {
          window.location.reload();
        }
      } else {
        addNotification({
          type: 'error',
          message: `❌ Undo failed: ${undoAction.description}`,
        });
      }
    } catch (error) {
      console.error('Undo error:', error);
      addNotification({
        type: 'error',
        message: `❌ Undo failed: ${undoAction.description}`,
      });
    }
  };

  const addUndoableNotification = (
    message: string, 
    undoAction: UndoAction,
    duration: number = 10000
  ) => {
    const id = Date.now().toString();
    const notification: NotificationToast = {
      id,
      type: 'success',
      message,
      undoAction,
      countdown: duration / 1000,
      action: {
        label: 'Undo',
        onClick: () => {
          performUndo(undoAction);
          removeNotification(id);
        }
      }
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Start countdown
    const countdownInterval = setInterval(() => {
      setNotifications(prev => prev.map(n => 
        n.id === id && n.countdown && n.countdown > 0
          ? { ...n, countdown: n.countdown - 1 }
          : n
      ));
    }, 1000);
    
    // Auto-remove after duration
    setTimeout(() => {
      clearInterval(countdownInterval);
      removeNotification(id);
    }, duration);
  };

  // Global notification system
  const addNotification = (notification: Omit<NotificationToast, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);
    
    if (!notification.action && !notification.undoAction) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Enhanced delete confirmation with undo support
  const showDeleteConfirmation = (
    itemName: string,
    itemType: string,
    onConfirm: (originalData?: any) => Promise<any> | any,
    additionalWarning?: string,
    undoData?: any
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${itemType}?\n\n` +
      `Item: "${itemName}"\n\n` +
      `This action will:\n• Remove the ${itemType} temporarily\n• Log the deletion for audit purposes\n• Can be undone within 10 seconds\n\n` +
      (additionalWarning ? `⚠️ ${additionalWarning}\n\n` : '') +
      `Click OK to confirm deletion.`
    );

    if (confirmed) {
      // Execute the deletion and capture the original data for undo
      const result = onConfirm(undoData);
      
      // If undoData is provided, show undoable notification
      if (undoData) {
        const undoAction: UndoAction = {
          type: itemType === 'user account' ? 'delete_user' : 'delete_article',
          data: undoData,
          table: itemType === 'user account' ? 'tracker_users' : 'articles',
          description: `Restored ${itemType} "${itemName}"`
        };
        
        addUndoableNotification(
          `🗑️ ${itemType} "${itemName}" has been deleted`,
          undoAction,
          10000 // 10 seconds to undo
        );
      } else {
        // Fallback to regular notification
        addNotification({
          type: 'success',
          message: `${itemType} "${itemName}" has been deleted`
        });
      }
    } else {
      addNotification({
        type: 'info',
        message: 'Deletion cancelled - item was not deleted'
      });
    }
  };

  // Expose functions to child components
  useEffect(() => {
    (window as any).adminActions = {
      showDeleteConfirmation,
      addNotification,
      addUndoableNotification,
      removeNotification
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex relative"
      style={{
        backgroundImage: `url('/images/hero/astro-ward.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm" />
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex flex-col relative z-10 h-screen`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed ? (
              <div className="flex items-center space-x-3">
                <Link href="/home">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer" title="Go to main site">
                    <span className="text-white font-bold text-sm">RVR</span>
                  </div>
                </Link>
                <div>
                  <h1 className="font-bold text-gray-900">Admin Portal</h1>
                  <p className="text-xs text-gray-500">Unified Dashboard</p>
                </div>
              </div>
            ) : (
              <Link href="/home">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer mx-auto" title="Go to main site">
                  <span className="text-white font-bold text-sm">RVR</span>
                </div>
              </Link>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        {/* User Info */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.full_name}</p>
                <p className={`text-xs px-2 py-1 rounded-full font-medium ${
                  user?.role === 'admin' 
                    ? 'bg-red-100 text-red-800' 
                    : user?.role === 'editor'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role}
                </p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {availableSections.length} of {adminSections.length} sections available
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {availableSections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 text-left relative overflow-hidden ${
                activeSection === section.id
                  ? `${section.color} text-white shadow-2xl transform scale-105 border-2 border-white/20 backdrop-blur-sm`
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-lg border-2 border-transparent'
              }`}
            >
              {/* Animated background for active state */}
              {activeSection === section.id && (
                <motion.div
                  layoutId="activeBackground"
                  className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
              
              <motion.span 
                className="text-2xl relative z-10"
                animate={{ 
                  rotate: activeSection === section.id ? [0, -5, 5, 0] : 0,
                  scale: activeSection === section.id ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                {section.icon}
              </motion.span>
              
              {!sidebarCollapsed && (
                <div className="flex-1 relative z-10">
                  <motion.div 
                    className="font-semibold text-sm"
                    animate={{ 
                      fontWeight: activeSection === section.id ? 700 : 500 
                    }}
                  >
                    {section.title}
                  </motion.div>
                  <motion.div 
                    className={`text-xs line-clamp-2 mt-0.5 ${
                      activeSection === section.id
                        ? 'text-white/80'
                        : 'text-gray-500'
                    }`}
                    animate={{
                      opacity: activeSection === section.id ? 1 : 0.7
                    }}
                  >
                    {section.description}
                  </motion.div>
                </div>
              )}
              
              {section.badge && !sidebarCollapsed && (
                <motion.span 
                  className="px-2 py-1 bg-red-500/90 text-white text-xs rounded-full font-medium relative z-10"
                  animate={{ 
                    scale: activeSection === section.id ? 1.05 : 1 
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  {section.badge}
                </motion.span>
              )}
              
              {/* Subtle glow effect for active state */}
              {activeSection === section.id && (
                <motion.div
                  className="absolute inset-0 bg-white/5 rounded-xl"
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!sidebarCollapsed && (
            <Link 
              href="/home"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              <span>←</span>
              <span>Back to Site</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Bar */}
        <motion.div 
          className="bg-white shadow-sm border-b-2 p-4 relative overflow-hidden"
          style={{
            borderBottomColor: currentSectionData?.color?.includes('blue') ? '#3b82f6' :
                              currentSectionData?.color?.includes('emerald') ? '#10b981' :
                              currentSectionData?.color?.includes('purple') ? '#a855f7' :
                              currentSectionData?.color?.includes('green') ? '#22c55e' :
                              currentSectionData?.color?.includes('orange') ? '#f97316' :
                              currentSectionData?.color?.includes('amber') ? '#f59e0b' :
                              currentSectionData?.color?.includes('indigo') ? '#6366f1' :
                              currentSectionData?.color?.includes('cyan') ? '#06b6d4' :
                              currentSectionData?.color?.includes('slate') ? '#64748b' :
                              currentSectionData?.color?.includes('gray') ? '#6b7280' : '#6b7280'
          }}
          animate={{
            borderBottomColor: currentSectionData?.color?.includes('blue') ? '#3b82f6' :
                              currentSectionData?.color?.includes('emerald') ? '#10b981' :
                              currentSectionData?.color?.includes('purple') ? '#a855f7' :
                              currentSectionData?.color?.includes('green') ? '#22c55e' :
                              currentSectionData?.color?.includes('orange') ? '#f97316' :
                              currentSectionData?.color?.includes('amber') ? '#f59e0b' :
                              currentSectionData?.color?.includes('indigo') ? '#6366f1' :
                              currentSectionData?.color?.includes('cyan') ? '#06b6d4' :
                              currentSectionData?.color?.includes('slate') ? '#64748b' :
                              currentSectionData?.color?.includes('gray') ? '#6b7280' : '#6b7280'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Gradient overlay bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-60"
            style={{
              backgroundImage: currentSectionData?.color ? 
                `linear-gradient(to right, ${
                  currentSectionData.color.includes('blue') ? '#3b82f6, #1e40af' :
                  currentSectionData.color.includes('emerald') ? '#10b981, #047857' :
                  currentSectionData.color.includes('purple') ? '#a855f7, #7c3aed' :
                  currentSectionData.color.includes('green') ? '#22c55e, #16a34a' :
                  currentSectionData.color.includes('orange') ? '#f97316, #ea580c' :
                  currentSectionData.color.includes('amber') ? '#f59e0b, #d97706' :
                  currentSectionData.color.includes('indigo') ? '#6366f1, #4f46e5' :
                  currentSectionData.color.includes('cyan') ? '#06b6d4, #0891b2' :
                  currentSectionData.color.includes('slate') ? '#64748b, #475569' :
                  currentSectionData.color.includes('gray') ? '#6b7280, #4b5563' : '#6b7280, #4b5563'
                })` : 'linear-gradient(to right, #6b7280, #4b5563)'
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          
          <div className="flex items-center justify-between relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-1">
                <motion.span 
                  className="text-3xl"
                  animate={{ 
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {currentSectionData?.icon || '🏠'}
                </motion.span>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentSectionData?.title || 'Dashboard'}
                </h1>
              </div>
              <p className="text-gray-600 ml-12">
                {currentSectionData?.description || 'System overview and analytics'}
              </p>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full bg-green-500`} />
              <span className="text-sm text-gray-500">System Online</span>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div 
          className="flex-1 overflow-auto relative"
          animate={{
            background: currentSectionData?.color ? 
              `linear-gradient(135deg, rgba(255,255,255,1) 0%, ${
                currentSectionData.color.includes('blue') ? 'rgba(59,130,246,0.03)' :
                currentSectionData.color.includes('emerald') ? 'rgba(16,185,129,0.03)' :
                currentSectionData.color.includes('purple') ? 'rgba(168,85,247,0.03)' :
                currentSectionData.color.includes('green') ? 'rgba(34,197,94,0.03)' :
                currentSectionData.color.includes('orange') ? 'rgba(249,115,22,0.03)' :
                currentSectionData.color.includes('amber') ? 'rgba(245,158,11,0.03)' :
                currentSectionData.color.includes('indigo') ? 'rgba(99,102,241,0.03)' :
                currentSectionData.color.includes('cyan') ? 'rgba(6,182,212,0.03)' :
                currentSectionData.color.includes('slate') ? 'rgba(100,116,139,0.03)' :
                currentSectionData.color.includes('gray') ? 'rgba(107,114,128,0.03)' : 'rgba(107,114,128,0.03)'
              } 100%)` : 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(107,114,128,0.03) 100%)'
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Floating Theme Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-10 right-20 w-2 h-2 rounded-full opacity-20"
              style={{
                backgroundColor: currentSectionData?.color?.includes('blue') ? '#3b82f6' :
                               currentSectionData?.color?.includes('emerald') ? '#10b981' :
                               currentSectionData?.color?.includes('purple') ? '#a855f7' :
                               currentSectionData?.color?.includes('green') ? '#22c55e' :
                               currentSectionData?.color?.includes('orange') ? '#f97316' :
                               currentSectionData?.color?.includes('amber') ? '#f59e0b' :
                               currentSectionData?.color?.includes('indigo') ? '#6366f1' :
                               currentSectionData?.color?.includes('cyan') ? '#06b6d4' :
                               currentSectionData?.color?.includes('slate') ? '#64748b' :
                               currentSectionData?.color?.includes('gray') ? '#6b7280' : '#6b7280'
              }}
              animate={{ 
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-20 left-16 w-1 h-1 rounded-full opacity-30"
              style={{
                backgroundColor: currentSectionData?.color?.includes('blue') ? '#3b82f6' :
                               currentSectionData?.color?.includes('emerald') ? '#10b981' :
                               currentSectionData?.color?.includes('purple') ? '#a855f7' :
                               currentSectionData?.color?.includes('green') ? '#22c55e' :
                               currentSectionData?.color?.includes('orange') ? '#f97316' :
                               currentSectionData?.color?.includes('amber') ? '#f59e0b' :
                               currentSectionData?.color?.includes('indigo') ? '#6366f1' :
                               currentSectionData?.color?.includes('cyan') ? '#06b6d4' :
                               currentSectionData?.color?.includes('slate') ? '#64748b' :
                               currentSectionData?.color?.includes('gray') ? '#6b7280' : '#6b7280'
              }}
              animate={{ 
                x: [0, 30, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>
          
          <div className="p-6 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 1.02 }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <CurrentComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Global Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 right-4 z-50 max-w-md"
          >
            <div className={`p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === 'success' ? 'bg-green-50 border-green-400' :
              notification.type === 'error' ? 'bg-red-50 border-red-400' :
              notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
              'bg-blue-50 border-blue-400'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className={`font-medium ${
                    notification.type === 'success' ? 'text-green-800' :
                    notification.type === 'error' ? 'text-red-800' :
                    notification.type === 'warning' ? 'text-yellow-800' :
                    'text-blue-800'
                  }`}>
                    {notification.message}
                  </p>
                  
                  {notification.countdown && notification.countdown > 0 && (
                    <div className={`mt-1 text-xs ${
                      notification.type === 'success' ? 'text-green-600' :
                      notification.type === 'error' ? 'text-red-600' :
                      notification.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      ⏱️ {notification.countdown}s remaining to undo
                    </div>
                  )}
                  
                  {notification.action && (
                    <div className="mt-2 flex items-center space-x-2">
                      <button
                        onClick={notification.action.onClick}
                        className={`px-3 py-1 text-sm font-medium rounded-md border-2 transition-all ${
                          notification.undoAction 
                            ? 'bg-orange-600 text-white border-orange-600 hover:bg-orange-700 hover:border-orange-700' 
                            : notification.type === 'success' ? 'text-green-600 border-green-600 hover:bg-green-50' :
                              notification.type === 'error' ? 'text-red-600 border-red-600 hover:bg-red-50' :
                              notification.type === 'warning' ? 'text-yellow-600 border-yellow-600 hover:bg-yellow-50' :
                              'text-blue-600 border-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {notification.undoAction ? '↶ ' : ''}{notification.action.label}
                      </button>
                      
                      {notification.undoAction && (
                        <span className="text-xs text-gray-500">
                          Click to reverse this action
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="ml-4 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Secure wrapper
export default function UnifiedAdminPage() {
  return (
    <RequireAuth>
      <UnifiedAdminDashboard />
    </RequireAuth>
  );
}