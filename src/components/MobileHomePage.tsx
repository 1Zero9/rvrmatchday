import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MobileHomePage() {
  const quickActions = [
    { href: "/matchday", title: "Match Day", subtitle: "Today's fixtures & results", icon: "⚽", color: "bg-green-50 border-green-200 text-green-800" },
    { href: "/teams", title: "Our Teams", subtitle: "All age groups & squads", icon: "👥", color: "bg-blue-50 border-blue-200 text-blue-800" },
    { href: "/join/trials", title: "Book a Trial", subtitle: "Join our club today", icon: "🎯", color: "bg-red-50 border-red-200 text-red-800" },
    { href: "/about", title: "About Club", subtitle: "Our history & values", icon: "🏛️", color: "bg-purple-50 border-purple-200 text-purple-800" },
    { href: "/contact", title: "Contact Us", subtitle: "Get in touch", icon: "📞", color: "bg-orange-50 border-orange-200 text-orange-800" }
  ];

  const latestNews = [
    { title: "U12 Team Wins Local Tournament", date: "Mar 15", summary: "Fantastic performance by our young players" },
    { title: "New Training Facilities Opening", date: "Mar 12", summary: "State-of-the-art pitches now available" },
    { title: "Registration Open for New Season", date: "Mar 10", summary: "Join us for the 2025 season" }
  ];

  return (
    <div className="pb-8">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src="/images/hero/halftime2.jpg" 
          alt="Rivervalley Rangers AFC"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex items-end justify-center pb-8">
          <div className="text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-2xl font-bold mb-2">Welcome to RVR AFC</h1>
              <p className="text-blue-200">Building community through football since 1981</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        
        <div className="space-y-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link
                href={action.href}
                className={`block p-4 rounded-xl border transition-all hover:shadow-md ${action.color}`}
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{action.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.subtitle}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Latest News */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
          <Link href="/news" className="text-blue-600 text-sm font-medium">View All</Link>
        </div>
        
        <div className="space-y-3">
          {latestNews.map((news, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (index * 0.1), duration: 0.3 }}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 text-sm pr-2">{news.title}</h3>
                <span className="text-xs text-gray-500 whitespace-nowrap">{news.date}</span>
              </div>
              <p className="text-sm text-gray-600">{news.summary}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-6">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Ready to Join?</h2>
          <p className="text-red-100 mb-4 text-sm">Book a trial session with one of our teams today</p>
          <Link
            href="/join/trials"
            className="inline-block bg-white text-red-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Book Your Trial
          </Link>
        </div>
      </section>

      {/* Club Stats */}
      <section className="px-4 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Club at a Glance</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">18</div>
            <div className="text-sm text-gray-600">Teams</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">350+</div>
            <div className="text-sm text-gray-600">Players</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">40+</div>
            <div className="text-sm text-gray-600">Years</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">25</div>
            <div className="text-sm text-gray-600">Coaches</div>
          </div>
        </div>
      </section>
    </div>
  );
}