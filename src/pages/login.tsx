import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";

export default function ConsolidatedLogin() {
  const loginTypes = [
    {
      id: 'parent',
      title: '👨‍👩‍👧‍👦 Parent Portal',
      description: 'Access your child\'s team information, match schedules, and club updates',
      features: [
        'View your child\'s team fixtures and results',
        'Access match locations and kick-off times',
        'Receive important club communications',
        'Update contact details and emergency info'
      ],
      color: 'from-blue-600 to-blue-700',
      href: '/members/login',
      cta: 'Parent Login',
      icon: '👨‍👩‍👧‍👦'
    },
    {
      id: 'coach',
      title: '⚽ Coach Dashboard',
      description: 'Manage your teams, log match results, and coordinate training sessions',
      features: [
        'Log match results and player attendance',
        'Manage team rosters and player details',
        'Schedule training sessions and events',
        'Communicate with parents and players'
      ],
      color: 'from-green-600 to-green-700',
      href: '/coach/login',
      cta: 'Coach Login',
      icon: '⚽'
    },
    {
      id: 'admin',
      title: '🔐 Administration',
      description: 'Site administration and club management (authorized personnel only)',
      features: [
        'Manage user accounts and permissions',
        'Oversee coach applications and approvals',
        'Maintain club content and news',
        'Access system analytics and reports'
      ],
      color: 'from-red-600 to-red-700',
      href: '/admin/login',
      cta: 'Admin Access',
      icon: '🔐',
      restricted: true
    }
  ];

  return (
    <Layout currentSection="public">
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Image 
                src="/images/logo.png" 
                alt="Rivervalley Rangers AFC Logo" 
                width={80}
                height={80}
                className="drop-shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to Rivervalley Rangers
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Choose your login type below. Each portal is designed for specific users with different access levels and features.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {loginTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                  
                  <div className={`bg-gradient-to-r ${type.color} px-6 py-8 text-center text-white relative`}>
                    {type.restricted && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-semibold">
                        RESTRICTED
                      </div>
                    )}
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {type.icon}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{type.title}</h2>
                    <p className="text-blue-100 text-sm">{type.description}</p>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">What you can do:</h3>
                    <ul className="space-y-2 mb-6">
                      {type.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                          <span className="text-green-500 mr-2 mt-0.5">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link href={type.href}>
                      <button className={`w-full bg-gradient-to-r ${type.color} text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200`}>
                        {type.cta}
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="mr-2">❓</span>
                  Need Help?
                </h3>
                <ul className="space-y-2 text-blue-100">
                  <li><strong>New to the club?</strong> Use the Parent Portal to register and access your family&apos;s information.</li>
                  <li><strong>Coaching a team?</strong> The Coach Dashboard lets you manage everything related to your teams.</li>
                  <li><strong>Forgot your login?</strong> Each portal has a password reset option on the login page.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <span className="mr-2">🔒</span>
                  Security & Privacy
                </h3>
                <ul className="space-y-2 text-blue-100">
                  <li>All portals use secure authentication</li>
                  <li>Your personal data is protected and never shared</li>
                  <li>Admin access is strictly controlled and monitored</li>
                  <li>Contact us if you notice any suspicious activity</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center mt-8"
          >
            <Link 
              href="/"
              className="text-white/80 hover:text-white text-sm transition-colors"
            >
              ← Back to Homepage
            </Link>
          </motion.div>

        </div>
      </div>
    </Layout>
  );
}