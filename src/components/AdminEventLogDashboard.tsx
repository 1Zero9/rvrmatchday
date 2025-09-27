/**
 * Admin Event Log Dashboard
 * Comprehensive interface for viewing and filtering all admin operations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminEvent {
  id: string;
  admin_user_id: string;
  admin_full_name?: string;
  admin_username?: string;
  admin_email?: string;
  event_type: string;
  action: string;
  target_type?: string;
  target_id?: string;
  target_identifier?: string;
  target_user_name?: string;
  target_user_email?: string;
  description?: string;
  details?: Record<string, any>;
  status?: string;
  created_at: string;
  ip_address?: string;
  user_agent?: string;
  request_path?: string;
}

interface FilterOptions {
  eventTypes: string[];
  actions: string[];
  targetTypes: string[];
  statuses: string[];
}

interface Statistics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByAction: Record<string, number>;
  eventsByStatus: Record<string, number>;
  timeframe: string;
}

interface EventLogResponse {
  logs: AdminEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  statistics: Statistics;
  filterOptions: FilterOptions;
  meta: {
    usingComprehensiveTable: boolean;
    tableVersion: string;
    capabilities: string[];
  };
}

export default function AdminEventLogDashboard() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [meta, setMeta] = useState<any>(null);

  // Filter state
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    event_type: '',
    action: '',
    admin_user_id: '',
    target_type: '',
    status: '',
    date_from: '',
    date_to: '',
    search: ''
  });

  // UI state
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/admin/comprehensive-audit-logs?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch event logs');
      }

      const data: EventLogResponse = await response.json();
      
      setEvents(data.logs);
      setStatistics(data.statistics);
      setFilterOptions(data.filterOptions);
      setMeta(data.meta);

    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 50,
      event_type: '',
      action: '',
      admin_user_id: '',
      target_type: '',
      status: '',
      date_from: '',
      date_to: '',
      search: ''
    });
  };

  const getEventTypeColor = (eventType: string) => {
    const colors = {
      user_management: 'bg-blue-100 text-blue-800',
      content_management: 'bg-green-100 text-green-800',
      system_management: 'bg-purple-100 text-purple-800',
      match_management: 'bg-orange-100 text-orange-800',
      security: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    return colors[eventType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      partial: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading event logs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-400">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Event Logs</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={fetchEvents}
              className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with System Info */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Event Log Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive audit trail of all admin operations
            </p>
          </div>
          {meta && (
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                meta.usingComprehensiveTable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {meta.tableVersion}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {meta.capabilities?.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{statistics.totalEvents}</div>
              <div className="text-sm text-gray-600">Total Events ({statistics.timeframe})</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-900">
                {Object.keys(statistics.eventsByType).length}
              </div>
              <div className="text-sm text-blue-600">Event Types</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-900">
                {Object.keys(statistics.eventsByAction).length}
              </div>
              <div className="text-sm text-green-600">Unique Actions</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-900">
                {statistics.eventsByStatus?.success || 0}
              </div>
              <div className="text-sm text-purple-600">Successful Operations</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
            >
              Reset
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search descriptions, names..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Event Type */}
                {filterOptions && filterOptions.eventTypes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                    <select
                      value={filters.event_type}
                      onChange={(e) => handleFilterChange('event_type', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="">All Types</option>
                      {filterOptions.eventTypes.map(type => (
                        <option key={type} value={type}>
                          {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Action */}
                {filterOptions && filterOptions.actions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                    <select
                      value={filters.action}
                      onChange={(e) => handleFilterChange('action', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="">All Actions</option>
                      {filterOptions.actions.map(action => (
                        <option key={action} value={action}>
                          {action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Status */}
                {filterOptions && filterOptions.statuses.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    >
                      <option value="">All Statuses</option>
                      {filterOptions.statuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="datetime-local"
                    value={filters.date_from}
                    onChange={(e) => handleFilterChange('date_from', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="datetime-local"
                    value={filters.date_to}
                    onChange={(e) => handleFilterChange('date_to', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Events Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getEventTypeColor(event.event_type)
                        }`}>
                          {event.event_type?.replace(/_/g, ' ') || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-900 mt-1 font-medium">
                          {event.action?.replace(/_/g, ' ') || 'Unknown Action'}
                        </div>
                        {event.description && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.admin_full_name || event.admin_username || 'Unknown'}
                    </div>
                    {event.admin_email && (
                      <div className="text-sm text-gray-500">{event.admin_email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {event.target_type && (
                      <div className="text-sm text-gray-900">
                        {event.target_identifier || event.target_user_name || event.target_id || 'Unknown'}
                      </div>
                    )}
                    {event.target_type && (
                      <div className="text-sm text-gray-500 capitalize">{event.target_type}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(event.status || 'success')
                    }`}>
                      {event.status || 'Success'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(event.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No events found matching your criteria</div>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Event Details</h3>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Event Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedEvent.event_type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Action</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedEvent.action}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Admin User</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {selectedEvent.admin_full_name || selectedEvent.admin_username}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedEvent.status || 'Success'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedEvent.created_at)}</dd>
                    </div>
                    {selectedEvent.ip_address && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">IP Address</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedEvent.ip_address}</dd>
                      </div>
                    )}
                  </div>
                  
                  {selectedEvent.description && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedEvent.description}</dd>
                    </div>
                  )}

                  {selectedEvent.details && Object.keys(selectedEvent.details).length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Details</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-64">
                          {JSON.stringify(selectedEvent.details, null, 2)}
                        </pre>
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}