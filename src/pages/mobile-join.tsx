/**
 * 📱 Mobile Join Page  
 * Optimized mobile experience for joining RVR AFC
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';
import { AuthProvider } from '../components/SecureAuth';
import { ThemeProvider, useRVRTheme } from '../utils/rvr-themes';
import { ArrowLeft, Users, Trophy, Heart, Star, Phone, Mail, MapPin } from 'lucide-react';

function MobileJoinContent() {
  const router = useRouter();
  const { currentTheme } = useRVRTheme();
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  const teams = [
    { id: 'seniors', name: 'Senior Team', description: 'Men\'s competitive football', ageRange: '18+' },
    { id: 'girls', name: 'Girls Team', description: 'Female football across all ages', ageRange: '5-35+' },
    { id: 'youth', name: 'Youth Teams', description: 'Boys development program', ageRange: '5-17' },
    { id: 'inclusive', name: 'Inclusive Football', description: 'Everyone welcome', ageRange: 'All ages' }
  ];

  return (
    <>
      <Head>
        <title>Join Us - Rivervalley Rangers AFC</title>
        <meta name="description" content="Join Rivervalley Rangers AFC - Where community spirit meets competitive football" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <motion.div 
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.headerGradient.from}, ${currentTheme.colors.headerGradient.via}, ${currentTheme.colors.headerGradient.to})`
          }}
          initial={{ height: 0 }}
          animate={{ height: 240 }}
          transition={{ duration: 0.6 }}
        >
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-24 h-24 bg-white/5 rounded-full"></div>
            <div className="absolute top-12 left-6 w-16 h-16 bg-white/5 rounded-full"></div>
            <div className="absolute bottom-8 right-12 w-20 h-20 bg-white/5 rounded-full"></div>
          </div>

          {/* Header Content */}
          <div className="relative z-10 pt-12 px-6">
            {/* Back Button and Logo */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
              >
                <ArrowLeft size={20} className="text-white" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <Image src="/images/logo.png" alt="RVR AFC" width={40} height={40} className="rounded-full" />
                </div>
                <div>
                  <div className="text-white font-bold text-xl">Join RVR AFC</div>
                  <div className="text-white/80 text-sm">Become part of our family</div>
                </div>
              </div>
              
              <div className="w-10 h-10"></div> {/* Spacer */}
            </div>

            {/* Welcome Text */}
            <div className="text-center">
              <h1 className="text-white text-2xl font-bold mb-2">Welcome to the Family</h1>
              <p className="text-white/80 text-sm">Where community spirit meets competitive football</p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 px-6 -mt-6 relative z-10">
          <motion.div
            className="bg-white rounded-t-3xl shadow-xl min-h-[600px] p-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Why Join Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Why Join RVR AFC?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.primary + '20' }}>
                    <Users size={16} style={{ color: currentTheme.colors.primary }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Inclusive Community</div>
                    <div className="text-sm text-gray-600">Welcome players of all skill levels and backgrounds</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.primary + '20' }}>
                    <Trophy size={16} style={{ color: currentTheme.colors.primary }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Competitive Football</div>
                    <div className="text-sm text-gray-600">Play in local leagues and tournaments</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.primary + '20' }}>
                    <Heart size={16} style={{ color: currentTheme.colors.primary }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Family Atmosphere</div>
                    <div className="text-sm text-gray-600">More than a club - we're a community</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.primary + '20' }}>
                    <Star size={16} style={{ color: currentTheme.colors.primary }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Player Development</div>
                    <div className="text-sm text-gray-600">Professional coaching and training programs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Team</h3>
              <div className="space-y-3">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => setSelectedTeam(team.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedTeam === team.id 
                        ? 'border-current shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      borderColor: selectedTeam === team.id ? currentTheme.colors.primary : undefined
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{team.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{team.description}</div>
                        <div className="text-xs text-gray-500 mt-1">Age: {team.ageRange}</div>
                      </div>
                      {selectedTeam === team.id && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: currentTheme.colors.primary }}>
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Get In Touch</h3>
              <div className="space-y-3">
                <a 
                  href="mailto:info@rvrfc.com" 
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Mail size={20} style={{ color: currentTheme.colors.primary }} />
                  <span className="text-gray-900">info@rvrfc.com</span>
                </a>
                <a 
                  href="tel:+1234567890" 
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Phone size={20} style={{ color: currentTheme.colors.primary }} />
                  <span className="text-gray-900">Call our club secretary</span>
                </a>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin size={20} style={{ color: currentTheme.colors.primary }} />
                  <span className="text-gray-900">Training Ground, Rivervalley</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => window.open('/contact', '_blank')}
                className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: currentTheme.colors.primary }}
                disabled={!selectedTeam}
              >
                {selectedTeam ? 'Contact Club Secretary' : 'Select a Team First'}
              </button>
              
              <button
                onClick={() => router.push('/mobile-login')}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Already a Member? Sign In
              </button>
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-700">
                <strong>New to football?</strong> No problem! We welcome complete beginners and provide training to help you develop your skills.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function MobileJoinPage() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MobileJoinContent />
      </ThemeProvider>
    </AuthProvider>
  );
}