# 🔐 RVR Match Central - Authentication System

## 🎯 Overview

The RVR Match Central authentication system provides secure access control for the club's match management tools. It supports multiple user roles and includes a streamlined account request workflow.

## 🏗️ System Architecture

### User Roles & Permissions

| Role | Permissions | Description |
|------|-------------|-------------|
| **Admin** | `*` (all) | Full system access, user management |
| **Coach** | `view_matches`, `create_matches`, `record_events`, `manage_teams`, `view_stats` | Complete team management |
| **Manager** | `view_matches`, `create_matches`, `record_events`, `view_stats` | Match recording and coordination |
| **Parent** | `view_matches`, `view_stats` | View-only access for their child's team |
| **Volunteer** | `view_matches` | Basic match viewing for volunteers |

### Database Schema

#### `tracker_users` Table
```sql
- id: UUID (auth.users reference)
- email: TEXT (unique)
- username: TEXT (unique) 
- full_name: TEXT
- role: TEXT (admin|coach|manager|parent|volunteer)
- teams: TEXT[] (team IDs user has access to)
- permissions: TEXT[] (specific permissions)
- is_active: BOOLEAN
- created_at, updated_at, last_login: TIMESTAMPTZ
```

#### `account_requests` Table
```sql
- id: UUID (primary key)
- email, first_name, last_name: TEXT
- phone: TEXT (optional)
- requested_role: TEXT
- team_interest: TEXT[] 
- experience, reason: TEXT
- garda_vetting, safeguarding_course: BOOLEAN
- status: TEXT (pending|approved|denied)
- requested_at, reviewed_at: TIMESTAMPTZ
- reviewer_notes: TEXT
```

## 🚀 User Workflows

### 1. New User Account Request
```
User visits /account-request
↓
Fills out application form:
- Personal information
- Role selection (coach/manager/parent/volunteer)
- Team interests
- Experience/background
- Reason for access
- Compliance certifications (coaches only)
↓
Request submitted to database (status: pending)
↓
Admin reviews in /account-admin
↓
If approved: User account created + welcome email
If denied: Notification sent with reason
```

### 2. User Login Process
```
User visits /match-central (protected)
↓
Redirected to /auth-login
↓
Option 1: Email/Password login (Supabase auth)
Option 2: Temporary access code (fallback)
↓
Authentication successful
↓
Redirected to Match Central dashboard
```

### 3. Admin Account Management
```
Admin accesses /account-admin
↓
Reviews pending requests:
- Applicant details
- Role requirements
- Compliance status
- Experience/background
↓
Approves/Denies with notes
↓
If approved: Auto-creates user account
```

## 🔧 Implementation Files

### Core Authentication
- `/src/contexts/AuthContext.tsx` - React context for auth state
- `/src/lib/supabase-auth.ts` - Supabase authentication functions
- `/src/lib/adminAuth.ts` - Admin privilege checking

### User Interface
- `/src/pages/auth-login.tsx` - Modern login page
- `/src/pages/account-request.tsx` - Account request form
- `/src/pages/account-admin.tsx` - Admin request management

### Database
- `/sql/create_account_requests.sql` - Database migration
- Existing: Supabase auth tables + RLS policies

## 🔄 Migration from Current System

### Current State (Simple Password)
- Single password: `rvrfc2025`
- Stored in sessionStorage
- No user roles or permissions

### New System Features
- ✅ Individual user accounts with Supabase
- ✅ Role-based access control
- ✅ Account request workflow
- ✅ Admin approval process
- ✅ Fallback access code (maintains existing access)
- ✅ Comprehensive audit logging

### Backwards Compatibility
- Temporary access code still works (`rvrfc2025`)
- Existing sessionStorage auth honored
- Gradual migration path for users

## 🛡️ Security Features

### Authentication
- Supabase Auth with email/password
- Row Level Security (RLS) policies
- Session management with expiration
- Secure password requirements

### Authorization
- Role-based permissions system
- Team-specific access control
- Admin privilege validation
- Audit logging for all actions

### Data Protection
- GDPR compliance (first names only for players)
- Encrypted password storage
- Secure API endpoints
- Request rate limiting

## 📋 Admin Setup Checklist

### 1. Database Setup
```sql
-- Run in Supabase SQL editor:
-- 1. Create account_requests table
\i sql/create_account_requests.sql

-- 2. Create tracker_users table (if not exists)
-- See supabase-auth.ts for CREATE_TABLES_SQL
```

### 2. Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Access Points
- **Admin Dashboard**: http://localhost:3000/admin (admin/rvrfc2025)
- **Account Requests**: http://localhost:3000/account-admin
- **User Login**: http://localhost:3000/auth-login
- **Request Form**: http://localhost:3000/account-request

## 🎯 Next Steps

### Immediate (Production Ready)
1. ✅ Account request form
2. ✅ Admin approval interface
3. ✅ Modern login page
4. ✅ Backwards compatibility

### Future Enhancements
1. **Email Notifications**
   - Welcome emails with credentials
   - Request status updates
   - Password reset functionality

2. **Advanced Permissions**
   - Team-specific access controls
   - Seasonal permission updates
   - Parent/child linking

3. **Self-Service Features**
   - Password reset
   - Profile management
   - Team request updates

## 💡 Usage Examples

### For Administrators
1. Review account requests in `/account-admin`
2. Approve coaches with proper vetting
3. Assign team access during approval
4. Monitor user activity in logs

### For New Users
1. Visit `/account-request` to apply
2. Provide role and team details
3. Wait for admin approval (2-3 days)
4. Receive email with login credentials

### For Existing Users (Transition)
1. Use temporary code during transition
2. Request proper account via form
3. Admin creates account manually
4. Migrate to email/password login

---

**Key Achievement**: Complete authentication system with user management, request workflow, and backwards compatibility for seamless transition from simple password to role-based access control.