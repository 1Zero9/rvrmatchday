import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function TempAdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Not Available</h1>
          <p>This temp login is only available in development mode.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Temporary password for dev testing
    if (password === 'devadmin123') {
      // Set a temporary session flag
      localStorage.setItem('temp_admin', 'true');
      router.push('/admin');
    } else {
      setMessage('Incorrect password. Use: devadmin123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🚨</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Temp Admin Login
          </h1>
          <p className="text-gray-600 text-sm">
            For development testing only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Development Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter temp password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {message && (
            <div className="p-4 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200"
          >
            Access Admin (Dev Only)
          </button>

          <div className="text-center text-xs text-gray-500">
            <p>🔑 Password: devadmin123</p>
            <p>⚠️ This bypasses database authentication</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}