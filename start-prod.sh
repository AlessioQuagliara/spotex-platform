#!/bin/bash

# ========================================
# 🚀 Script Avvio Production
# ========================================
# Usa questo script per deploy in produzione

set -e

echo "🐳 Avvio ambiente Production..."

# Verifica che Docker sia in esecuzione
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker non è in esecuzione!"
  exit 1
fi

# Verifica file .env
if [ ! -f .env ]; then
  echo "❌ File .env non trovato!"
  echo "   In produzione DEVE esistere un file .env configurato."
  exit 1
fi

# Verifica variabili critiche
source .env
if [ -z "$JWT_SECRET" ]; then
  echo "❌ JWT_SECRET non configurato nel .env!"
  exit 1
fi

if [ -z "$DB_PASSWORD" ]; then
  echo "❌ DB_PASSWORD non configurato nel .env!"
  exit 1
fi

# Backup database se esiste
if docker ps -a | grep -q spotex-postgres-prod; then
  echo "💾 Creando backup database..."
  timestamp=$(date +%Y%m%d_%H%M%S)
  docker exec spotex-postgres-prod pg_dump -U spotex spotex_platform > "backup_${timestamp}.sql"
  echo "✅ Backup salvato: backup_${timestamp}.sql"
fi

# Ferma container esistenti
echo "🛑 Fermando container esistenti..."
docker-compose -f docker-compose.prod.yml down

# Build e avvio servizi
echo "🔨 Building servizi..."
docker-compose -f docker-compose.prod.yml build

echo "🚀 Avvio servizi..."
docker-compose -f docker-compose.prod.yml up -d

# Attendi che i servizi siano pronti
echo "⏳ Attendo che i servizi siano pronti..."
sleep 10

# Verifica stato servizi
echo ""
echo "📊 Stato servizi:"
docker-compose -f docker-compose.prod.yml ps

# Verifica health
echo ""
echo "🏥 Health check:"
if docker exec spotex-postgres-prod pg_isready -U spotex > /dev/null 2>&1; then
  echo "   ✅ PostgreSQL: OK"
else
  echo "   ❌ PostgreSQL: ERRORE"
fi

if docker exec spotex-redis-prod redis-cli ping > /dev/null 2>&1; then
  echo "   ✅ Redis: OK"
else
  echo "   ❌ Redis: ERRORE"
fi

if curl -s http://localhost/health > /dev/null 2>&1; then
  echo "   ✅ Nginx: OK"
else
  echo "   ⚠️  Nginx: Non ancora pronto"
fi

echo ""
echo "🎉 Ambiente Production avviato con successo!"
echo ""
echo "📡 Servizi disponibili:"
echo "   • Frontend: http://localhost (porta 80)"
echo "   • HTTPS: https://localhost (porta 443)"
echo ""
echo "📝 Comandi utili:"
echo "   • Vedi logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "   • Ferma servizi: docker-compose -f docker-compose.prod.yml down"
echo "   • Rebuild: docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   • Backup database salvato prima dell'aggiornamento"
echo "   • Monitora i logs per errori: docker-compose -f docker-compose.prod.yml logs -f"
