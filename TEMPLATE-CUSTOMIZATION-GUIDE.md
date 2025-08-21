# 🏆 Football Club Website Template - Customization Guide

This guide helps you customize the Rivervalley Rangers website template for your own football club.

## 📁 File Structure for Media

Create these folders in your `public` directory:

```
public/
├── images/
│   ├── hero-main.jpg              # Main hero image/video
│   ├── logo.png                   # Club logo
│   ├── news/
│   │   └── featured-story.jpg     # Featured news stories
│   ├── sponsors/
│   │   ├── main-sponsor.png       # Sponsor logos
│   │   ├── kit-sponsor.png
│   │   ├── transport-sponsor.png
│   │   └── refreshments-sponsor.png
│   ├── gallery/
│   │   ├── match-action-1.jpg     # Gallery photos
│   │   ├── training-1.jpg
│   │   ├── community-1.jpg
│   │   └── awards-1.jpg
│   └── teams/
│       ├── boys-team.jpg          # Team photos
│       ├── girls-team.jpg
│       └── senior-team.jpg
└── videos/
    └── hero-main.mp4              # Optional hero video
```

## 🎯 Quick Customization Checklist

### 1. Basic Club Information
- [ ] Update club name in `/src/pages/index.tsx` and `/src/pages/home.tsx`
- [ ] Change motto/tagline in hero section
- [ ] Update establishment year (currently 1981)
- [ ] Replace logo in `/public/images/logo.png`

### 2. Hero Section (`/src/pages/home.tsx`)
- [ ] Add hero image: `/public/images/hero-main.jpg`
- [ ] OR add hero video: `/public/videos/hero-main.mp4`
- [ ] Update club name in hero text
- [ ] Customize motto/tagline

### 3. Sponsors Section
- [ ] Add sponsor logos to `/public/images/sponsors/`
- [ ] Update sponsor names and categories
- [ ] Customize sponsorship packages

### 4. Social Media Integration
- [ ] Update Instagram handle (@rvrfc1981 → @yourclub)
- [ ] Update Facebook page URLs
- [ ] Add Instagram feed embed code
- [ ] Add Facebook feed embed code

### 5. News & Content
- [ ] Update featured story headline and content
- [ ] Add featured news image
- [ ] Customize match results and fixtures
- [ ] Update community stories

### 6. Team Colors & Branding
- [ ] Update primary colors (currently green/blue)
- [ ] Customize button colors and hover states
- [ ] Update gradient backgrounds

## 🎨 Color Customization

The template uses these main colors:
- **Primary Green**: `bg-green-600` (buttons, headers)
- **Secondary Blue**: `bg-blue-600` (accents, links)
- **Orange**: `bg-orange-600` (CTAs, highlights)

To change colors globally, search and replace in all files:
- `green-600` → `your-primary-600`
- `blue-600` → `your-secondary-600`
- `orange-600` → `your-accent-600`

## 📸 Image Specifications

### Hero Image/Video
- **Image**: 1920x1080px minimum, landscape, JPG/PNG
- **Video**: MP4 format, under 10MB, 10-30 seconds max

### Sponsor Logos
- **Format**: PNG with transparent background preferred
- **Size**: 400x200px maximum
- **Background**: Transparent or white

### News/Gallery Images
- **Size**: 800x400px minimum for featured images
- **Format**: JPG/PNG
- **Orientation**: Landscape preferred

### Team Photos
- **Size**: 600x400px minimum
- **Format**: JPG/PNG
- **Content**: Team group photos, action shots

## 🔧 Advanced Customization

### Adding New Pages
1. Copy existing page structure
2. Update breadcrumb navigation
3. Add to main navigation menu
4. Follow existing design patterns

### Social Media Integration
1. **Instagram**: Use SnapWidget or Instagram Basic Display API
2. **Facebook**: Use Facebook Page Plugin
3. **Replace placeholder divs** with embed codes

### SEO Optimization
1. Update page titles in each component
2. Add meta descriptions
3. Update alt text for all images
4. Update sitemap and robots.txt

## 🚀 Quick Start Steps

1. **Fork/Clone** the repository
2. **Replace** `/public/images/logo.png` with your club logo  
3. **Update** club name in `/src/pages/home.tsx`
4. **Add** hero image to `/public/images/hero-main.jpg`
5. **Customize** colors by searching/replacing color classes
6. **Deploy** to Vercel/Netlify

## 📞 Support

For technical support with customization:
- Check the detailed comments in each file
- Look for sections marked with `===` comment blocks
- All media placeholders are clearly marked in code

## 🏆 Template Features Included

✅ Responsive design (mobile-friendly)
✅ Modern animations and transitions  
✅ SEO optimized
✅ Social media integration ready
✅ Sponsor showcase areas
✅ News and events sections
✅ Team pages structure
✅ Contact and registration forms
✅ Gallery and media sections
✅ Admin-friendly content areas

---

**Made for grassroots football clubs worldwide** 🌍⚽