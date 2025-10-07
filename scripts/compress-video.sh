#!/bin/bash

# Video Compression Script for RVR Background Video
# Original: 41MB rvr-drone-5.mp4

echo "🎥 Video Compression Options for RVR Background Video"
echo "======================================================"
echo ""
echo "Current video: 41MB (quite large for background video)"
echo ""

# Check if ffmpeg is available
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found. Install with:"
    echo "   brew install ffmpeg (macOS)"
    echo "   sudo apt install ffmpeg (Ubuntu)"
    echo ""
    exit 1
fi

VIDEO_PATH="public/images/hero/rvr-drone-5.mp4"
OUTPUT_DIR="public/images/hero/compressed"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "🔄 Creating compressed versions..."
echo ""

# Option 1: High quality but smaller (recommended for hero video)
echo "1️⃣  Creating high-quality version (~8-12MB)..."
ffmpeg -i "$VIDEO_PATH" \
  -vcodec libx264 \
  -crf 28 \
  -preset slow \
  -vf scale=1920:1080 \
  -acodec aac \
  -b:a 128k \
  -movflags +faststart \
  "$OUTPUT_DIR/rvr-drone-5-hq.mp4" \
  -y -v quiet -stats

# Option 2: Medium quality, very small (great for background)
echo "2️⃣  Creating medium-quality version (~4-6MB)..."
ffmpeg -i "$VIDEO_PATH" \
  -vcodec libx264 \
  -crf 32 \
  -preset fast \
  -vf scale=1280:720 \
  -acodec aac \
  -b:a 96k \
  -movflags +faststart \
  "$OUTPUT_DIR/rvr-drone-5-med.mp4" \
  -y -v quiet -stats

# Option 3: Low quality, tiny file (mobile-friendly)
echo "3️⃣  Creating mobile-friendly version (~2-3MB)..."
ffmpeg -i "$VIDEO_PATH" \
  -vcodec libx264 \
  -crf 35 \
  -preset ultrafast \
  -vf scale=960:540 \
  -acodec aac \
  -b:a 64k \
  -movflags +faststart \
  "$OUTPUT_DIR/rvr-drone-5-mobile.mp4" \
  -y -v quiet -stats

echo ""
echo "✅ Compression complete! File sizes:"
ls -lh "$OUTPUT_DIR/"*.mp4

echo ""
echo "📋 Recommendations:"
echo "   • High Quality (~8-12MB): Best for desktop hero videos"
echo "   • Medium Quality (~4-6MB): Good balance for all devices"
echo "   • Mobile (~2-3MB): Use for mobile devices or slow connections"
echo ""
echo "🔧 To use a compressed version, update home.tsx:"
echo "   <source src=\"/images/hero/compressed/rvr-drone-5-med.mp4\" type=\"video/mp4\" />"