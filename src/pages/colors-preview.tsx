/**
 * Color Palette Preview Page
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Preview page for new club color palette
 */

import { motion } from 'framer-motion';
import StandardLayout from '../components/StandardLayout';
import { GlassCard, GlassActionCard } from '../components/Glass';

export default function ColorsPreview() {
  const colorPalette = [
    {
      name: 'Club Primary',
      hex: '#972A4C',
      rgb: 'rgb(151, 42, 76)',
      description: 'Burgundy/Maroon - Main brand color',
      usage: 'Primary buttons, headers, key elements'
    },
    {
      name: 'Club Secondary', 
      hex: '#5E7794',
      rgb: 'rgb(94, 119, 148)',
      description: 'Muted Blue-Gray - Supporting color',
      usage: 'Secondary buttons, navigation, backgrounds'
    },
    {
      name: 'Club Accent',
      hex: '#98C0F0', 
      rgb: 'rgb(152, 192, 240)',
      description: 'Light Blue - Accent color',
      usage: 'Highlights, links, call-to-actions'
    },
    {
      name: 'Club Neutral',
      hex: '#B6B7B6',
      rgb: 'rgb(182, 183, 182)', 
      description: 'Light Gray - Neutral tone',
      usage: 'Text, borders, subtle backgrounds'
    }
  ];

  const complementaryColors = [
    { name: 'Success', hex: '#2D7A4C', description: 'Complements burgundy' },
    { name: 'Warning', hex: '#F59E0B', description: 'Complements blue-gray' },
    { name: 'Error', hex: '#DC2626', description: 'Complements light blue' }
  ];

  return (
    <StandardLayout title="Color Palette Preview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🎨</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">New Club Color Palette</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Updated brand colors for RVRFC with complementary UX palette for better user experience
          </p>
        </motion.div>

        {/* Main Palette */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Main Club Colors</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {colorPalette.map((color, index) => (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div 
                  className="h-32 w-full relative"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white text-shadow">
                      <div className="text-2xl font-bold">{color.name}</div>
                      <div className="text-sm opacity-90">{color.hex}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{color.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{color.description}</p>
                  <p className="text-xs text-gray-500 mb-3">{color.rgb}</p>
                  <div className="text-xs text-gray-400">
                    <strong>Usage:</strong> {color.usage}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Navigation Preview</h2>
          <div className="gradient-hero text-white rounded-2xl p-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-6 py-3 rounded-lg hover:bg-club-primary-light transition-colors">🏠 Home</button>
              <button className="px-6 py-3 rounded-lg hover:bg-club-secondary-light transition-colors">🏛️ About</button>
              <button className="px-6 py-3 rounded-lg hover:bg-club-accent-dark transition-colors">👥 Teams</button>
              <button className="px-6 py-3 rounded-lg hover:bg-club-primary-dark transition-colors">⚽ Matches</button>
              <button className="px-6 py-3 rounded-lg hover:bg-club-neutral-dark transition-colors">📞 Contact</button>
            </div>
          </div>
        </motion.div>

        {/* Glass Cards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Glass Morphism Cards</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <GlassActionCard
              icon="⚽"
              title="Primary Action"
              description="Using club primary color"
              gradient="club-primary"
              size="lg"
            />
            <GlassActionCard
              icon="🏟️"
              title="Secondary Action"
              description="Using club secondary color"
              gradient="club-secondary"
              size="lg"
            />
            <GlassActionCard
              icon="🌟"
              title="Accent Action"
              description="Using club accent color"
              gradient="club-accent"
              size="lg"
            />
          </div>
        </motion.div>

        {/* Button Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Button Styles</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button className="bg-club-primary text-white px-6 py-3 rounded-lg hover:bg-club-primary-light transition-colors font-semibold">
                Primary Button
              </button>
              <button className="bg-club-secondary text-white px-6 py-3 rounded-lg hover:bg-club-secondary-light transition-colors font-semibold">
                Secondary Button
              </button>
              <button className="bg-club-accent text-gray-900 px-6 py-3 rounded-lg hover:bg-club-accent-dark transition-colors font-semibold">
                Accent Button
              </button>
              <button className="bg-club-neutral text-gray-900 px-6 py-3 rounded-lg hover:bg-club-neutral-dark transition-colors font-semibold">
                Neutral Button
              </button>
            </div>
          </div>
        </motion.div>

        {/* Complementary Colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Complementary UX Colors</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {complementaryColors.map((color, index) => (
              <div key={color.name} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div 
                  className="h-20 w-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: color.hex }}
                >
                  {color.name}
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-600">{color.hex}</div>
                  <div className="text-xs text-gray-500 mt-1">{color.description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Color Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">UX Analysis</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-club-primary mb-4">✅ Strengths</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Professional, mature color palette</li>
                <li>• Good contrast ratios for accessibility</li>
                <li>• Burgundy creates strong brand identity</li>
                <li>• Light blue provides good accent contrast</li>
                <li>• Neutral gray offers flexibility</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-club-secondary mb-4">⚠️ Considerations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Secondary blue-gray quite dark - lightened for mobile</li>
                <li>• Need complementary colors for full UX palette</li>
                <li>• Glass morphism works well with these tones</li>
                <li>• Burgundy works well for primary actions</li>
                <li>• Consider lighter variants for backgrounds</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-club-primary text-white rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Ready to Implement</h3>
            <p className="mb-6">
              The color palette is now active across navigation and key components. 
              Ready for full site rollout!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/home" className="bg-white text-club-primary px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                View Home Page
              </a>
              <a href="/contact" className="bg-club-accent text-gray-900 px-6 py-3 rounded-lg hover:bg-club-accent-light transition-colors font-semibold">
                View Contact Page
              </a>
              <a href="/admin" className="bg-club-secondary text-white px-6 py-3 rounded-lg hover:bg-club-secondary-light transition-colors font-semibold">
                Admin Dashboard
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </StandardLayout>
  );
}