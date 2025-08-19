import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ConsolidatedLogin() {
  const loginTypes = [
    {
      id: 'parent',
      title: '👨‍👩‍👧‍👦 Parent Portal',
      subtitle: 'Team info & schedules',
      description: 'Access your child\'s team information, match schedules, and club updates',
      features: [
        'View your child\'s team fixtures and results',
        'Access match locations and kick-off times', 
        'Receive important club communications',
        'Update contact details and emergency info'
      ],
      color: 'from-blue-600 to-cyan-700',
      href: '/members/login',
      cta: 'Parent Login',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      id: 'coach',
      title: '⚽ Coach Dashboard',
      subtitle: 'Team management & results',
      description: 'Manage your teams, log match results, and coordinate training sessions',
      features: [
        'Log match results and player attendance',
        'Manage team rosters and player details',
        'Schedule training sessions and events',
        'Communicate with parents and players'
      ],
      color: 'from-green-600 to-emerald-700',
      href: '/coach/login',
      cta: 'Coach Login',
      icon: '⚽'
    },
    {
      id: 'admin',
      title: '🔐 Administration',
      subtitle: 'Site admin & management',
      description: 'Site administration and club management (authorized personnel only)',
      features: [
        'Manage user accounts and permissions',
        'Oversee coach applications and approvals',
        'Maintain club content and news',
        'Access system analytics and reports'
      ],
      color: 'from-slate-600 to-slate-700',
      href: '/admin/login',
      cta: 'Admin Access',
      icon: '🔐',
      restricted: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Clean Geometric Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl translate-x-40"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl translate-y-36"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.15]" 
             style={{
               backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
               backgroundSize: '30px 30px'
             }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Top Navigation - Minimal */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center p-6"
        >
          <div className="flex items-center space-x-4">
            <Image 
              src="/images/logo.png" 
              alt="Rivervalley Rangers AFC Logo" 
              width={75}
              height={75}
              className="drop-shadow-lg"
            />
            <div className="text-white">
              <h1 className="text-xl font-bold">Member Area</h1>
              <p className="text-sm text-blue-200">Players, parents & coaches</p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex space-x-4 text-sm">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              ← Home
            </Link>
          </div>
        </motion.div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-6xl w-full">
            
            {/* Hero Title */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  Member Area
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Secure Access for Players, Parents & Coaches • Choose Your Portal
              </p>
            </motion.div>

            {/* Login Type Boxes Grid */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
              {loginTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.1) }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group"
                >
                  <Link href={type.href}>
                    <div className={`
                      bg-gradient-to-br ${type.color} 
                      rounded-3xl p-8 h-80
                      text-white shadow-2xl 
                      cursor-pointer 
                      border border-white/10
                      backdrop-blur-sm
                      relative overflow-hidden
                      transition-all duration-300
                      hover:shadow-3xl hover:border-white/30
                    `}>
                      {/* Restricted Badge */}
                      {type.restricted && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-semibold">
                          RESTRICTED
                        </div>
                      )}

                      {/* Background Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                            {type.icon}
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            {type.title}
                          </h3>
                          <p className="text-sm opacity-90 mb-4">
                            {type.subtitle}
                          </p>
                          <p className="text-xs opacity-70 mb-4">
                            {type.description}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs opacity-60 mb-3">Key Features:</div>
                          <ul className="space-y-1 mb-4">
                            {type.features.slice(0, 2).map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start text-xs opacity-80">
                                <span className="text-green-300 mr-1">•</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Hover Arrow */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Help & Security Info */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="grid md:grid-cols-2 gap-8"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-3">❓</span>
                  Need Help?
                </h3>
                <ul className="space-y-3 text-blue-100 text-sm">
                  <li><strong className="text-white">New to the club?</strong> Use the Parent Portal to register and access your family's information.</li>
                  <li><strong className="text-white">Coaching a team?</strong> The Coach Dashboard lets you manage everything related to your teams.</li>
                  <li><strong className="text-white">Forgot your login?</strong> Each portal has a password reset option on the login page.</li>
                </ul>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-3">🔒</span>
                  Security & Privacy
                </h3>
                <ul className="space-y-3 text-blue-100 text-sm">
                  <li>All portals use secure authentication</li>
                  <li>Your personal data is protected and never shared</li>
                  <li>Admin access is strictly controlled and monitored</li>
                  <li>Contact us if you notice any suspicious activity</li>
                </ul>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  );
}