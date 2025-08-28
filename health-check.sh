#!/bin/bash

# Quick health check script
PORT=3000
URL="http://localhost:$PORT"

echo "🔍 Checking dev server health..."
echo "URL: $URL"
echo "Time: $(date)"
echo "----------------------------------------"

# Check if port is in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ Port $PORT is in use"
    
    # Check if server responds
    if curl -s --max-time 5 "$URL" >/dev/null 2>&1; then
        echo "✅ Server is responding"
        
        # Get server info
        echo "📊 Server Response:"
        curl -I --max-time 5 "$URL" 2>/dev/null | head -5
        
        echo ""
        echo "🌐 Access your app at: $URL"
    else
        echo "❌ Server is not responding (but port is in use)"
        echo "💡 Try: npm run dev:clean"
    fi
else
    echo "❌ No process listening on port $PORT"
    echo "💡 Try: npm run dev:clean"
fi

# Show running processes
echo ""
echo "🔍 Next.js processes:"
ps aux | grep -i next | grep -v grep || echo "No Next.js processes found"