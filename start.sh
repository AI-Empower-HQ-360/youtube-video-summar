#!/bin/bash
# Quick start script - Run this to start the application

echo "🚀 Starting YouTube Video Summarizer..."
echo ""

# Check if setup has been run
if [ ! -f ".env.local" ] || [ ! -f "server/.env" ]; then
    echo "⚠️  Environment files not found. Running setup first..."
    ./setup.sh
    echo ""
    echo "✅ Setup complete! Please edit .env.local and server/.env with your API keys."
    echo ""
    echo "After adding your API keys, run this script again to start the application."
    exit 0
fi

# Function to check if port is in use
check_port() {
    lsof -i :$1 >/dev/null 2>&1
    return $?
}

# Check if ports are available
if check_port 3001; then
    echo "⚠️  Port 3001 is already in use. Please stop the process using this port."
    echo "   Run: lsof -i :3001 to find the process"
    exit 1
fi

if check_port 5173; then
    echo "⚠️  Port 5173 is already in use. Please stop the process using this port."
    echo "   Run: lsof -i :5173 to find the process"
    exit 1
fi

echo "✅ Ports are available"
echo ""
echo "Starting backend server..."
cd server && npm run dev &
BACKEND_PID=$!
cd ..

echo "Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "🎉 Application is starting!"
echo "=========================================="
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001"
echo "API Docs: http://localhost:3001/api/docs"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
