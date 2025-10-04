# Changelog

All notable changes to this project will be documented in this file.

## [8.1.3] - 2025-10-04

### Added
- **Comprehensive Match Management System**: Complete overhaul of match tracking capabilities
  - MatchStatusManager component for real-time match status updates
  - Enhanced match recorder with improved mobile support
  - Match notifications system for live updates and alerts
  - New hero video asset (rvr-drone-7.mp4) for enhanced visual experience

### New Admin Features
- **Admin API Endpoints**: Full suite of match management APIs
  - `list-matches.ts` - Advanced match listing and filtering
  - `update-match-status.ts` - Real-time match status management
  - `migrate-cancellation-fields.ts` - Database migration utilities
  - `run-sql.ts` - Secure admin SQL operations
- **Database Migration**: Added cancellation fields migration SQL

### Enhanced Features
- **MatchCentralContent**: Improved match tracking with better UX (234 lines optimized)
- **Mobile App**: Enhanced mobile experience with match features (+219 additions)
- **Match Recorder**: Better functionality and mobile responsiveness (+34 improvements)
- **Team Colors**: Updated match-type-colors.ts for improved team colorization
- **TypeScript Support**: Enhanced match-tracker types for better development experience

### Technical Improvements
- Real-time match status management across the platform
- Enhanced mobile responsiveness for match-related features
- Improved error handling and user feedback systems
- Better admin match management capabilities with security controls

---

## [8.1.1] - 2025-10-04

### Fixed
- **Home Page Layout**: Fixed match score layout to prevent wrapping with long team names
  - Score badges now stay on same line using `flex-shrink-0` and `whitespace-nowrap`
  - Team names can wrap naturally while keeping score inline
  - Improved responsive layout with consistent gap spacing
  - Applied to both "Latest Result" and "Next Match" boxes

### Technical Improvements
- **CSS Layout**: Enhanced flexbox layout for better responsive behavior
- **User Experience**: Cleaner visual presentation of match information

---

## [6.0.17] - 2025-09-21

### Fixed
- **React Hooks Error**: Fixed "Rendered more hooks than during the previous render" error in RequireAuth component
  - Restructured component to ensure all hooks are called consistently on every render
  - Moved all useEffect hooks before conditional returns to comply with React Rules of Hooks
  - Authentication flow now stable without hook violations

### Changed
- **Footer Simplification**: Simplified footer from complex expandable design (285 lines) to clean minimal layout (41 lines)
  - Removed complex animations and expandable content
  - Focused on essential links and club information
  - Improved performance and maintainability

### Technical Improvements
- **Authentication System**: Consolidated multiple conflicting auth systems into single SecureAuth approach
- **Navigation Links**: Updated all navigation to use `/match-central-secure` instead of `/match-central`
- **Login Flow**: Fixed redirect loop by updating LoginButton to redirect to `/welcome` after login

### Removed
- Deleted legacy authentication files:
  - `src/contexts/AuthContext.tsx`
  - `src/lib/supabase-auth.ts`
  - `src/pages/auth-login.tsx`
  - `src/pages/match-central/login.tsx`

---

## [6.0.16] - Previous Version

### Added
- Epic 3D animated welcome dashboard with glass morphism effects
- Role-based authentication system with SecureAuth
- Horizontal CTA layout for better role access
- Dynamic background and particle effects
- Mouse tracking and cursor interactions

### Technical Notes
- Authentication system uses Supabase with fallback demo accounts
- Demo credentials: `demo@rvrfc.com` / `demo123`
- All authenticated pages wrapped with RequireAuth component
- Role-based access control for admin, coach, manager, volunteer roles