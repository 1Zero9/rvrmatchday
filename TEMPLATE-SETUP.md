# 🚀 Template Setup Guide

## Quick Customization Checklist

### ✅ Step 1: Basic Setup
- [ ] Clone repository to your local machine
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run dev` to start development server
- [ ] Verify site loads at `http://localhost:3000`

### ✅ Step 2: Club Identity (Priority)
- [ ] Replace `/public/images/logo.png` with your club logo
- [ ] Update club name in `src/components/StandardLayout.tsx` (line 68)
- [ ] Update main title in `src/pages/home.tsx` (line 81)
- [ ] Change "RVR" abbreviation throughout codebase to your club's abbreviation

### ✅ Step 3: Essential Content
- [ ] Update hero section text in `src/pages/home.tsx`
- [ ] Modify glass box actions (lines 120-200 in home.tsx)
- [ ] Update news story content (lines 300-400 in home.tsx)
- [ ] Add your contact information in footer and contact sections

### ✅ Step 4: Navigation & Links
- [ ] Customize navigation menu in `src/components/StandardLayout.tsx`
- [ ] Update mobile menu links (lines 259-264)
- [ ] Verify all links point to correct pages
- [ ] Test mobile navigation functionality

### ✅ Step 5: Images & Media
- [ ] Replace hero background image (`/public/images/homepg-image1.jpg`)
- [ ] Add your club photos to `/public/images/`
- [ ] Update image alt text with your club name
- [ ] Test image loading on all devices

### ✅ Step 6: Colors & Branding
- [ ] Customize color scheme (search for `bg-green-` and `bg-blue-` classes)
- [ ] Update glass box color themes
- [ ] Modify gradient backgrounds to match team colors
- [ ] Test color contrast for accessibility

### ✅ Step 7: Content Sections
- [ ] Update sponsor placeholders with real sponsor information
- [ ] Modify team information sections
- [ ] Update social media links and handles
- [ ] Customize footer content

### ✅ Step 8: Testing & Launch
- [ ] Test on mobile devices (responsive design)
- [ ] Verify all navigation links work
- [ ] Check loading performance
- [ ] Test glass box hover effects
- [ ] Verify mobile menu opens/closes properly

## 🔧 Common Customizations

### Change Club Name Globally
Search and replace these terms throughout the codebase:
- "Rivervalley Rangers AFC" → "Your Club Name FC"
- "RVR" → "YCN" (your club abbreviation)
- "Rivervalley Rangers" → "Your Club Name"

### Update Glass Box Actions
In `src/pages/home.tsx` around line 120, modify:
```jsx
<h3 className="text-xl font-bold mb-2">Your Action</h3>
<p className="text-sm opacity-90 mb-4">Your description</p>
<Link href="/your-link">Your Button Text</Link>
```

### Add New Glass Box
Copy an existing glass box section and modify:
- Change background color: `bg-yourcolor-600/20`
- Update icon emoji
- Modify text and link

### Mobile Optimization
The template automatically hides sections on mobile using `hidden md:block`. 
To show/hide different sections on mobile, modify these classes.

## 📱 Mobile Menu Customization

In `src/components/StandardLayout.tsx`, update mobile navigation (lines 259-264):
```jsx
<Link href="/your-page" onClick={() => setMobileMenuOpen(false)}>
  🏠 Your Page
</Link>
```

## 🎨 Color Theme Customization

Main color classes to update:
- Header gradient: `from-green-700 via-green-600 to-blue-700`
- Glass boxes: `bg-blue-600/20`, `bg-purple-600/20`, etc.
- Buttons: `bg-green-600 hover:bg-green-700`

## 📞 Support

If you need help customizing this template:
1. Check the main TEMPLATE-README.md for detailed documentation
2. Review existing code comments for guidance
3. Test changes in development mode before deploying

## 🎯 Next Steps

Once customization is complete:
1. Build for production: `npm run build`
2. Test production build: `npm run start`
3. Deploy to your hosting platform
4. Set up domain and SSL certificate

---

**Ready to make this template your own! ⚽**