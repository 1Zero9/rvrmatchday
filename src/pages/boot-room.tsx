import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

export default function BootRoom() {
  const [activeTab, setActiveTab] = useState<'kit' | 'equipment' | 'sizing' | 'care'>('kit');

  const kitItems = [
    {
      id: '1',
      name: 'Home Jersey',
      description: 'Official Rivervalley Rangers home kit with club crest',
      price: '€35',
      sizes: ['4-6', '6-8', '8-10', '10-12', 'S', 'M', 'L', 'XL'],
      image: '/images/home-jersey.jpg',
      inStock: true,
      category: 'Playing Kit'
    },
    {
      id: '2', 
      name: 'Away Jersey',
      description: 'Official away strip in signature club colors',
      price: '€35',
      sizes: ['4-6', '6-8', '8-10', '10-12', 'S', 'M', 'L', 'XL'],
      image: '/images/away-jersey.jpg',
      inStock: true,
      category: 'Playing Kit'
    },
    {
      id: '3',
      name: 'Training Shorts',
      description: 'Comfortable training shorts with club logo',
      price: '€20',
      sizes: ['4-6', '6-8', '8-10', '10-12', 'S', 'M', 'L', 'XL'],
      image: '/images/training-shorts.jpg',
      inStock: true,
      category: 'Training Gear'
    },
    {
      id: '4',
      name: 'Club Tracksuit',
      description: 'Full tracksuit set for training and match days',
      price: '€55',
      sizes: ['4-6', '6-8', '8-10', '10-12', 'S', 'M', 'L', 'XL'],
      image: '/images/tracksuit.jpg',
      inStock: false,
      category: 'Training Gear'
    }
  ];

  const equipment = [
    {
      name: 'Football Boots',
      description: 'Essential for all players - various brands and styles available',
      recommendation: 'Adidas Copa or Nike Mercurial for beginners',
      priceRange: '€40-€150',
      where: 'Decathlon, Sports Direct, or online'
    },
    {
      name: 'Shin Pads',
      description: 'Mandatory safety equipment for all matches and training',
      recommendation: 'Nike or Adidas with ankle guards for younger players',
      priceRange: '€10-€25',
      where: 'Any sports shop - must be CE marked'
    },
    {
      name: 'Football Socks',
      description: 'Long socks to cover shin pads completely',
      recommendation: 'Club socks preferred, or plain white/black',
      priceRange: '€8-€15',
      where: 'Club shop or sports retailers'
    },
    {
      name: 'Training Ball',
      description: 'Size 4 for U12 and below, Size 5 for older players',
      recommendation: 'Derbystar or Select match balls',
      priceRange: '€15-€30',
      where: 'Club can arrange bulk purchase'
    }
  ];

  const sizingGuide = [
    { age: '4-6 years', jersey: 'Age 4-6', shorts: 'Age 4-6', boots: '10-13 (UK)', ballSize: '3' },
    { age: '6-8 years', jersey: 'Age 6-8', shorts: 'Age 6-8', boots: '13-2 (UK)', ballSize: '3' },
    { age: '8-10 years', jersey: 'Age 8-10', shorts: 'Age 8-10', boots: '2-4 (UK)', ballSize: '4' },
    { age: '10-12 years', jersey: 'Age 10-12', shorts: 'Age 10-12', boots: '4-6 (UK)', ballSize: '4' },
    { age: '12+ years', jersey: 'S/M/L', shorts: 'S/M/L', boots: '6+ (UK)', ballSize: '5' },
  ];

  const careTips = [
    {
      title: 'Jersey Care',
      tips: [
        'Wash inside-out in cold water to protect prints',
        'Air dry - never tumble dry',
        'Iron on low heat, avoiding printed areas',
        'Store on hangers to prevent creasing'
      ]
    },
    {
      title: 'Boot Maintenance',
      tips: [
        'Clean mud off immediately after use',
        'Stuff with newspaper to maintain shape while drying',
        'Never dry near direct heat or radiators',
        'Replace studs when worn down for safety'
      ]
    },
    {
      title: 'Equipment Storage',
      tips: [
        'Always air-dry gear before storing',
        'Keep a dedicated kit bag organized',
        'Check shin pads for cracks regularly',
        'Pack spare socks and laces for match days'
      ]
    }
  ];

  return (
    <Layout currentSection="public">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border-b border-gray-200 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <div className="text-6xl mb-4">👕</div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  The Boot Room
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Your one-stop shop for all club kit, equipment recommendations, and gear care tips. 
                  Get match-ready with official RVR gear and expert advice.
                </p>
              </motion.div>
              
              <div className="flex justify-center">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2 mb-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: 'kit', label: 'Club Kit', icon: '👕', desc: 'Official jerseys & gear' },
                { id: 'equipment', label: 'Equipment Guide', icon: '⚽', desc: 'What you need to play' },
                { id: 'sizing', label: 'Sizing Guide', icon: '📏', desc: 'Find the right fit' },
                { id: 'care', label: 'Kit Care', icon: '🧼', desc: 'Keep gear in top shape' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-2">{tab.icon}</div>
                  <div className="font-semibold text-sm">{tab.label}</div>
                  <div className="text-xs opacity-80 mt-1">{tab.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Club Kit Tab */}
          {activeTab === 'kit' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">🛒</span>
                  Official Club Kit
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kitItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-lg h-48 mb-4 flex items-center justify-center text-white text-4xl">
                        👕
                      </div>
                      
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.inStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <p className="text-xs text-blue-600 font-medium mb-3">{item.category}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-green-600">{item.price}</span>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                          Order Now
                        </button>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500">
                        Sizes: {item.sizes.slice(0, 4).join(', ')}{item.sizes.length > 4 && '...'}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 bg-blue-50 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 How to Order</h3>
                  <p className="text-blue-700 mb-4">
                    Contact your team manager or email us at kit@rvrafc.ie with your requirements. 
                    We arrange group orders monthly to keep costs down!
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <span className="bg-white px-3 py-1 rounded-full text-blue-800">📞 Group orders save money</span>
                    <span className="bg-white px-3 py-1 rounded-full text-blue-800">📦 Direct delivery to training</span>
                    <span className="bg-white px-3 py-1 rounded-full text-blue-800">💳 Card or cash payment</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Equipment Guide Tab */}
          {activeTab === 'equipment' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">⚽</span>
                  Essential Equipment Guide
                </h2>
                
                <div className="grid gap-6">
                  {equipment.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                        <div className="md:w-2/3">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                          <p className="text-gray-700 mb-4">{item.description}</p>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-green-700">💡 Our Recommendation: </span>
                              <span className="text-gray-600">{item.recommendation}</span>
                            </div>
                            <div>
                              <span className="font-medium text-blue-700">💰 Price Range: </span>
                              <span className="text-gray-600">{item.priceRange}</span>
                            </div>
                            <div>
                              <span className="font-medium text-purple-700">🏪 Where to Buy: </span>
                              <span className="text-gray-600">{item.where}</span>
                            </div>
                          </div>
                        </div>
                        <div className="md:w-1/3 mt-4 md:mt-0 text-center">
                          <div className="bg-white rounded-lg p-8 text-4xl shadow-sm">
                            {item.name.includes('Boot') ? '👟' : 
                             item.name.includes('Shin') ? '🛡️' :
                             item.name.includes('Socks') ? '🧦' : '⚽'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
                    <span className="mr-2">⚠️</span>
                    Safety First!
                  </h3>
                  <ul className="space-y-2 text-yellow-800">
                    <li>• Shin pads are <strong>mandatory</strong> for all training and matches</li>
                    <li>• Boots must not have metal studs (plastic or rubber only)</li>
                    <li>• Remove all jewelry before playing</li>
                    <li>• Goalkeepers need additional protective gear</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sizing Guide Tab */}
          {activeTab === 'sizing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">📏</span>
                  Sizing Guide
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-green-50 border-b border-green-200">
                        <th className="text-left p-4 font-semibold text-green-900">Age Group</th>
                        <th className="text-left p-4 font-semibold text-green-900">Jersey Size</th>
                        <th className="text-left p-4 font-semibold text-green-900">Shorts Size</th>
                        <th className="text-left p-4 font-semibold text-green-900">Boot Size</th>
                        <th className="text-left p-4 font-semibold text-green-900">Ball Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizingGuide.map((row, index) => (
                        <motion.tr
                          key={row.age}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                        >
                          <td className="p-4 font-medium text-gray-900">{row.age}</td>
                          <td className="p-4 text-gray-700">{row.jersey}</td>
                          <td className="p-4 text-gray-700">{row.shorts}</td>
                          <td className="p-4 text-gray-700">{row.boots}</td>
                          <td className="p-4 text-gray-700">Size {row.ballSize}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                      <span className="mr-2">📐</span>
                      Measuring Tips
                    </h3>
                    <ul className="space-y-2 text-blue-800 text-sm">
                      <li>• Measure jersey size around the chest</li>
                      <li>• Boot sizing: measure feet in the afternoon when they're largest</li>
                      <li>• Allow growing room but not too loose</li>
                      <li>• Try on with football socks for boots</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                      <span className="mr-2">💡</span>
                      Pro Tips
                    </h3>
                    <ul className="space-y-2 text-green-800 text-sm">
                      <li>• Kids grow fast - check sizes every 6 months</li>
                      <li>• Boot comfort is crucial for performance</li>
                      <li>• Consider buying end-of-season for savings</li>
                      <li>• Ask about hand-me-downs from older players</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Kit Care Tab */}
          {activeTab === 'care' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-3">🧼</span>
                  Kit Care & Maintenance
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {careTips.map((section, index) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                      <ul className="space-y-3">
                        {section.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start text-sm text-gray-700">
                            <span className="text-green-600 mr-2 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <span className="mr-2">♻️</span>
                    Kit Exchange Program
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Outgrown Kit?</h4>
                      <p className="text-green-700 text-sm mb-3">
                        Don't let good kit go to waste! Our exchange program helps families 
                        save money while ensuring every player has proper equipment.
                      </p>
                      <div className="space-y-1 text-xs text-green-600">
                        <div>• Drop off clean, good condition kit to team managers</div>
                        <div>• Get credit towards new purchases</div>
                        <div>• Help other families get started</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">Need Kit?</h4>
                      <p className="text-green-700 text-sm mb-3">
                        Check our exchange stock first - you might find exactly what you need 
                        at a fraction of the cost of buying new.
                      </p>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        Check Available Kit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </Layout>
  );
}