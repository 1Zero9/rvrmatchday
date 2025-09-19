# 🚀 Production Deployment Guide - RVR Match Day v5.0.0

## 🎯 Quick Start Checklist

### ✅ Pre-Deployment Requirements
- [ ] Supabase project created and configured
- [ ] Domain name ready (e.g., `matchday.rivervalleyrangers.ie`)
- [ ] Email service configured (Gmail or SendGrid)
- [ ] SSL certificate available (automatic with Vercel)

---

## 🔧 Step-by-Step Deployment

### 1. **Environment Configuration**

#### Create Production Environment File:
```bash
# Copy template and configure
cp .env.local.example .env.production.local
```

#### Required Environment Variables:
```bash
# === SUPABASE (Required) ===
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# === SECURITY (Required) ===
JWT_SECRET=your-secure-32-character-random-string
NODE_ENV=production

# === ADMIN ACCESS (Required) ===
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASS=YourSecureAdminPassword2025!
NEXT_PUBLIC_MATCH_CENTRAL_PASS=YourSecureMatchPassword2025!

# === EMAIL SERVICE (Required for user management) ===
ADMIN_EMAIL=admin@rivervalleyrangers.ie
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=admin@rivervalleyrangers.ie
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=noreply@rivervalleyrangers.ie

# === SITE CONFIG (Optional) ===
NEXTAUTH_URL=https://matchday.rivervalleyrangers.ie
NEXTAUTH_SECRET=your-nextauth-secret
```

### 2. **Database Setup**

#### Deploy Database Schema:
```sql
-- Run in Supabase SQL Editor
-- 1. Basic schema (already done)
\i database/admin_user_management.sql

-- 2. Match tracker tables  
\i src/lib/match-tracker-schema.sql

-- 3. Create admin user (run AFTER auth user creation)
\i database/setup/create_secure_admin.sql
```

#### Test Database Connection:
```bash
# Test API endpoints work
curl https://your-domain.com/api/admin/debug-users
```

### 3. **Vercel Deployment**

#### Method A: GitHub Integration (Recommended)
```bash
# 1. Push to GitHub (already done)
git push origin main

# 2. Import project in Vercel dashboard
# - Connect GitHub repository
# - Add environment variables
# - Deploy automatically
```

#### Method B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... (repeat for all env vars)
```

### 4. **Domain Configuration**

#### Custom Domain Setup:
1. **Vercel Dashboard** → Project → Settings → Domains
2. **Add Domain**: `matchday.rivervalleyrangers.ie`
3. **DNS Configuration**: Point CNAME to Vercel
4. **SSL Certificate**: Automatic with Vercel

#### DNS Records:
```
Type: CNAME
Name: matchday
Value: cname.vercel-dns.com
```

### 5. **Email Service Configuration**

#### Gmail SMTP Setup:
1. **Enable 2FA** on Gmail account
2. **Generate App Password**:
   - Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update Environment Variables** with app password

#### SendGrid Alternative:
```bash
# Instead of SMTP variables, use:
SENDGRID_API_KEY=your-sendgrid-api-key
```

---

## 🧪 **Testing Production Deployment**

### 1. **Build Verification**
```bash
# Local production build test
npm run build
npm start

# Visit: http://localhost:3000
```

### 2. **Feature Testing Checklist**
- [ ] **Home Page**: Video hero loads and fades to image
- [ ] **Admin Login**: http://your-domain.com/admin
- [ ] **User Management**: Create, activate, deactivate users
- [ ] **Email System**: Password reset emails send correctly
- [ ] **Match Central**: All match tracking features work
- [ ] **Mobile**: Responsive design on mobile devices

### 3. **Security Verification**
- [ ] **HTTPS**: Site loads with SSL certificate
- [ ] **Environment Variables**: No secrets exposed in browser
- [ ] **Admin Access**: Strong passwords enforced
- [ ] **Database**: RLS policies prevent unauthorized access

---

## 🎛️ **Post-Deployment Configuration**

### 1. **Create Initial Admin User**
```bash
# 1. Create auth user in Supabase dashboard
# Email: admin@rivervalleyrangers.ie
# Password: YourSecureAdminPassword2025!

# 2. Run SQL to create tracker_users entry
INSERT INTO tracker_users (email, username, full_name, role, permissions, is_active)
VALUES ('admin@rivervalleyrangers.ie', 'admin', 'Site Administrator', 'admin', ARRAY['*'], true);
```

### 2. **Test User Registration Flow**
1. **Visit**: https://your-domain.com/register
2. **Create Test Account**: Use real email you control
3. **Admin Review**: Login to admin panel and approve request
4. **User Login**: Test login with approved account

### 3. **Configure Club Information**
- **Update club details** in `/src/config/club-info.ts`
- **Add sponsor logos** to replace placeholders
- **Upload club photos** for gallery sections

---

## 🚨 **Troubleshooting**

### Build Errors:
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Database Connection Issues:
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY

# Test API endpoint
curl https://your-domain.com/api/admin/debug-users
```

### Email Not Sending:
```bash
# Verify SMTP settings
# Check Gmail app password is correct
# Ensure 2FA is enabled on Gmail account
```

---

## 📊 **Deployment Status Checklist**

### ✅ **Production Ready Indicators**
- [ ] Build completes without errors (85 pages)
- [ ] All environment variables configured
- [ ] Database schema deployed and working
- [ ] Admin login functional
- [ ] Email system operational
- [ ] HTTPS certificate active
- [ ] Custom domain pointing correctly

### 🎯 **Go-Live Checklist**
- [ ] Backup current site (if replacing existing)
- [ ] Update DNS to point to new deployment
- [ ] Test all critical user journeys
- [ ] Monitor error logs for 24 hours
- [ ] Announce new system to club members

---

## 🆘 **Emergency Contacts & Rollback**

### Quick Rollback Plan:
```bash
# Revert DNS to previous site
# Or disable deployment in Vercel dashboard
```

### Support Information:
- **Developer**: Claude AI Assistant
- **Repository**: https://github.com/1Zero9/rvrmatchday
- **Version**: v5.0.0
- **Last Updated**: September 19, 2025

---

**🎉 Your RVR Match Day system is ready for production deployment!**

The system includes 85 pages, complete user management, video hero, admin dashboard, and match tracking functionality. Follow this guide step-by-step for a smooth deployment.