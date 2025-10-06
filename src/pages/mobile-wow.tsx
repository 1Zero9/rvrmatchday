/**
 * 🏆 RVR AFC Mobile App - WOW Factor
 * 
 * Inspired by SportMember - immediate impact design
 * Dark header, clean content, native app feel
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Home, Calendar, Users, Trophy, ArrowRight, Clock, MapPin, User, Palette, Target, FileText, Camera, MessageSquare, ChevronRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthProvider, useAuth } from '../components/SecureAuth';
import { useHomepageData, formatMatchDate, formatMatchTime } from '../hooks/useHomepageData';
import { ThemeProvider, useRVRTheme } from '../utils/rvr-themes';
import ThemeSelector from '../components/mobile/ThemeSelector';
import MobileMatchRecord from '../components/mobile-app/MobileMatchRecord';

type Screen = 'home' | 'fixtures' | 'teams' | 'results' | 'match-record' | 'news' | 'gallery';

function WowMobileAppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const { user, profile } = useAuth();
  const { currentTheme } = useRVRTheme();

  const handleScreenChange = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const getScreenContent = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen user={user} profile={profile} onNavigate={handleScreenChange} currentTheme={currentTheme} setShowThemeSelector={setShowThemeSelector} />;
      case 'fixtures':
        return <FixturesScreen onBack={() => setCurrentScreen('home')} />;
      case 'teams':
        return <TeamsScreen onBack={() => setCurrentScreen('home')} />;
      case 'results':
        return <ResultsScreen onBack={() => setCurrentScreen('home')} />;
      case 'news':
        return <NewsScreen onBack={() => setCurrentScreen('home')} />;
      case 'gallery':
        return <GalleryScreen onBack={() => setCurrentScreen('home')} />;
      default:
        return <HomeScreen user={user} profile={profile} onNavigate={handleScreenChange} currentTheme={currentTheme} setShowThemeSelector={setShowThemeSelector} />;
    }
  };


  // If we're on the match record screen, render it fullscreen without the mobile app layout
  if (currentScreen === 'match-record') {
    return (
      <>
        <Head>
          <title>Match Tracker | Rivervalley Rangers AFC</title>
          <meta name="description" content="Live match tracking for RVR AFC" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#1f2937" />
          <style>{`
            body { margin: 0; padding: 0; }
          `}</style>
        </Head>
        <MobileMatchRecord onBack={() => setCurrentScreen('home')} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Rivervalley Rangers AFC</title>
        <meta name="description" content="Rivervalley Rangers AFC - Mobile App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1f2937" />
        <link rel="manifest" href="/mobile-manifest.json" />
        <style>{`
          body { margin: 0; padding: 0; background: #f8fafc; }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Wow Factor Header */}
        <div className="relative">
          {/* Dynamic Themed Gradient Background */}
          <motion.div 
            className="relative overflow-hidden"
            animate={{
              height: isContentExpanded ? 200 : 320
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.headerGradient.from}, ${currentTheme.colors.headerGradient.via}, ${currentTheme.colors.headerGradient.to})`
            }}
          >
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full"></div>
              <div className="absolute top-12 left-8 w-20 h-20 bg-white/5 rounded-full"></div>
              <div className="absolute bottom-8 right-12 w-24 h-24 bg-white/5 rounded-full"></div>
            </div>

            {/* Header Content */}
            <div className="relative z-10 pt-6 px-6">
              <div className="flex items-center justify-between mb-2">
                {/* Logo on left spanning both title and icons */}
                <div className="flex items-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Image src="/images/logo.png" alt="RVR AFC" width={64} height={64} className="rounded-full" />
                  </div>
                </div>

                {/* Title and Icons on right */}
                <div className="flex-1">
                  {/* Title line */}
                  <div className="flex justify-end mb-3">
                    <div className="text-right">
                      <div className="text-white/95 text-xl font-bold whitespace-nowrap">Rivervalley Rangers AFC</div>
                    </div>
                  </div>

                  {/* Icons line - 1x4 */}
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={() => handleScreenChange('home')}
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Home size={16} className="text-white/80" />
                    </button>
                    <button 
                      onClick={() => handleScreenChange('fixtures')}
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Calendar size={16} className="text-white/80" />
                    </button>
                    <button 
                      onClick={() => handleScreenChange('match-record')}
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors relative"
                      title="Match Tracker"
                    >
                      <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        ⚽
                      </motion.div>
                    </button>
                    <button 
                      onClick={() => setShowThemeSelector(true)}
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Palette size={16} className="text-white/80" />
                    </button>
                    {user ? (
                      <button 
                        onClick={() => window.open('/admin', '_blank')}
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        title={`${profile?.full_name || 'User'} - ${profile?.role || 'Member'}`}
                      >
                        <User size={16} className="text-white/80" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => window.open('/mobile-login?returnTo=/mobile-wow', '_blank')}
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        title="Sign In"
                      >
                        <User size={16} className="text-white/80" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Screen Content */}
          <motion.div 
            className="relative z-20 flex-1 cursor-pointer"
            animate={{
              y: isContentExpanded ? -120 : -144
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            onClick={() => setIsContentExpanded(!isContentExpanded)}
          >
            {/* Drag indicator */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-30">
              <div 
                className="w-12 h-1 rounded-full transition-opacity"
                style={{ 
                  backgroundColor: currentTheme.colors.primary,
                  opacity: isContentExpanded ? 0.3 : 0.6
                }}
              />
            </div>
            {getScreenContent()}
          </motion.div>
        </div>

        {/* Enhanced Bottom Navigation with More Tabs */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-pb">
          <div className="flex items-center justify-around">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'fixtures', icon: Calendar, label: 'Fixtures' },
              { id: 'teams', icon: Users, label: 'Teams' },
              { id: 'results', icon: Trophy, label: 'Results' },
              { id: 'news', icon: FileText, label: 'News' },
              { id: 'match-record', icon: Target, label: 'Tracker', isFootball: true },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleScreenChange(item.id as Screen)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  currentScreen === item.id 
                    ? 'bg-gray-100' 
                    : 'text-gray-500'
                }`}
                style={{
                  color: currentScreen === item.id ? currentTheme.colors.navActive : undefined
                }}
              >
                {item.isFootball ? (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-xl"
                  >
                    ⚽
                  </motion.div>
                ) : (
                  <item.icon size={20} />
                )}
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Theme Selector Modal */}
        {showThemeSelector && (
          <ThemeSelector 
            showAsModal 
            onClose={() => setShowThemeSelector(false)}
          />
        )}
      </div>
    </>
  );
}

