# 🚀 Spotex Platform - Cloud Solution Provider

<div align="center">

**Piattaforma Multi-Tenant White-Label per Agenzie Marketing**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/AlessioQuagliara/spotex-platform)
[![Built with DRY](https://img.shields.io/badge/Built%20with-DRY-blue)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
[![Follows KISS](https://img.shields.io/badge/Follows-KISS-green)](https://en.wikipedia.org/wiki/KISS_principle)
[![Python](https://img.shields.io/badge/Python-3.11+-blue)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)](https://fastapi.tiangolo.com/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-red)](https://sqlalchemy.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2015-blue)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/Status-Initial%20Setup-orange)](./FINAL_PRODUCTION_REPORT.md)

</div>

---

## 📋 Indice

- [Panoramica](#-panoramica)
- [Quick Start](#-quick-start)
- [Architettura](#-architettura)
- [Stack Tecnologico](#-stack-tecnologico)
- [Database Setup](#-database-setup)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Test Accounts](#-test-accounts)
- [Principi di Design](#-principi-di-design)
- [Documentation](#-documentation)

---

## 🎯 Panoramica

Piattaforma **Cloud Solution Provider** completa, offre alle agenzie marketing una piattaforma white-label per gestire i propri clienti.

### 📊 Status

```
🚧 Frontend Admin:      ░░░░░░░░░░░░░░░░░░░░ 0% Initial Setup
🚧 Frontend Agency:     ░░░░░░░░░░░░░░░░░░░░ 0% Initial Setup
🚧 Frontend Customers:  ████████░░░░░░░░░░░ 40% Auth System Complete
🚧 Frontend Site:       ░░░░░░░░░░░░░░░░░░░░ 0% Initial Setup
🚧 Backend API:         ████████░░░░░░░░░░░ 40% FastAPI Structure Complete
🚧 WordPress Deploy:    ░░░░░░░░░░░░░░░░░░░░ 0% Initial Setup
🚧 Multi-Tenant DB:     ░░░░░░░░░░░░░░░░░░░░ 0% Initial Setup
🚧 Docker Setup:        ░░░░░░░░░░░░░░░░░░░░ 0% Initial Setup
🎯 Overall:             ████░░░░░░░░░░░░░░░ 20% FastAPI Backend Implemented
```

[📈 View Production Report](./FINAL_PRODUCTION_REPORT.md)

### 🎪 Dominio

- **Sito Pubblico**: `www.spotexsrl.com`
- **Portale Agenzie**: `agency.spotexsrl.com`
- **Portale Clienti**: `customers.spotexsrl.com`
- **Admin Spotex**: `admin.spotexsrl.com`

### 🎯 Target

1. **Spotex SRL** (Super Admin) → Gestisce tutte le agenzie
2. **Agenzie Marketing** (Tenant) → Gestiscono i loro clienti
3. **Clienti Finali** (Sub-Tenant) → Ricevono servizi

### 📦 Repository Contents

Questo repository contiene il **sistema completo Spotex Platform** basato su **FastAPI + Python**:

- **Backend** (`backend/`): API REST con FastAPI + Python + **Sistema Autenticazione Completo**
- **Frontend Agency** (`frontend/agency/`): Dashboard agenzie con Express
- **Frontend Customers** (`frontend/customers/`): **Portale clienti con autenticazione role-based (AGENCY/COMPANY)**
- **Frontend Admin** (`frontend/spotex-admin/`): Admin Spotex con Express
- **Frontend Site** (`frontend/spotex-site/`): Sito pubblico con Express
- **Shared Libraries** (`shared/`): Codice comune e componenti
- **Database Schema** (`backend/alembic/`): Migrations SQLAlchemy PostgreSQL
- **Docker Setup**: Containerizzazione completa per produzione

---

## ⚡ Quick Start

### Prerequisites

- Python 3.11+
- Docker & Docker Compose
- pip or poetry

### 🚀 Launch Everything

```bash
# Clone repository
git clone https://github.com/AlessioQuagliara/spotex-platform.git
cd spotex-platform

# Install Python dependencies
cd backend
pip install -r requirements.txt

# Start infrastructure (PostgreSQL + Redis)
docker-compose up -d postgres redis

# Run database migrations
alembic upgrade head

# Start FastAPI server
fastapi dev app/main.py
```

### 🌐 Access Points

Once running, access:

- **Backend API**: http://localhost:8000/api/v1
- **Frontend Site**: http://localhost:3001
- **Frontend Admin**: http://localhost:3002
- **Frontend Agency**: http://localhost:3003
- **Frontend Customers**: http://localhost:3004
- **Database**: postgresql://spotex:spotex_dev_password@localhost:5432/spotex_platform
- **API Documentation**: http://localhost:8000/docs

---

## 🏗️ Architettura

### FastAPI Monorepo Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       NGINX Reverse Proxy                    │
│          (www / agency / customers / admin .spotexsrl.com)  │
└───────────────────┬─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼───────┐      ┌───────▼────────┐
│   FRONTENDS   │      │   BACKEND API  │
│   (Express)   │      │   (FastAPI)    │
│               │      └────────┬───────┘
│ • Admin       │               │
│ • Agency      │      ┌────────┴────────────┐
│ • Customers   │      │                     │
│ • Site        │      │                     │
└───────────────┘      │                     │
                ┌──────▼──────┐    ┌────────▼─────────┐
                │   Services   │    │   Database      │
                │  (Python)    │    │  (PostgreSQL)   │
                └──────┬──────┘    └────────┬─────────┘
                       │                     │
              ┌────────▼────────┐  ┌────────▼─────────┐
              │   Business      │  │   Multi-Tenant   │
              │   Logic         │  │   Schema         │
              └────────┬────────┘  └────────┬─────────┘
                       │                     │
              ┌────────▼─────────────────────┘
              │
      ┌───────▼────────┐
      │   Shared Code  │
      │   (Types, Utils│
      │    Components) │
      └────────────────┘
```

---

## 🛠️ Stack Tecnologico

### Backend

| Tecnologia | Uso | Versione |
|------------|-----|----------|
| **Python** | Runtime | 3.11+ |
| **FastAPI** | Web Framework | 0.104+ |
| **SQLAlchemy** | ORM | 2.0+ |
| **Alembic** | Migrations | 1.12+ |
| **PostgreSQL** | Database | 15 |
| **Redis** | Cache & Sessioni | 7 |
| **Pydantic** | Data Validation | 2.5+ |

### Frontend (Express Services)

| Tecnologia | Uso | Versione |
|------------|-----|----------|
| **Express** | Web Framework | 4.18 |
| **EJS** | Template Engine | 3.1 |
| **TypeScript** | Linguaggio | 5.3+ |
| **Tailwind CSS** | Styling | 3.4 |
| **HTMX** | Interattività | 1.9 |

### Infrastructure

| Tecnologia | Uso |
|------------|-----|
| **Docker** | Containerizzazione |
| **Docker Compose** | Orchestrazione Dev |
| **Nginx** | Reverse Proxy |

---

## 📁 Struttura del Progetto

```
spotex-platform/
│
├── 📦 shared/                      # ⭐ CUORE DRY DEL SISTEMA
│   ├── src/
│   │   ├── types/                  # Tutte le interfacce TypeScript
│   │   │   ├── core.ts            # Tenant, User, Site, Ticket, Domain
│   │   │   ├── api.ts             # ApiResponse, Pagination
│   │   │   ├── dto.ts             # Data Transfer Objects
│   │   │   ├── auth.ts            # JWT, Permissions
│   │   ├── services/              # Business Logic Condivisa
│   │   │   ├── BaseService.ts     # Service astratto (DRY)
│   │   │   ├── TenantService.ts   # Gestione tenant
│   │   └── utils/                 # Utility functions
│   │       ├── helpers.ts         # String, Date, Validation
│   │       └── logger.ts          # Logging unificato
│   └── prisma/
│       └── schema.prisma          # Database schema unificato
│
├── 🔗 backend/                     # API Gateway Centrale FastAPI
│   ├── app/
│   │   ├── main.py                # FastAPI app principale
│   │   ├── config.py              # Configurazioni
│   │   ├── database.py            # Connessione DB SQLAlchemy
│   │   ├── core/
│   │   │   ├── dependencies.py    # Dipendenze FastAPI
│   │   │   ├── exceptions.py      # Gestione errori
│   │   │   └── security.py        # JWT, hashing passwords
│   │   ├── middleware/
│   │   │   ├── rate_limit.py      # Rate limiting
│   │   │   └── tenant_middleware.py # Isolamento tenant
│   │   ├── models/                # Modelli SQLAlchemy
│   │   │   ├── user.py            # Modello User
│   │   │   ├── tenant.py          # Modello Tenant
│   │   │   ├── website.py         # Modello Website
│   │   │   ├── domain.py          # Modello Domain
│   │   │   ├── database.py        # Modello Database
│   │   │   ├── backup.py          # Modello Backup
│   │   │   └── email.py           # Modello Email
│   │   ├── routers/               # API Routes FastAPI
│   │   │   ├── __init__.py        # Router principale
│   │   │   └── v1/
│   │   │       ├── auth.py         # Autenticazione (/api/v1/auth/*)
│   │   │       ├── users.py        # Gestione utenti
│   │   │       ├── tenants.py      # Gestione tenant
│   │   │       ├── websites.py     # Gestione siti web
│   │   │       ├── domains.py      # Gestione domini
│   │   │       ├── databases.py    # Gestione database
│   │   │       ├── backups.py      # Gestione backup
│   │   │       ├── emails.py       # Gestione email
│   │   │       └── monitoring.py   # Monitoraggio sistema
│   │   ├── schemas/               # Pydantic Schemas
│   │   │   ├── user.py            # Schemi User (request/response)
│   │   │   ├── tenant.py          # Schemi Tenant
│   │   │   ├── website.py         # Schemi Website
│   │   │   ├── domain.py          # Schemi Domain
│   │   │   ├── database.py        # Schemi Database
│   │   │   ├── backup.py          # Schemi Backup
│   │   │   └── email.py           # Schemi Email
│   │   └── services/              # Business Logic Services
│   │       ├── auth_service.py    # Servizio autenticazione
│   │       ├── user_service.py    # Servizio utenti
│   │       ├── tenant_service.py  # Servizio tenant
│   │       └── ...               # Altri servizi
│   ├── alembic/                   # Database Migrations
│   │   ├── env.py
│   │   └── versions/              # File migrazioni
│   ├── tests/                     # Test Python
│   │   ├── test_auth.py          # Test autenticazione
│   │   ├── test_domains.py       # Test domini
│   │   └── test_websites.py      # Test siti web
│   ├── utils/                    # Utility Functions
│   │   ├── docker_manager.py     # Gestione Docker
│   │   ├── helpers.py            # Helper functions
│   │   └── validators.py         # Validatori
│   ├── requirements.txt          # Dipendenze Python
│   ├── Dockerfile               # Container FastAPI
│   └── docker-compose.yml       # Orchestrazione servizi
│
├── 📱 frontend-public/            # Servizio Express per Sito Marketing
├── 🏢 frontend-agency/            # Servizio Express per Dashboard Agenzie
├── ⚙️ frontend-admin/             # Servizio Express per Admin Spotex
│
├── 🌐 nginx/                      # Reverse Proxy
│   ├── nginx.conf
│   └── Dockerfile
│
├── 🐳 docker-compose.yml          # Orchestrazione servizi globale
├── 📄 package.json                # Monorepo root (npm workspaces)
├── 📘 pyproject.toml              # Configurazione Python (opzionale)
└── 📖 README.md                   # Questo file
```

### 🌟 Backend FastAPI - Architettura Pulita

Il backend è strutturato secondo i principi **DRY & KISS**:

- ✅ **Routers**: Ogni dominio ha il suo router API (`/api/v1/{domain}/*`)
- ✅ **Models**: Modelli SQLAlchemy per ogni entità
- ✅ **Schemas**: Validazione Pydantic per request/response
- ✅ **Services**: Logica business isolata e testabile
- ✅ **Middleware**: Cross-cutting concerns (auth, rate limiting, tenant isolation)
- ✅ **Dependencies**: Injection delle dipendenze FastAPI

**Esempio struttura router:**

```python
# routers/v1/auth.py
from fastapi import APIRouter, Depends
from app.schemas.auth import LoginRequest, LoginResponse
from app.services.auth_service import AuthService
from app.core.dependencies import get_auth_service

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
):
    return await auth_service.login(request.email, request.password)
```

---

## ⚡ Funzionalità

### 🔐 Authentication & Security System

- ✅ **Role-Based Authentication**: Supporto per AGENCY e COMPANY users
- ✅ **JWT Token Management**: Sicurezza avanzata con token crittografati
- ✅ **Email Verification**: Sistema di verifica email obbligatoria
- ✅ **Password Recovery**: Reset password sicuro con token email
- ✅ **Frontend Auth Pages**: Login, registrazione, recupero password
- ✅ **Security Features**: bcrypt hashing, token expiration, input validation
- ✅ **Multi-Role UI**: Dashboard separate per AGENCY/COMPANY users

### 🏢 Multi-Tenant White-Label

- ✅ Gerarchia tenant: Spotex → Agenzie → Clienti
- ✅ Personalizzazione branding (logo, colori, domini)
- ✅ Limiti configurabili per tier (starter/business/enterprise)
- ✅ Isolamento completo dei dati

### 🚀 WordPress Auto-Deploy

- ✅ Deploy automatico di siti WordPress
- ✅ Configurazione PHP/MySQL automatica
- ✅ Gestione stato deployment (deploying/active/error)
- ✅ Backup automatici schedulati

### 🎫 Ticket System Multi-Livello

- ✅ SLA automatico basato su tier e priorità
- ✅ Escalation automatica ticket critici
- ✅ Assegnazione e routing intelligente
- ✅ Notifiche real-time

### 🌐 Domain & SSL Management

- ✅ Registrazione domini automatica
- ✅ Provisioning SSL con Let's Encrypt
- ✅ Gestione DNS automatica
- ✅ Auto-renewal

### 🔔 Notification System

- ✅ Multi-canale (email, SMS, in-app, webhook)
- ✅ Template personalizzabili
- ✅ Notifiche basate su eventi

---

## 📡 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication

Tutte le API richiedono JWT token:

```bash
Authorization: Bearer <your_jwt_token>
```

### Endpoints Principali

#### Authentication

```http
POST   /api/v1/auth/login               # Login con email/password
POST   /api/v1/auth/register            # Registrazione nuovo utente
POST   /api/v1/auth/logout              # Logout utente
GET    /api/v1/auth/me                  # Profilo utente autenticato
POST   /api/v1/auth/verify-email        # Verifica email con token
POST   /api/v1/auth/forgot-password     # Richiesta reset password
POST   /api/v1/auth/reset-password      # Reset password con token
```

#### Tenants

```http
GET    /api/v1/tenants              # Lista tutti i tenant
POST   /api/v1/tenants              # Crea nuovo tenant
GET    /api/v1/tenants/:id          # Dettaglio tenant
PUT    /api/v1/tenants/:id          # Aggiorna tenant
DELETE /api/v1/tenants/:id          # Elimina tenant
GET    /api/v1/tenants/:id/stats    # Statistiche tenant
```

#### Websites

```http
GET    /api/v1/websites              # Lista siti web
POST   /api/v1/websites              # Crea nuovo sito
GET    /api/v1/websites/:id          # Dettaglio sito
PUT    /api/v1/websites/:id          # Aggiorna sito
DELETE /api/v1/websites/:id          # Elimina sito
POST   /api/v1/websites/:id/deploy   # Deploy sito
```

### Response Format

Tutte le risposte seguono questo formato:

```typescript
{
  "success": boolean,
  "data": T | T[],
  "message": string,
  "timestamp": string,
  "pagination": {  // Solo per liste
    "page": number,
    "limit": number,
    "total": number,
    "totalPages": number
  }
}
```

---

## �️ Database Schema

### Modelli SQLAlchemy Principali

```python
# User Model
class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"))
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)  # AGENCY, COMPANY, ADMIN
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Tenant Model  
class Tenant(Base):
    __tablename__ = "tenants"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    domain = Column(String, unique=True)
    parent_tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"))
    tier = Column(Enum(Tier), default=Tier.STARTER)
    white_label_config = Column(JSON)
    limits = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)

# Website Model
class Website(Base):
    __tablename__ = "websites"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"))
    name = Column(String, nullable=False)
    domain = Column(String, unique=True)
    status = Column(Enum(WebsiteStatus), default=WebsiteStatus.DEPLOYING)
    server_details = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### Migrations

```bash
# Crea nuova migration
alembic revision --autogenerate -m "Add new table"

# Applica migrazioni
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## 🚢 Deployment

### Development

```bash
cd backend
fastapi dev app/main.py
```

### Production

```bash
# Build tutti i servizi
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables (Production)

```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=your_super_secret_key
JWT_SECRET_KEY=your_jwt_secret
SMTP_SERVER=smtp.gmail.com
SMTP_USER=noreply@spotexsrl.com
SMTP_PASSWORD=secret
```

---

## 🧪 Testing

```bash
# Run tutti i test Python
cd backend
pytest

# Test con coverage
pytest --cov=app --cov-report=html

# Test specifico
pytest tests/test_auth.py
```

---

## 📊 Monitoring & Logs

### Logs

```bash
# Vedi logs FastAPI
docker-compose logs -f backend

# Logs strutturati con JSON
fastapi run app/main.py --log-config log_config.json
```

### Health Checks

```bash
# API Gateway
curl http://localhost:8000/health

# Database
curl http://localhost:8000/api/v1/monitoring/health
```

---

## 🤝 Contribuire

### Workflow

1. Crea branch feature: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Apri Pull Request

### Coding Standards

- ✅ Segui principi **DRY & KISS**
- ✅ Type hints Python completi
- ✅ Pydantic per validazione dati
- ✅ SQLAlchemy 2.0 style
- ✅ Async/await per operazioni I/O
- ✅ Test per nuove features

---

## �📝 License

Proprietario - © 2024 Spotex SRL

---

## 👥 Team

- **Alessio** - CTO & Developer
- **Spotex SRL** - Product Owner

---

## 📞 Supporto

- 📧 Email: info@spotexsrl.it
- 🌐 Website: https://www.spotexsrl.com
- 📱 Slack: [spotex-platform.slack.com](https://spotex-platform.slack.com)

---

<div align="center">

**Fatto con ❤️ da Quagliara Alessio per Spotex SRL**

</div>
