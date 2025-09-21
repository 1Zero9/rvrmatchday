# Changelog

All notable changes to this project will be documented in this file.

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