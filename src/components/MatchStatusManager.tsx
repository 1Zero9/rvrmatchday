/**
 * Match Status Manager Component
 * Handles match cancellation, postponement, and status updates
 * Includes reason field and notification handling
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Match, MatchStatus } from '@/types/match-tracker';
import { notifyMatchCancelled, notifyMatchPostponed, shouldTriggerNotification } from '@/lib/matchNotifications';

interface MatchStatusManagerProps {
  match: Match;
  onStatusUpdate: (updatedMatch: Match) => void;
  teamName?: string;
}

export default function MatchStatusManager({ match, onStatusUpdate, teamName }: MatchStatusManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus>(match.status);
  const [cancellationReason, setCancellationReason] = useState(match.cancellationReason || '');
  const [postponedToDate, setPostponedToDate] = useState(
    match.postponedToDate ? new Date(match.postponedToDate).toISOString().split('T')[0] : ''
  );
  const [postponedToTime, setPostponedToTime] = useState(
    match.postponedToDate ? new Date(match.postponedToDate).toISOString().split('T')[1].substring(0, 5) : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions: { value: MatchStatus; label: string; color: string; icon: string }[] = [
    { value: 'Scheduled', label: 'Scheduled', color: 'bg-blue-200 text-blue-900 border-blue-300', icon: '📅' },
    { value: 'Live', label: 'Live', color: 'bg-red-200 text-red-900 border-red-300', icon: '🔴' },
    { value: 'Finished', label: 'Finished', color: 'bg-green-200 text-green-900 border-green-300', icon: '✅' },
    { value: 'Cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' },
    { value: 'Postponed', label: 'Postponed', color: 'bg-yellow-200 text-yellow-900 border-yellow-300', icon: '⏰' }
  ];

  const currentStatus = statusOptions.find(s => s.value === match.status);
  const requiresReason = selectedStatus === 'Cancelled' || selectedStatus === 'Postponed';
  const requiresNewDate = selectedStatus === 'Postponed';

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (requiresReason && !cancellationReason.trim()) {
        alert('Please provide a reason for cancellation/postponement');
        return;
      }

      if (requiresNewDate && !postponedToDate) {
        alert('Please provide a new date for the postponed match');
        return;
      }

      // Create new date for postponed matches
      let newPostponedDate: Date | undefined;
      if (requiresNewDate && postponedToDate) {
        const timeStr = postponedToTime || '15:00'; // Default to 3 PM if no time provided
        newPostponedDate = new Date(`${postponedToDate}T${timeStr}`);
      }

      // Call the API to update the match status
      const response = await fetch('/api/admin/update-match-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: match.id,
          status: selectedStatus,
          cancellationReason: requiresReason ? cancellationReason.trim() : undefined,
          postponedToDate: newPostponedDate?.toISOString()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update match status');
      }

      // Update match object with the response data
      const updatedMatch: Match = {
        ...match,
        ...result.match,
        status: selectedStatus,
        cancellationReason: requiresReason ? cancellationReason.trim() : undefined,
        postponedToDate: newPostponedDate,
        updatedAt: new Date()
      };

      // Send notifications based on status change
      if (selectedStatus !== match.status) {
        if (selectedStatus === 'Cancelled') {
          await notifyMatchCancelled(updatedMatch, teamName, cancellationReason);
        } else if (selectedStatus === 'Postponed') {
          await notifyMatchPostponed(updatedMatch, teamName, cancellationReason);
        }
      }

      // Call the parent update handler
      onStatusUpdate(updatedMatch);
      setIsOpen(false);

      // Show success message
      const statusLabel = statusOptions.find(s => s.value === selectedStatus)?.label;
      alert(`Match status updated to ${statusLabel}${!shouldTriggerNotification(selectedStatus) ? ' (notifications disabled)' : ''}`);

    } catch (error) {
      console.error('Error updating match status:', error);
      alert(`Error updating match status: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedStatus(match.status);
    setCancellationReason(match.cancellationReason || '');
    setPostponedToDate(match.postponedToDate ? new Date(match.postponedToDate).toISOString().split('T')[0] : '');
    setPostponedToTime(match.postponedToDate ? new Date(match.postponedToDate).toISOString().split('T')[1].substring(0, 5) : '');
  };

  return (
    <>
      {/* Status Display & Trigger Button */}
      <div className="flex items-center space-x-3">
        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md border transition-all duration-300 ${currentStatus?.color} ${
          (match.status === 'Cancelled' || match.status === 'Postponed') 
            ? 'animate-pulse ring-2 ring-offset-1 ' + (match.status === 'Cancelled' ? 'ring-red-300' : 'ring-yellow-300')
            : ''
        }`}>
          <span className="mr-2 text-lg">{currentStatus?.icon}</span>
          {currentStatus?.label}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            resetForm();
            setIsOpen(true);
          }}
          className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 rounded-lg border border-blue-200 transition-all duration-200 hover:shadow-sm"
        >
          ⚙️ Update
        </button>
      </div>

      {/* Modal Portal */}
      <AnimatePresence>
        {isOpen && typeof window !== 'undefined' && createPortal(
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full relative"
              style={{ zIndex: 10000 }}
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Update Match Status</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {teamName || 'Team'} vs {match.opponent}
                  </p>
                </div>

                {/* Content */}
                <div className="px-6 py-4 space-y-4">
                  
                  {/* Status Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Match Status
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {statusOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedStatus === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="status"
                            value={option.value}
                            checked={selectedStatus === option.value}
                            onChange={(e) => setSelectedStatus(e.target.value as MatchStatus)}
                            className="sr-only"
                          />
                          <span className="text-lg mr-3">{option.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{option.label}</div>
                            {option.value === 'Cancelled' && (
                              <div className="text-xs text-gray-500">Match will not be played</div>
                            )}
                            {option.value === 'Postponed' && (
                              <div className="text-xs text-gray-500">Match moved to new date</div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cancellation/Postponement Reason */}
                  {requiresReason && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for {selectedStatus === 'Cancelled' ? 'Cancellation' : 'Postponement'} *
                      </label>
                      <textarea
                        value={cancellationReason}
                        onChange={(e) => setCancellationReason(e.target.value)}
                        placeholder={`Enter reason for ${selectedStatus === 'Cancelled' ? 'cancellation' : 'postponement'}...`}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required={requiresReason}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This reason will be displayed to team members and in notifications
                      </p>
                    </motion.div>
                  )}

                  {/* New Date for Postponed Matches */}
                  {requiresNewDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        New Match Date & Time *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Date</label>
                          <input
                            type="date"
                            value={postponedToDate}
                            onChange={(e) => setPostponedToDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required={requiresNewDate}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Time</label>
                          <input
                            type="time"
                            value={postponedToTime}
                            onChange={(e) => setPostponedToTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Notification Warning */}
                  {!shouldTriggerNotification(selectedStatus) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <span className="text-yellow-600 mr-2">⚠️</span>
                        <div className="text-sm text-yellow-800">
                          <strong>Note:</strong> No notifications will be sent for {selectedStatus.toLowerCase()} matches.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
}