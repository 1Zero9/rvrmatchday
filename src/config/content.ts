/**
 * 🎯 MODULAR CONTENT CONFIGURATION SYSTEM
 * 1Zero9.com - OneZeronine Studio
 * 
 * Purpose: Centralized content management for easy template customization
 * Usage: Import and customize for each client/organization
 */

// =====================================
// 🏢 ORGANIZATION CONFIGURATION
// =====================================

export const ORGANIZATION = {
  name: "Your Club Name", // EDIT: Change to client's name
  shortName: "YCN", // EDIT: Abbreviation
  established: "2024", // EDIT: Year established
  website: "yourclub.com", // EDIT: Domain
  email: "hello@yourclub.com", // EDIT: Contact email
  phone: "+1 (555) 123-4567", // EDIT: Phone number
  
  // Social Media
  social: {
    facebook: "https://facebook.com/yourclub",
    instagram: "https://instagram.com/yourclub", 
    twitter: "https://twitter.com/yourclub",
    youtube: "https://youtube.com/yourclub"
  },
  
  // Brand Colors (Tailwind classes)
  colors: {
    primary: "club-primary", // Main brand color
    secondary: "club-secondary", // Secondary color
    accent: "club-accent", // Accent color
    neutral: "club-neutral" // Neutral color
  },
  
  // Location
  location: {
    address: "123 Club Street",
    city: "Your City",
    state: "Your State", 
    zip: "12345",
    country: "Your Country"
  }
};

// =====================================
// 🎨 HERO CONTENT LIBRARY
// =====================================

export const HERO_CONTENT = {
  home: {
    title: "Welcome to Our Community",
    subtitle: "Building connections, creating memories, achieving excellence together",
    backgroundImage: "/images/hero/home-hero.jpg", // EDIT: Replace with local image
    video: "/videos/hero/home-hero.mp4", // EDIT: Optional video
    cta: {
      primary: { text: "Join Us Today", href: "/join" },
      secondary: { text: "Learn More", href: "/about" }
    }
  },
  
  about: {
    title: "Our Story & Values", 
    subtitle: "Discover what makes our community special and how we're building something amazing together",
    backgroundImage: "/images/hero/about-hero.jpg",
    icon: "🏛️"
  },
  
  events: {
    title: "Community Events & Activities",
    subtitle: "Join our vibrant community and help create unforgettable experiences for everyone", 
    backgroundImage: "/images/hero/events-hero.jpg",
    icon: "🎊"
  },
  
  teams: {
    title: "Our Teams & Groups",
    subtitle: "Find your place in our diverse, welcoming community of passionate members",
    backgroundImage: "/images/hero/teams-hero.jpg", 
    icon: "👥"
  },
  
  contact: {
    title: "Get in Touch",
    subtitle: "Ready to join our community? We'd love to hear from you and answer any questions",
    backgroundImage: "/images/hero/contact-hero.jpg",
    icon: "📞"
  }
};

// =====================================
// 📝 PAGE CONTENT TEMPLATES  
// =====================================

export const PAGE_CONTENT = {
  home: {
    welcomeSection: {
      title: "Welcome to Our Community",
      description: "We're more than just an organization - we're a family dedicated to excellence, growth, and making a positive impact in our community.",
      stats: [
        { number: "500+", label: "Active Members" },
        { number: "15+", label: "Years of Excellence" }, 
        { number: "100+", label: "Community Events" },
        { number: "50+", label: "Achievements" }
      ]
    },
    
    featuresSection: {
      title: "What Makes Us Special",
      items: [
        {
          icon: "🌟",
          title: "Excellence",
          description: "We strive for the highest standards in everything we do"
        },
        {
          icon: "🤝", 
          title: "Community",
          description: "Building lasting friendships and supporting each other"
        },
        {
          icon: "📈",
          title: "Growth", 
          description: "Continuous improvement and personal development"
        }
      ]
    }
  },
  
  events: {
    stats: {
      volunteers: "150+",
      eventsPerYear: "50+", 
      totalAttendees: "1000+"
    },
    
    categories: ["All", "Community", "Training", "Social", "Fundraising"],
    
    featured: {
      title: "Summer Community Festival",
      date: "Saturday, July 15th",
      time: "10:00 AM - 6:00 PM",
      location: "Main Venue", 
      description: "Our biggest event of the year! Join us for a day of fun, food, and community connection.",
      image: "/images/events/featured-event.jpg",
      volunteersNeeded: 25,
      spotsLeft: 8
    }
  }
};

// =====================================
// 🧩 MODULAR COMPONENTS CONFIG
// =====================================

export const COMPONENTS = {
  navigation: {
    mainMenuItems: [
      { label: "Home", href: "/home" },
      { label: "About", href: "/about" },
      { label: "Teams", href: "/teams", hasDropdown: true },
      { label: "Events", href: "/events" },
      { label: "Contact", href: "/contact", hasDropdown: true }
    ],
    
    footerLinks: [
      { section: "Quick Links", items: [
        { label: "About Us", href: "/about" },
        { label: "Our Teams", href: "/teams" },
        { label: "Events", href: "/events" },
        { label: "Contact", href: "/contact" }
      ]},
      { section: "Get Involved", items: [
        { label: "Join Us", href: "/join" },
        { label: "Volunteer", href: "/volunteer" },
        { label: "Partnerships", href: "/partnerships" },
        { label: "Support Us", href: "/support" }
      ]}
    ]
  },
  
  quickActions: {
    home: [
      { icon: "🤝", title: "Join Us", description: "Become a member", href: "/join", gradient: "blue" },
      { icon: "📅", title: "Events", description: "See what's happening", href: "/events", gradient: "green" },
      { icon: "👥", title: "Teams", description: "Find your group", href: "/teams", gradient: "purple" },
      { icon: "📞", title: "Contact", description: "Get in touch", href: "/contact", gradient: "orange" }
    ],
    
    events: [
      { icon: "🤝", title: "Volunteer", description: "Join our volunteer team", href: "/volunteer", gradient: "blue" },
      { icon: "💡", title: "Suggest Event", description: "Share your ideas", href: "/contact", gradient: "green" },
      { icon: "📸", title: "Gallery", description: "See past events", href: "/gallery", gradient: "purple" },
      { icon: "📞", title: "Contact", description: "Get in touch", href: "/contact", gradient: "orange" }
    ]
  }
};

