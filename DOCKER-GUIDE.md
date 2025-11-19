# ========================================
# 🐳 GUIDA DOCKER - Spotex Platform
# ========================================

## 📋 Quick Start

### Development (Locale)
```bash
# Avvia tutti i servizi in development
docker-compose -f docker-compose.dev.yml up -d

# Verifica che i servizi siano attivi
docker-compose -f docker-compose.dev.yml ps

# Vedi i logs
docker-compose -f docker-compose.dev.yml logs -f backend

# Ferma tutti i servizi
docker-compose -f docker-compose.dev.yml down
```

### Production
```bash
# Avvia tutti i servizi in produzione
docker-compose -f docker-compose.prod.yml up -d

# Verifica che i servizi siano attivi
docker-compose -f docker-compose.prod.yml ps

# Vedi i logs
docker-compose -f docker-compose.prod.yml logs -f

# Ferma tutti i servizi
docker-compose -f docker-compose.prod.yml down
```

## 🗂️ Struttura File Docker

```
central-server/
├── docker-compose.dev.yml        # Development compose (hot-reload)
├── docker-compose.prod.yml       # Production compose (ottimizzato)
├── backend/
│   ├── Dockerfile                # Production dockerfile
│   ├── Dockerfile.dev            # Development dockerfile
│   ├── docker-compose.yml        # [DEPRECATO - usa root]
│   └── init-db.sql               # Script inizializzazione DB
├── nginx/
│   ├── nginx.conf                # Config nginx production
│   └── nginx.dev.conf            # Config nginx development
└── .env                          # Variabili d'ambiente (NON committare!)
```

## 🔧 Servizi Disponibili

### Development Mode
- **Backend FastAPI**: http://localhost:8000
  - API Docs: http://localhost:8000/docs
  - Redoc: http://localhost:8000/redoc
- **PostgreSQL**: localhost:5432
  - User: spotex
  - Password: da .env
  - Database: spotex_platform
- **Redis**: localhost:6379

### Production Mode
- **Nginx**: http://localhost (porta 80) o https://localhost (porta 443)
- **Backend FastAPI**: Accessibile solo via nginx (non esposto)
- **PostgreSQL**: Accessibile solo internamente (non esposto)
- **Redis**: Accessibile solo internamente (non esposto)

## 📦 Volumi Docker

### Development
- `spotex-postgres-dev-data`: Dati PostgreSQL development
- `spotex-redis-dev-data`: Dati Redis development

### Production
- `spotex-postgres-prod-data`: Dati PostgreSQL production
- `spotex-redis-prod-data`: Dati Redis production

## 🛠️ Comandi Utili

### Rebuild dopo modifiche al codice
```bash
# Development
docker-compose -f docker-compose.dev.yml up -d --build

# Production
docker-compose -f docker-compose.prod.yml up -d --build
```

### Accedi al container
```bash
# Backend
docker exec -it spotex-backend-dev bash  # Development
docker exec -it spotex-backend-prod bash # Production

# PostgreSQL
docker exec -it spotex-postgres-dev psql -U spotex -d spotex_platform  # Development
docker exec -it spotex-postgres-prod psql -U spotex -d spotex_platform # Production
```

### Vedi logs specifici
```bash
# Backend
docker-compose -f docker-compose.dev.yml logs -f backend

# PostgreSQL
docker-compose -f docker-compose.dev.yml logs -f postgres

# Tutti i servizi
docker-compose -f docker-compose.dev.yml logs -f
```

### Rimuovi volumi (⚠️ ELIMINA TUTTI I DATI!)
```bash
# Development
docker-compose -f docker-compose.dev.yml down -v

# Production
docker-compose -f docker-compose.prod.yml down -v
```

### Health check manuale
```bash
# Backend
curl http://localhost:8000/health

# PostgreSQL
docker exec spotex-postgres-dev pg_isready -U spotex

# Redis
docker exec spotex-redis-dev redis-cli ping
```

## 🔐 Sicurezza in Production

### Differenze Dev vs Prod
| Feature | Development | Production |
|---------|-------------|------------|
| Hot-reload | ✅ | ❌ |
| Porte esposte | Tutte | Solo nginx (80/443) |
| Workers uvicorn | 1 | 4 |
| Debug mode | ✅ | ❌ |
| SSL | ❌ | ✅ |
| Health checks | Base | Avanzati |
| Restart policy | unless-stopped | always |

### Best Practices Production
1. ✅ **Non esporre** porte database/redis esternamente
2. ✅ **Usa sempre HTTPS** con certificati validi
3. ✅ **Imposta JWT_SECRET** forte nel .env
4. ✅ **Abilita firewall** sul server
5. ✅ **Fai backup** regolari dei volumi
6. ✅ **Monitora logs** per errori

## 🚨 Troubleshooting

### "Port already in use"
```bash
# Trova processo che usa la porta
lsof -i :8000  # MacOS/Linux
netstat -ano | findstr :8000  # Windows

# Ferma il servizio o cambia porta in docker-compose
```

### "Database connection refused"
```bash
# Verifica che postgres sia healthy
docker-compose -f docker-compose.dev.yml ps

# Vedi logs postgres
docker-compose -f docker-compose.dev.yml logs postgres

# Riavvia postgres
docker-compose -f docker-compose.dev.yml restart postgres
```

### "Backend container keeps restarting"
```bash
# Vedi logs per errore
docker-compose -f docker-compose.dev.yml logs backend

# Errori comuni:
# - DATABASE_URL errato nel .env
# - Dipendenze mancanti in requirements.txt
# - Syntax error nel codice Python
```

### Rebuild completo (⚠️ rimuove tutto)
```bash
# Development
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d --build

# Production
docker-compose -f docker-compose.prod.yml down -v
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📝 Note Importanti

1. **File .env**: Mai committare su Git! Contiene segreti.
2. **Volumi**: I dati persistono anche dopo `docker-compose down`. Usa `-v` per rimuoverli.
3. **Network**: I container comunicano tramite hostname (es: `postgres` invece di `localhost`).
4. **Hot-reload**: Solo in dev mode. In prod serve rebuild per aggiornare codice.

## 🔗 Link Utili

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI in Docker](https://fastapi.tiangolo.com/deployment/docker/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
