/**
 * Edit Modal Component
 * 
 * Shows a modal dialog for editing content with proper contrast
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  contentKey: string
  initialContent: string
  type?: 'text' | 'textarea'
  onSave: (content: string) => void
}

export default function EditModal({
  isOpen,
  onClose,
  contentKey,
  initialContent,
  type = 'text',
  onSave
}: EditModalProps) {
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent, isOpen])

  const handleSave = () => {
    onSave(content)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Edit Content
          </h3>

          {type === 'textarea' ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-blue-500 resize-none"
              rows={6}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:border-blue-500"
              autoFocus
            />
          )}

          <div className="flex gap-3 mt-6 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Save
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}