import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import StandardLayout from '../../components/StandardLayout';

export default function MatchCentralLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple password check - replace with proper auth later
    if (password === 'matchday2024') {
      // Store auth in localStorage for now
      localStorage.setItem('match-central-auth', 'authenticated');
      router.push('/match-central');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
    
    setLoading(false);
  };

  return (
    <StandardLayout>
      <div className="min-h-screen bg-gradient-to-br from-club-primary to-club-secondary flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-club-primary to-club-primary-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">⚽</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Match Central</h1>
            <p className="text-gray-600">Enter password to access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-club-primary focus:border-club-primary"
                placeholder="Enter password..."
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-club-primary to-club-primary-dark hover:from-club-primary-dark hover:to-club-primary text-white py-3 px-4 rounded-lg font-bold disabled:opacity-50 transition-all duration-300"
            >
              {loading ? 'Checking...' : 'Access Match Central'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-club-primary hover:text-club-primary-dark font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </StandardLayout>
  );
}