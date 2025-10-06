/**
 * 🏟️ RVR AFC Clean Mobile App
 * 
 * Professional, functional mobile experience
 * Inspired by SportMember - clean, minimal, focused on utility
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Home, Calendar, Users, Trophy, Settings, ArrowLeft, Plus, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthProvider, useAuth } from '../components/SecureAuth';
import { useHomepageData, formatMatchDate, formatMatchTime } from '../hooks/useHomepageData';

type Screen = 'home' | 'fixtures' | 'teams' | 'results' | 'settings';

function CleanMobileApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const { user, profile, loading, signOut } = useAuth();

  const handleScreenChange = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const hasCoachAccess = profile && (profile.role === 'coach' || profile.role === 'admin');

  const getScreenContent = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen user={user} profile={profile} hasCoachAccess={hasCoachAccess} onNavigate={handleScreenChange} />;
      case 'fixtures':
        return <FixturesScreen onBack={() => setCurrentScreen('home')} />;
      case 'teams':
        return <TeamsScreen onBack={() => setCurrentScreen('home')} />;
      case 'results':
        return <ResultsScreen onBack={() => setCurrentScreen('home')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setCurrentScreen('home')} user={user} profile={profile} onSignOut={signOut} />;
      default:
        return <HomeScreen user={user} profile={profile} hasCoachAccess={hasCoachAccess} onNavigate={handleScreenChange} />;
    }
  };

  return (
    <>
      <Head>
        <title>RVR AFC</title>
        <meta name="description" content="Rivervalley Rangers AFC" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#fc7001" />
        <link rel="manifest" href="/mobile-manifest.json" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Clean Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/images/logo.png" alt="RVR AFC" width={32} height={32} className="rounded" />
            <h1 className="font-semibold text-gray-900">RVR AFC</h1>
          </div>
          <Settings size={20} className="text-gray-600" onClick={() => setCurrentScreen('settings')} />
        </header>

        {/* Screen Content */}
        <main className="pb-16">
          {getScreenContent()}
        </main>

        {/* Clean Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
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
                currentScreen === item.id ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

// Clean Home Screen
function HomeScreen({ user, profile, hasCoachAccess, onNavigate }: {
  user: any;
  profile: any;
  hasCoachAccess: boolean;
  onNavigate: (screen: Screen) => void;
}) {
  const { latestResult, nextFixture, latestNews, loading } = useHomepageData();

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {user ? `Welcome back, ${profile?.full_name?.split(' ')[0]}` : 'Welcome to RVR AFC'}
        </h2>
        <p className="text-gray-600 text-sm">
          {user ? 'Your team management dashboard' : 'Stay updated with fixtures, results and team news'}
        </p>
        {profile?.role && (
          <div className="mt-2">
            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
              {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </span>
          </div>
        )}
      </div>

      {/* Next Match */}
      {nextFixture && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Next Match</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {formatMatchDate(nextFixture.matchDate)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{nextFixture.homeTeam}</span>
            <div className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-gray-600">vs</div>
            <span className="font-medium text-gray-900">{nextFixture.awayTeam}</span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {formatMatchTime(nextFixture.matchTime)}
            {nextFixture.venue && ` • ${nextFixture.venue}`}
          </div>
        </div>
      )}

      {/* Latest Result */}
      {latestResult && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Latest Result</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {formatMatchDate(latestResult.matchDate)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{latestResult.homeTeam}</span>
            <div className="px-3 py-1 bg-gray-900 text-white rounded text-sm font-medium">
              {latestResult.homeScore} - {latestResult.awayScore}
            </div>
            <span className="font-medium text-gray-900">{latestResult.awayTeam}</span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <ActionCard
          title="View Fixtures"
          description="Upcoming matches"
          onClick={() => onNavigate('fixtures')}
        />
        <ActionCard
          title="Latest Results"
          description="Recent match results"
          onClick={() => onNavigate('results')}
        />
        <ActionCard
          title="Team Info"
          description="Squad details"
          onClick={() => onNavigate('teams')}
        />
        <ActionCard
          title="Club Contact"
          description="Get in touch"
          onClick={() => window.open('/contact', '_blank')}
        />
      </div>

      {/* Coach Tools */}
      {hasCoachAccess && (
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <h3 className="font-semibold text-gray-900 mb-3">Coach Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => window.open('/match-recorder', '_blank')}
              className="p-3 bg-white rounded border border-orange-200 text-left"
            >
              <div className="font-medium text-gray-900">Record Match</div>
              <div className="text-sm text-gray-600">Log results</div>
            </button>
            <button
              onClick={() => window.open('/match-central', '_blank')}
              className="p-3 bg-white rounded border border-orange-200 text-left"
            >
              <div className="font-medium text-gray-900">Match Central</div>
              <div className="text-sm text-gray-600">Team management</div>
            </button>
          </div>
        </div>
      )}

      {/* Login Prompt */}
      {!user && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">Team Access</h3>
          <p className="text-sm text-gray-600 mb-3">
            Sign in to access match recording and team management tools.
          </p>
          <button
            onClick={() => window.open('/login?returnTo=/mobile-clean', '_blank')}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}

// Clean Action Card Component
function ActionCard({ title, description, onClick }: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-4 bg-white rounded-lg border border-gray-200 text-left hover:border-orange-200 transition-colors"
    >
      <div className="font-medium text-gray-900">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{description}</div>
    </button>
  );
}

