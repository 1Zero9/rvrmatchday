#!/bin/bash
# RVR Match Day - Quick Deployment Script
# Run: chmod +x deploy.sh && ./deploy.sh

echo "🚀 RVR Match Day Deployment Script v5.0.0"
echo "========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Step 1: Environment Check
echo "📋 Step 1: Checking environment..."
if [ ! -f ".env.production.local" ]; then
    echo "⚠️  Warning: .env.production.local not found"
    echo "📝 Creating from template..."
    cp .env.production.template .env.production.local
    echo "✅ Please edit .env.production.local with your production values"
    echo "💡 Then run this script again"
    exit 0
fi

# Step 2: Dependencies
echo "📦 Step 2: Installing dependencies..."
npm install

# Step 3: Build Test
echo "🔨 Step 3: Testing production build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check errors above."
    exit 1
fi

# Step 4: Environment Variables Check
echo "🔍 Step 4: Checking required environment variables..."
source .env.production.local

required_vars=("NEXT_PUBLIC_SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY" "JWT_SECRET" "NEXT_PUBLIC_ADMIN_PASS")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required environment variable: $var"
        echo "📝 Please check your .env.production.local file"
        exit 1
    fi
done

# Step 5: Database Check
echo "🗄️  Step 5: Testing database connection..."
if command -v curl &> /dev/null; then
    echo "Testing API endpoint..."
    # This would need to be updated with actual domain
    # curl -f http://localhost:3000/api/admin/debug-users > /dev/null 2>&1
    echo "✅ Database connection check skipped (run after deployment)"
else
    echo "⚠️  curl not found, skipping API test"
fi

# Step 6: Deployment Options
echo "🚀 Step 6: Deployment options"
echo "Choose your deployment method:"
echo "1. Vercel CLI (npm install -g vercel && vercel --prod)"
echo "2. GitHub + Vercel (push to main branch)"
echo "3. Manual build (npm run build && npm start)"

echo ""
echo "✅ Pre-deployment checks complete!"
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo "🎯 Your app is ready for production deployment"

# Step 7: Quick Start Commands
echo ""
echo "🚀 Quick Start Commands:"
echo "# Install Vercel CLI and deploy:"
echo "npm install -g vercel"
echo "vercel --prod"
echo ""
echo "# Or start local production server:"
echo "npm start"
echo ""
echo "# Open admin dashboard:"
echo "open http://localhost:3000/admin"