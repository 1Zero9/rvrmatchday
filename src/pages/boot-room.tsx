import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';

export default function BootRoom() {
  const [activeTab, setActiveTab] = useState<'give' | 'take' | 'rules'>('give');

  const availableItems = [
    {
      id: 1,
      title: 'Football Boots - Size 8',
      category: 'footwear',
      condition: 'Good',
      description: 'Nike football boots, barely used. Perfect for training or matches.',
      donatedBy: 'Sarah M.',
      dateAdded: '2024-08-18',
      image: '👟'
    },
    {
      id: 2,
      title: 'Training Jerseys (Multiple)',
      category: 'clothing',
      condition: 'Excellent',
      description: 'Set of 5 training jerseys, various sizes. Great for new players.',
      donatedBy: 'Coach Davies',
      dateAdded: '2024-08-15',
      image: '👕'
    },
    {
      id: 3,
      title: 'Goalkeeper Gloves - Youth',
      category: 'equipment',
      condition: 'Very Good',
      description: 'Youth goalkeeper gloves, size medium. Still have good grip.',
      donatedBy: 'The Murphy Family',
      dateAdded: '2024-08-12',
      image: '🧤'
    },
    {
      id: 4,
      title: 'Football - Match Quality',
      category: 'equipment',
      condition: 'Good',
      description: 'FIFA approved match ball. Few scuffs but still playable.',
      donatedBy: 'Anonymous',
      dateAdded: '2024-08-10',
      image: '⚽'
    },
    {
      id: 5,
      title: 'Shin Pads - Junior Size',
      category: 'safety',
      condition: 'Excellent',
      description: 'Lightweight shin pads, perfect for youth players.',
      donatedBy: 'Emily K.',
      dateAdded: '2024-08-08',
      image: '🛡️'
    },
    {
      id: 6,
      title: 'Kit Bag - Large',
      category: 'bags',
      condition: 'Very Good',
      description: 'Spacious kit bag with separate boot compartment.',
      donatedBy: 'Former Player',
      dateAdded: '2024-08-05',
      image: '🎒'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Items', icon: '📦' },
    { id: 'footwear', label: 'Boots & Shoes', icon: '👟' },
    { id: 'clothing', label: 'Kit & Clothing', icon: '👕' },
    { id: 'equipment', label: 'Equipment', icon: '⚽' },
    { id: 'safety', label: 'Safety Gear', icon: '🛡️' },
    { id: 'bags', label: 'Bags', icon: '🎒' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredItems = selectedCategory === 'all' 
    ? availableItems 
    : availableItems.filter(item => item.category === selectedCategory);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Very Good':
        return 'bg-blue-100 text-blue-800';
      case 'Good':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <StandardLayout title="Boot Room - Swap Shop">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🔄</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Boot Room Swap Shop</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Give something, take something. Help our community by sharing football equipment that's no longer needed.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md mx-auto">
            {[
              { key: 'give' as const, label: '🎁 Give Items', color: 'green' },
              { key: 'take' as const, label: '🛍️ Take Items', color: 'blue' },
              { key: 'rules' as const, label: '📋 How It Works', color: 'purple' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          
          {/* Give Items Tab */}
          {activeTab === 'give' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🎁</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Donate Equipment</h2>
                  <p className="text-gray-600">
                    Have football equipment your child has outgrown? Share it with other families in our community!
                  </p>
                </div>

                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="e.g., Football Boots - Size 6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                      <option value="">Select category...</option>
                      <option value="footwear">Boots & Shoes</option>
                      <option value="clothing">Kit & Clothing</option>
                      <option value="equipment">Equipment</option>
                      <option value="safety">Safety Gear</option>
                      <option value="bags">Bags</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
                      <option value="">Select condition...</option>
                      <option value="excellent">Excellent</option>
                      <option value="very-good">Very Good</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Describe the item, size, brand, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="How you'd like to be credited"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    List Item for Sharing
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Take Items Tab */}
          {activeTab === 'take' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🛍️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Items</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Browse items donated by our community. Contact us to arrange collection.
                </p>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                        selectedCategory === category.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-3xl">{item.image}</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                          {item.condition}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                      <div className="text-xs text-gray-500 mb-3">
                        Donated by {item.donatedBy} • {new Date(item.dateAdded).toLocaleDateString('en-GB')}
                      </div>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors">
                        Request Item
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">📋</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">How the Boot Room Works</h2>
                  <p className="text-gray-600">
                    Our community swap shop helps families share football equipment and reduce costs.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center">
                      <span className="text-2xl mr-2">🎁</span>
                      Giving Items
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Items should be clean and in usable condition
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Include accurate size and condition information
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Drop off at the clubhouse during opening hours
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        All donations help our community
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center">
                      <span className="text-2xl mr-2">🛍️</span>
                      Taking Items
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        Contact us to arrange collection
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        Items are free - no payment required
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        Please only take what you need
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✓</span>
                        Consider donating when you no longer need items
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Guidelines</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• Safety equipment (shin pads, goalkeeping gear) must be in excellent condition</li>
                    <li>• We cannot accept items that are damaged or unsafe to use</li>
                    <li>• Collection must be arranged within 2 weeks of requesting an item</li>
                    <li>• Items may be removed if not collected promptly</li>
                  </ul>
                </div>

                <div className="flex justify-center mt-8">
                  <Link 
                    href="/contact"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    📞 Contact Us About Boot Room
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </StandardLayout>
  );
}