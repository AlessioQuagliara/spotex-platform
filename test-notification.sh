#!/bin/bash
cd /Users/alessio/Spotex-SRL/apps/central-server/notification-service
npm run dev &
PID=$!
sleep 3

echo "Testing health endpoint..."
curl -X GET http://localhost:3006/health
echo ""

echo "Testing notification creation..."
curl -X POST http://localhost:3006/api/notifications -H "Content-Type: application/json" -d '{"type":"email","recipient":"test@example.com","message":"Test notification"}'
echo ""

echo "Testing notification retrieval..."
curl -X GET http://localhost:3006/api/notifications
echo ""

kill $PID