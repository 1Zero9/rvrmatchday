/**
 * 📱 RVR MOBILE APP - SIMPLIFIED
 * Clean, simple mobile interface inspired by ClubZap
 * Focus on essential features without complexity
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Home, Calendar, Users, Trophy, Settings, Phone, Edit3, Shield, Plus, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Screen = 'home' | 'fixtures' | 'teams' | 'results' | 'settings' | 'match-recorder' | 'match-central';

export default function MobileApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [showMenu, setShowMenu] = useState(false);
  // Simple navigation handler
  const handleScreenChange = (screen: Screen) => {
    setCurrentScreen(screen);
    setShowMenu(false);
  };

  // Simple screen content (no complex components)
  const getScreenContent = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={handleScreenChange} />;
      case 'fixtures':
        return <FixturesScreen onBack={() => setCurrentScreen('home')} />;
      case 'teams':
        return <TeamsScreen onBack={() => setCurrentScreen('home')} />;
      case 'results':
        return <ResultsScreen onBack={() => setCurrentScreen('home')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setCurrentScreen('home')} />;
      case 'match-recorder':
        return <MatchRecorderScreen onBack={() => setCurrentScreen('home')} />;
      case 'match-central':
        return <MatchCentralScreen onBack={() => setCurrentScreen('home')} />;
      default:
        return <HomeScreen onNavigate={handleScreenChange} />;
    }
  };


  return (
    <>
      <Head>
        <title>RVR AFC Mobile</title>
        <meta name="description" content="Rivervalley Rangers AFC Mobile" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#972A4C" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Simple Header */}
        <header className="bg-[#972A4C] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/images/logo.png" alt="RVR" width={32} height={32} className="rounded" />
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
        <main className="pb-16">
          {getScreenContent()}
        </main>

        {/* Simple Bottom Navigation */}
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
function HomeScreen({ onNavigate }: { 
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RVR AFC</h2>
        <p className="text-gray-600">Your club at your fingertips</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ActionCard
          title="Fixtures"
          description="View upcoming matches"
          icon={<Calendar className="text-[#972A4C]" size={24} />}
          onClick={() => onNavigate('fixtures')}
        />
        <ActionCard
          title="Teams"
          description="Our squads"
          icon={<Users className="text-[#972A4C]" size={24} />}
          onClick={() => onNavigate('teams')}
        />
        <ActionCard
          title="Results"
          description="Recent matches"
          icon={<Trophy className="text-[#972A4C]" size={24} />}
          onClick={() => onNavigate('results')}
        />
        <ActionCard
          title="Contact"
          description="Get in touch"
          icon={<Phone className="text-[#972A4C]" size={24} />}
          onClick={() => window.open('/contact', '_blank')}
        />
      </div>

      {/* Coach Tools */}
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4 text-[#972A4C]">
          ⚽ Coach Tools
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <ActionCard
            title="Record Match"
            description="Log match results"
            icon={<Edit3 className="text-[#972A4C]" size={24} />}
            onClick={() => onNavigate('match-recorder')}
          />
          <ActionCard
            title="Match Central"
            description="Manage matches"
            icon={<Shield className="text-[#972A4C]" size={24} />}
            onClick={() => onNavigate('match-central')}
          />
        </div>
      </div>

      {/* Recent News */}
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4">Latest News</h3>
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <h4 className="font-semibold mb-2">Welcome to our new mobile app!</h4>
          <p className="text-gray-600 text-sm">
            Stay connected with RVR AFC on the go. Check fixtures, results, and team information.
          </p>
        </div>
      </div>
    </div>
  );
}

function FixturesScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-[#972A4C]">← Back</button>
        <h2 className="text-xl font-bold">Upcoming Fixtures</h2>
      </div>
      
      <div className="space-y-4">
        <FixtureCard
          homeTeam="RVR AFC U12"
          awayTeam="Lucan United"
          date="Oct 5, 2025"
          time="10:00 AM"
          venue="RVR Pitch"
        />
        <FixtureCard
          homeTeam="Castleknock Celtic"
          awayTeam="RVR AFC U14"
          date="Oct 6, 2025"
          time="11:30 AM"
          venue="Castleknock"
        />
      </div>
    </div>
  );
}

function TeamsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-[#972A4C]">← Back</button>
        <h2 className="text-xl font-bold">Our Teams</h2>
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
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-[#972A4C]">← Back</button>
        <h2 className="text-xl font-bold">Recent Results</h2>
      </div>
      
      <div className="space-y-4">
        <ResultCard
          homeTeam="RVR AFC U12"
          awayTeam="Lucan United"
          homeScore={3}
          awayScore={1}
          date="Sep 28, 2025"
        />
        <ResultCard
          homeTeam="Castleknock Celtic"
          awayTeam="RVR AFC U14"
          homeScore={0}
          awayScore={2}
          date="Sep 27, 2025"
        />
      </div>
    </div>
  );
}

function SettingsScreen({ onBack }: { 
  onBack: () => void;
}) {
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="mr-4 text-[#972A4C]">← Back</button>
        <h2 className="text-xl font-bold">Settings</h2>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => window.open('/home', '_blank')}
          className="w-full text-left p-3 bg-white rounded-lg border hover:bg-gray-50"
        >
          🖥️ Open Desktop Site
        </button>
        
        <button
          onClick={() => window.open('/contact', '_blank')}
          className="w-full text-left p-3 bg-white rounded-lg border hover:bg-gray-50"
        >
          📞 Contact Club
        </button>

        <button
          onClick={() => window.open('/admin', '_blank')}
          className="w-full text-left p-3 bg-white rounded-lg border hover:bg-gray-50"
        >
          ⚙️ Admin Dashboard
        </button>
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
    <button
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left"
    >
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </button>
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
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{date} • {time}</span>
        <span className="text-sm text-gray-500">{venue}</span>
      </div>
      <div className="text-center">
        <span className="font-semibold">{homeTeam}</span>
        <span className="mx-4 text-gray-400">vs</span>
        <span className="font-semibold">{awayTeam}</span>
      </div>
    </div>
  );
}

function TeamCard({ name, manager, players }: {
  name: string;
  manager: string;
  players: string;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Manager: {manager}</span>
        <span>{players} players</span>
      </div>
    </div>
  );
}

function ResultCard({ homeTeam, awayTeam, homeScore, awayScore, date }: {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="text-sm text-gray-500 mb-2">{date}</div>
      <div className="flex justify-between items-center">
        <span className="font-semibold">{homeTeam}</span>
        <div className="bg-[#972A4C] text-white px-3 py-1 rounded">
          {homeScore} - {awayScore}
        </div>
        <span className="font-semibold">{awayTeam}</span>
      </div>
    </div>
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
              <p className="text-gray-600">No matches found</p>
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