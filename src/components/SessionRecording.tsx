/**
 * Session Recording System - Context Continuity for Claude AI
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Captures conversation context, decisions, and progress for seamless session continuity
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SessionEntry {
  id: string;
  timestamp: string;
  sessionTitle: string;
  contextSummary: string;
  keyDecisions: string[];
  filesModified: string[];
  currentState: string;
  nextSteps: string[];
  version: string;
  priority: 'high' | 'medium' | 'low';
}

interface SessionRecordingProps {
  onSessionSave?: (session: SessionEntry) => void;
}

const SessionRecording: React.FC<SessionRecordingProps> = ({ onSessionSave }) => {
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentSession, setCurrentSession] = useState<Partial<SessionEntry>>({
    sessionTitle: '',
    contextSummary: '',
    keyDecisions: [''],
    filesModified: [''],
    currentState: '',
    nextSteps: [''],
    priority: 'medium'
  });

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('claude-sessions');
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    }
  }, []);

  // Save sessions to localStorage
  const saveSessions = (updatedSessions: SessionEntry[]) => {
    localStorage.setItem('claude-sessions', JSON.stringify(updatedSessions));
    setSessions(updatedSessions);
  };

  // Add array item
  const addArrayItem = (field: 'keyDecisions' | 'filesModified' | 'nextSteps') => {
    setCurrentSession(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  // Update array item
  const updateArrayItem = (field: 'keyDecisions' | 'filesModified' | 'nextSteps', index: number, value: string) => {
    const array = [...(currentSession[field] || [])];
    array[index] = value;
    setCurrentSession(prev => ({
      ...prev,
      [field]: array
    }));
  };

  // Remove array item
  const removeArrayItem = (field: 'keyDecisions' | 'filesModified' | 'nextSteps', index: number) => {
    const array = [...(currentSession[field] || [])];
    array.splice(index, 1);
    setCurrentSession(prev => ({
      ...prev,
      [field]: array
    }));
  };

  // Save current session
  const saveSession = () => {
    if (!currentSession.sessionTitle || !currentSession.contextSummary) {
      alert('Please fill in session title and context summary');
      return;
    }

    const session: SessionEntry = {
      id: `session-${Date.now()}`,
      timestamp: new Date().toISOString(),
      sessionTitle: currentSession.sessionTitle!,
      contextSummary: currentSession.contextSummary!,
      keyDecisions: (currentSession.keyDecisions || []).filter(Boolean),
      filesModified: (currentSession.filesModified || []).filter(Boolean),
      currentState: currentSession.currentState || '',
      nextSteps: (currentSession.nextSteps || []).filter(Boolean),
      version: '2.10.0', // Auto-set current version
      priority: currentSession.priority || 'medium'
    };

    const updatedSessions = [session, ...sessions];
    saveSessions(updatedSessions);
    
    // Clear current session
    setCurrentSession({
      sessionTitle: '',
      contextSummary: '',
      keyDecisions: [''],
      filesModified: [''],
      currentState: '',
      nextSteps: [''],
      priority: 'medium'
    });
    
    setIsRecording(false);
    onSessionSave?.(session);
    alert('Session saved successfully!');
  };

  // Generate resume prompt
  const generateResumePrompt = (session: SessionEntry) => {
    const prompt = `# Resume Session Context

**Session:** ${session.sessionTitle}
**Date:** ${new Date(session.timestamp).toLocaleDateString()}
**Version:** ${session.version}

## What We Accomplished
${session.contextSummary}

## Key Decisions Made
${session.keyDecisions.map(decision => `- ${decision}`).join('\n')}

## Files Modified
${session.filesModified.map(file => `- ${file}`).join('\n')}

## Current State
${session.currentState}

## Next Steps
${session.nextSteps.map(step => `- ${step}`).join('\n')}

---
*Claude: Please review this context and confirm you understand where we left off. Then let's continue with the next steps.*`;

    navigator.clipboard.writeText(prompt);
    alert('Resume prompt copied to clipboard! Paste this at the start of your next Claude session.');
  };

  // Delete session
  const deleteSession = (sessionId: string) => {
    if (confirm('Delete this session record?')) {
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      saveSessions(updatedSessions);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <span className="mr-3 text-3xl">🎯</span>
          Session Recording
        </h2>
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isRecording 
              ? 'bg-red-100 text-red-700 hover:bg-red-200' 
              : 'bg-club-primary text-white hover:bg-club-secondary'
          }`}
        >
          {isRecording ? '❌ Cancel Recording' : '📝 New Session'}
        </button>
      </div>

      {/* Recording Form */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">📝 Record Current Session</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Session Title *</label>
                <input
                  type="text"
                  value={currentSession.sessionTitle}
                  onChange={(e) => setCurrentSession(prev => ({ ...prev, sessionTitle: e.target.value }))}
                  placeholder="e.g., Mobile-First Match Creation UX Redesign"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Context Summary *</label>
                <textarea
                  value={currentSession.contextSummary}
                  onChange={(e) => setCurrentSession(prev => ({ ...prev, contextSummary: e.target.value }))}
                  placeholder="Describe what we accomplished in this session..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Current State</label>
                <textarea
                  value={currentSession.currentState}
                  onChange={(e) => setCurrentSession(prev => ({ ...prev, currentState: e.target.value }))}
                  placeholder="Where did we leave off? What's the current state?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                <select
                  value={currentSession.priority}
                  onChange={(e) => setCurrentSession(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="high">🔥 High Priority</option>
                  <option value="medium">⚡ Medium Priority</option>
                  <option value="low">📝 Low Priority</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {/* Key Decisions */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Key Decisions Made
                  <button
                    type="button"
                    onClick={() => addArrayItem('keyDecisions')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    + Add
                  </button>
                </label>
                {(currentSession.keyDecisions || []).map((decision, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={decision}
                      onChange={(e) => updateArrayItem('keyDecisions', index, e.target.value)}
                      placeholder="e.g., Changed from 6 boxes to 2 cards for mobile optimization"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('keyDecisions', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>

              {/* Files Modified */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Files Modified
                  <button
                    type="button"
                    onClick={() => addArrayItem('filesModified')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    + Add
                  </button>
                </label>
                {(currentSession.filesModified || []).map((file, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={file}
                      onChange={(e) => updateArrayItem('filesModified', index, e.target.value)}
                      placeholder="e.g., /src/pages/matches/new.tsx"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('filesModified', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>

              {/* Next Steps */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Next Steps
                  <button
                    type="button"
                    onClick={() => addArrayItem('nextSteps')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    + Add
                  </button>
                </label>
                {(currentSession.nextSteps || []).map((step, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => updateArrayItem('nextSteps', index, e.target.value)}
                      placeholder="e.g., Test mobile responsiveness on real devices"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('nextSteps', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={saveSession}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              💾 Save Session
            </button>
            <button
              onClick={() => setIsRecording(false)}
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Session History */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Session History ({sessions.length})</h3>
        
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No sessions recorded yet. Start a new session to begin tracking context!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{session.sessionTitle}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span>📅 {new Date(session.timestamp).toLocaleDateString()}</span>
                      <span>🏷️ v{session.version}</span>
                      <span className={`px-2 py-1 rounded border text-xs font-medium ${getPriorityColor(session.priority)}`}>
                        {session.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => generateResumePrompt(session)}
                      className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      📋 Resume
                    </button>
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{session.contextSummary}</p>
                
                {session.currentState && (
                  <div className="mb-3">
                    <strong className="text-gray-900">Current State:</strong>
                    <p className="text-gray-700 mt-1">{session.currentState}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                  {session.keyDecisions.length > 0 && (
                    <div>
                      <strong className="text-gray-900">Key Decisions:</strong>
                      <ul className="text-gray-700 mt-1">
                        {session.keyDecisions.map((decision, idx) => (
                          <li key={idx}>• {decision}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {session.filesModified.length > 0 && (
                    <div>
                      <strong className="text-gray-900">Files Modified:</strong>
                      <ul className="text-gray-700 mt-1">
                        {session.filesModified.map((file, idx) => (
                          <li key={idx}>• {file}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {session.nextSteps.length > 0 && (
                    <div>
                      <strong className="text-gray-900">Next Steps:</strong>
                      <ul className="text-gray-700 mt-1">
                        {session.nextSteps.map((step, idx) => (
                          <li key={idx}>• {step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionRecording;