# ========================================
# 📝 CHANGELOG Docker Setup
# ========================================

## [1.0.0] - 2025-11-11

### ✨ Added
- **Docker Compose Development** (`docker-compose.dev.yml`)
  - PostgreSQL 15 con health check
  - Redis 7 per caching
  - Backend FastAPI con hot-reload
  - Rete isolata `spotex-dev-network`
  - Volumi persistenti per dati

- **Docker Compose Production** (`docker-compose.prod.yml`)
  - Setup ottimizzato per produzione
  - Nginx reverse proxy con SSL
  - 4 workers Uvicorn per performance
  - Health checks avanzati
  - Sicurezza: porte interne non esposte

- **Dockerfile Production** (`backend/Dockerfile`)
  - Multi-stage build ottimizzato
  - Utente non-root per sicurezza
  - Health check integrato
  - 4 workers Uvicorn

- **Dockerfile Development** (`backend/Dockerfile.dev`)
  - Hot-reload abilitato
  - Debug mode
  - FastAPI dev command

- **Script Automatici**
  - `start-dev.sh`: Avvio rapido development
  - `start-prod.sh`: Deploy automatico production con backup
  - Health check automatici
  - Verifica prerequisiti

- **Documentazione**
  - `DOCKER-GUIDE.md`: Guida completa Docker
  - Troubleshooting
  - Best practices
  - Comandi utili

- **Database**
  - `init-db.sql`: Script inizializzazione DB
  - Estensioni PostgreSQL (uuid-ossp, pg_trgm)

### 🔧 Changed
- Aggiornato `.gitignore` per escludere backup SQL
- Corretto typo in `backend/Dockerfile` (`--no-cache-dir -r` → `--no-cache-dir -r`)
- Ottimizzato path nel Dockerfile per struttura app/

### 🛡️ Security
- Database non esposto in production
- Redis non esposto in production
- Backend dietro Nginx proxy
- Utente non-root nei container
- Variabili sensibili in `.env` (non committato)

### 📦 Dependencies
- PostgreSQL 15
- Redis 7
- Python 3.12
- Nginx (production)

### 🚀 Performance
- 4 workers Uvicorn in production
- Health checks ottimizzati
- Volumi separati dev/prod
- Network isolate

---

## Come usare

### Development
```bash
./start-dev.sh
# oppure
docker-compose -f docker-compose.dev.yml up -d
```

### Production
```bash
./start-prod.sh
# oppure
docker-compose -f docker-compose.prod.yml up -d
```
