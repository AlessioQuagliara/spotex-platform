# 🚀 Spotex Platform - Quick Deployment Guide

## Pre-requisites
- Docker & Docker Compose installed
- Domain names configured (DNS A records)
- Server with 8GB+ RAM, 50GB+ disk
- SSL certificates (Let's Encrypt)

## 1️⃣ Quick Start (Local Development)

```bash
# Clone repository
git clone <repository-url>
cd spotex-platform

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend-api npx prisma migrate deploy

# Seed database (optional)
docker-compose exec backend-api npx prisma db seed

# Verify health
curl http://localhost:3000/api/health

# Run tests
bash scripts/test-e2e.sh
```

**Access Points**:
- Admin Dashboard: http://localhost:5175
- Agency Dashboard: http://localhost:5174
- Public Site: http://localhost:3005
- API: http://localhost:3000

## 2️⃣ Production Deployment

### Step 1: Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create project directory
sudo mkdir -p /opt/spotex-platform
sudo chown $USER:$USER /opt/spotex-platform
cd /opt/spotex-platform
```

### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.production.example .env.production

# Edit with your production values
nano .env.production

# Required values to configure:
# - DATABASE_URL (production database)
# - JWT_SECRET (generate with: openssl rand -base64 32)
# - JWT_REFRESH_SECRET
# - KAMATERA_API_KEY (from Kamatera dashboard)
# - KAMATERA_API_SECRET
# - STRIPE_SECRET_KEY (from Stripe dashboard)
# - AWS credentials (for backups)
```

### Step 3: SSL Certificates
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Stop nginx if running
docker-compose stop nginx

# Generate certificates for all domains
sudo certbot certonly --standalone \
  -d admin.spotexsrl.com \
  -d agency.spotexsrl.com \
  -d api.spotexsrl.com \
  -d app.spotexsrl.com \
  -d spotexsrl.com \
  -d www.spotexsrl.com \
  --email ssl@spotexsrl.com \
  --agree-tos \
  --non-interactive

# Setup auto-renewal
echo "0 0 * * * certbot renew --quiet && docker-compose exec nginx nginx -s reload" | sudo crontab -
```

### Step 4: Database Setup
```bash
# Start database only
docker-compose up -d postgres

# Wait for database to be ready
sleep 10

# Run migrations
docker-compose exec postgres psql -U spotex_prod -c "CREATE DATABASE spotex_platform_prod;"
docker-compose exec backend-api npx prisma migrate deploy

# Create admin user (optional)
docker-compose exec backend-api npm run seed:admin
```

### Step 5: Deploy Services
```bash
# Build and start all services
docker-compose -f docker-compose.production.yml up -d

# Check all services are running
docker-compose ps

# Verify health
curl -f https://api.spotexsrl.com/health || echo "Health check failed"

# Check logs for errors
docker-compose logs --tail=50
```

### Step 6: Configure Backups
```bash
# Make backup script executable
chmod +x scripts/backup-database.sh

# Test backup manually
./scripts/backup-database.sh

# Add to crontab for daily backups at 2 AM
echo "0 2 * * * /opt/spotex-platform/scripts/backup-database.sh >> /var/log/spotex-backup.log 2>&1" | crontab -
```

### Step 7: Monitoring Setup
```bash
# Setup Sentry (optional)
export SENTRY_DSN="your-sentry-dsn"

# Configure uptime monitoring
# - Add https://api.spotexsrl.com/health to UptimeRobot
# - Configure email/Slack alerts

# Setup log rotation
sudo tee /etc/logrotate.d/spotex <<EOF
/opt/spotex-platform/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        docker-compose restart nginx
    endscript
}
EOF
```

## 3️⃣ Verification Checklist

```bash
# Run comprehensive health check
curl -s https://api.spotexsrl.com/health | jq .

# Test all endpoints
curl -I https://admin.spotexsrl.com
curl -I https://agency.spotexsrl.com
curl -I https://api.spotexsrl.com

# Check SSL certificates
echo | openssl s_client -servername admin.spotexsrl.com -connect admin.spotexsrl.com:443 2>/dev/null | openssl x509 -noout -dates

# Run smoke tests
cd /opt/spotex-platform/tests
npm test -- production-smoke.test.ts

# Check Docker resources
docker stats --no-stream

# Verify backups
ls -lh /var/backups/spotex/
```

## 4️⃣ Post-Deployment

### Monitoring Dashboard Access
- **Health Status**: https://api.spotexsrl.com/health
- **Admin Panel**: https://admin.spotexsrl.com
- **Agency Panel**: https://agency.spotexsrl.com

### First Login
1. Navigate to https://admin.spotexsrl.com
2. Use admin credentials from environment setup
3. Change default password immediately
4. Configure tenant settings
5. Test tenant registration flow

### Enable Production Features
```bash
# Enable production logging
docker-compose exec backend-api npm run logs:production

# Enable monitoring
docker-compose exec backend-api npm run monitoring:enable

# Start background jobs
docker-compose exec backend-api npm run jobs:start
```

## 5️⃣ Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs backend-api --tail=100

# Check disk space
df -h

# Check memory
free -h

# Restart problematic service
docker-compose restart backend-api
```

### Database connection errors
```bash
# Check database is running
docker-compose ps postgres

# Check connection
docker-compose exec postgres psql -U spotex_prod -d spotex_platform_prod -c "SELECT 1;"

# Reset connection pool
docker-compose restart backend-api
```

### SSL certificate issues
```bash
# Renew certificates
sudo certbot renew --force-renewal

# Restart nginx
docker-compose restart nginx

# Check certificate validity
certbot certificates
```

## 6️⃣ Scaling (Optional)

### Horizontal Scaling
```bash
# Scale backend API to 3 instances
docker-compose up -d --scale backend-api=3

# Scale with load balancing
# Configure nginx upstream with multiple backends
```

### Database Optimization
```sql
-- Run as database admin
VACUUM ANALYZE;
REINDEX DATABASE spotex_platform_prod;

-- Check slow queries
SELECT query, calls, total_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

## 7️⃣ Maintenance Windows

### Rolling Updates (Zero Downtime)
```bash
# Pull latest images
docker-compose pull

# Update one service at a time
docker-compose up -d --no-deps --force-recreate backend-api
sleep 30 # Wait for health check
docker-compose up -d --no-deps --force-recreate frontend-admin
```

### Database Migrations
```bash
# Backup before migration
./scripts/backup-database.sh

# Run migrations
docker-compose exec backend-api npx prisma migrate deploy

# Verify migration
docker-compose exec backend-api npx prisma migrate status
```

## 📞 Support

### Emergency Procedures
See `PRODUCTION_RUNBOOK.md` for:
- Common issues & solutions
- Emergency contacts
- Recovery procedures
- Escalation paths

### Health Check Endpoints
- Liveness: `/health/live` (simple alive check)
- Readiness: `/health/ready` (ready to serve traffic)
- Full Health: `/health` (comprehensive system check)

## 🎉 Launch Checklist

Before announcing the launch:
- [ ] All health checks passing
- [ ] SSL certificates valid (> 30 days)
- [ ] Backups running successfully
- [ ] Monitoring alerts configured
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Load testing performed
- [ ] Disaster recovery tested
- [ ] Team trained on runbook
- [ ] Support channels ready

---

**Deployment Time**: ~45 minutes (excluding DNS propagation)
**Recommended Server**: 8GB RAM, 4 CPU cores, 100GB SSD
**Minimum Server**: 4GB RAM, 2 CPU cores, 50GB SSD

🚀 **Ready for Production Launch!**
