/**
 * Match Recorder Authentication API
 * 
 * © 2025 OneZeroNine Premium Football Club Template
 * Developer: OneZeroNine (onezeronine@gmail.com)
 * AI Collaboration: Claude (Anthropic)
 * 
 * Secure authentication for match recording access.
 * Provides JWT-based session management for authorized match recorders.
 */

import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Demo users for match recording (in production, these would be in database)
const MATCH_RECORDERS = [
  {
    id: 'coach1',
    username: 'coach',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMgOURAR.rYqoHgeCjJW1OBYyX1Dn4qjl9.',
    name: 'Head Coach',
    role: 'coach',
    teams: ['u16-boys', 'u18-boys']
  },
  {
    id: 'manager1', 
    username: 'manager',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMgOURAR.rYqoHgeCjJW1OBYyX1Dn4qjl9.',
    name: 'Team Manager',
    role: 'manager',
    teams: ['u14-girls', 'u16-girls']
  },
  {
    id: 'admin1',
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    name: 'Administrator',
    role: 'admin',
    teams: ['*'] // Access to all teams
  }
];

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.error('WARNING: JWT_SECRET environment variable not set!');
  return 'insecure-default-change-immediately';
})();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await handleLogin(req, res);
  } else if (req.method === 'GET') {
    await handleVerify(req, res);
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleLogin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password required',
        success: false
      });
    }

    // Find user
    const user = MATCH_RECORDERS.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        success: false
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        error: 'Invalid credentials', 
        success: false
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        teams: user.teams,
        iat: Date.now()
      },
      JWT_SECRET,
      { expiresIn: '8h' } // Match recording sessions shouldn't be too long
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        teams: user.teams
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      success: false
    });
  }
}

async function handleVerify(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        valid: false
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Check if user still exists (in production, check database)
    const user = MATCH_RECORDERS.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'User no longer exists',
        valid: false
      });
    }

    res.status(200).json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        teams: user.teams
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      error: 'Invalid token',
      valid: false
    });
  }
}