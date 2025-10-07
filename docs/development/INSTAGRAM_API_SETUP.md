# 📸 Instagram API Setup Guide

Complete guide to connect your real @rvrfc1981 Instagram account to your website.

## 🎯 What You'll Get

✅ **Real Instagram Posts** automatically displayed on your news page  
✅ **Live Updates** - new posts appear automatically every 30 minutes  
✅ **Professional Display** with real images, captions, and timestamps  
✅ **Fallback Protection** - if API fails, shows demo content  
✅ **Zero Maintenance** once setup - completely automated  

## 📋 Prerequisites

1. **Instagram Business Account** (convert from personal if needed)
2. **Facebook Developer Account** (free)
3. **Access to @rvrfc1981 Instagram account**

---

## 🔧 Step-by-Step Setup

### Step 1: Convert Instagram to Business Account

1. Open Instagram app → Go to @rvrfc1981 profile
2. Tap **Settings** (3 lines) → **Account**
3. Tap **Switch to Professional Account**
4. Choose **Business** (not Creator)
5. Complete business profile setup

### Step 2: Create Facebook Developer App

1. Go to [developers.facebook.com](https://developers.facebook.com/)
2. Click **Create App** → **Other** → **Business**
3. App Name: `"RVR Website Integration"`
4. Contact Email: Your email
5. Click **Create App**

### Step 3: Configure Instagram API

1. In your Facebook App dashboard:
   - Click **Add Product**
   - Find **Instagram API** → Click **Set Up**
   - Choose **Instagram API with Instagram Login**

2. Configure Instagram Login:
   - Go to **Instagram → Basic Display → Settings**
   - Add Redirect URI: `https://yourdomain.com/admin` (your website)
   - Save changes

### Step 4: Generate Access Token

1. In Facebook App dashboard:
   - Go to **Instagram → Basic Display → Roles**
   - Click **Add Instagram Testers**
   - Add your @rvrfc1981 Instagram username
   
2. Accept the invitation:
   - Check Instagram notifications
   - Accept the tester invitation

3. Generate User Token:
   - Go to **Instagram → Basic Display → Generate Token**
   - Authorize @rvrfc1981 account
   - Copy the **User Access Token** (long string)

### Step 5: Convert to Long-Lived Token

Short-lived tokens expire in 1 hour. Convert to 60-day token:

```bash
# Replace YOUR_APP_ID, YOUR_APP_SECRET, and SHORT_TOKEN
curl -i -X GET "https://graph.instagram.com/access_token
  ?grant_type=ig_exchange_token
  &client_secret=YOUR_APP_SECRET
  &access_token=SHORT_TOKEN"
```

Save the returned `access_token` - this lasts 60 days.

### Step 6: Add Environment Variables

Create/update `.env.local` in your project root:

```env
# Instagram API Configuration
INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here

# Optional: App credentials for token refresh
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
```

### Step 7: Update Your News Page

Replace the current Instagram widget with the API version:

```typescript
// In src/pages/news.tsx
import InstagramWidgetApi from '../components/InstagramWidgetApi';

// Replace this line:
<InstagramWidget />

// With this:
<InstagramWidgetApi maxPosts={3} />
```

---

## 🚀 Testing Your Setup

1. **Check Environment Variables**:
   ```bash
   # In terminal, run:
   echo $INSTAGRAM_ACCESS_TOKEN
   ```

2. **Test API Endpoint**:
   Visit: `http://localhost:3000/api/instagram/posts`
   
   ✅ Success: Returns real Instagram posts  
   ❌ Error: Shows error message and uses demo content  

3. **Check Widget Status**:
   - **"LIVE API"** badge = Real Instagram connected
   - **"DEMO MODE"** badge = Using fallback content

---

## 🔄 Token Refresh (Every 60 Days)

Long-lived tokens expire after 60 days. Set up automatic refresh:

### Option 1: Manual Refresh
Run this command every 50 days:
```bash
curl -i -X GET "https://graph.instagram.com/refresh_access_token
  ?grant_type=ig_refresh_token
  &access_token=CURRENT_TOKEN"
```

### Option 2: Automatic Refresh (Recommended)
The API route includes auto-refresh logic. Create a cron job:

```bash
# Add to crontab (runs monthly)
0 0 1 * * curl https://yourwebsite.com/api/instagram/posts
```

---

## 🛟 Troubleshooting

### Common Issues:

**❌ "Instagram Access Token not configured"**
- Check `.env.local` file exists
- Verify environment variable name is correct
- Restart your development server: `npm run dev`

**❌ "Instagram API error: 401 Unauthorized"**  
- Token expired (renew long-lived token)
- Wrong token (regenerate from Facebook dashboard)
- Account permissions changed

**❌ "No posts returned"**  
- Account is private (convert to business/public)
- No recent posts on Instagram
- API rate limit reached (wait 1 hour)

**❌ Posts showing but not updating**  
- Cached for 30 minutes (normal behavior)
- Clear browser cache
- Check if new posts exist on Instagram

### Debug Mode:

Check API directly:
```bash
# Test your token
curl "https://graph.instagram.com/me/media?fields=id,permalink,media_url,media_type,caption,timestamp&access_token=YOUR_TOKEN"
```

---

## 📊 API Limits & Usage

- **Rate Limit**: 200 requests/hour per user token
- **Cache Duration**: 30 minutes (reduces API calls)
- **Post Limit**: Max 25 posts per request
- **Token Expiry**: 60 days for long-lived tokens

---

## 🎉 Success! 

Once setup is complete:

✅ Your website automatically shows real Instagram posts  
✅ New posts appear within 30 minutes  
✅ No manual updates needed  
✅ Professional Instagram integration  
✅ Fallback protection if API has issues  

Your news page now has **automated Instagram content** alongside **manual news articles** - the perfect combination!

---

## 📞 Need Help?

1. **Test with Demo**: The widget works with mock data by default
2. **Check Console**: Browser dev tools show API errors
3. **Verify Token**: Use Facebook Graph API Explorer to test tokens
4. **Instagram Business Help**: [business.instagram.com/help](https://business.instagram.com/help)