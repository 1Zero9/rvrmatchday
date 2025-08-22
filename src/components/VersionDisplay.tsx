/**
 * Version Display Component
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Displays version information and build details for admin users.
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import { VERSION_CONFIG, getBuildInfo, formatVersion } from '../config/version';
import { GlassCard } from './Glass';

interface VersionDisplayProps {
  variant?: 'badge' | 'card' | 'detailed';
  showBuildInfo?: boolean;
  className?: string;
}

export default function VersionDisplay({ 
  variant = 'badge', 
  showBuildInfo = false,
  className = '' 
}: VersionDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const versionInfo = VERSION_CONFIG.current;
  const buildInfo = getBuildInfo();

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center space-x-1 ${className}`}>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-200">
          v{versionInfo.version}
        </span>
        {showBuildInfo && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full border border-gray-200">
            {versionInfo.buildNumber}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <GlassCard intensity="light" className={`p-4 ${className}`}>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">
              {formatVersion(versionInfo.version)}
            </h3>
            <p className="text-sm text-gray-600">{versionInfo.releaseDate}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            VERSION_CONFIG.release.type === 'major' 
              ? 'bg-red-100 text-red-800 border-red-200'
              : VERSION_CONFIG.release.type === 'minor'
              ? 'bg-blue-100 text-blue-800 border-blue-200'
              : 'bg-green-100 text-green-800 border-green-200'
          } border`}>
            {VERSION_CONFIG.release.type.toUpperCase()}
          </span>
        </div>
      </GlassCard>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Main Version Info */}
        <GlassCard intensity="medium" className="p-6 bg-gradient-to-br from-white/80 to-gray-50/80">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {formatVersion(versionInfo.version)}
              </h2>
              <p className="text-gray-600 mt-1">{versionInfo.releaseDate}</p>
            </div>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                VERSION_CONFIG.release.type === 'major' 
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : VERSION_CONFIG.release.type === 'minor'
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-green-100 text-green-800 border-green-200'
              }`}>
                {VERSION_CONFIG.release.type.toUpperCase()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                VERSION_CONFIG.release.impact === 'breaking'
                  ? 'bg-red-500 text-white'
                  : VERSION_CONFIG.release.impact === 'feature'
                  ? 'bg-green-500 text-white'
                  : VERSION_CONFIG.release.impact === 'improvement'
                  ? 'bg-blue-500 text-white'
                  : 'bg-yellow-500 text-white'
              }`}>
                {VERSION_CONFIG.release.impact.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {VERSION_CONFIG.metrics.filesChanged}
              </div>
              <div className="text-xs text-gray-600">Files Changed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                +{VERSION_CONFIG.metrics.linesAdded.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Lines Added</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {VERSION_CONFIG.metrics.pagesUpdated}
              </div>
              <div className="text-xs text-gray-600">Pages Updated</div>
            </div>
          </div>

          {/* Toggle Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {showDetails ? 'Hide Details' : 'Show Technical Details'}
          </button>
        </GlassCard>

        {/* Technical Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Build Information */}
            <GlassCard intensity="light" className="p-4 bg-gradient-to-br from-blue-50/80 to-gray-50/80">
              <h3 className="font-semibold text-gray-900 mb-3">Build Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Build Number:</span>
                  <span className="ml-2 font-mono">{buildInfo.buildNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600">Environment:</span>
                  <span className="ml-2 font-medium capitalize">{buildInfo.environment}</span>
                </div>
                <div>
                  <span className="text-gray-600">Deployed:</span>
                  <span className="ml-2">{new Date(buildInfo.deployedAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Stability:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    VERSION_CONFIG.release.stability === 'stable'
                      ? 'bg-green-100 text-green-800'
                      : VERSION_CONFIG.release.stability === 'beta'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {VERSION_CONFIG.release.stability}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Technical Stack */}
            <GlassCard intensity="light" className="p-4 bg-gradient-to-br from-green-50/80 to-gray-50/80">
              <h3 className="font-semibold text-gray-900 mb-3">Technical Stack</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Framework:</span>
                  <span className="ml-2">{VERSION_CONFIG.technical.framework}</span>
                </div>
                <div>
                  <span className="text-gray-600">Language:</span>
                  <span className="ml-2">{VERSION_CONFIG.technical.language}</span>
                </div>
                <div>
                  <span className="text-gray-600">Styling:</span>
                  <span className="ml-2">{VERSION_CONFIG.technical.styling}</span>
                </div>
                <div>
                  <span className="text-gray-600">Animations:</span>
                  <span className="ml-2">{VERSION_CONFIG.technical.animations}</span>
                </div>
              </div>
            </GlassCard>

            {/* Browser Support */}
            <GlassCard intensity="light" className="p-4 bg-gradient-to-br from-purple-50/80 to-gray-50/80">
              <h3 className="font-semibold text-gray-900 mb-3">Browser Support</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Chrome:</span>
                  <span className="ml-2">{VERSION_CONFIG.browserSupport.chrome}</span>
                </div>
                <div>
                  <span className="text-gray-600">Firefox:</span>
                  <span className="ml-2">{VERSION_CONFIG.browserSupport.firefox}</span>
                </div>
                <div>
                  <span className="text-gray-600">Safari:</span>
                  <span className="ml-2">{VERSION_CONFIG.browserSupport.safari}</span>
                </div>
                <div>
                  <span className="text-gray-600">Mobile:</span>
                  <span className="ml-2">{VERSION_CONFIG.browserSupport.mobile}</span>
                </div>
              </div>
            </GlassCard>

            {/* Feature Flags */}
            <GlassCard intensity="light" className="p-4 bg-gradient-to-br from-orange-50/80 to-gray-50/80">
              <h3 className="font-semibold text-gray-900 mb-3">Feature Flags</h3>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                {Object.entries(VERSION_CONFIG.features).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      enabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Branding */}
        <GlassCard intensity="light" className="p-4 text-center bg-gradient-to-br from-gray-50/80 to-gray-100/80">
          <div className="text-sm text-gray-600">
            <p className="font-semibold">{VERSION_CONFIG.branding.copyright}</p>
            <p className="text-xs mt-1">
              Developer: {VERSION_CONFIG.branding.developer} • 
              AI: {VERSION_CONFIG.branding.collaboration}
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return null;
}