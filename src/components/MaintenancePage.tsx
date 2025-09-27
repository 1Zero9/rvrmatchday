/**
 * Maintenance Page Component
 * Displayed when a specific page is under maintenance
 */

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface MaintenancePageProps {
  pageName: string;
  reason?: string;
  expectedDuration?: string;
  lastUpdated?: string;
}

export default function MaintenancePage({ 
  pageName, 
  reason = "We're making improvements to enhance your experience", 
  expectedDuration,
  lastUpdated 
}: MaintenancePageProps) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url('/images/hero/astro-ward.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <span className="text-4xl">🚧</span>
          </motion.div>
          
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Page Under Maintenance
          </motion.h1>
          
          {/* Page Name */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-orange-600 font-semibold mb-6"
          >
            {pageName}
          </motion.p>
          
          {/* Reason */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 rounded-2xl p-6 mb-8"
          >
            <h2 className="font-semibold text-gray-900 mb-3">What's happening?</h2>
            <p className="text-gray-700 leading-relaxed">{reason}</p>
          </motion.div>
          
          {/* Additional Info */}
          {(expectedDuration || lastUpdated) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
              {expectedDuration && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-2xl">⏰</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Expected Duration</h3>
                  <p className="text-sm text-gray-600">{expectedDuration}</p>
                </div>
              )}
              
              {lastUpdated && (
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Last Updated</h3>
                  <p className="text-sm text-gray-600">{new Date(lastUpdated).toLocaleString()}</p>
                </div>
              )}
            </motion.div>
          )}
          
          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/home">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                🏠 Return to Homepage
              </button>
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🔄 Try Again
            </button>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-6 border-t border-gray-200"
          >
            <p className="text-sm text-gray-600 mb-3">
              Need immediate assistance?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 transition-colors">
                📧 Contact Us
              </Link>
              <a href="tel:+353-1-234-5678" className="text-blue-600 hover:text-blue-800 transition-colors">
                📞 Call Club
              </a>
              <a href="mailto:info@rivervalleyrangers.ie" className="text-blue-600 hover:text-blue-800 transition-colors">
                ✉️ Email Support
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-8 h-8 bg-orange-400/20 rounded-full"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            x: [0, -80, 0],
            y: [0, 60, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-3/4 right-1/4 w-6 h-6 bg-blue-400/20 rounded-full"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 right-1/3 w-4 h-4 bg-purple-400/30 rounded-full"
        />
      </div>
    </div>
  );
}

// Hook for checking if page is under maintenance
export function usePageMaintenance(pagePath: string) {
  const [isUnderMaintenance, setIsUnderMaintenance] = React.useState(false);
  const [maintenanceInfo, setMaintenanceInfo] = React.useState<{
    reason?: string;
    disabled_at?: string;
    disabled_by?: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkMaintenanceStatus();
  }, [pagePath]);

  const checkMaintenanceStatus = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from database first
      const response = await fetch(`/api/maintenance/check?path=${encodeURIComponent(pagePath)}`);
      
      if (response.ok) {
        const data = await response.json();
        setIsUnderMaintenance(!data.is_enabled);
        setMaintenanceInfo({
          reason: data.maintenance_reason,
          disabled_at: data.disabled_at,
          disabled_by: data.disabled_by
        });
      } else {
        // Fallback: check localStorage for demo mode
        const maintenanceData = localStorage.getItem('page_maintenance_demo');
        if (maintenanceData) {
          const pages = JSON.parse(maintenanceData);
          const page = pages.find((p: any) => p.path === pagePath);
          if (page) {
            setIsUnderMaintenance(!page.is_enabled);
            setMaintenanceInfo({
              reason: page.maintenance_reason,
              disabled_at: page.disabled_at,
              disabled_by: page.disabled_by
            });
          }
        }
      }
    } catch (error) {
      console.error('Error checking maintenance status:', error);
      // Default to enabled if there's an error
      setIsUnderMaintenance(false);
    } finally {
      setLoading(false);
    }
  };

  return { isUnderMaintenance, maintenanceInfo, loading, refresh: checkMaintenanceStatus };
}