// Home Screen with Clean Cards
function HomeScreen({ user, profile, onNavigate, currentTheme, setShowThemeSelector }: {
  user: any;
  profile: any;
  onNavigate: (screen: Screen) => void;
  currentTheme: any;
  setShowThemeSelector: (show: boolean) => void;
}) {
  const { latestResult, nextFixture, latestNews, loading } = useHomepageData();

  // Generic welcome content - no longer personalized by theme

  const getWelcomeMessage = () => {
    if (user) {
      const firstName = profile?.full_name?.split(' ')[0];
      return `Welcome back, ${firstName}!`;
    } else {
      return 'Welcome to RVR AFC';
    }
  };

  const getDescription = () => {
    if (user) {
      return 'Your home for everything RVR AFC - match updates, team news, and club activities.';
    } else {
      return 'Rivervalley Rangers AFC - where community spirit meets competitive football. Join our growing club family!';
    }
  };


  return (
    <div className="bg-white rounded-t-3xl flex-1 pb-20">
      {/* Welcome Section */}
      <div className="px-6 pt-8 pb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {getWelcomeMessage()}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {getDescription()}
        </p>
        {profile?.role && (
          <div className="mt-3">
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: currentTheme.colors.primary + '20', 
                color: currentTheme.colors.primary 
              }}
            >
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </span>
          </div>
        )}
      </div>

      {/* Prominent Match Recorder CTA */}
      <div className="px-6 pb-6">
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative overflow-hidden rounded-2xl p-6 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.headerGradient.from}, ${currentTheme.colors.headerGradient.via}, ${currentTheme.colors.headerGradient.to})`
          }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-6 -translate-x-6"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-1">⚽ Live Match Tracker</h3>
              <p className="text-white/90 text-sm mb-3">Record scores and time at the sideline</p>
              
              <button
                onClick={() => onNavigate('match-record')}
                className="bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
              >
                <span className="text-xl">🚀</span>
                <span>Start Tracking</span>
              </button>
            </div>
            
            <div className="flex-shrink-0 ml-4">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-4xl"
              >
                ⚽
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Future Activities Section */}
      <div className="px-6 mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Future activities</h3>
        
        {/* Activity Tabs */}
        <div className="flex space-x-6 mb-4">
          <button className="text-blue-600 font-medium text-sm border-b-2 border-blue-600 pb-1">
            Club activities
          </button>
          <button className="text-gray-500 font-medium text-sm pb-1">
            Matches
          </button>
        </div>

        {/* Activity Cards */}
        <div className="space-y-3">
          {nextFixture && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: currentTheme.colors.activityColors.match }}
                    ></div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {nextFixture.homeTeam} vs {nextFixture.awayTeam}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{formatMatchTime(nextFixture.matchTime)}</span>
                      </div>
                      {nextFixture.venue && (
                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                          <MapPin size={12} />
                          <span>{nextFixture.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {new Date(nextFixture.matchDate).getDate()}
                  </div>
                  <div className="text-xs text-gray-500 uppercase">
                    {new Date(nextFixture.matchDate).toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Latest Result Card */}
          {latestResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-1 h-12 rounded-full"
                      style={{ backgroundColor: currentTheme.colors.activityColors.match }}
                    ></div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {latestResult.homeTeam} vs {latestResult.awayTeam}
                      </div>
                      <div className="text-sm text-gray-500">Latest Result</div>
                      <div className="text-sm font-medium text-gray-900">
                        {latestResult.homeScore} - {latestResult.awayScore}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {new Date(latestResult.matchDate).getDate()}
                  </div>
                  <div className="text-xs text-gray-500 uppercase">
                    {new Date(latestResult.matchDate).toLocaleDateString('en', { weekday: 'short' })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* See All Button */}
        <button 
          onClick={() => onNavigate('fixtures')}
          className="w-full mt-4 py-3 font-medium text-sm flex items-center justify-center space-x-1"
          style={{ color: currentTheme.colors.primary }}
        >
          <span>See all</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Club News Section */}
      <div className="px-6 mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Club News</h3>
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="backdrop-blur-md bg-white/70 border border-white/30 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Season 2024/25 Registration Open</div>
                <div className="text-sm text-gray-600 mb-2">
                  New players welcome! Join RVR AFC for an exciting season ahead.
                </div>
                <button
                  onClick={() => window.open('/mobile-join', '_blank')}
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: currentTheme.colors.primary, 
                    color: 'white' 
                  }}
                >
                  Register Now
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="backdrop-blur-md bg-white/70 border border-white/30 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => onNavigate('match-record')}
          >
            <div className="font-semibold text-gray-900 mb-1">Mobile Match Recorder</div>
            <div className="text-sm text-gray-600 mb-2">
              Record live match events, scores, and player stats from the sideline.
            </div>
            <button
              onClick={() => onNavigate('match-record')}
              className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: currentTheme.colors.primary, 
                color: 'white' 
              }}
            >
              Start Recording
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="font-semibold text-gray-900 mb-1">Match Central Available</div>
            <div className="text-sm text-gray-600 mb-2">
              Coaches can now use our advanced match tracking system.
            </div>
            <button
              onClick={() => window.open('/match-central', '_blank')}
              className="text-xs font-medium text-blue-600"
            >
              Learn More →
            </button>
          </motion.div>
        </div>
      </div>

      {/* Theme Selector Section */}
      <div className="px-6 mb-8">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Personalize Your Experience</h3>
        <div 
          className="rounded-xl p-4 border"
          style={{ 
            backgroundColor: currentTheme.colors.primary + '05', 
            borderColor: currentTheme.colors.primary + '20' 
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-medium text-gray-900">Choose Your Color Theme</div>
              <div className="text-sm text-gray-600">Currently using: {currentTheme.displayName}</div>
            </div>
            <div className="flex space-x-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: currentTheme.colors.headerGradient.from }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: currentTheme.colors.accent }}
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowThemeSelector(true)}
            className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors"
            style={{ backgroundColor: currentTheme.colors.primary }}
          >
            Change Theme
          </button>
        </div>
      </div>


      {/* Coach Access */}
      {profile?.role === 'coach' || profile?.role === 'admin' ? (
        <div className="px-6 mb-8">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Coach Dashboard</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => window.open('/match-recorder', '_blank')}
              className="p-4 rounded-xl text-left"
              style={{ 
                backgroundColor: currentTheme.colors.primary + '10', 
                borderColor: currentTheme.colors.primary + '30',
                borderWidth: '1px'
              }}
            >
              <div 
                className="font-medium"
                style={{ color: currentTheme.colors.primary }}
              >
                Record Match
              </div>
              <div className="text-sm text-gray-600 mt-1">Log results & stats</div>
            </button>
            <button
              onClick={() => window.open('/match-central', '_blank')}
              className="p-4 rounded-xl text-left"
              style={{ 
                backgroundColor: currentTheme.colors.secondary + '10', 
                borderColor: currentTheme.colors.secondary + '30',
                borderWidth: '1px'
              }}
            >
              <div 
                className="font-medium"
                style={{ color: currentTheme.colors.secondary }}
              >
                Match Central
              </div>
              <div className="text-sm text-gray-600 mt-1">Team management</div>
            </button>
            <button
              onClick={() => window.open('/admin', '_blank')}
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-left col-span-2"
            >
              <div className="font-medium text-gray-900">Admin Panel</div>
              <div className="text-sm text-gray-600 mt-1">Manage club settings, users, and content</div>
            </button>
          </div>
        </div>
      ) : !user ? (
        <div className="px-6 mb-8">
          <div 
            className="rounded-xl p-4 border"
            style={{ 
              backgroundColor: currentTheme.colors.primary + '10', 
              borderColor: currentTheme.colors.primary + '30' 
            }}
          >
            <h3 className="font-semibold text-gray-900 mb-2">Join RVR AFC Community</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sign in to access match notifications, team updates, and exclusive member content.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => window.open('/mobile-login?returnTo=/mobile-wow', '_blank')}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                Sign In
              </button>
              <button
                onClick={() => window.open('/mobile-join', '_blank')}
                className="px-4 py-2 rounded-lg text-sm font-medium border"
                style={{ 
                  borderColor: currentTheme.colors.primary,
                  color: currentTheme.colors.primary 
                }}
              >
                Join Club
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Simple screen components
function FixturesScreen({ onBack }: { onBack: () => void }) {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .is('home_score', null)
        .gte('match_date', new Date().toISOString().split('T')[0])
        .order('match_date', { ascending: true })
        .limit(10);

      if (!error && data) {
        setFixtures(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="rounded-t-3xl flex-1 pb-20 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(/images/hero/boots.jpg)',
      }}
    >
      <div className="absolute inset-0 bg-black/20 rounded-t-3xl"></div>
      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-t-3xl pb-20">
        <div className="px-6 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Fixtures</h2>
          <button onClick={onBack} className="text-blue-600 font-medium">Done</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : fixtures.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No upcoming fixtures</div>
            <div className="text-sm text-gray-400">Check back soon for new matches</div>
          </div>
        ) : (
          <div className="space-y-3">
            {fixtures.map((fixture, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-500">{formatMatchDate(fixture.match_date)}</div>
                  <div className="text-sm text-gray-500">{formatMatchTime(fixture.match_time)}</div>
                </div>
                <div className="font-semibold text-gray-900">
                  {fixture.home_team} vs {fixture.away_team}
                </div>
                {fixture.venue && (
                  <div className="text-sm text-gray-500 mt-1">{fixture.venue}</div>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

function TeamsScreen({ onBack }: { onBack: () => void }) {
  const teams = [
    { 
      name: 'RVR AFC First Team', 
      manager: 'Head Coach',
      description: 'Senior men\'s team competing in local leagues',
      link: '/teams/boys'
    },
    { 
      name: 'RVR AFC Reserve Team', 
      manager: 'Assistant Coach',
      description: 'Development squad for emerging players',
      link: '/teams/boys'
    },
    { 
      name: 'RVR AFC Girls', 
      manager: 'Girls Coach',
      description: 'Competitive girls team across all age groups',
      link: '/teams/girls'
    },
    { 
      name: 'RVR AFC Youth', 
      manager: 'Youth Coach',
      description: 'Youth development program for future stars',
      link: '/teams/boys'
    }
  ];

  return (
    <div className="bg-white rounded-t-3xl flex-1 pb-20">
      <div className="px-6 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Our Teams</h2>
          <button onClick={onBack} className="text-blue-600 font-medium">Done</button>
        </div>

        <div className="space-y-3">
          {teams.map((team, index) => (
            <button
              key={index}
              onClick={() => window.open(team.link, '_blank')}
              className="w-full border border-gray-200 rounded-xl p-4 text-left hover:border-blue-200 transition-colors"
            >
              <div className="font-semibold text-gray-900">{team.name}</div>
              <div className="text-sm text-gray-500 mt-1">Coach: {team.manager}</div>
              <div className="text-sm text-gray-600 mt-1">{team.description}</div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Join Our Club</h3>
          <p className="text-sm text-gray-600 mb-3">
            Interested in playing for RVR AFC? We welcome players of all skill levels.
          </p>
          <button
            onClick={() => window.open('/mobile-join', '_blank')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Join RVR AFC
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ onBack }: { onBack: () => void }) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .not('home_score', 'is', null)
        .order('match_date', { ascending: false })
        .limit(10);

      if (!error && data) {
        setResults(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-t-3xl flex-1 pb-20">
      <div className="px-6 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Results</h2>
          <button onClick={onBack} className="text-blue-600 font-medium">Done</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">No recent results</div>
            <div className="text-sm text-gray-400">Results will appear here after matches</div>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <div className="text-sm text-gray-500 mb-2">{formatMatchDate(result.match_date)}</div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{result.home_team}</span>
                  <div className="px-3 py-1 bg-gray-900 text-white rounded text-sm font-bold">
                    {result.home_score} - {result.away_score}
                  </div>
                  <span className="font-semibold text-gray-900">{result.away_team}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// News Screen with Categories
function NewsScreen({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'latest' | 'match-reports' | 'club-news'>('latest');
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, [activeTab]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      let query = supabase.from('news').select('*');
      
      if (activeTab === 'match-reports') {
        query = query.ilike('category', '%match%');
      } else if (activeTab === 'club-news') {
        query = query.not('category', 'ilike', '%match%');
      }
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setNews(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="rounded-t-3xl flex-1 pb-20 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/images/hero/ariel-pitch.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/20 rounded-t-3xl"></div>
      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-t-3xl pb-20">
        <div className="px-6 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Club News</h2>
            <button onClick={onBack} className="text-blue-600 font-medium">Done</button>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('latest')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'latest'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setActiveTab('match-reports')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'match-reports'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Match Reports
            </button>
            <button
              onClick={() => setActiveTab('club-news')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'club-news'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Club News
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : news.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <div className="text-gray-500 mb-2">No news articles</div>
              <div className="text-sm text-gray-400">Check back soon for updates</div>
            </div>
          ) : (
            <div className="space-y-4">
              {news.map((article) => (
                <div key={article.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                      {article.category || 'News'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(article.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {article.excerpt || article.content?.substring(0, 120) + '...'}
                  </p>
                  <button className="mt-3 text-blue-600 text-sm font-medium flex items-center">
                    Read more <ChevronRight size={14} className="ml-1" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Gallery Screen with Categories
function GalleryScreen({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'recent' | 'matches' | 'training'>('recent');

  const galleryItems = [
    { id: 1, type: 'match', title: 'vs City United', image: '/images/hero/boots.jpg', date: '2025-10-01' },
    { id: 2, type: 'training', title: 'Training Session', image: '/images/hero/ariel-pitch.jpg', date: '2025-09-28' },
    { id: 3, type: 'match', title: 'vs Rangers FC', image: '/images/hero/boots.jpg', date: '2025-09-25' },
    { id: 4, type: 'training', title: 'Youth Training', image: '/images/hero/ariel-pitch.jpg', date: '2025-09-20' },
  ];

  const filteredItems = galleryItems.filter(item => 
    activeTab === 'recent' || item.type === (activeTab === 'matches' ? 'match' : 'training')
  );

  return (
    <div 
      className="rounded-t-3xl flex-1 pb-20 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/images/hero/astro-ward.png)' }}
    >
      <div className="absolute inset-0 bg-black/20 rounded-t-3xl"></div>
      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-t-3xl pb-20">
        <div className="px-6 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Photo Gallery</h2>
            <button onClick={onBack} className="text-blue-600 font-medium">Done</button>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('recent')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'recent'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'matches'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Matches
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'training'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Training
            </button>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <div className="text-gray-500 mb-2">No photos yet</div>
              <div className="text-sm text-gray-400">Check back soon for new photos</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <div 
                    className="aspect-square bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 text-sm mb-1">{item.title}</h3>
                    <div className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main App with Auth and Theme Providers
export default function WowMobileApp() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WowMobileAppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}