// Clean Screen Components
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
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-orange-500">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Fixtures</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : fixtures.length === 0 ? (
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <p className="text-gray-600">No upcoming fixtures scheduled</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fixtures.map((fixture, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{formatMatchDate(fixture.match_date)}</span>
                <span className="text-sm text-gray-500">{formatMatchTime(fixture.match_time)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{fixture.home_team}</span>
                <div className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">vs</div>
                <span className="font-medium text-gray-900">{fixture.away_team}</span>
              </div>
              {fixture.venue && (
                <div className="mt-2 text-sm text-gray-600">{fixture.venue}</div>
              )}
            </div>
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
        <button onClick={onBack} className="mr-4 text-orange-500">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Teams</h2>
      </div>

      <div className="space-y-3">
        {[
          { name: 'First Team', manager: 'John Smith', players: 22 },
          { name: 'Reserve Team', manager: 'Mike Jones', players: 18 },
          { name: 'Youth Team', manager: 'Sarah Wilson', players: 16 },
        ].map((team, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="font-semibold text-gray-900">{team.name}</div>
            <div className="text-sm text-gray-600 mt-1">Manager: {team.manager}</div>
            <div className="text-sm text-gray-600">{team.players} players</div>
          </div>
        ))}
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
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-orange-500">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Recent Results</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
          <p className="text-gray-600">No recent results</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{formatMatchDate(result.match_date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{result.home_team}</span>
                <div className="px-3 py-1 bg-gray-900 text-white rounded text-sm font-medium">
                  {result.home_score} - {result.away_score}
                </div>
                <span className="font-medium text-gray-900">{result.away_team}</span>
              </div>
            </div>
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
  onSignOut: () => void;
}) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-orange-500">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      </div>

      {user && (
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Account</h3>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-gray-600">Name: </span>
              <span className="text-gray-900">{profile?.full_name || 'Not set'}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Email: </span>
              <span className="text-gray-900">{user.email}</span>
            </div>
            {profile?.role && (
              <div className="text-sm">
                <span className="text-gray-600">Role: </span>
                <span className="text-gray-900">{profile.role}</span>
              </div>
            )}
          </div>
          <button
            onClick={onSignOut}
            className="mt-4 text-red-600 text-sm font-medium"
          >
            Sign Out
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">Links</h3>
        <div className="space-y-3">
          <button
            onClick={() => window.open('/home', '_blank')}
            className="block w-full text-left text-sm text-gray-900"
          >
            Desktop Website
          </button>
          <button
            onClick={() => window.open('/contact', '_blank')}
            className="block w-full text-left text-sm text-gray-900"
          >
            Contact Club
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App with Auth Provider
export default function CleanMobileAppPage() {
  return (
    <AuthProvider>
      <CleanMobileApp />
    </AuthProvider>
  );
}