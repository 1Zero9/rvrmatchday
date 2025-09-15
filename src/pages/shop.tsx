/**
 * Shop Page - Club Merchandise & Kit
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Shop page converted to glass morphism design system.
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import GlassPageTemplate from '../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../components/Glass';

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const quickActions = [
    {
      icon: "🏪",
      title: "Official Store",
      description: "Shop authentic RVR merchandise",
      href: "https://www.balondirect.com/product-category/rivervalley-rangers",
      gradient: "orange" as const,
      external: true
    },
    {
      icon: "👕",
      title: "Match Kit",
      description: "Official home & away jerseys",
      href: "https://www.balondirect.com/product-category/rivervalley-rangers",
      gradient: "blue" as const,
      external: true
    },
    {
      icon: "🏃",
      title: "Training Gear",
      description: "Polos, tracksuits & equipment",
      href: "https://www.balondirect.com/product-category/rivervalley-rangers",
      gradient: "green" as const,
      external: true
    },
    {
      icon: "🎁",
      title: "Club Gifts",
      description: "Bags, scarves & accessories",
      href: "https://www.balondirect.com/product-category/rivervalley-rangers",
      gradient: "purple" as const,
      external: true
    }
  ];

  const categories = ['All', 'Kit & Clothing', 'Training Gear', 'Accessories', 'Gifts'];

  const products = [
    {
      id: 1,
      name: 'Home Jersey 2024/25',
      category: 'Kit & Clothing',
      price: '€65.00',
      image: '/api/placeholder/300/300',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      popular: true,
      description: 'Official home jersey for the 2024/25 season'
    },
    {
      id: 2,
      name: 'Away Jersey 2024/25',
      category: 'Kit & Clothing',
      price: '€65.00',
      image: '/api/placeholder/300/300',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      popular: true,
      description: 'Official away jersey for the 2024/25 season'
    },
    {
      id: 3,
      name: 'Training Polo Shirt',
      category: 'Training Gear',
      price: '€35.00',
      image: '/api/placeholder/300/300',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      popular: false,
      description: 'Comfortable polo shirt for training and casual wear'
    },
    {
      id: 4,
      name: 'Club Tracksuit',
      category: 'Training Gear',
      price: '€95.00',
      image: '/api/placeholder/300/300',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      popular: false,
      description: 'Full tracksuit with jacket and pants'
    },
    {
      id: 5,
      name: 'Club Scarf',
      category: 'Accessories',
      price: '€18.00',
      image: '/api/placeholder/300/300',
      sizes: ['One Size'],
      popular: false,
      description: 'Classic club scarf in team colors'
    },
    {
      id: 6,
      name: 'Sports Bag',
      category: 'Accessories',
      price: '€45.00',
      image: '/api/placeholder/300/300',
      sizes: ['One Size'],
      popular: true,
      description: 'Large sports bag with club logo'
    }
  ];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <GlassPageTemplate
      heroTitle="Club Shop"
      heroSubtitle="Official Rivervalley Rangers merchandise, kit, and training gear"
      heroIcon="🛒"
      backgroundImage="https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
      quickActions={quickActions}
      sectionName="SHOP"
      imageSpecs="1920x1080px minimum, merchandise and team kit preferred"
    >

      {/* Official Supplier Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <GlassCard intensity="high" className="overflow-hidden bg-gradient-to-br from-orange-500/90 to-red-600/90 text-white border-orange-300/50">
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🏪</div>
            <h2 className="text-3xl font-bold mb-4">Official Club Supplier</h2>
            <p className="text-xl mb-6 opacity-95">
              Shop authentic Rivervalley Rangers merchandise from our official partner
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30">
              <h3 className="text-2xl font-bold mb-2">Balon Direct</h3>
              <p className="text-white/90 mb-4">
                Your trusted supplier for all official RVR kit, training gear, and accessories
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-2xl mb-1">✅</div>
                  <p className="font-medium">Official Kit</p>
                </div>
                <div>
                  <div className="text-2xl mb-1">🚚</div>
                  <p className="font-medium">Fast Delivery</p>
                </div>
                <div>
                  <div className="text-2xl mb-1">💯</div>
                  <p className="font-medium">Quality Guaranteed</p>
                </div>
              </div>
            </div>
            <a
              href="https://www.balondirect.com/product-category/rivervalley-rangers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-orange-600 font-black py-4 px-8 rounded-2xl text-lg hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/30"
            >
              🛒 Shop Official Store
            </a>
          </div>
        </GlassCard>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">Shop Categories</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {selectedCategory === 'All' ? 'Product Showcase' : selectedCategory}
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">🛒</span>
              <span className="font-bold text-blue-800">Official Purchase Notice</span>
            </div>
            <p className="text-sm text-blue-700">
              All official RVR merchandise should be purchased through our official supplier <strong>Balon Direct</strong>. 
              The products below are for reference only.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
              whileHover={{ y: -5 }}
            >
              <GlassCard intensity="medium" className="overflow-hidden bg-gradient-to-br from-white/80 to-gray-50/80 h-full">
                {product.popular && (
                  <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 absolute top-4 left-4 rounded-full z-10">
                    Popular
                  </div>
                )}
                
                {/* 
                ===================================================================
                🛒 PRODUCT IMAGE REPLACEMENT INSTRUCTIONS
                ===================================================================
                
                TO ADD PRODUCT IMAGES:
                1. Save your image as: /public/images/shop/product-name.jpg
                2. Replace the placeholder div with an img element
                
                BEST PRODUCT IMAGES:
                - High-quality photos of actual merchandise
                - Clean white or transparent backgrounds
                - Multiple angles for complex items
                - Lifestyle shots showing products in use
                
                IMAGE SPECS: 600x600px minimum, square format preferred
                ===================================================================
                */}
                <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">👕</div>
                    <p className="text-sm font-bold text-gray-700">PRODUCT PHOTO</p>
                    <p className="text-xs text-gray-600">Replace with actual image</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-green-600">{product.price}</span>
                    <span className="text-gray-500 text-sm">{product.category}</span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Available Sizes:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <a
                    href="https://www.balondirect.com/product-category/rivervalley-rangers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-300 text-center"
                  >
                    🛒 Shop at Balon Direct
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Shop Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 rounded-2xl p-8 text-center text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Shop Information</h2>
        <p className="text-xl mb-8 opacity-90">
          Support your club while looking great in official Rivervalley Rangers gear
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div>
            <div className="text-3xl mb-2">🚚</div>
            <h3 className="font-bold mb-2">Free Delivery</h3>
            <p className="text-sm opacity-90">Free delivery on orders over €50</p>
          </div>
          <div>
            <div className="text-3xl mb-2">↩️</div>
            <h3 className="font-bold mb-2">Easy Returns</h3>
            <p className="text-sm opacity-90">30-day return policy on all items</p>
          </div>
          <div>
            <div className="text-3xl mb-2">💯</div>
            <h3 className="font-bold mb-2">Quality Guaranteed</h3>
            <p className="text-sm opacity-90">Official merchandise with club guarantee</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <GlassActionCard
            icon="📞"
            title="Need Help?"
            description="Contact our shop team"
            href="/contact"
            gradient="blue"
            size="lg"
          />
          <GlassActionCard
            icon="📍"
            title="Collect in Person"
            description="Pick up from the clubhouse"
            href="/club/facilities"
            gradient="green"
            size="lg"
          />
        </div>
      </motion.div>

    </GlassPageTemplate>
  );
}