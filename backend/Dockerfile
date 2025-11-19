# ========================================
# 🐳 Dockerfile Backend FastAPI
# ========================================
# Questo Dockerfile è ottimizzato per PRODUZIONE
# Per development usa docker-compose.dev.yml

# Base image Python 3.12 slim (leggera e sicura)
FROM python:3.12-slim

# Imposta variabili d'ambiente per Python
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Directory di lavoro nel container
WORKDIR /app

# Installa dipendenze di sistema necessarie
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia e installa dipendenze Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia il codice dell'applicazione
COPY ./app ./app
COPY ./alembic ./alembic
COPY ./alembic.ini .

# Crea utente non-root per sicurezza
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Esponi porta 8000
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Comando di avvio per PRODUZIONE
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]