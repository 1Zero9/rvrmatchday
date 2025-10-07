# News Management System Design

## Overview
A user-friendly news creation and management system that allows editors/content creators to publish news without admin access.

## User Roles & Permissions

### 1. **Editor/Poster Role**
- Can create, edit, and publish news articles
- Can upload images for articles
- Can categorize articles (Academy, First Team, Youth, etc.)
- Can schedule articles for future publication
- Cannot delete published articles (safety measure)
- Cannot access admin functions

### 2. **Admin Role**
- Full access to all editor functions
- Can delete any article
- Can moderate/approve articles if approval workflow is enabled
- Can manage user permissions
- Access to analytics and engagement metrics

## News Article Structure

```typescript
interface NewsArticle {
  id: string
  title: string
  content: string // Rich text content
  excerpt: string // Auto-generated or manual
  author: {
    id: string
    name: string
    role: string // "Editor", "Coach", "Admin", etc.
  }
  category: string // "Academy", "First Team", "Youth", etc.
  tags: string[]
  featuredImage?: string
  status: 'draft' | 'published' | 'scheduled'
  publishDate: Date
  createdAt: Date
  updatedAt: Date
  featured: boolean
  views: number
  comments?: Comment[]
}
```

## Implementation Plan

### Phase 1: Basic News Creation
1. **News Creation Interface**
   - Rich text editor (TinyMCE or similar)
   - Image upload capability
   - Category selection
   - Featured article toggle
   - Save as draft or publish immediately

2. **Authentication Enhancement**
   - Extend current demo auth to include roles
   - Add "Editor" login in addition to "Admin"
   - Role-based UI components

### Phase 2: Enhanced Features
1. **Article Management Dashboard**
   - List view of all articles (published, drafts)
   - Bulk actions (publish, unpublish, delete drafts)
   - Article statistics (views, engagement)

2. **Content Workflow**
   - Draft system
   - Schedule publishing
   - Optional approval workflow for new editors

### Phase 3: Advanced Features
1. **Media Management**
   - Image upload and organization
   - Image optimization and resizing
   - Gallery management

2. **SEO & Analytics**
   - Meta descriptions
   - Article view tracking
   - Popular articles widgets

## Technical Implementation

### Storage Options
1. **Phase 1**: Extended localStorage (for demo/development)
2. **Phase 2**: Supabase integration with proper database schema
3. **Phase 3**: File storage for images (Supabase Storage)

### Components to Create
- `NewsEditor` - Rich text article creation
- `ArticleDashboard` - Article management interface  
- `NewsAdmin` - Admin-only article oversight
- `ArticlePreview` - Preview before publishing
- `MediaUploader` - Image upload component

## User Experience Flow

### For Editors:
1. Login with editor credentials
2. See "Create Article" button in news section
3. Use rich text editor to create content
4. Select category, add featured image
5. Save as draft or publish immediately
6. View their published articles in dashboard

### For Readers:
1. Visit news page
2. See published articles organized by featured/recent
3. Click to read full articles
4. View by category filters
5. Search functionality (future)

## Security Considerations
- Input sanitization for article content
- Image upload validation and size limits
- Rate limiting for article creation
- Audit log for article changes
- Role-based access control

## Integration Points
- Existing authentication system
- Current news page layout
- Mobile responsive design
- InlineEditor components for quick edits

This design allows content creators to manage news effectively while maintaining security and admin oversight.