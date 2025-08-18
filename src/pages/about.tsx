import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <Layout currentSection="public">
      <div className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-display text-gray-900 mb-6">
              About Rivervalley Rangers AFC
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Building community through football since 2009. We&apos;re more than just a club – 
              we&apos;re a family dedicated to developing players, building character, and creating 
              lasting memories on and off the pitch.
            </p>
          </motion.div>

          {/* Values Grid */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
                <p className="text-gray-700">
                  We believe football brings people together. Our club is built on strong 
                  community bonds and mutual support.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Development</h3>
                <p className="text-gray-700">
                  Every player&apos;s journey is unique. We focus on individual growth, 
                  skill development, and personal achievement.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-700">
                  We strive for excellence in everything we do, from training quality 
                  to community engagement and player care.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-primary-800 rounded-lg p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8">By the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
              <div>
                <div className="text-3xl font-bold mb-2">150+</div>
                <div className="text-primary-200">Active Players</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">12</div>
                <div className="text-primary-200">Teams</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">25+</div>
                <div className="text-primary-200">Qualified Coaches</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">15</div>
                <div className="text-primary-200">Years of Excellence</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
