/**
 * News & Media Hub - Main News Landing Page
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Central hub for news, events, and media with glass morphism design.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlassPageTemplate from '../../components/GlassPageTemplate';
import { GlassCard, GlassActionCard } from '../../components/Glass';

export default function NewsMediaIndex() {
  const quickActions = [
    {
      icon: "📰",
      title: "Latest News",
      description: "Club announcements & updates",
      href: "/news-media/events",
      gradient: "blue" as const
    },
    {
      icon: "📸",
      title: "Photo Gallery",
      description: "Match photos & memories",
      href: "/news-media/gallery",
      gradient: "purple" as const
    },
    {
      icon: "📅",
      title: "Events Calendar",
      description: "Upcoming club events",
      href: "/news-media/events",
      gradient: "green" as const
    },
    {
      icon: "📱",
      title: "Social Media",
      description: "Follow our channels",
      href: "#social-links",
      gradient: "orange" as const
    }
  ];

  const featuredNews = [
    {
      title: "U16 Boys Reach County Cup Final",
      excerpt: "Historic achievement as our U16 boys secure their place in the County Cup Final after a thrilling 3-2 victory...",
      date: "2025-01-21",
      category: "Match News",
      image: "/images/news/featured-story.jpg",
      href: "/news/u16-county-cup-final"
    },
    {
      title: "New Girls Teams Growing Fast",
      excerpt: "Over 50 girls have registered since the launch of our girls section in 2023, creating a vibrant new community...",
      date: "2025-01-20",
      category: "Community",
      image: "/images/news/girls-teams.jpg",
      href: "/news/girls-teams-growth"
    },
    {
      title: "Club Facilities Upgrade Complete",
      excerpt: "The major upgrade to our training facilities is now complete, providing better resources for all our teams...",
      date: "2025-01-19",
      category: "Club News",
      image: "/images/news/facilities-upgrade.jpg",
      href: "/news/facilities-upgrade"
    }
  ];

  const quickUpdates = [
    {
      title: "First Team Victory",
      text: "Rangers FC 2-1 Millbrook FC - Great performance on Saturday!",
      type: "result",
      color: "text-green-600"
    },
    {
      title: "Upcoming Match",
      text: "Rangers FC vs Oakwood United - Saturday 3pm at home",
      type: "fixture",
      color: "text-blue-600"
    },
    {
      title: "Training Update",
      text: "U14 training moved to Thursday this week due to pitch maintenance",
      type: "notice",
      color: "text-orange-600"
    },
    {
      title: "Registration Open",
      text: "Spring season registration now open for all age groups",
      type: "announcement",
      color: "text-purple-600"
    }
  ];

  return (
    <GlassPageTemplate
      heroTitle="News & Media"
      heroSubtitle="Stay connected with the latest club news, events, and community stories"
      heroIcon="📰"
      quickActions={quickActions}
      sectionName="NEWS"
      imageSpecs="1920x1080px minimum, news events and celebrations preferred"
    >
      
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Featured News */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Stories</h2>
            
            <div className="space-y-8">
              {featuredNews.map((article, index) => (
                <motion.div
                  key={article.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={article.href}>
                    <GlassCard 
                      intensity="medium" 
                      hover={true}
                      className="p-0 overflow-hidden cursor-pointer bg-gradient-to-br from-white/80 to-gray-50/80"
                    >
                      {/* 
                      ===================================================================
                      📰 NEWS ARTICLE IMAGE REPLACEMENT INSTRUCTIONS
                      ===================================================================
                      
                      TO ADD NEWS ARTICLE IMAGES:
                      1. Save your image as: /public/images/news/article-name.jpg
                      2. Update the image path in the article data above
                      
                      BEST NEWS IMAGES:
                      - Match action and celebration photos
                      - Community events and gatherings
                      - Award ceremonies and achievements
                      - Training sessions and club activities
                      
                      IMAGE SPECS: 800x400px minimum, landscape orientation
                      ===================================================================
                      */}
                      <div className="h-48 bg-gradient-to-r from-blue-600 to-green-600 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-4xl mb-2">📸</div>
                          <p className="text-sm font-bold">NEWS PHOTO PLACEHOLDER</p>
                          <p className="text-xs opacity-75">Replace with actual image</p>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center mb-3">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold mr-2">
                            {article.category}
                          </span>
                          <span className="text-gray-500 text-sm">{article.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                        <p className="text-gray-600 mb-4">{article.excerpt}</p>
                        <div className="text-blue-600 font-semibold">
                          Read Full Story →
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Updates */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Updates</h3>
              <div className="space-y-4">
                {quickUpdates.map((update, index) => (
                  <div key={index} className="border-l-4 border-gray-200 pl-4">
                    <h4 className={`font-semibold text-sm ${update.color}`}>
                      {update.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{update.text}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            id="social-links"
          >
            <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-blue-50/80 to-purple-50/80">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
              <div className="space-y-3">
                <a href="https://www.instagram.com/rvrfc1981/" className="block p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📸</span>
                    <div>
                      <div className="font-semibold">Instagram</div>
                      <div className="text-xs opacity-90">@rvrfc1981</div>
                    </div>
                  </div>
                </a>
                
                <a href="https://www.facebook.com/RVRFC/" className="block p-3 bg-blue-600 text-white rounded-lg hover:shadow-lg transition-all">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">👥</span>
                    <div>
                      <div className="font-semibold">Facebook - Main</div>
                      <div className="text-xs opacity-90">Club updates</div>
                    </div>
                  </div>
                </a>
                
                <a href="https://www.facebook.com/RVRSeniors/" className="block p-3 bg-green-600 text-white rounded-lg hover:shadow-lg transition-all">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🏆</span>
                    <div>
                      <div className="font-semibold">Facebook - Seniors</div>
                      <div className="text-xs opacity-90">Senior team news</div>
                    </div>
                  </div>
                </a>
              </div>
            </GlassCard>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-green-50/80 to-blue-50/80">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Stay Updated</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get the latest club news and updates delivered to your inbox.
              </p>
              <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Subscribe to Newsletter
              </button>
            </GlassCard>
          </motion.div>
        </div>
      </div>

    </GlassPageTemplate>
  );
}