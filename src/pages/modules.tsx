/**
 * 🏗️ MODULES SHOWCASE PAGE
 * Business product modules and pricing
 * 
 * Demonstrates the modular architecture and business model
 */

import { motion } from 'framer-motion';
import Link from 'next/link';
import StandardLayout from '../components/StandardLayout';
import MobileLayout from '../components/MobileLayout';
// import { MobileHero, ActionCard } from '../design/MobileDesignSystem';
import { PRODUCT_MODULES, SUBSCRIPTION_TIERS, calculateRevenue } from '../lib/modules';

export default function ModulesPage() {
  // Demo revenue calculation
  const revenueProjection = calculateRevenue(100, {
    starter: 40,
    professional: 35,
    enterprise: 5
  });

  const moduleCards = Object.values(PRODUCT_MODULES);
  const subscriptionTiers = Object.values(SUBSCRIPTION_TIERS);

  return (
    <div>
      {/* Mobile Version */}
      <div className="block md:hidden">
        <MobileLayout
          currentPage="/modules"
          clubData={{
            name: "RVR Platform",
            logo: "/images/logo.png",
            established: "2025",
            colors: {
              primary: "#dc2626",
              secondary: "#1e40af"
            }
          }}
        >
          <div className="pb-20">
            {/* Hero */}
            <div className="h-64 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white mb-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">RVR Platform Modules</h1>
                <p className="text-sm opacity-90">Modular football club solutions</p>
              </div>
            </div>

            {/* Module Overview */}
            <section className="px-4 py-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">
                  Choose Your Modules
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {moduleCards.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (index * 0.1), duration: 0.4 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900">{module.name}</h3>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">€{module.price.monthly}</div>
                          <div className="text-xs text-gray-500">/month</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                      <div className="space-y-2">
                        {module.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                        {module.features.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{module.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Subscription Tiers */}
            <section className="px-4 py-8 bg-gray-50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">
                  Subscription Plans
                </h2>
                <div className="space-y-4">
                  {subscriptionTiers.map((tier, index) => (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (index * 0.1), duration: 0.4 }}
                      className={`bg-white rounded-xl p-6 border-2 ${
                        tier.id === 'professional' 
                          ? 'border-blue-500 shadow-lg' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{tier.name}</h3>
                          {tier.id === 'professional' && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                              Most Popular
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-2xl text-gray-900">€{tier.price.monthly}</div>
                          <div className="text-xs text-gray-500">/month</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                      <div className="text-sm text-blue-600 font-medium">
                        Includes: {tier.modules.map(m => PRODUCT_MODULES[m]?.name).join(', ')}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>
          </div>
        </MobileLayout>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block">
        <StandardLayout currentPage="/modules">
          <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4">
              <div className="max-w-7xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-5xl font-bold text-white mb-6">
                    RVR Football Platform
                  </h1>
                  <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                    Modular business solution for football clubs. Choose exactly what you need,
                    scale as you grow. From mobile marketing to advanced analytics.
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div>
                        <div className="text-3xl font-bold text-blue-400 mb-2">€{revenueProjection.monthly.toLocaleString()}</div>
                        <div className="text-sm text-gray-300">Monthly Revenue (100 clubs)</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-green-400 mb-2">{moduleCards.length}</div>
                        <div className="text-sm text-gray-300">Product Modules</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-purple-400 mb-2">{subscriptionTiers.length}</div>
                        <div className="text-sm text-gray-300">Subscription Tiers</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Product Modules */}
            <section className="py-16 px-4">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-bold text-white mb-4">Product Modules</h2>
                  <p className="text-xl text-gray-300">Mix and match to create the perfect solution for your club</p>
                </motion.div>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
                  {moduleCards.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (index * 0.1), duration: 0.6 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white">{module.name}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          module.category === 'core' 
                            ? 'bg-blue-500 text-white'
                            : module.category === 'premium'
                            ? 'bg-purple-500 text-white'
                            : 'bg-orange-500 text-white'
                        }`}>
                          {module.category.toUpperCase()}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-6 leading-relaxed">{module.description}</p>
                      
                      <div className="mb-6">
                        <div className="text-3xl font-bold text-white mb-2">
                          €{module.price.monthly}
                          <span className="text-base font-normal text-gray-400">/month</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          €{module.price.annual}/year (save €{(module.price.monthly * 12) - module.price.annual})
                        </div>
                      </div>

                      <div className="space-y-3 mb-8">
                        {module.features.map((feature, i) => (
                          <div key={i} className="flex items-start text-sm text-gray-300">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      <button className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30">
                        Learn More
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Subscription Tiers */}
            <section className="py-16 px-4 bg-black/20">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-bold text-white mb-4">Subscription Plans</h2>
                  <p className="text-xl text-gray-300">Bundle modules and save on your monthly costs</p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {subscriptionTiers.map((tier, index) => (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 + (index * 0.1), duration: 0.6 }}
                      className={`rounded-xl p-8 border-2 transition-all duration-300 ${
                        tier.id === 'professional'
                          ? 'bg-gradient-to-b from-blue-600/20 to-purple-600/20 border-blue-400 shadow-2xl scale-105'
                          : 'bg-white/10 border-white/20 hover:bg-white/15'
                      }`}
                    >
                      {tier.id === 'professional' && (
                        <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white text-center py-2 px-4 rounded-lg text-sm font-bold mb-6">
                          MOST POPULAR
                        </div>
                      )}
                      
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                        <div className="text-4xl font-bold text-white mb-2">
                          €{tier.price.monthly}
                          <span className="text-base font-normal text-gray-400">/month</span>
                        </div>
                        <p className="text-gray-300">{tier.description}</p>
                      </div>

                      <div className="space-y-3 mb-8">
                        {tier.features.map((feature, i) => (
                          <div key={i} className="flex items-start text-sm text-gray-300">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      <div className="mb-8">
                        <div className="text-sm text-gray-400 mb-2">Included Modules:</div>
                        <div className="flex flex-wrap gap-2">
                          {tier.modules.map(moduleId => (
                            <span key={moduleId} className="bg-white/20 text-white text-xs px-2 py-1 rounded">
                              {PRODUCT_MODULES[moduleId]?.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 ${
                        tier.id === 'professional'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                          : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30'
                      }`}>
                        {tier.id === 'enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20"
                >
                  <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Club?</h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Join the growing number of clubs using RVR Platform to engage fans, 
                    manage operations, and grow their community.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/contact"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      Start Free Trial
                    </Link>
                    <Link
                      href="/contact"
                      className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30"
                    >
                      Schedule Demo
                    </Link>
                  </div>
                </motion.div>
              </div>
            </section>

          </div>
        </StandardLayout>
      </div>
    </div>
  );
}