// =====================================
// 🎯 SEO & META CONFIGURATION
// =====================================

export const SEO_CONFIG = {
  defaultTitle: `${ORGANIZATION.name} - Community Excellence`,
  defaultDescription: `Join ${ORGANIZATION.name}, a thriving community dedicated to excellence, growth, and making a positive impact. Discover our teams, events, and opportunities.`,
  defaultKeywords: "community, organization, teams, events, membership, excellence",
  defaultImage: "/images/og/default-og.jpg", // EDIT: Social sharing image
  
  pages: {
    home: {
      title: `Welcome to ${ORGANIZATION.name}`,
      description: `Discover ${ORGANIZATION.name} - a vibrant community where excellence meets belonging. Join our teams, attend events, and be part of something special.`
    },
    events: {
      title: `Events & Activities - ${ORGANIZATION.name}`,
      description: `Join exciting community events and activities at ${ORGANIZATION.name}. From social gatherings to skill-building workshops, there's something for everyone.`
    },
    teams: {
      title: `Our Teams - ${ORGANIZATION.name}`,
      description: `Explore our diverse teams and find your perfect fit at ${ORGANIZATION.name}. Join passionate members working towards common goals.`
    }
  }
};

// =====================================
// 🔧 FEATURES & MODULES CONFIG
// =====================================

export const FEATURES = {
  // Enable/disable features for different template packages
  userManagement: true, // Enterprise feature
  eventManagement: true, // Pro feature  
  teamManagement: true, // Standard feature
  gallery: true, // Standard feature
  blog: false, // Optional feature
  ecommerce: false, // Premium add-on
  booking: false, // Premium add-on
  analytics: true, // Pro feature
  
  // Authentication features
  auth: {
    enabled: true,
    registration: true,
    socialLogin: false, // Premium feature
    twoFactor: false // Enterprise feature
  }
};

// =====================================
// 📱 MOBILE CONFIGURATION
// =====================================

export const MOBILE_CONFIG = {
  // Progressive Web App settings
  pwa: {
    enabled: true,
    name: ORGANIZATION.name,
    shortName: ORGANIZATION.shortName,
    description: `${ORGANIZATION.name} Community App`,
    themeColor: "#1f2937", // EDIT: Match brand colors
    backgroundColor: "#ffffff"
  },
  
  // Mobile-specific features
  features: {
    bottomNavigation: true,
    pullToRefresh: true,
    pushNotifications: false, // Premium feature
    offlineMode: false, // Premium feature
    darkMode: true
  }
};

// =====================================
// 🎨 TEMPLATE THEMES
// =====================================

export const THEMES = {
  sports: {
    name: "Sports Club",
    colors: { primary: "blue", secondary: "green", accent: "yellow" },
    fonts: { heading: "Roboto", body: "Open Sans" }
  },
  
  community: {
    name: "Community Organization", 
    colors: { primary: "indigo", secondary: "purple", accent: "pink" },
    fonts: { heading: "Inter", body: "Inter" }
  },
  
  business: {
    name: "Business Network",
    colors: { primary: "gray", secondary: "blue", accent: "green" },
    fonts: { heading: "Poppins", body: "Poppins" }
  },
  
  nonprofit: {
    name: "Non-Profit",
    colors: { primary: "green", secondary: "blue", accent: "orange" },
    fonts: { heading: "Nunito", body: "Nunito" }
  }
};

// =====================================
// 📊 ANALYTICS & TRACKING
// =====================================

export const ANALYTICS = {
  googleAnalytics: "GA_MEASUREMENT_ID", // EDIT: Add client's GA4 ID
  facebookPixel: "FB_PIXEL_ID", // EDIT: Add client's Facebook Pixel
  enabled: FEATURES.analytics,
  
  events: {
    pageView: true,
    buttonClick: true, 
    formSubmit: true,
    fileDownload: true,
    videoPlay: false // Premium feature
  }
};

// =====================================
// 🔐 SECURITY CONFIGURATION
// =====================================

export const SECURITY = {
  // Rate limiting
  rateLimiting: {
    enabled: true,
    requests: 100, // Per hour
    window: 3600000 // 1 hour in ms
  },
  
  // Content Security Policy
  csp: {
    enabled: false, // Enable for production
    reportOnly: true
  },
  
  // CORS settings
  cors: {
    origins: [`https://${ORGANIZATION.website}`, "http://localhost:3000"],
    credentials: true
  }
};

// =====================================
// 📧 EMAIL CONFIGURATION
// =====================================

export const EMAIL = {
  provider: "sendgrid", // or "mailgun", "ses", etc.
  from: ORGANIZATION.email,
  replyTo: ORGANIZATION.email,
  
  templates: {
    welcome: "welcome-template-id",
    eventReminder: "event-reminder-template-id", 
    newsletter: "newsletter-template-id"
  }
};

// Export all configurations
export default {
  ORGANIZATION,
  HERO_CONTENT,
  PAGE_CONTENT,
  COMPONENTS,
  SEO_CONFIG,
  FEATURES,
  MOBILE_CONFIG,
  THEMES,
  ANALYTICS,
  SECURITY,
  EMAIL
};