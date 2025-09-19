# 🚀 Production Environment Setup Guide

## 🎯 Overview
This guide walks you through setting up the secure production environment for the Rivervalley Rangers Match Tracker system.

## ✅ Prerequisites
- Supabase project with authentication enabled
- Custom domain (recommended: matchday.rivervalleyrangers.ie)
- Email service for password resets (Gmail or SendGrid)
- SSL certificate for HTTPS

---

## 🔐 Step 1: Secure Environment Variables

### Copy Production Template
```bash
# Copy the production environment template
cp .env.production.local .env.local
```

### Required Changes in .env.local:
```bash
# 1. Generate secure JWT secret (32+ characters)
JWT_SECRET=your_super_secure_random_string_minimum_32_characters_long

# 2. Set production admin credentials
ADMIN_USER=your_production_admin_username
ADMIN_PASS=your_secure_admin_password_min_12_chars

# 3. Set match central password
MATCH_CENTRAL_PASS=your_secure_match_central_password

# 4. Configure your production domain
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 5. Set up email service
ADMIN_EMAIL=admin@your-domain.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

---

## 📧 Step 2: Email Service Setup

### Option A: Gmail SMTP
1. Enable 2FA on your Gmail account
2. Generate an App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Update environment variables:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

### Option B: SendGrid (Recommended for production)
1. Create SendGrid account
2. Generate API key
3. Update environment variables:
   ```bash
   SENDGRID_API_KEY=SG.your-sendgrid-api-key
   ```

---

## 🗄️ Step 3: Database Setup

### Verify Supabase Connection
```bash
# Test the connection
npm run dev
# Visit http://localhost:3001/login
# Try logging in with: admin@rvr.ie / rvrfc2025
```

### Create Production User Accounts
1. **Access Supabase Dashboard**: https://app.supabase.com
2. **Go to Authentication → Users**
3. **Create the following accounts**:
   ```
   admin@rivervalleyrangers.ie    (Admin role)
   coach@rivervalleyrangers.ie    (Coach role)
   manager@rivervalleyrangers.ie  (Manager role)
   editor@rivervalleyrangers.ie   (Editor role)
   parent@rivervalleyrangers.ie   (Parent role)
   ```

### Update User Profiles
Run this SQL in Supabase SQL Editor:
```sql
-- Create admin user profile
INSERT INTO tracker_users (
  id, 
  email, 
  username, 
  full_name, 
  role, 
  permissions, 
  is_active
) 
SELECT 
  auth.uid(),
  'admin@rivervalleyrangers.ie',
  'admin',
  'System Administrator',
  'admin',
  ARRAY['all'],
  true
FROM auth.users 
WHERE email = 'admin@rivervalleyrangers.ie';

-- Repeat for other roles...
```

---

## 🔒 Step 4: Security Verification

### Security Checklist
- [ ] JWT_SECRET is 32+ characters and unique
- [ ] All passwords are 12+ characters with mixed case/symbols
- [ ] NEXT_PUBLIC_ variables contain no sensitive data
- [ ] .env.local is in .gitignore
- [ ] Demo credentials are disabled
- [ ] HTTPS is enabled on production domain

### Test Security
```bash
# Scan for exposed credentials
grep -r -i "password\|secret\|key" src/ --exclude-dir=node_modules --exclude="*.md"

# Should return no hardcoded secrets
```

---

## 🌐 Step 5: Domain & Deployment

### Custom Domain Setup
1. **Point your domain** to your hosting provider
2. **Update NEXT_PUBLIC_SITE_URL** in .env.local
3. **Configure SSL certificate**
4. **Test HTTPS redirect**

### Deployment Commands
```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel/Netlify
```

---

## 🧪 Step 6: Testing Production Setup

### Authentication Flow Test
1. **Visit login page**: https://your-domain.com/login
2. **Test admin login**: Use your production admin credentials
3. **Verify role-based access**: Check header colors and permissions
4. **Test auto-logout**: Wait 5 minutes for inactivity logout
5. **Test password reset**: Use forgot password flow

### Database Connection Test
1. **Visit match central**: Should load all teams/matches
2. **Check user profile**: Verify correct role and permissions
3. **Test data operations**: Create/edit matches if admin

---

## 🎯 Step 7: Post-Deployment Tasks

### User Management
- [ ] Create accounts for all coaches/managers
- [ ] Send login credentials securely (not via email)
- [ ] Set up user onboarding documentation
- [ ] Configure role-based team assignments

### Monitoring Setup
- [ ] Set up error tracking (Sentry/LogRocket)
- [ ] Configure uptime monitoring
- [ ] Set up backup schedules
- [ ] Enable database logs in Supabase

---

## 📞 Support & Troubleshooting

### Common Issues

**Authentication fails:**
- Check Supabase project status
- Verify environment variables are loaded
- Ensure JWT_SECRET is set

**Email not working:**
- Test SMTP credentials manually
- Check spam folders
- Verify app passwords (Gmail)

**Database connection issues:**
- Check Supabase API keys
- Verify RLS policies are correct
- Check user profile exists in tracker_users

### Emergency Contacts
- **System Admin**: admin@rivervalleyrangers.ie
- **Technical Support**: Available via admin dashboard
- **Supabase Support**: https://supabase.com/support

---

## ✅ Production Readiness Checklist

### Security ✅
- [ ] Secure environment variables configured
- [ ] All demo credentials removed
- [ ] JWT secret is production-ready
- [ ] HTTPS enabled on domain

### Authentication ✅  
- [ ] Production user accounts created
- [ ] Role-based access working
- [ ] Password reset functional
- [ ] Auto-logout configured

### Database ✅
- [ ] Supabase connection verified
- [ ] User profiles populated
- [ ] Data loading correctly
- [ ] Backup system enabled

### Monitoring ✅
- [ ] Error tracking setup
- [ ] Uptime monitoring active
- [ ] Performance metrics tracked
- [ ] Database logs enabled

---

**🎯 Once completed, your production environment will be secure and ready for live use!**