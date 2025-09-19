# 🔐 Security Migration Plan

## Current Security Issues

### 🚨 Critical Vulnerabilities
1. **Client-Side Password Storage**: NEXT_PUBLIC_* variables expose passwords to all users
2. **Hardcoded Credentials**: Multiple files contain hardcoded passwords
3. **Console Logging**: Passwords logged to browser console (admin.tsx:451)
4. **Multiple Auth Systems**: 5+ different authentication methods
5. **No Session Security**: localStorage/sessionStorage easily manipulated

### 📍 Files with Security Issues
- `match-central.tsx` - NEXT_PUBLIC_MATCH_CENTRAL_PASS
- `admin.tsx` - NEXT_PUBLIC_ADMIN_PASS + console.log passwords
- `LoginPopup.tsx` - Hardcoded credentials
- `InlineEditor.tsx` - Multiple credential checks
- `auth-login.tsx` - Exposed password
- Multiple other files with localStorage auth

## 🎯 Recommended Solution: Supabase Auth + RLS

### Benefits
- ✅ **Server-side authentication** - passwords never touch client
- ✅ **JWT tokens** with automatic expiration
- ✅ **Row Level Security** - database enforces permissions
- ✅ **Single sign-on** across entire app
- ✅ **Email verification** and password reset
- ✅ **Audit trail** of all auth events

### Architecture
```
User Login → Supabase Auth → JWT Token → RLS Policies → Database Access
```

## 🔄 Migration Steps

### Phase 1: Secure Foundation
1. Create proper user table with roles
2. Set up RLS policies
3. Remove all client-side password checks
4. Implement secure login component

### Phase 2: Consolidate Auth
1. Replace Match Central auth with Supabase
2. Replace demo auth with real accounts
3. Update admin checks to use database
4. Remove all hardcoded passwords

### Phase 3: Security Hardening
1. Add proper session management
2. Implement secure logout
3. Add audit logging
4. Security testing

## 🛡️ Immediate Actions Needed

1. **STOP using NEXT_PUBLIC_ for passwords** - these are public!
2. **Remove console.log statements** with credentials
3. **Create emergency admin access** through database
4. **Implement proper Supabase auth flow**

## 🔧 Emergency Admin Access

For development, create admin via SQL:
```sql
-- Create secure admin user
INSERT INTO tracker_users (
  id, email, username, full_name, role, 
  permissions, is_active
) VALUES (
  gen_random_uuid(),
  'admin@rvr.ie',
  'admin',
  'Site Administrator', 
  'admin',
  ARRAY['*'],
  true
);
```

Then use Supabase dashboard to create auth user with same email.