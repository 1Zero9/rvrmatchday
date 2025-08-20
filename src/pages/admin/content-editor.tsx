import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'about' | 'general';
  lastModified: string;
  modifiedBy: string;
}

export default function ContentEditor() {
  const [activeTab, setActiveTab] = useState<'news' | 'about' | 'general'>('news');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  // Mock content data - in real implementation, this would come from a database
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'Latest Club News',
      content: 'Welcome to the latest updates from Rivervalley Rangers AFC...',
      type: 'news',
      lastModified: '2024-08-20',
      modifiedBy: 'Content Editor'
    },
    {
      id: '2',
      title: 'About Our Club',
      content: 'Rivervalley Rangers AFC has been serving the community since 2009...',
      type: 'about',
      lastModified: '2024-08-15',
      modifiedBy: 'Content Editor'
    },
    {
      id: '3',
      title: 'Match Day Information',
      content: 'Important information for supporters attending matches...',
      type: 'general',
      lastModified: '2024-08-18',
      modifiedBy: 'Content Editor'
    }
  ]);

  const filteredItems = contentItems.filter(item => item.type === activeTab);

  const handleSave = () => {
    if (selectedItem) {
      const updatedItems = contentItems.map(item =>
        item.id === selectedItem.id
          ? { ...item, title, content, lastModified: new Date().toISOString().split('T')[0], modifiedBy: 'Content Editor' }
          : item
      );
      setContentItems(updatedItems);
      setSelectedItem({ ...selectedItem, title, content });
      setIsEditing(false);
      
      // In real implementation, would save to database here
      alert('Content saved successfully!');
    }
  };

  const handleEdit = (item: ContentItem) => {
    setSelectedItem(item);
    setTitle(item.title);
    setContent(item.content);
    setIsEditing(true);
  };

  const tabs = [
    { key: 'news' as const, label: '📰 News & Events', color: 'blue' },
    { key: 'about' as const, label: '📖 About Pages', color: 'green' },
    { key: 'general' as const, label: '📝 General Content', color: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Editor</h1>
              <p className="text-gray-600">Manage website content easily</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Content Editor Access
              </div>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Back to Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSelectedItem(null);
                  setIsEditing(false);
                }}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {tabs.find(t => t.key === activeTab)?.label}
                </h3>
                <p className="text-sm text-gray-600">{filteredItems.length} items</p>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ backgroundColor: 'rgb(249, 250, 251)' }}
                    className={`p-4 cursor-pointer ${
                      selectedItem?.id === item.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => handleEdit(item)}
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.content}</p>
                    <div className="text-xs text-gray-400">
                      Modified {item.lastModified} by {item.modifiedBy}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-2">
            {selectedItem ? (
              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {isEditing ? 'Edit Content' : 'View Content'}
                    </h3>
                    <div className="flex space-x-2">
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          ✏️ Edit
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setTitle(selectedItem.title);
                              setContent(selectedItem.content);
                            }}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            💾 Save
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter title..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={12}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                          placeholder="Enter content... You can use basic HTML tags like <p>, <br>, <strong>, <em>, etc."
                        />
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-blue-900 mb-2">📝 Formatting Tips:</h4>
                        <ul className="text-xs text-blue-800 space-y-1">
                          <li>• Use &lt;p&gt;...&lt;/p&gt; for paragraphs</li>
                          <li>• Use &lt;br&gt; for line breaks</li>
                          <li>• Use &lt;strong&gt;...&lt;/strong&gt; for bold text</li>
                          <li>• Use &lt;em&gt;...&lt;/em&gt; for italic text</li>
                          <li>• Use &lt;ul&gt;&lt;li&gt;...&lt;/li&gt;&lt;/ul&gt; for bullet lists</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4">{selectedItem.title}</h4>
                      <div 
                        className="prose prose-lg max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: selectedItem.content }}
                      />
                      
                      <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
                        <p>Last modified: {selectedItem.lastModified} by {selectedItem.modifiedBy}</p>
                        <p>Content type: {selectedItem.type}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select content to edit</h3>
                <p className="text-gray-600">Choose an item from the list to view or edit its content.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}