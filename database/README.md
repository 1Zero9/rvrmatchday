# 🗄️ Database Management

## 📁 Folder Structure

```
database/
├── README.md              # This file
├── setup/                 # Initial database setup and documentation
│   ├── SETUP-DATABASE.md  # Complete setup instructions
│   └── USER_MANAGEMENT_GUIDE.md  # User management system guide
├── migrations/            # Database migration scripts
│   └── DATABASE_MIGRATION_ACCOUNT_REQUESTS.sql  # Account requests schema updates
├── temp/                  # Temporary/one-time scripts (gitignored)
│   ├── QUICK_DATABASE_FIX.sql
│   └── URGENT_DB_FIX.sql
└── private/              # Private/sensitive scripts (gitignored)
```

## 🚀 Quick Start

### Initial Setup
1. Follow instructions in `setup/SETUP-DATABASE.md`
2. Run setup scripts in Supabase SQL Editor
3. Configure environment variables

### Running Migrations
1. Check `migrations/` folder for new scripts
2. Run in Supabase SQL Editor in chronological order
3. Verify changes with test queries

### User Management
- Complete guide: `setup/USER_MANAGEMENT_GUIDE.md`
- Account requests: `/account-request` and `/admin-request`
- Admin management: `/account-admin`

## 🔐 Security Notes

- **Never commit** sensitive database credentials
- **Temp scripts** are gitignored for security
- **Private folder** for local-only scripts
- **Migrations** are version controlled for team sync

## 📋 Current Schema

### Tables
- `account_requests` - User account registration workflow
- `tracker_users` - User profiles and permissions
- `matches` - Match data and results
- `players` - Player information
- `teams` - Team management

### Key Features
- Row Level Security (RLS) enabled
- Role-based access control
- Email notification integration
- Audit trails for admin actions

## 🛠️ Maintenance

### Regular Tasks
- Review pending account requests
- Update user permissions
- Clean up old temporary data
- Monitor database performance

### Backup Strategy
- Supabase automatic backups
- Export critical data monthly
- Store backups securely off-site

---

**📧 Support**: Contact club administrator for database access or issues.