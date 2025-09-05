# 🤖 Claude AI Development Guidelines

## 📋 SESSION STARTUP PROTOCOL

**IMPORTANT: At the start of EVERY new session, please:**

1. **Review Todo List**: Ask Claude to check current todos
2. **Use This Phrase**: *"Review the todo list"*
3. **Admin Access**: http://localhost:3000/admin (admin/rvrfc2025)

This ensures continuity and efficient task management across sessions.

---

## 🎯 Todo List Integration

### Automatic Sync System
- **TodoWrite Tool** → **Admin Dashboard** (automatic)
- **Persistent Storage** → Tasks survive sessions
- **Priority Classification** → Auto-assigned based on content
- **Due Dates** → Calculated by priority level

### Task Categories (Auto-detected):
- **Design**: image, hero, background, visual, styling
- **Content**: text, copy, writing, content updates  
- **Development**: code, nav, routes, functionality
- **Maintenance**: backup, updates, system tasks
- **Marketing**: SEO, social media, analytics

### Priority Levels (Auto-assigned):
- **Critical** (1 day): urgent, breaking, security, critical
- **High** (3 days): important, major, priority fixes
- **Medium** (7 days): standard tasks, improvements
- **Low** (14 days): nice-to-have, minor enhancements

---

## 🚀 Development Workflow

### 1. Session Start
```
User: Review the todo list
Claude: [Shows current in-progress and pending tasks]
Claude: [Suggests what to work on based on priority]
```

### 2. Task Execution
- Use TodoWrite tool for ALL task tracking
- Mark tasks in_progress when starting
- Mark completed when finished
- Add new tasks as they're discovered

### 3. Session End
- Update TodoWrite with current status
- Ensure all work is reflected in todos
- Admin dashboard automatically syncs

---

## 🏗️ Site Architecture

### Template System:
- **StandardLayout**: Traditional pages (home, news, gallery, etc.)
- **GlassPageTemplate**: Modern glass morphism pages (about, teams, etc.)
- **Match Tracker**: Premium feature set

### Key Pages Status:
- ✅ **Working**: All main navigation pages functional
- 🎨 **Missing Images**: 9 glass morphism pages need backgroundImage props
- 🔧 **In Progress**: Auth system improvements, todo integration

### Navigation Structure:
```
Home → About (dropdown) → Teams (dropdown) → Matches → Volunteer → Contact (dropdown)
```

Contact dropdown includes: Contact Us, Join Club, Trials, Become Coach

---

## 🛠️ Current Priorities

### High Priority Tasks:
1. **Hero Images**: Add backgroundImage props to glass morphism pages
2. **Authentication**: Implement proper JWT/session system
3. **Database Backup**: Automated backup system

### Medium Priority:
4. **Sponsor Logos**: Replace placeholders with actual logos
5. **SEO Audit**: Meta tags, alt texts, structured data
6. **Content Updates**: Refresh team information

---

## 🔐 Admin System

### Access:
- **URL**: http://localhost:3000/admin
- **Credentials**: admin / rvrfc2025 (demo - replace in production)

### Features:
- **Dashboard**: Site overview, recent changes, system status
- **Todo List**: Full task management with filtering
- **Site Map**: Complete page analysis (moved from public)
- **Changelog**: Development history
- **System Info**: Technical details and version info

---

## 📂 File Structure

### Key Directories:
```
/src/pages/          # Next.js pages
/src/components/     # Reusable components  
/src/utils/          # Utility functions (todoSync.ts)
/src/pages/api/      # API endpoints
```

### Important Files:
- `admin.tsx` - Admin dashboard with todo integration
- `AdminTodoList.tsx` - Todo management component
- `todoSync.ts` - Claude todo sync utility
- `StandardLayout.tsx` - Main site navigation
- `GlassPageTemplate.tsx` - Glass morphism pages

---

## 🎨 Design System

### Glass Morphism Pages:
- Backdrop blur effects
- Translucent backgrounds  
- Smooth animations
- Hero image backgrounds
- Quick action cards

### Team Color System:
**NEW: Smart Team Colorization**
- **RVR Main Teams**: Brand burgundy/maroon colors (`#A32A4C`)
- **RVR Girls Teams**: Brand colors with pink accent (`#C44771`, `#E91E63`)
- **Opponent Teams**: Neutral gray-blue (`#64748B`)

**Implementation:**
- `src/lib/team-colors.ts` - Color detection and utilities
- `src/styles/colors.css` - CSS variables and utility classes
- Auto-detects team type from name (RVR, RVR Girls, opponents)
- Applied in: CelebrationResultCard, Girls team page, match displays

**Usage:**
```typescript
import { getTeamColorClasses } from '../lib/team-colors';
const colors = getTeamColorClasses(teamName);
// Returns: { background, text, border, gradient, lightBackground }
```

### Missing backgroundImage Props:
1. `/join/inclusive.tsx`
2. `/get-involved/events.tsx` 
3. `/members/feedback.tsx`
4. `/members/faq.tsx`
5. `/club/values.tsx`
6. `/members/parents.tsx`
7. `/fundraising.tsx`
8. `/shop.tsx`
9. `/members/index.tsx`

---

## 🧪 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Code linting
npm run typecheck    # TypeScript checking
```

### Testing URLs:
- **Home**: http://localhost:3000/home
- **Admin**: http://localhost:3000/admin  
- **Teams**: http://localhost:3000/teams/boys
- **Contact**: http://localhost:3000/contact

---

## 📝 Best Practices

### For Claude Development:
1. **Always start sessions** with todo review
2. **Use TodoWrite tool** for all task tracking
3. **Mark progress** as in_progress → completed
4. **Add context** in todo descriptions
5. **Test changes** before marking complete

### Code Standards:
- TypeScript strict mode
- Tailwind CSS utilities
- Framer Motion animations
- Responsive design (mobile-first)
- Accessibility considerations

---

## 🎯 Success Metrics

### Site Performance:
- ✅ All 68+ pages working (0 broken links)
- ✅ Mobile-responsive navigation
- ✅ Glass morphism design system
- ✅ Admin dashboard with todo management

### Current Status:
- **Pages**: 68+ functional, 0 broken links
- **Templates**: 2 main layouts (Standard/Glass)
- **Admin**: Full dashboard with todo integration
- **Security**: Demo auth (needs production upgrade)

---

**Remember: Start every session with "Review the todo list" for maximum efficiency! 🚀**