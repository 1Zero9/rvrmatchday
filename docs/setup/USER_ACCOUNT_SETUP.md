# 👥 User Account Setup Guide

## 🎯 Overview
This guide will help you create additional user accounts for different roles in the Rivervalley Rangers Match Tracker system.

---

## 🔐 Step 1: Create Auth Users in Supabase

### Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `nhpvxrjalcnkxufyqgyy`
3. Navigate to **Authentication** → **Users**

### Create the Following Accounts
Click **"Add User"** and create these accounts:

| Email | Role | Temporary Password | Teams |
|-------|------|-------------------|-------|
| `coach@rvr.ie` | Coach | `coach2025rvr` | U10 Boys, U12 Boys |
| `manager@rvr.ie` | Manager | `manager2025rvr` | U14 Boys, U16 Boys |
| `editor@rvr.ie` | Editor | `editor2025rvr` | Content Management |
| `parent@rvr.ie` | Parent | `parent2025rvr` | U10 Boys (child's team) |
| `volunteer@rvr.ie` | Volunteer | `volunteer2025rvr` | Club Support |

**Important**: Make sure to set **"Auto Confirm User"** to `true` for each account.

---

## 🗄️ Step 2: Create User Profiles

### Run SQL Script
1. In Supabase Dashboard, go to **SQL Editor**
2. Copy and paste the contents of: `database/setup/create_additional_users.sql`
3. Click **"Run"** to execute the script

### Expected Result
You should see a success message and a table showing all created users with their roles and permissions.

---

## 🎨 Step 3: Test Role-Based Access

### Role Colors & Permissions
Each role has specific header colors and permissions:

| Role | Header Color | Key Permissions |
|------|-------------|-----------------|
| **Admin** 🛡️ | Red | Full system access |
| **Editor** ✏️ | Purple | Content management, news publishing |
| **Coach** ⚽ | Green | Team management, match recording |
| **Manager** 📋 | Blue | Team administration, player management |
| **Parent** 👨‍👩‍👧‍👦 | Orange | View child's team info only |
| **Volunteer** 🤝 | Teal | Event support, match day help |

### Test Each Account
1. **Visit**: http://localhost:3001/login
2. **Login with each account** using the credentials above
3. **Verify**:
   - Correct header color displays
   - Role badge shows in header
   - Welcome message includes user name and role
   - Access permissions are appropriate for role

---

## 🔄 Step 4: Production Account Setup

### For Production Environment
Replace the demo accounts with real email addresses:

```
admin@rivervalleyrangers.ie       (System Administrator)
coach.john@rivervalleyrangers.ie  (Head Coach John Smith)
manager.sarah@rivervalleyrangers.ie (Team Manager Sarah Jones)
editor.media@rivervalleyrangers.ie (Media Manager)
parent.guardian@email.com          (Parent/Guardian)
volunteer.helper@email.com         (Club Volunteer)
```

### Secure Password Requirements
- **Minimum 12 characters**
- **Mixed case letters**
- **Numbers and symbols**
- **No dictionary words**
- **Unique per account**

---

## 📧 Step 5: User Onboarding

### Welcome Email Template
```
Subject: Welcome to Rivervalley Rangers Match Tracker

Dear [Name],

Your account has been created for the Rivervalley Rangers Match Tracker system.

Login Details:
- Website: https://matchday.rivervalleyrangers.ie
- Email: [email]
- Temporary Password: [password]

Your Role: [role]
Access Level: [permissions]

Please login and change your password immediately.

Support: admin@rivervalleyrangers.ie
```

### First Login Instructions
1. **Login** with temporary credentials
2. **Change password** in user settings
3. **Complete profile** information
4. **Review team assignments**
5. **Test key features** for your role

---

## 🛠️ Step 6: Role Management

### Assign Teams to Users
```sql
-- Example: Assign coach to specific teams
UPDATE tracker_users 
SET teams = ARRAY['RVR U10 Boys', 'RVR U12 Boys']
WHERE email = 'coach@rvr.ie';

-- Example: Assign parent to child's team
UPDATE tracker_users 
SET teams = ARRAY['RVR U10 Boys']
WHERE email = 'parent@rvr.ie';
```

### Update Permissions
```sql
-- Example: Grant additional permissions to manager
UPDATE tracker_users 
SET permissions = ARRAY['view_teams', 'edit_matches', 'view_players', 'manage_team', 'view_reports']
WHERE email = 'manager@rvr.ie';
```

---

## 🧪 Step 7: Testing & Validation

### Authentication Flow Tests
For each role, verify:
- [ ] **Login** works with correct credentials
- [ ] **Header color** matches role
- [ ] **Role badge** displays correctly
- [ ] **Welcome message** shows user name and role
- [ ] **Navigation menu** shows appropriate options
- [ ] **Data access** respects role permissions
- [ ] **Auto-logout** works after 5 minutes inactivity

### Database Verification
```sql
-- Check all user accounts
SELECT 
    email, 
    full_name, 
    role, 
    array_length(teams, 1) as team_count,
    array_length(permissions, 1) as permission_count,
    is_active,
    created_at
FROM tracker_users 
ORDER BY role, email;
```

---

## 🔒 Security Considerations

### Password Policy
- All temporary passwords should be changed on first login
- Implement password complexity requirements
- Consider two-factor authentication for admin accounts

### Role Permissions
- **Principle of least privilege**: Users only get minimum required permissions
- **Regular review**: Audit permissions quarterly
- **Team assignments**: Parents only see their child's team data

### Account Management
- **Deactivate** accounts for departing users
- **Regular audit** of active accounts
- **Monitor** for suspicious login activity

---

## 📞 Support & Troubleshooting

### Common Issues

**"User already exists" error:**
- Check if auth user was created first in Supabase Dashboard
- Verify email address spelling

**"Permission denied" error:**
- Check RLS policies are enabled
- Verify user profile exists in tracker_users table

**Role colors not showing:**
- Clear browser cache
- Check AuthProvider is wrapping the component
- Verify user profile has correct role value

### Getting Help
- **Technical Issues**: Check browser console for errors
- **Account Problems**: Contact admin@rivervalleyrangers.ie
- **Password Reset**: Use "Forgot Password" on login page

---

## ✅ Completion Checklist

### Setup Complete When:
- [ ] All 5 additional auth users created in Supabase
- [ ] User profiles created with SQL script
- [ ] Role-based header colors working
- [ ] Each role tested with login/logout
- [ ] Permissions verified for each role
- [ ] Demo matches created for testing
- [ ] Production credentials planned
- [ ] User onboarding process documented

---

**🎯 Success! Your user account system is now ready with proper role-based access control.**