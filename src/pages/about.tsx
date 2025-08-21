import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';

export default function About() {
  // Interactive content boxes for About page
  const aboutBoxes = [
    {
      id: 'history',
      title: '📜 Our Story',
      subtitle: 'Since 2009',
      color: 'from-blue-600 to-cyan-700',
      icon: '📜',
      description: 'Learn about our journey and heritage'
    },
    {
      id: 'values',
      title: '🤝 Our Values', 
      subtitle: 'Community • Development • Excellence',
      color: 'from-green-600 to-emerald-700',
      icon: '🤝',
      description: 'The principles that guide us'
    },
    {
      id: 'facilities',
      title: '🏟️ Our Facilities',
      subtitle: 'Training grounds & clubhouse',
      color: 'from-purple-600 to-violet-700',
      icon: '🏟️',
      description: 'Where the magic happens'
    },
    {
      id: 'coaches',
      title: '👨‍🏫 Our Team',
      subtitle: '25+ qualified coaches',
      color: 'from-amber-600 to-orange-700',
      icon: '👨‍🏫',
      description: 'Meet the people behind our success'
    }
  ];

  return (
    <StandardLayout title="About Us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🏰</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Story & Heritage</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            From Ancient Swords to Modern Rangers • A Thousand Years of Community Spirit
          </p>
        </motion.div>

        {/* Navigation Links to Related Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Explore Our Community</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/club/facilities" className="group">
                <div className="bg-blue-50 hover:bg-blue-100 rounded-lg p-4 border-l-4 border-blue-500 transition-all duration-200">
                  <h3 className="font-medium text-blue-900 mb-2 group-hover:text-blue-700 flex items-center">
                    <span className="text-xl mr-2">🏰</span>
                    Modern Castle
                  </h3>
                  <p className="text-sm text-blue-700">Our facilities continue the tradition of community gathering places</p>
                </div>
              </Link>
              
              <Link href="/get-involved/fundraising" className="group">
                <div className="bg-green-50 hover:bg-green-100 rounded-lg p-4 border-l-4 border-green-500 transition-all duration-200">
                  <h3 className="font-medium text-green-900 mb-2 group-hover:text-green-700 flex items-center">
                    <span className="text-xl mr-2">🌊</span>
                    Building Legacy
                  </h3>
                  <p className="text-sm text-green-700">Like ancient builders, we invest in our community's future</p>
                </div>
              </Link>
              
              <Link href="/teams/youth" className="group">
                <div className="bg-purple-50 hover:bg-purple-100 rounded-lg p-4 border-l-4 border-purple-500 transition-all duration-200">
                  <h3 className="font-medium text-purple-900 mb-2 group-hover:text-purple-700 flex items-center">
                    <span className="text-xl mr-2">⛪</span>
                    Centers of Learning
                  </h3>
                  <p className="text-sm text-purple-700">Continuing St. Columba's tradition of youth development</p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          
          {/* Club Story - Priority Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-slate-900 text-white rounded-2xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-center mb-6">Our Club Story</h2>
              <div className="text-center mb-8">
                <span className="text-6xl">🏆</span>
              </div>
              <p className="text-lg text-slate-200 text-center max-w-4xl mx-auto leading-relaxed mb-6">
                Established in 1981, Rivervalley Rangers AFC has grown from a local youth club into a cornerstone of the Swords community. 
                For over 40 years, we've been dedicated to developing young talent, promoting inclusivity, and bringing families together through football.
              </p>
              <div className="bg-blue-800 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-center mb-4">FAI Club Mark Accredited</h3>
                <p className="text-blue-100 text-center text-sm">
                  We're proud to hold the FAI Club Mark, recognizing our commitment to best practices in governance, 
                  management, and administration - creating stronger clubs and a stronger game.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission & Programs</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">⚽</span>
                    <div>
                      <strong>Boys Teams:</strong> Traditional football development across all age groups
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-3 mt-1">🌟</span>
                    <div>
                      <strong>New Girls Section:</strong> Expanding opportunities for female players of all ages
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1">🤝</span>
                    <div>
                      <strong>Football for All:</strong> Inclusive programs for children with special needs
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1">👨‍👩‍👧‍👦</span>
                    <div>
                      <strong>Community Programs:</strong> Walking Football, Ladies Fitness, and family activities
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-xl p-8 border border-green-200">
                <h3 className="text-2xl font-bold text-green-900 mb-4">Our Achievements</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-green-600">43+</div>
                    <div className="text-sm text-gray-600">Years Serving Community</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-blue-600">500+</div>
                    <div className="text-sm text-gray-600">Players Developed</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-purple-600">15+</div>
                    <div className="text-sm text-gray-600">Active Teams</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-orange-600">30+</div>
                    <div className="text-sm text-gray-600">Volunteer Coaches</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-800 text-center font-medium">
                    "Football for All - Developing players, building character, strengthening community" 
                    <br />- Club Mission Since 1981
                  </p>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Local Area History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-16"
          >
            <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white rounded-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">The Historic Area of Swords</h2>
              <p className="text-lg text-amber-100 text-center max-w-4xl mx-auto leading-relaxed">
                Our club calls home one of Ireland's most historically rich areas. From ancient castles to medieval monasteries, 
                Swords has been a center of community life for over a millennium, providing the perfect foundation for our modern football club.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission & Programs</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">⚽</span>
                    <div>
                      <strong>Boys Teams:</strong> Traditional football development across all age groups
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-3 mt-1">🌟</span>
                    <div>
                      <strong>New Girls Section:</strong> Expanding opportunities for female players of all ages
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1">🤝</span>
                    <div>
                      <strong>Football for All:</strong> Inclusive programs for children with special needs
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1">👨‍👩‍👧‍👦</span>
                    <div>
                      <strong>Community Programs:</strong> Walking Football, Ladies Fitness, and family activities
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-xl p-8 border border-green-200">
                <h3 className="text-2xl font-bold text-green-900 mb-4">Our Achievements</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-green-600">43+</div>
                    <div className="text-sm text-gray-600">Years Serving Community</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-blue-600">500+</div>
                    <div className="text-sm text-gray-600">Players Developed</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-purple-600">15+</div>
                    <div className="text-sm text-gray-600">Active Teams</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-2xl font-bold text-orange-600">30+</div>
                    <div className="text-sm text-gray-600">Volunteer Coaches</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-800 text-center font-medium">
                    "Football for All - Developing players, building character, strengthening community" 
                    <br />- Club Mission Since 1981
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </StandardLayout>
  );
}
