import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MobileHomePage() {
  // Marketing + Coaching Tools - Two purposes, one entry
  const keyActions = [
    { href: "/matchday", title: "MatchDay", subtitle: "Public fixtures & results", icon: "⚽", color: "bg-green-50 border-green-200 text-green-800" },
    { href: "/join/trials", title: "Join Club", subtitle: "Book a trial today", icon: "🎯", color: "bg-blue-50 border-blue-200 text-blue-800" },
    { href: "/teams", title: "Our Teams", subtitle: "All squads & age groups", icon: "👥", color: "bg-purple-50 border-purple-200 text-purple-800" },
    { href: "/contact", title: "Contact", subtitle: "Get in touch", icon: "📞", color: "bg-orange-50 border-orange-200 text-orange-800" }
  ];

  return (
    <div className="pb-4">
      {/* Primary Hero Section - Full Focus */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src="/images/hero/halftime2.jpg" 
          alt="Rivervalley Rangers AFC"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h1 className="text-lg font-bold">Rivervalley Rangers AFC</h1>
          <p className="text-sm text-gray-200">Est. 1981 • Dublin 15</p>
        </div>
      </div>

      {/* Key Action Boxes - Marketing & Coaching Tools */}
      <section className="px-4 py-6">        
        <div className="grid grid-cols-2 gap-3">
          {keyActions.map((action, index) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link
                href={action.href}
                className={`block p-4 rounded-lg border transition-all hover:shadow-md ${action.color}`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-600">{action.subtitle}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}