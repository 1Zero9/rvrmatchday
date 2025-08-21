/**
 * Developer Credits Component
 * 
 * © 2025 OneZeroNine - Premium Football Club Website Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * This component provides branding and copyright information
 * for the premium football club website template system.
 */

import { motion } from 'framer-motion';
import { GlassCard } from './Glass';

interface DeveloperCreditsProps {
  variant?: 'full' | 'minimal' | 'footer';
  className?: string;
}

export default function DeveloperCredits({ 
  variant = 'minimal', 
  className = '' 
}: DeveloperCreditsProps) {
  
  if (variant === 'footer') {
    return (
      <div className={`text-center text-gray-400 text-xs border-t border-gray-700 pt-4 mt-8 ${className}`}>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
          <span>© 2025 OneZeroNine Premium Template</span>
          <span className="hidden sm:inline">•</span>
          <span>Built with Claude AI</span>
          <span className="hidden sm:inline">•</span>
          <a 
            href="mailto:onezeronine@gmail.com" 
            className="hover:text-gray-300 transition-colors"
          >
            onezeronine@gmail.com
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <GlassCard 
            intensity="medium" 
            className="px-3 py-2 cursor-help group"
          >
            <div className="flex items-center space-x-2 text-white text-xs">
              <span className="text-blue-400">⚡</span>
              <span className="font-medium">OneZeroNine</span>
              
              {/* Expanded tooltip on hover */}
              <div className="absolute bottom-full right-0 mb-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <GlassCard intensity="heavy" className="p-3 text-xs">
                  <div className="text-white">
                    <div className="font-bold text-blue-400 mb-1">⚡ OneZeroNine Template</div>
                    <div className="mb-1">Premium Football Club Website</div>
                    <div className="text-gray-300 text-xs">
                      Built by OneZeroNine × Claude AI
                    </div>
                    <div className="text-blue-300 text-xs mt-1">
                      onezeronine@gmail.com
                    </div>
                  </div>
                  <div className="absolute top-full right-4 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-white/20"></div>
                </GlassCard>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <motion.div 
        className={`bg-gradient-to-r from-blue-900 to-purple-900 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-8 text-center text-white">
          <GlassCard intensity="medium" className="p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold mb-2 text-blue-300">OneZeroNine Premium Template</h3>
            <p className="text-lg mb-4">Modern Glass Morphism Football Club Website</p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">🏗️</span>
                <span>Developed by OneZeroNine</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">🤖</span>
                <span>AI Collaboration with Claude</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">📧</span>
                <a 
                  href="mailto:onezeronine@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  onezeronine@gmail.com
                </a>
              </div>
            </div>
            
            <div className="mt-6 text-xs text-gray-400">
              © 2025 OneZeroNine. This premium template features cutting-edge glass morphism design,
              <br />built specifically for football clubs seeking a modern, professional web presence.
            </div>
          </GlassCard>
        </div>
      </motion.div>
    );
  }

  return null;
}

/**
 * Copyright Notice Component for Page Headers
 */
export function CopyrightNotice() {
  return (
    <div className="text-xs text-gray-500 opacity-75">
      {/* 
      ================================================================
      © 2025 OneZeroNine Premium Football Club Template
      Developer: OneZeroNine (onezeronine@gmail.com)
      AI Collaboration: Claude (Anthropic)
      ================================================================
      */}
    </div>
  );
}