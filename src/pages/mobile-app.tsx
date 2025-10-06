/**
 * 📱 RVR MOBILE APP - ENHANCED
 * Clean, beautiful mobile interface with glass morphism design
 * Real data integration and smooth animations
 * 
 * Note: This is also used as the mobile version of /home
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Home, Calendar, Users, Trophy, Settings, Phone, Edit3, Shield, Plus, Eye, LogIn, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthProvider, useAuth } from '../components/SecureAuth';
import { useHomepageData, formatMatchDate, formatMatchTime } from '../hooks/useHomepageData';
import CrestAnimation from '../components/mobile/CrestAnimation';
import NextMatchHero from '../components/mobile/NextMatchHero';
import { OptimizedLogo, OptimizedBackground } from '../components/mobile/OptimizedImage';
import usePerformanceMonitoring, { logPerformanceMetrics } from '../hooks/usePerformanceMonitoring';
import { performanceTester, measurePerformanceNow } from '../utils/performanceTest';
import { useMobileAnalytics, AnalyticsEvents } from '../hooks/useAnalytics';

type Screen = 'home' | 'fixtures' | 'teams' | 'results' | 'settings' | 'match-recorder' | 'match-central';

function MobileAppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [showMenu, setShowMenu] = useState(false);
  const [showCrestAnimation, setShowCrestAnimation] = useState(true);
  const [hasShownCrest, setHasShownCrest] = useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const performanceData = usePerformanceMonitoring();
  const analytics = useMobileAnalytics();

  // Check if this is the first visit this session
  useEffect(() => {
    const hasSeenCrest = sessionStorage.getItem('rvr-crest-shown');
    if (hasSeenCrest) {
      setShowCrestAnimation(false);
      setHasShownCrest(true);
    }
  }, []);

  // Handle crest animation completion
  const handleCrestComplete = () => {
    setShowCrestAnimation(false);
    setHasShownCrest(true);
    sessionStorage.setItem('rvr-crest-shown', 'true');
    
    // Track crest animation completion
    analytics.trackMobileEvent('CREST_ANIMATION', 'view');
  };

  // Enhanced performance monitoring and baseline measurement (Phase 2)
  useEffect(() => {
    if (!performanceData.isLoading && !hasShownCrest) {
      const timer = setTimeout(async () => {
        // Original performance logging
        logPerformanceMetrics();
        console.log('🎯 Performance Grade:', performanceData.grade);
        console.log('📊 Core Web Vitals:', {
          LCP: performanceData.formatMetric(performanceData.metrics.lcp, 's'),
          FID: performanceData.formatMetric(performanceData.metrics.fid),
          CLS: performanceData.formatMetric(performanceData.metrics.cls, '')
        });

        // Phase 2: Enhanced performance testing
        try {
          const baseline = await measurePerformanceNow();
          performanceTester.logPerformanceReport(baseline);
          
          // Track performance metrics to analytics
          if (baseline.lcp) {
            analytics.trackPerformance('LCP', baseline.lcp, 'lcp');
          }
          if (baseline.fid) {
            analytics.trackPerformance('FID', baseline.fid, 'fid');
          }
          if (baseline.cls) {
            analytics.trackPerformance('CLS', baseline.cls, 'cls');
          }
          
          // Set as baseline if none exists
          const existingBaseline = performanceTester.getBaseline();
          if (!existingBaseline) {
            performanceTester.setBaseline(baseline);
            console.log('📌 Performance baseline established for Phase 2 optimization');
            analytics.trackEvent('performance', 'baseline_set', 'initial');
          } else {
            // Compare with existing baseline
            const comparison = await performanceTester.compareWithBaseline();
            if (comparison.improvements.length > 0) {
              console.log('✅ Performance improvements:', comparison.improvements);
              analytics.trackEvent('performance', 'improvement', 'compared_to_baseline');
            }
            if (comparison.regressions.length > 0) {
              console.log('⚠️ Performance regressions:', comparison.regressions);
              analytics.trackEvent('performance', 'regression', 'compared_to_baseline');
            }
          }
        } catch (error) {
          console.log('Performance measurement error:', error);
          analytics.trackError('performance_measurement', 'baseline_setup', { error: error.message });
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [performanceData.isLoading, hasShownCrest, performanceData.grade, performanceData.formatMetric, performanceData.metrics]);

  // Phase 2: PWA Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Service Worker update found');
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('✨ New Service Worker available');
                  // Could show update notification to user
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('❌ Service Worker registration failed:', error);
        });

      // Listen for service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_COMPLETE') {
          console.log('🔄 Offline sync completed');
        }
      });
    }
  }, []);

  // Enhanced navigation handler with analytics
  const handleScreenChange = (screen: Screen) => {
    // Track screen navigation
    analytics.trackPageView(screen, { 
      previousScreen: currentScreen,
      navigationSource: 'bottom_nav'
    });
    
    setCurrentScreen(screen);
    setShowMenu(false);
  };

  // Check if user has coach/admin access
  const hasCoachAccess = profile && (profile.role === 'coach' || profile.role === 'admin');

  // Simple screen content (no complex components)
  const getScreenContent = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleScreenChange} user={user} profile={profile} hasCoachAccess={hasCoachAccess} />;
      case 'fixtures':
        return <FixturesScreen onBack={() => setCurrentScreen('home')} />;
      case 'teams':
        return <TeamsScreen onBack={() => setCurrentScreen('home')} />;
      case 'results':
        return <ResultsScreen onBack={() => setCurrentScreen('home')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setCurrentScreen('home')} user={user} profile={profile} onSignOut={signOut} />;
      case 'match-recorder':
        return hasCoachAccess ? <MatchRecorderScreen onBack={() => setCurrentScreen('home')} /> : <AuthRequiredScreen onBack={() => setCurrentScreen('home')} />;
      case 'match-central':
        return hasCoachAccess ? <MatchCentralScreen onBack={() => setCurrentScreen('home')} /> : <AuthRequiredScreen onBack={() => setCurrentScreen('home')} />;
      default:
        return <HomeScreen onNavigate={handleScreenChange} user={user} profile={profile} hasCoachAccess={hasCoachAccess} />;
    }
  };


  return (
    <>
      <Head>
        <title>RVR AFC Mobile</title>
        <meta name="description" content="Rivervalley Rangers AFC Mobile" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#972A4C" />
        
        {/* Performance Optimization: Preload Critical Resources */}
        <link 
          rel="preload" 
          href="/images/hero/astro-ward.png" 
          as="image" 
          type="image/png"
          importance="high"
        />
        <link 
          rel="preload" 
          href="/images/logo.png" 
          as="image" 
          type="image/png"
          importance="high"
        />
        
        {/* DNS Prefetch for External Resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Resource Hints for Performance */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/mobile-manifest.json" />
        
        {/* Apple PWA Support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RVR AFC" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
      </Head>

      {/* Crest Animation - Shows on first load */}
      {showCrestAnimation && (
        <CrestAnimation 
          onComplete={handleCrestComplete}
          skipAnimation={hasShownCrest}
        />
      )}

      <div className="min-h-screen relative overflow-hidden">
        {/* Optimized Background for LCP */}
        <div className="absolute inset-0">
          <OptimizedBackground 
            src="/images/hero/astro-ward.png"
            alt="RVR AFC Stadium"
            priority={true}
          />
          {/* Gradient overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50"></div>
        </div>

        {/* Simple Header */}
        <header className="bg-gradient-to-r from-[#972A4C]/90 to-[#7A1D3C]/90 backdrop-blur-sm text-white p-4 flex items-center justify-between shadow-lg relative z-10">
          <div className="flex items-center space-x-3">
            <OptimizedLogo size={32} priority={true} />
            <h1 className="font-bold text-lg">RVR AFC</h1>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2"
          >
            <Settings size={20} />
          </button>
        </header>

        {/* Screen Content */}
        <main className="pb-16 relative z-10">
          {getScreenContent()}
        </main>

        {/* Enhanced Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-white/50 flex shadow-2xl relative z-20">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'fixtures', icon: Calendar, label: 'Fixtures' },
            { id: 'teams', icon: Users, label: 'Teams' },
            { id: 'results', icon: Trophy, label: 'Results' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleScreenChange(item.id as Screen)}
              className={`flex-1 p-3 flex flex-col items-center space-y-1 ${
                currentScreen === item.id ? 'text-[#972A4C]' : 'text-gray-500'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Simple Menu Overlay */}
        {showMenu && (
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowMenu(false)}
          >
            <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Menu</h3>
                <button onClick={() => setShowMenu(false)}>✕</button>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => window.open('/home', '_blank')}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded"
                >
                  🖥️ Desktop Site
                </button>
                <button
                  onClick={() => window.open('/contact', '_blank')}
                  className="w-full text-left p-3 hover:bg-gray-100 rounded"
                >
                  📞 Contact
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Simple Screen Components
function HomeScreen({ onNavigate, user, profile, hasCoachAccess }: { 
  onNavigate: (screen: Screen) => void;
  user: any;
  profile: any;
  hasCoachAccess: boolean;
}) {
  const { latestResult, nextFixture, latestNews, loading } = useHomepageData();
  const analytics = useMobileAnalytics();

  // Track home screen view
  useEffect(() => {
    analytics.trackPageView('home', {
      userType: user ? 'authenticated' : 'anonymous',
      userRole: profile?.role || 'visitor',
      hasCoachAccess
    });
  }, [user, profile, hasCoachAccess]);

  return (
    <div className="p-4">
      {/* Hero Welcome Section */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/60"
        >
          <div className="flex justify-center mb-4">
            <OptimizedLogo size={60} priority={true} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user ? `Ready for action, ${profile?.full_name?.split(' ')[0] || 'Coach'}! 🔥` : 'Matchday Madness Starts Here! 🏟️'}
          </h1>
          <p className="text-gray-600 mb-4">
            {user ? 'Your matchday command center awaits ⚡' : 'Where champions are made since 1981 ⚽'}
          </p>
          {profile?.role && (
            <div className="mb-4">
              <span className="inline-block bg-gradient-to-r from-[#972A4C] to-[#7A1D3C] text-white text-sm px-3 py-1 rounded-full font-medium">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
            </div>
          )}
          
          {/* Compelling CTA for Desktop */}
          <motion.button
            onClick={() => {
              analytics.trackMobileEvent('DESKTOP_REDIRECT');
              analytics.trackConversion('desktop_redirect', true, { 
                userType: user ? 'authenticated' : 'anonymous' 
              });
              window.location.href = '/home';
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 mx-auto"
          >
            <span>⚡</span>
            <span>Enter the Action Zone</span>
            <span>🔥</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Next Match Hero - Broadcast Style Prominence */}
      {nextFixture && (
        <div className="mb-8">
          <NextMatchHero
            match={{
              homeTeam: nextFixture.homeTeam,
              awayTeam: nextFixture.awayTeam,
              matchDate: nextFixture.matchDate,
              matchTime: nextFixture.matchTime,
              venue: nextFixture.venue,
              competition: nextFixture.competition,
              isHomeMatch: nextFixture.isHomeMatch
            }}
            onClick={() => {
              analytics.trackMobileEvent('HERO_INTERACTION', 'click');
              analytics.trackInteraction('next_match_hero', 'tap', 'home_screen');
              onNavigate('fixtures');
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <ActionCard
          title="Fixtures ⚽"
          description="Next battles ahead!"
          icon={<Calendar className="text-[#972A4C]" size={24} />}
          onClick={() => onNavigate('fixtures')}
        />
        <ActionCard
          title="Teams 🔥"
          description="Meet our warriors"
          icon={<Users className="text-[#972A4C]" size={24} />}
          onClick={() => onNavigate('teams')}
        />
        <ActionCard
          title="Results 🏆"
          description="Victory stories"
          icon={<Trophy className="text-[#972A4C]" size={24} />}
          onClick={() => onNavigate('results')}
        />
        <ActionCard
          title="Contact ⚡"
          description="Join the action"
          icon={<Phone className="text-[#972A4C]" size={24} />}
          onClick={() => window.open('/contact', '_blank')}
        />
      </div>

      {/* Coach Tools - Only show if user has coach access */}
      {hasCoachAccess && (
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4 text-[#972A4C]">
            🔥 COACH COMMAND CENTER ⚡
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <ActionCard
              title="Record Battle 💥"
              description="Log the victories!"
              icon={<Edit3 className="text-[#972A4C]" size={24} />}
              onClick={() => onNavigate('match-recorder')}
            />
            <ActionCard
              title="Match Central ⚡"
              description="Command center!"
              icon={<Shield className="text-[#972A4C]" size={24} />}
              onClick={() => onNavigate('match-central')}
            />
          </div>
        </div>
      )}

      {/* Login Prompt for Non-authenticated Users */}
      {!user && (
        <div className="mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              🔥 JOIN THE COACHING CREW ⚡
            </h3>
            <p className="text-blue-700 text-sm mb-3">
              Ready to command the team? Login to unlock your matchday superpowers! 💪
            </p>
            <button
              onClick={() => window.open('/login?returnTo=/mobile-app', '_blank')}
              className="bg-[#972A4C] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
            >
              <LogIn size={16} />
              <span>Power Up! ⚡</span>
            </button>
          </div>
        </div>
      )}


      {/* Latest News - Simplified */}
      {latestNews && (
        <div className="mt-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/60"
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📰</div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">{latestNews.title}</h4>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {latestNews.excerpt}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

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
        .is('home_score', null) // Only upcoming matches
        .gte('match_date', new Date().toISOString().split('T')[0])
        .order('match_date', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching fixtures:', error);
      } else {
        setFixtures(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-[#972A4C]">← Back</button>
        <h2 className="text-xl font-bold">🔥 BATTLES AHEAD ⚽</h2>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#972A4C] mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading fixtures...</p>
        </div>
      ) : fixtures.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl text-center">
          <p className="text-gray-600 mb-4">🔥 Time to schedule the next battle! ⚽</p>
          <Calendar className="mx-auto text-gray-400" size={32} />
        </div>
      ) : (
        <div className="space-y-4">
          {fixtures.map((fixture) => (
            <FixtureCard
              key={fixture.id}
              homeTeam={fixture.home_team}
              awayTeam={fixture.away_team}
              date={formatMatchDate(fixture.match_date)}
              time={fixture.match_time || 'TBD'}
              venue={fixture.venue || 'TBD'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-[#972A4C]">← Back</button>
        <h2 className="text-xl font-bold">💪 OUR WARRIORS 🔥</h2>
      </div>
      
      <div className="space-y-4">
        <TeamCard name="RVR AFC Seniors" manager="John Smith" players="22" />
        <TeamCard name="RVR AFC U18" manager="Mike Jones" players="18" />
        <TeamCard name="RVR AFC U16" manager="Sarah Wilson" players="16" />
        <TeamCard name="RVR AFC Girls U14" manager="Lisa Brown" players="14" />
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
        .not('home_score', 'is', null) // Only completed matches
        .order('match_date', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching results:', error);
      } else {
        setResults(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-[#972A4C]">← Back</button>
        <h2 className="text-xl font-bold">🏆 VICTORY STORIES ⚡</h2>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#972A4C] mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading results...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl text-center">
          <p className="text-gray-600 mb-4">No recent results</p>
          <Trophy className="mx-auto text-gray-400" size={32} />
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <ResultCard
              key={result.id}
              homeTeam={result.home_team}
              awayTeam={result.away_team}
              homeScore={result.home_score}
              awayScore={result.away_score}
              date={formatMatchDate(result.match_date)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsScreen({ onBack, user, profile, onSignOut }: { 
  onBack: () => void;
  user: any;
  profile: any;
  onSignOut: () => Promise<void>;
}) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-[#972A4C]">← Back</button>
        <h2 className="text-xl font-bold">⚙️ COMMAND CENTER</h2>
      </div>
      
      {/* User Account Info */}
      {user && profile && (
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-green-900 mb-1">
              ✅ {profile.full_name}
            </h3>
            <p className="text-green-700 text-sm mb-1">{profile.email}</p>
            <div className="flex items-center space-x-2">
              <span className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
              {profile.teams && profile.teams.length > 0 && (
                <span className="text-xs text-green-600">
                  {profile.teams.length} team{profile.teams.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={async () => {
              await onSignOut();
              window.location.reload(); // Simple refresh to reset state
            }}
            className="w-full bg-red-500 text-white p-3 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Login Prompt for Non-authenticated Users */}
      {!user && (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              🔐 Not Signed In
            </h3>
            <p className="text-blue-700 text-sm mb-3">
              Sign in to access coach tools and personalized features.
            </p>
          </div>
          <button
            onClick={() => window.open('/login?returnTo=/mobile-app', '_blank')}
            className="w-full bg-[#972A4C] text-white p-3 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={() => window.location.href = '/home'}
          className="w-full text-left p-3 bg-white/90 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white transition-all shadow-md"
        >
          🖥️ Open Desktop Site
        </button>
        
        <button
          onClick={() => window.open('/contact', '_blank')}
          className="w-full text-left p-3 bg-white/90 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white transition-all shadow-md"
        >
          📞 Contact Club
        </button>

        {profile?.role === 'admin' && (
          <button
            onClick={() => window.open('/admin', '_blank')}
            className="w-full text-left p-3 bg-white/90 backdrop-blur-sm rounded-xl border border-white/50 hover:bg-white transition-all shadow-md"
          >
            ⚙️ Admin Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

// Helper Components
function ActionCard({ title, description, icon, onClick }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/60 hover:shadow-xl transition-all text-left group relative overflow-hidden"
    >
      {/* Gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#972A4C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="relative z-10">
        <div className="mb-3 group-hover:scale-110 transition-transform text-2xl">{icon}</div>
        <h3 className="font-bold text-gray-900 mb-1 text-lg">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </motion.button>
  );
}

function FixtureCard({ homeTeam, awayTeam, date, time, venue }: {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-white/50"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{date} • {time}</span>
        <span className="text-sm text-gray-500">{venue}</span>
      </div>
      <div className="text-center">
        <span className="font-semibold">{homeTeam}</span>
        <span className="mx-4 text-orange-500 font-bold">vs</span>
        <span className="font-semibold">{awayTeam}</span>
      </div>
    </motion.div>
  );
}

function TeamCard({ name, manager, players }: {
  name: string;
  manager: string;
  players: string;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-white/50"
    >
      <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Manager: {manager}</span>
        <span className="text-[#972A4C] font-medium">{players} players</span>
      </div>
    </motion.div>
  );
}

function ResultCard({ homeTeam, awayTeam, homeScore, awayScore, date }: {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
}) {
  const isRVRWin = homeTeam.includes('RVR') ? homeScore > awayScore : awayScore > homeScore;
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-white/50"
    >
      <div className="text-sm text-gray-500 mb-2">{date}</div>
      <div className="flex justify-between items-center">
        <span className="font-semibold flex-1 text-center">{homeTeam}</span>
        <div className={`text-white px-3 py-1 rounded-lg mx-2 whitespace-nowrap ${
          isRVRWin ? 'bg-green-600' : 'bg-red-500'
        }`}>
          {homeScore} - {awayScore}
        </div>
        <span className="font-semibold flex-1 text-center">{awayTeam}</span>
      </div>
    </motion.div>
  );
}

// Auth Required Screen (Simple ClubZap-style)
function AuthRequiredScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-[#972A4C]">← Back</button>
        <h2 className="text-xl font-bold">Access Required</h2>
      </div>
      
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Coach Access Required</h3>
        <p className="text-gray-600 mb-6">
          You need coach or admin permissions to access this feature.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.open('/login?returnTo=/mobile-app', '_blank')}
            className="w-full bg-[#972A4C] text-white p-3 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => window.open('/contact', '_blank')}
            className="w-full bg-gray-100 text-gray-700 p-3 rounded-lg font-medium"
          >
            Request Access
          </button>
        </div>
      </div>
    </div>
  );
}

// Main export with AuthProvider wrapper
export default function MobileApp() {
  return (
    <AuthProvider>
      <MobileAppContent />
    </AuthProvider>
  );
}

// Coach Management Screens

function MatchRecorderScreen({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'teams' | 'score' | 'details'>('teams');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const handleSaveMatch = () => {
    // Simple save logic - in real app would save to database
    alert(`Match saved: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`);
    onBack();
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-[#972A4C]">← Back</button>
        <h2 className="text-xl font-bold">Record Match</h2>
      </div>

      {step === 'teams' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Step 1: Select Teams</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Home Team</label>
            <select
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select home team</option>
              <option value="RVR AFC U12">RVR AFC U12</option>
              <option value="RVR AFC U14">RVR AFC U14</option>
              <option value="RVR AFC U16">RVR AFC U16</option>
              <option value="RVR AFC Seniors">RVR AFC Seniors</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Away Team</label>
            <input
              type="text"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              placeholder="Enter away team name"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            onClick={() => setStep('score')}
            disabled={!homeTeam || !awayTeam}
            className="w-full bg-[#972A4C] text-white p-3 rounded-lg font-medium disabled:bg-gray-400"
          >
            Next: Enter Score
          </button>
        </div>
      )}

      {step === 'score' && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Step 2: Enter Score</h3>
          
          <div className="bg-white p-4 rounded-lg border text-center">
            <p className="text-gray-600 mb-4">{homeTeam} vs {awayTeam}</p>
            
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="flex items-center space-x-2 mb-2">
                  <button
                    onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                    className="bg-gray-200 w-8 h-8 rounded-full"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold w-12 text-center">{homeScore}</span>
                  <button
                    onClick={() => setHomeScore(homeScore + 1)}
                    className="bg-gray-200 w-8 h-8 rounded-full"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-600">Home</p>
              </div>
              
              <span className="text-2xl text-gray-400">-</span>
              
              <div className="text-center">
                <div className="flex items-center space-x-2 mb-2">
                  <button
                    onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                    className="bg-gray-200 w-8 h-8 rounded-full"
                  >
                    -
                  </button>
                  <span className="text-3xl font-bold w-12 text-center">{awayScore}</span>
                  <button
                    onClick={() => setAwayScore(awayScore + 1)}
                    className="bg-gray-200 w-8 h-8 rounded-full"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-600">Away</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setStep('teams')}
              className="flex-1 bg-gray-500 text-white p-3 rounded-lg font-medium"
            >
              Back
            </button>
            <button
              onClick={handleSaveMatch}
              className="flex-1 bg-[#972A4C] text-white p-3 rounded-lg font-medium"
            >
              Save Match
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchCentralScreen({ onBack }: { onBack: () => void }) {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching matches:', error);
      } else {
        setMatches(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedMatch) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#972A4C] text-white p-4 flex items-center">
          <button onClick={() => setSelectedMatch(null)} className="mr-4 text-white">← Back</button>
          <h1 className="font-bold text-lg">Match Details</h1>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold">
                {selectedMatch.home_team} vs {selectedMatch.away_team}
              </h2>
              <p className="text-gray-600">{new Date(selectedMatch.match_date).toLocaleDateString()}</p>
              {selectedMatch.home_score !== null && (
                <div className="text-2xl font-bold text-[#972A4C] mt-2">
                  {selectedMatch.home_score} - {selectedMatch.away_score}
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Venue:</span>
                <span>{selectedMatch.venue || 'TBD'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Match Type:</span>
                <span>{selectedMatch.match_type || 'Regular'}</span>
              </div>
              {selectedMatch.notes && (
                <div>
                  <span className="text-gray-600 block mb-1">Notes:</span>
                  <p className="text-sm">{selectedMatch.notes}</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => window.open(`/match-recorder?edit=${selectedMatch.id}`, '_blank')}
            className="w-full bg-[#972A4C] text-white p-3 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <Edit3 size={18} />
            <span>Edit Match Details</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#972A4C] text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 text-white">← Back</button>
          <h1 className="font-bold text-lg">Match Central</h1>
        </div>
        <button
          onClick={() => window.open('/match-recorder', '_blank')}
          className="bg-white bg-opacity-20 p-2 rounded-lg"
        >
          <Plus size={20} />
        </button>
      </div>
      
      <div className="p-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-[#972A4C]">
              {matches.filter(m => m.home_score !== null).length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-blue-600">
              {matches.filter(m => m.home_score === null).length}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-green-600">
              {matches.filter(m => m.home_score !== null && m.home_score > m.away_score && m.home_team.includes('RVR')).length}
            </div>
            <div className="text-sm text-gray-600">Wins</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => window.open('/match-recorder', '_blank')}
              className="w-full p-4 bg-white rounded-lg border hover:bg-gray-50 flex items-center space-x-3"
            >
              <Plus className="text-[#972A4C]" size={20} />
              <span className="font-medium">Record New Match</span>
            </button>
            <button
              onClick={() => window.open('/match-central-secure', '_blank')}
              className="w-full p-4 bg-white rounded-lg border hover:bg-gray-50 flex items-center space-x-3"
            >
              <Eye className="text-blue-600" size={20} />
              <span className="font-medium">Open Full Desktop View</span>
            </button>
          </div>
        </div>

        {/* Recent Matches */}
        <div>
          <h3 className="font-bold text-lg mb-3">Recent Matches</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#972A4C] mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading matches...</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-white p-6 rounded-lg border text-center">
              <p className="text-gray-600">🏆 The victories are yet to be written! 🔥</p>
              <button
                onClick={() => window.open('/match-recorder', '_blank')}
                className="mt-3 bg-[#972A4C] text-white px-4 py-2 rounded-lg text-sm"
              >
                Record First Match
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className="w-full bg-white p-4 rounded-lg border hover:bg-gray-50 text-left"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {match.home_team} vs {match.away_team}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(match.match_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      {match.home_score !== null ? (
                        <div className="font-bold text-[#972A4C]">
                          {match.home_score} - {match.away_score}
                        </div>
                      ) : (
                        <div className="text-sm text-blue-600 font-medium">
                          Upcoming
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}