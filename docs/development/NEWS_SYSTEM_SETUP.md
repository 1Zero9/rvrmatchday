# 📰 News System Setup Guide

The news management system allows you to create, edit, and publish news articles with images.

## 🚀 Quick Setup

### Option 1: Automatic Setup
```bash
node setup-news-database.js
```

### Option 2: Manual Setup
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and run the contents of: `database/migrations/create_news_articles_table.sql`

## 📋 Features

### Admin Features (`/admin/news`)
- ✅ Create/Edit/Delete articles
- ✅ Upload images or use URLs
- ✅ Live image preview
- ✅ Category management (Match Reports, Club News, etc.)
- ✅ Draft/Published status
- ✅ Featured article highlighting
- ✅ Search and filtering

### Public Display (`/news`)
- ✅ Clean article layout with images
- ✅ Featured articles section
- ✅ Category badges and icons
- ✅ Responsive design
- ✅ View counts and author info

## 🗄️ Database Structure

The `news_articles` table includes:
- **Basic Info**: title, content, excerpt, author
- **Organization**: category, status, featured flag
- **Media**: image_url support
- **Metadata**: publish_date, tags, views
- **Timestamps**: created_at, updated_at

## 🔒 Security

- Row Level Security (RLS) enabled
- Public can read published articles
- Authenticated users can manage all articles
- Proper data validation and constraints

## 🛠️ Current Status

- **Demo Mode**: If database isn't set up, uses temporary demo articles
- **Real Mode**: Once database is configured, all articles persist permanently
- **Image Support**: Upload files or use external URLs
- **Admin Access**: Requires authentication

## 📊 Article Categories

1. **⚽ Match Report** - Game results and analysis
2. **🏛️ Club News** - Official announcements
3. **👤 Player News** - Player updates and transfers
4. **🤝 Community** - Community events and activities
5. **📢 Announcement** - Important club announcements

## 🎯 Usage

1. **Access Admin**: Go to `/admin/news` (requires login)
2. **Create Article**: Click "Add Article" button
3. **Add Image**: Upload file or enter URL
4. **Publish**: Set status to "Published"
5. **View Public**: Check `/news` to see live articles

## 🔧 Troubleshooting

**Can't delete demo articles?**
- Demo articles are temporary until database is set up
- Run the database setup to get permanent storage

**Images not uploading?**
- Check file size (5MB limit)
- Ensure Supabase storage is configured
- Falls back to local URLs if storage fails

**Articles not appearing?**
- Check article status is "Published"
- Verify database connection
- Check browser console for errors