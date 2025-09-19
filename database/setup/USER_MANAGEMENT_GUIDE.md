# 👥 User Management System - Complete Guide

## 🎯 Overview

A comprehensive user management system with account requests, email notifications, and admin approval workflow.

## 🚀 Features

### ✅ **Account Request System**
- Public account request form (`/account-request`)
- Role-based requests (coach, manager, parent, volunteer)
- Team interest selection
- Automatic email notifications to admins

### ✅ **Admin Approval Workflow**
- Admin review interface (`/account-admin`)
- Approve/deny requests with notes
- Automatic user account creation on approval
- Email notifications to applicants

### ✅ **User Management Dashboard**
- Comprehensive user management (`/user-management`)
- Role management and permissions
- User status controls (active/inactive)
- Team assignments

### ✅ **Email Notification System**
- Admin notifications for new requests
- Welcome emails with temporary passwords
- Rejection emails with custom messages
- Professional HTML email templates

## 📋 Database Tables

### `account_requests`
```sql
- id (UUID, primary key)
- email (TEXT, not null)
- first_name (TEXT, not null)  
- last_name (TEXT, not null)
- phone (TEXT)
- requested_role (TEXT, check constraint)
- team_interest (TEXT[])
- experience (TEXT)
- reason (TEXT, not null)
- garda_vetting (BOOLEAN)
- safeguarding_course (BOOLEAN)
- status (TEXT, default 'pending')
- requested_at (TIMESTAMPTZ)
- reviewed_at (TIMESTAMPTZ)
- reviewer_notes (TEXT)
- reviewer_id (UUID, foreign key)
```

### `tracker_users`
```sql
- id (UUID, primary key, references auth.users)
- email (TEXT, unique, not null)
- username (TEXT, unique, not null)
- full_name (TEXT, not null)
- role (TEXT, check constraint)
- teams (TEXT[])
- permissions (TEXT[])
- is_active (BOOLEAN, default true)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
- last_login (TIMESTAMPTZ)
```

## 🔐 Security Features

### Row Level Security (RLS)
- **account_requests**: Public insert, admin read/update, users can view own
- **tracker_users**: Self-view/update, admin full access
- Proper authentication checks on all operations

### Role-Based Access
- **Admin**: Full user management access
- **Users**: Can view/update own profiles only
- **Public**: Can submit account requests only

## 📧 Email Configuration

### Environment Variables
```env
# Required
ADMIN_EMAIL=admin@yourclub.com

# SMTP Configuration (Option 1)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourclub.com

# SendGrid Configuration (Option 2)
SENDGRID_API_KEY=your-sendgrid-api-key

# Development Mode
NODE_ENV=development  # Logs emails to console
```

### Email Templates
- **Admin Notification**: New account request alerts
- **Welcome Email**: Account approval with temp password
- **Rejection Email**: Polite rejection with optional reason

## 🎯 User Workflow

### 1. Account Request
1. User visits `/account-request`
2. Fills out comprehensive form
3. Submits request
4. System creates database record
5. Admin receives email notification

### 2. Admin Review
1. Admin visits `/account-admin` or `/user-management`
2. Reviews pending requests
3. Approves or denies with notes
4. System creates user account (if approved)
5. Applicant receives email notification

### 3. User Onboarding
1. Approved user receives welcome email
2. Gets temporary password
3. Logs in at `/auth-login`
4. Must change password on first login

## 🔧 API Endpoints

### Email Notifications
**POST** `/api/email/send-notification`

**Request Types:**
- `account_request_admin`: Notify admins of new request
- `account_approved`: Welcome new user
- `account_rejected`: Notify user of rejection

## 🛠️ Installation & Setup

### 1. Database Setup
Run the SQL commands from `SETUP-DATABASE.md`:
```sql
-- Create account_requests table
-- Create tracker_users table  
-- Set up RLS policies
-- Create initial admin user
```

### 2. Environment Configuration
Copy `.env.local.example` to `.env.local` and configure:
- Admin email address
- SMTP or SendGrid credentials (optional for development)

### 3. Email Service Setup (Production)

#### Option A: Gmail SMTP
1. Enable 2-factor authentication
2. Generate app-specific password
3. Configure SMTP settings in `.env.local`

#### Option B: SendGrid
1. Create SendGrid account
2. Get API key
3. Set `SENDGRID_API_KEY` in `.env.local`

#### Development Mode
- Emails are logged to console
- No external service required

### 4. Admin Access
1. Set admin credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_ADMIN_USER=admin
   NEXT_PUBLIC_ADMIN_PASS=your-secure-password
   ```
2. Or create admin user in database

## 📱 Page URLs

- **Account Request**: `/account-request`
- **Admin Review**: `/account-admin`
- **User Management**: `/user-management`
- **User Login**: `/auth-login`

## 🔍 Testing

### Development Testing
1. Submit account request at `/account-request`
2. Check console for email notifications
3. Review request at `/account-admin`
4. Approve/deny and check console for user emails

### Production Testing
1. Configure real email service
2. Test full workflow with real email addresses
3. Verify emails are received and formatted correctly

## 🚨 Security Considerations

### Password Security
- Temporary passwords are auto-generated
- Users must change password on first login
- Passwords use secure character set

### Data Protection
- All forms validate required fields
- SQL injection protection via Supabase
- Proper error handling without data exposure

### Access Control
- Admin authentication required for management
- RLS policies prevent unauthorized access
- Audit trail for all user actions

## 🎨 Customization

### Email Templates
Edit templates in `src/lib/emailService.ts`:
- Company branding
- Custom messaging
- Additional data fields

### User Roles
Add new roles in:
- Database check constraints
- Form options
- Role management interface

### Team Management
Extend system with:
- Team-specific permissions
- Hierarchical access control
- Team-based notifications

## 📈 Future Enhancements

### Planned Features
- [ ] Bulk user operations
- [ ] User import/export
- [ ] Advanced role permissions
- [ ] Team hierarchy management
- [ ] Email template editor
- [ ] User activity logging
- [ ] Password reset workflow
- [ ] Multi-factor authentication

### Integration Opportunities
- [ ] Calendar integration for events
- [ ] SMS notifications
- [ ] Slack/Discord webhooks
- [ ] LDAP/Active Directory sync

## 💡 Best Practices

### Admin Workflow
1. Review requests daily
2. Provide feedback in rejection notes
3. Assign appropriate roles and teams
4. Monitor user activity regularly

### Security Maintenance
1. Regular password policy updates
2. Review user permissions quarterly
3. Audit admin access logs
4. Update environment variables regularly

### Email Management
1. Monitor email delivery rates
2. Keep templates updated with current branding
3. Test email appearance across clients
4. Maintain valid sender reputation

---

**🎯 Result: Complete user management system with professional workflow, email notifications, and secure admin controls!**