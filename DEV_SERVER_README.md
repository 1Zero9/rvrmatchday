# 🚀 Robust Dev Server Management

This project now includes robust dev server management to prevent the endless crashes and restarts we've been experiencing.

## 📋 Available Commands

### Quick Commands
```bash
# Clean start (kills existing processes and starts fresh)
npm run dev:clean

# Simple health check
npm run health

# Original dev command
npm run dev

# Robust server with auto-restart (advanced)
npm run dev:robust
```

### Manual Scripts
```bash
# Comprehensive health check
./health-check.sh

# Robust server with monitoring (advanced)
./dev-server.sh
```

## 🔧 How It Works

### `npm run dev:clean` (Recommended)
- Kills any existing Next.js processes
- Clears port 3000 
- Waits 2 seconds for cleanup
- Starts fresh dev server
- **Use this when the server crashes or stops responding**

### `npm run health`
- Quick health check script
- Shows server status, response times
- Lists running Next.js processes
- **Use this to check if the server is working**

### `./dev-server.sh` (Advanced)
- Full monitoring with auto-restart
- Health checks every 30 seconds
- Automatic restart on crashes (max 5 attempts)
- Colored logging and status updates
- **Use this for long development sessions**

## 🆘 Troubleshooting

### Server Not Responding?
```bash
npm run health        # Check status
npm run dev:clean     # Force restart
```

### Port 3000 In Use?
```bash
# Kill everything on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev:clean
```

### Multiple Next.js Processes?
```bash
# Kill all Next.js processes
pkill -f "next dev"
npm run dev:clean
```

### Check What's Running
```bash
# See all Next.js processes
ps aux | grep -i next

# See what's using port 3000
lsof -i:3000
```

## 💡 Best Practices

1. **Always use `npm run dev:clean`** when starting a session
2. **Run `npm run health`** if things seem slow/broken
3. **Use the robust server** for long coding sessions
4. **Kill the server properly** with Ctrl+C, not force-quit terminal

## 🎯 Current Status

✅ **Server is healthy and running on http://localhost:3000**

The new glass morphism header with the refined maroon color is ready for testing!

---

*This system should end the dev server crash cycles we've been experiencing. No more going in circles!* 🔄➡️✅