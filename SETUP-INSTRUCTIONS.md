# Page Manager Setup Instructions

## Step 1: Database Setup

You need to create the database tables for the Page Manager to work. Here's how:

### Option A: Supabase Dashboard (Recommended)

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the SQL from `database/page-management-schema.sql`
4. Click **Run** to execute the SQL
5. Go back to Page Manager and click "Import Existing Site"

### Option B: Command Line (If available)

```bash
psql $DATABASE_URL -f database/page-management-schema.sql
```

## Step 2: Import Your Pages

After the database setup:

1. Go to `/admin` → Click "📄 Page Manager"
2. Click "📥 Import Existing Site"
3. The system will import all 85+ pages from your site

## What Gets Created

The Page Manager will organize your existing pages into these groups:

- **🏠 Home** - Landing page, home
- **ℹ️ About** - Club info, history, committee, policies, values, facilities  
- **⚽ Teams** - Boys, girls, youth, senior, inclusive teams
- **🥅 Matches** - MatchDay, fixtures, results, tables, match recording
- **📰 News & Media** - News articles, events, gallery
- **🤝 Get Involved** - Volunteering, sponsorship, fundraising, events
- **👥 Members** - Parent resources, FAQ, feedback
- **📞 Contact** - Contact forms, join club, trials, coach recruitment
- **⚙️ Admin** - Dashboard, tools, management pages

## Troubleshooting

If you see "Could not find table" errors:
1. The SQL schema hasn't been run yet
2. Follow Step 1 above to create the tables
3. The Page Manager will then work properly

Once setup is complete, you'll have a powerful bookmark manager-style interface for all your pages!