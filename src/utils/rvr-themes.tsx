/**
 * 🎨 RVR AFC Theme System
 * 
 * Based on official RVR AFC kit colors from Balon Direct shop
 * Mens, Boys, Girls themed color schemes
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  colors: {
    // Header colors
    headerGradient: {
      from: string;
      via: string;
      to: string;
    };
    headerText: string;
    headerAccent: string;
    
    // Content colors
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    
    // Navigation colors
    navActive: string;
    navInactive: string;
    
    // Card colors
    cardBorder: string;
    cardBackground: string;
    
    // Activity indicators
    activityColors: {
      match: string;
      training: string;
      meeting: string;
      event: string;
    };
  };
}

export const RVR_THEMES: Record<string, Theme> = {
  burgundy: {
    id: 'burgundy',
    name: 'burgundy',
    displayName: 'Burgundy',
    description: 'Classic RVR AFC burgundy and gold',
    colors: {
      headerGradient: {
        from: '#7f1d3b', // Deep burgundy
        via: '#991b1b',  // Rich red
        to: '#450a0a'    // Dark burgundy
      },
      headerText: '#ffffff',
      headerAccent: '#fbbf24', // Gold accent
      
      primary: '#991b1b',      // RVR burgundy
      secondary: '#7f1d3b',    // Deeper burgundy
      accent: '#fbbf24',       // Gold
      background: '#f8fafc',   // Light gray
      
      navActive: '#991b1b',
      navInactive: '#6b7280',
      
      cardBorder: '#e5e7eb',
      cardBackground: '#ffffff',
      
      activityColors: {
        match: '#991b1b',     // Burgundy for matches
        training: '#059669',   // Green for training
        meeting: '#7c3aed',    // Purple for meetings
        event: '#ea580c'      // Orange for events
      }
    }
  },

  blue: {
    id: 'blue',
    name: 'blue',
    displayName: 'Blue',
    description: 'Energetic blue and navy combination',
    colors: {
      headerGradient: {
        from: '#1e3a8a', // Navy blue
        via: '#1e40af',  // Royal blue
        to: '#1e293b'    // Dark slate
      },
      headerText: '#ffffff',
      headerAccent: '#3b82f6', // Bright blue
      
      primary: '#2563eb',      // Royal blue
      secondary: '#1e40af',    // Navy blue
      accent: '#60a5fa',       // Light blue
      background: '#f8fafc',   // Light gray
      
      navActive: '#2563eb',
      navInactive: '#6b7280',
      
      cardBorder: '#e5e7eb',
      cardBackground: '#ffffff',
      
      activityColors: {
        match: '#2563eb',     // Blue for matches
        training: '#059669',   // Green for training
        meeting: '#7c3aed',    // Purple for meetings
        event: '#ea580c'      // Orange for events
      }
    }
  },

  pink: {
    id: 'pink',
    name: 'pink',
    displayName: 'Pink',
    description: 'Pink and purple with professional touches',
    colors: {
      headerGradient: {
        from: '#be185d', // Deep pink
        via: '#db2777',  // Bright pink
        to: '#831843'    // Dark pink
      },
      headerText: '#ffffff',
      headerAccent: '#f472b6', // Light pink
      
      primary: '#db2777',      // Bright pink
      secondary: '#be185d',    // Deep pink
      accent: '#f472b6',       // Light pink
      background: '#f8fafc',   // Light gray
      
      navActive: '#db2777',
      navInactive: '#6b7280',
      
      cardBorder: '#e5e7eb',
      cardBackground: '#ffffff',
      
      activityColors: {
        match: '#db2777',     // Pink for matches
        training: '#059669',   // Green for training
        meeting: '#7c3aed',    // Purple for meetings
        event: '#ea580c'      // Orange for events
      }
    }
  },

  purple: {
    id: 'purple',
    name: 'purple',
    displayName: 'Purple',
    description: 'Vibrant purple and violet theme',
    colors: {
      headerGradient: {
        from: '#6366f1', // Indigo
        via: '#8b5cf6',  // Violet
        to: '#a855f7'    // Purple
      },
      headerText: '#ffffff',
      headerAccent: '#fbbf24', // Gold accent
      
      primary: '#8b5cf6',      // Violet
      secondary: '#6366f1',    // Indigo
      accent: '#fbbf24',       // Gold
      background: '#f8fafc',   // Light gray
      
      navActive: '#8b5cf6',
      navInactive: '#6b7280',
      
      cardBorder: '#e5e7eb',
      cardBackground: '#ffffff',
      
      activityColors: {
        match: '#8b5cf6',     // Violet for matches
        training: '#059669',   // Green for training
        meeting: '#7c3aed',    // Purple for meetings
        event: '#ea580c'      // Orange for events
      }
    }
  },

  green: {
    id: 'green',
    name: 'green',
    displayName: 'Green',
    description: 'Fresh emerald and green tones',
    colors: {
      headerGradient: {
        from: '#059669', // Emerald
        via: '#10b981',  // Green
        to: '#047857'    // Dark emerald
      },
      headerText: '#ffffff',
      headerAccent: '#fbbf24', // Gold accent
      
      primary: '#10b981',      // Green
      secondary: '#059669',    // Emerald
      accent: '#fbbf24',       // Gold
      background: '#f8fafc',   // Light gray
      
      navActive: '#10b981',
      navInactive: '#6b7280',
      
      cardBorder: '#e5e7eb',
      cardBackground: '#ffffff',
      
      activityColors: {
        match: '#10b981',     // Green for matches
        training: '#059669',   // Emerald for training
        meeting: '#7c3aed',    // Purple for meetings
        event: '#ea580c'      // Orange for events
      }
    }
  },

  orange: {
    id: 'orange',
    name: 'orange',
    displayName: 'Orange',
    description: 'Bold orange and gold theme',
    colors: {
      headerGradient: {
        from: '#ea580c', // Orange
        via: '#f97316',  // Bright orange
        to: '#c2410c'    // Dark orange
      },
      headerText: '#ffffff',
      headerAccent: '#fbbf24', // Gold accent
      
      primary: '#f97316',      // Bright orange
      secondary: '#ea580c',    // Orange
      accent: '#fbbf24',       // Gold
      background: '#f8fafc',   // Light gray
      
      navActive: '#f97316',
      navInactive: '#6b7280',
      
      cardBorder: '#e5e7eb',
      cardBackground: '#ffffff',
      
      activityColors: {
        match: '#f97316',     // Orange for matches
        training: '#059669',   // Green for training
        meeting: '#7c3aed',    // Purple for meetings
        event: '#ea580c'      // Dark orange for events
      }
    }
  }
};

// Default theme
export const DEFAULT_THEME = 'burgundy';

// Theme management utilities
export const getTheme = (themeId: string): Theme => {
  return RVR_THEMES[themeId] || RVR_THEMES[DEFAULT_THEME];
};

export const getAllThemes = (): Theme[] => {
  return Object.values(RVR_THEMES);
};

export const saveTheme = (themeId: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rvr-theme', themeId);
  }
};

export const loadTheme = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('rvr-theme') || DEFAULT_THEME;
  }
  return DEFAULT_THEME;
};

// CSS custom properties generator
export const generateThemeCSS = (theme: Theme): string => {
  return `
    :root {
      --rvr-header-from: ${theme.colors.headerGradient.from};
      --rvr-header-via: ${theme.colors.headerGradient.via};
      --rvr-header-to: ${theme.colors.headerGradient.to};
      --rvr-header-text: ${theme.colors.headerText};
      --rvr-header-accent: ${theme.colors.headerAccent};
      
      --rvr-primary: ${theme.colors.primary};
      --rvr-secondary: ${theme.colors.secondary};
      --rvr-accent: ${theme.colors.accent};
      --rvr-background: ${theme.colors.background};
      
      --rvr-nav-active: ${theme.colors.navActive};
      --rvr-nav-inactive: ${theme.colors.navInactive};
      
      --rvr-card-border: ${theme.colors.cardBorder};
      --rvr-card-background: ${theme.colors.cardBackground};
      
      --rvr-activity-match: ${theme.colors.activityColors.match};
      --rvr-activity-training: ${theme.colors.activityColors.training};
      --rvr-activity-meeting: ${theme.colors.activityColors.meeting};
      --rvr-activity-event: ${theme.colors.activityColors.event};
    }
  `;
};

// Theme context hook
interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themeId: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeId, setThemeId] = useState(DEFAULT_THEME);
  const [currentTheme, setCurrentTheme] = useState(getTheme(DEFAULT_THEME));

  useEffect(() => {
    const savedTheme = loadTheme();
    setThemeId(savedTheme);
    setCurrentTheme(getTheme(savedTheme));
  }, []);

  const handleSetTheme = (newThemeId: string) => {
    setThemeId(newThemeId);
    setCurrentTheme(getTheme(newThemeId));
    saveTheme(newThemeId);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme: handleSetTheme, themeId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useRVRTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useRVRTheme must be used within a ThemeProvider');
  }
  return context;
};