#!/bin/bash

# ========================================
# 🚀 Script Avvio Development
# ========================================
# Usa questo script per avviare rapidamente
# l'ambiente di sviluppo

set -e

echo "🐳 Avvio ambiente Development..."

# Verifica che Docker sia in esecuzione
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker non è in esecuzione!"
  echo "   Avvia Docker Desktop e riprova."
  exit 1
fi

# Verifica file .env
if [ ! -f .env ]; then
  echo "⚠️  File .env non trovato!"
  echo "   Copio .env.example in .env..."
  cp .env.example .env
  echo "✅ File .env creato. Modifica le variabili necessarie."
fi

# Ferma container esistenti
echo "🛑 Fermando container esistenti..."
docker-compose -f docker-compose.dev.yml down

# Build e avvio servizi
echo "🔨 Building servizi..."
docker-compose -f docker-compose.dev.yml build

echo "🚀 Avvio servizi..."
docker-compose -f docker-compose.dev.yml up -d

# Attendi che i servizi siano pronti
echo "⏳ Attendo che i servizi siano pronti..."
sleep 5

# Verifica stato servizi
echo ""
echo "📊 Stato servizi:"
docker-compose -f docker-compose.dev.yml ps

# Verifica health
echo ""
echo "🏥 Health check:"
if docker exec spotex-postgres-dev pg_isready -U spotex > /dev/null 2>&1; then
  echo "   ✅ PostgreSQL: OK"
else
  echo "   ❌ PostgreSQL: ERRORE"
fi

if docker exec spotex-redis-dev redis-cli ping > /dev/null 2>&1; then
  echo "   ✅ Redis: OK"
else
  echo "   ❌ Redis: ERRORE"
fi

if curl -s http://localhost:8000/health > /dev/null 2>&1; then
  echo "   ✅ Backend API: OK"
else
  echo "   ⚠️  Backend API: Non ancora pronto (potrebbe servire ancora qualche secondo)"
fi

if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "   ✅ Frontend Admin: OK"
else
  echo "   ⚠️  Frontend Admin: Non ancora pronto (potrebbe servire ancora qualche secondo)"
fi

if curl -s http://localhost:3001 > /dev/null 2>&1; then
  echo "   ✅ Frontend Customer Portal: OK"
else
  echo "   ⚠️  Frontend Customer Portal: Non ancora pronto (potrebbe servire ancora qualche secondo)"
fi

if curl -s http://localhost:3002 > /dev/null 2>&1; then
  echo "   ✅ Frontend Website: OK"
else
  echo "   ⚠️  Frontend Website: Non ancora pronto (potrebbe servire ancora qualche secondo)"
fi

echo ""
echo "🎉 Ambiente Development avviato con successo!"
echo ""
echo "📡 Servizi disponibili:"
echo "   • Backend API: http://localhost:8000"
echo "   • API Docs: http://localhost:8000/docs"
echo "   • Frontend Admin: http://localhost:3000"
echo "   • Frontend Customer Portal: http://localhost:3001"
echo "   • Frontend Website: http://localhost:3002"
echo "   • PostgreSQL: localhost:5432"
echo "   • Redis: localhost:6379"
echo ""
echo "📝 Comandi utili:"
echo "   • Vedi logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "   • Ferma servizi: docker-compose -f docker-compose.dev.yml down"
echo "   • Rebuild: docker-compose -f docker-compose.dev.yml up -d --build"
