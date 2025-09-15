/**
 * Inline Editor Component
 * 
 * Shows edit button for authenticated users to edit page content directly
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EditModal from './EditModal'
import MarkdownContent from './MarkdownContent'

interface InlineEditorProps {
  contentKey: string
  initialContent: string
  type?: 'text' | 'textarea' | 'rich'
  className?: string
  placeholder?: string
  onSave?: (content: string) => void
  as?: 'div' | 'span' | 'p'
  renderMarkdown?: boolean
}

export default function InlineEditor({
  contentKey,
  initialContent,
  type = 'text',
  className = '',
  placeholder = 'Click to edit...',
  onSave,
  as = 'div',
  renderMarkdown = false
}: InlineEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(initialContent)
  const [canEdit, setCanEdit] = useState(false)
  
  // Check for demo auth state
  useEffect(() => {
    const demoAuth = localStorage.getItem('rvr_demo_auth')
    setCanEdit(!!demoAuth)
  }, [])
  
  const handleEdit = () => {
    setIsEditing(true)
  }
  
  const handleSave = async (newContent: string) => {
    try {
      // Save to localStorage as simple storage (replace with API call)
      localStorage.setItem(`rvr_content_${contentKey}`, newContent)
      setContent(newContent)
      
      if (onSave) {
        onSave(newContent)
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Error saving content. Please try again.')
    }
  }
  
  // Load saved content on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem(`rvr_content_${contentKey}`)
    if (savedContent) {
      setContent(savedContent)
    }
  }, [contentKey])
  
  const Component = as
  
  return (
    <>
      <Component className={`relative group ${className}`}>
        {/* Display content */}
        {renderMarkdown && content ? (
          <MarkdownContent content={content} />
        ) : (
          <span className={content ? '' : 'text-gray-500 italic'}>
            {content || placeholder}
          </span>
        )}
        
        {/* Edit button - only visible to authenticated editors */}
        <AnimatePresence>
          {canEdit && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleEdit}
              className="absolute -top-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all opacity-0 group-hover:opacity-100 shadow-lg"
              title="Edit content"
            >
              ✏️
            </motion.button>
          )}
        </AnimatePresence>
      </Component>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        contentKey={contentKey}
        initialContent={content}
        type={type}
        onSave={handleSave}
      />
    </>
  )
}

/**
 * Simple Demo Login Component
 */
export function QuickLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  
  // Check localStorage for demo login state
  useEffect(() => {
    const demoAuth = localStorage.getItem('rvr_demo_auth')
    setIsLoggedIn(!!demoAuth)
  }, [])
  
  const handleLogin = () => {
    // Simple demo login - username: admin, password: rvrfc2025
    if (credentials.username === 'admin' && credentials.password === 'rvrfc2025') {
      localStorage.setItem('rvr_demo_auth', 'true')
      setIsLoggedIn(true)
      setShowLogin(false)
      setCredentials({ username: '', password: '' })
    } else {
      alert('Invalid credentials. Try username: admin, password: rvrfc2025')
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('rvr_demo_auth')
    setIsLoggedIn(false)
  }
  
  if (isLoggedIn) {
    return (
      <div className="flex items-center justify-between text-sm text-gray-700 bg-green-50 rounded-lg p-2">
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span className="font-medium">Editor Mode</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 text-xs"
        >
          Logout
        </button>
      </div>
    )
  }
  
  if (showLogin) {
    return (
      <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-200">
        <div className="text-xs text-gray-800 font-medium">Editor Login</div>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900 bg-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded text-xs text-gray-900 bg-white"
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
        <div className="flex gap-1">
          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex-1 transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-2 py-1 rounded text-xs transition-colors"
          >
            Cancel
          </button>
        </div>
        <div className="text-xs text-gray-500">Demo: admin / rvrfc2025</div>
      </div>
    )
  }
  
  return (
    <button
      onClick={() => setShowLogin(true)}
      className="w-full text-left text-gray-800 hover:bg-club-primary hover:bg-opacity-20 hover:text-club-primary transition-colors text-sm py-2 px-3 rounded font-medium"
    >
      🔑 Editor Login
    </button>
  )
}