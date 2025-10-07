# 🏗️ Project Structure

## Overview
This document outlines the organized structure of the RVR Match Day Platform.

## 📁 Root Directory Structure

```
rvrmatchday/
├── docs/                      # All documentation
│   ├── archive/              # Historical documentation  
│   ├── development/          # Technical guides
│   ├── marketing/           # Sales & marketing materials
│   └── strategy/            # Product strategy
├── src/                     # Source code
│   ├── components/          # React components
│   ├── pages/              # Next.js pages
│   ├── lib/                # Utility libraries
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # CSS and styling
│   └── types/              # TypeScript definitions
├── database/               # Database management
│   ├── migrations/         # Database migrations
│   ├── setup/             # Setup scripts and guides
│   └── archive/           # Legacy database files
├── scripts/               # Development and deployment scripts
├── public/                # Static assets
└── README.md             # Main project documentation
```

## 📋 Key Documentation Files

### Production Ready
- `README.md` - Main project documentation
- `PRODUCTION_SETUP.md` - Production deployment guide
- `SECURITY.md` - Security guidelines
- `CLAUDE.md` - AI development guidelines

### Development
- `docs/development/DEVELOPMENT_ROADMAP.md` - Technical roadmap
- `docs/SIMPLE-SETUP.md` - Quick setup guide
- `CHANGELOG.md` - Version history

## 🔧 Development Structure

### Source Code Organization
- **Components**: Reusable UI components organized by function
- **Pages**: Next.js page components with file-based routing  
- **Lib**: Utility functions and external service integrations
- **Hooks**: Custom React hooks for data fetching and state management
- **Types**: TypeScript type definitions

### Database Organization
- **Migrations**: SQL files for database schema changes
- **Setup**: Initial database setup and user creation scripts
- **Archive**: Legacy and temporary database files

### Scripts Organization  
- **Production**: Deployment and health check scripts
- **Development**: Debug, testing, and development utility scripts

## 🚀 Recent Organization Improvements

### v9.3.4 Structure Cleanup
- ✅ Moved SQL files from `src/lib/` to `database/migrations/`
- ✅ Organized scripts into `scripts/` directory structure
- ✅ Archived legacy database temp files
- ✅ Consolidated documentation into `docs/` hierarchy
- ✅ Removed backup and obsolete files
- ✅ Created logical directory groupings

### Benefits
- **Cleaner Root**: Reduced clutter in project root
- **Logical Grouping**: Related files organized together
- **Better Maintenance**: Easier to find and maintain files
- **Professional Structure**: Industry-standard organization
- **Improved Navigation**: Clear hierarchy for developers

## 📝 File Naming Conventions

- **Documentation**: UPPERCASE.md for important docs, lowercase.md for guides
- **Components**: PascalCase.tsx for React components
- **Utilities**: kebab-case.ts for utility files
- **Scripts**: kebab-case.sh/.js for executable scripts
- **SQL**: descriptive-name.sql with timestamps for migrations

This structure ensures maintainability, scalability, and professional organization.