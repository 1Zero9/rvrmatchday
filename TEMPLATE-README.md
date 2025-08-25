# 🏆 Sports Club Website Template - RVR 2025

A modern, responsive website template designed specifically for football/soccer clubs, sports organizations, and community teams.

## ✨ Features

### 🎨 Modern Design
- **Glass morphism design system** with beautiful transparency effects
- **Mobile-first responsive** design optimized for all devices
- **Premium UI/UX** with smooth animations and hover effects
- **Athletic color scheme** with customizable team colors

### 📱 Mobile Experience
- **Simplified mobile navigation** with working burger menu
- **Clean, uncluttered mobile layout** showing only essentials
- **Touch-friendly** interface optimized for smartphones
- **Fast loading** with mobile-optimized content

### 🚀 Core Functionality
- **Hero section** with customizable glass action boxes
- **News & updates** system for club announcements
- **Team information** sections for multiple age groups
- **Match fixtures & results** display areas
- **Join/registration** call-to-action sections
- **Contact information** and social media integration
- **Sponsor showcase** sections
- **Photo gallery** placeholder areas

### 🛠️ Technical Features
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** animations
- **Responsive images** with Next.js Image optimization
- **SEO-friendly** structure
- **Clean code architecture** with reusable components

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/1Zero9/sports-site-rvr-2025-template.git your-club-website
cd your-club-website
npm install
```

### 2. Start Development
```bash
npm run dev
```
Visit `http://localhost:3000` to see your site.

### 3. Customize for Your Club
Follow the customization guide below to make it your own!

## 🎨 Customization Guide

### Club Identity
1. **Replace Logo**: Add your club logo to `/public/images/logo.png`
2. **Update Club Name**: Search and replace "Rivervalley Rangers AFC" with your club name
3. **Change Colors**: Modify the color scheme in Tailwind classes throughout the codebase
4. **Update Branding**: Change "RVR" references to your club's abbreviation

### Content Areas
1. **Hero Images**: Replace placeholder images in `/public/images/`
2. **News Stories**: Update news content in `src/pages/home.tsx`
3. **Team Information**: Customize team details throughout the site
4. **Contact Details**: Update contact information and social media links

### Navigation & Structure
1. **Menu Items**: Modify navigation in `src/components/StandardLayout.tsx`
2. **Page Routes**: Update Next.js routes in `src/pages/`
3. **Glass Boxes**: Customize action buttons in the hero section

## 📂 Key Files to Customize

```
src/
├── pages/
│   ├── home.tsx              # Main homepage content
│   ├── index.tsx             # Entry redirect
│   └── [other-pages]/        # Additional pages
├── components/
│   ├── StandardLayout.tsx    # Main layout & navigation
│   └── Footer.tsx           # Footer component
└── public/
    └── images/
        ├── logo.png         # Your club logo
        ├── homepg-image*.jpg # Hero images
        └── [other-images]   # Additional images
```

## 🎯 Glass Box Actions

The hero section features customizable "glass boxes" - transparent action buttons that can be easily modified:

- **Join Our Club** - Links to registration
- **Fixtures** - Match schedule
- **Results** - Recent match results  
- **Contact** - Contact information
- **News** - Latest club news
- **Teams** - Team information
- **Gallery** - Photo gallery

Customize these in the home.tsx file around line 120.

## 🌈 Color Themes

The template uses a green/blue sports theme by default. Key color classes to modify:
- `bg-green-600` - Primary green
- `bg-blue-600` - Primary blue  
- `text-green-200` - Light green text
- Glass box themes: `bg-blue-600/20`, `bg-purple-600/20`, etc.

## 📱 Mobile Optimization

The template automatically hides complex sections on mobile:
- Sponsor sections (hidden on mobile)
- Social media feeds (desktop only)
- Gallery previews (desktop only)
- News sidebars (desktop only)

This creates a fast, focused mobile experience.

## 🛠️ Development Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

## 📸 Image Specifications

- **Logo**: 160x160px PNG with transparent background
- **Hero Images**: 1920x1080px minimum, landscape orientation
- **News Images**: 800x400px minimum, landscape orientation
- **Sponsor Logos**: 400x200px maximum, PNG preferred

## 🎨 Design Philosophy

This template follows modern web design principles:
- **Glass morphism** for premium visual appeal
- **Mobile-first** responsive design
- **Content hierarchy** with clear visual structure
- **Athletic aesthetics** appropriate for sports organizations
- **Performance optimized** for fast loading

## 🤝 Support & Credits

**Template Created By:**
- **Developer**: OneZeroNine (onezeronine@gmail.com)
- **AI Collaboration**: Claude (Anthropic)

**Originally Built For**: Rivervalley Rangers AFC

## 📄 License

This template is provided as-is for sports clubs and community organizations. 
Feel free to customize and use for your club's website.

---

**Happy Building! ⚽🏆**

*Transform this template into your club's digital home.*