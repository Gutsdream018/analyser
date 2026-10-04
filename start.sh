#!/bin/bash

# MarketPulse Local Development Runner
echo "=========================================="
echo " Starting MarketPulse Local Environment   "
echo "=========================================="

# Check if backend venv exists
if [ -d "backend/venv" ]; then
  echo "✓ Starting FastAPI Backend on http://localhost:8000..."
  source backend/venv/bin/activate
  PYTHONPATH=./backend python3 -m uvicorn app.main:app --port 8000 &
  BACKEND_PID=$!
else
  echo "! Backend venv not found. Running Next.js with standalone mock/live fallback."
fi

# Trap exits to kill background backend
cleanup() {
  if [ -n "$BACKEND_PID" ]; then
    echo "Stopping backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID 2>/dev/null
  fi
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

echo "✓ Starting Next.js Dev Server on http://localhost:3000..."
npm run dev
