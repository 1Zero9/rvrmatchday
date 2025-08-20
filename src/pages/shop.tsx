import StandardLayout from '../components/StandardLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState('All');

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
      description: 'Show your support with our official club scarf'
    },
    {
      id: 6,
      name: 'Training Football',
      category: 'Training Gear',
      price: '€25.00',
      image: '/api/placeholder/300/300',
      sizes: ['Size 5'],
      popular: false,
      description: 'Official training football with club logo'
    },
    {
      id: 7,
      name: 'Club Water Bottle',
      category: 'Accessories',
      price: '€12.00',
      image: '/api/placeholder/300/300',
      sizes: ['750ml'],
      popular: false,
      description: 'Stainless steel water bottle with club crest'
    },
    {
      id: 8,
      name: 'Club Mug',
      category: 'Gifts',
      price: '€15.00',
      image: '/api/placeholder/300/300',
      sizes: ['Standard'],
      popular: false,
      description: 'Ceramic mug with club logo - perfect gift'
    },
    {
      id: 9,
      name: 'Training Shorts',
      category: 'Training Gear',
      price: '€28.00',
      image: '/api/placeholder/300/300',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      popular: false,
      description: 'Official training shorts with club badge'
    }
  ];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <StandardLayout title="Club Shop">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="text-6xl mb-6">🛍️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Club Shop</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Show your support with official Rivervalley Rangers AFC merchandise and equipment
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-8"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Featured Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 mb-8 text-white"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">New Season Kit Available Now!</h2>
                  <p className="text-blue-100 mb-4">Get your official 2024/25 home and away jerseys with free name printing</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded text-sm">Free Delivery over €50</span>
                    <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded text-sm">Free Name Printing</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Shop Jerseys
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 4) }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative">
                    <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                      <div className="text-4xl">👕</div>
                    </div>
                    {product.popular && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Popular
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity"></div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {product.category}
                      </span>
                      <span className="text-lg font-bold text-blue-600">{product.price}</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Available sizes:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((size, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            
            {/* Shopping Cart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shopping Cart</h3>
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🛒</div>
                <p className="text-gray-500 text-sm">Your cart is empty</p>
                <button className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-800">
                  Continue Shopping
                </button>
              </div>
            </motion.div>

            {/* Delivery Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Free Delivery</p>
                    <p className="text-gray-600">On orders over €50</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Fast Processing</p>
                    <p className="text-gray-600">2-3 business days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-purple-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Secure Payment</p>
                    <p className="text-gray-600">PayPal & card accepted</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Size Guide */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Guide</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Size</th>
                      <th className="text-center py-2">Chest</th>
                      <th className="text-center py-2">Length</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr className="border-b">
                      <td className="py-1">XS</td>
                      <td className="text-center">86cm</td>
                      <td className="text-center">66cm</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1">S</td>
                      <td className="text-center">91cm</td>
                      <td className="text-center">69cm</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1">M</td>
                      <td className="text-center">96cm</td>
                      <td className="text-center">72cm</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-1">L</td>
                      <td className="text-center">101cm</td>
                      <td className="text-center">75cm</td>
                    </tr>
                    <tr>
                      <td className="py-1">XL</td>
                      <td className="text-center">106cm</td>
                      <td className="text-center">78cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Contact Shop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-blue-900">Shop Manager</p>
                  <p className="text-blue-700">Helen Murphy</p>
                  <p className="text-blue-600">shop@rvrfc.com</p>
                  <p className="text-blue-500">+353 1 123 4579</p>
                </div>
                <div className="pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-600">
                    Available for sizing help, custom orders, and bulk purchases
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </StandardLayout>
  );
}