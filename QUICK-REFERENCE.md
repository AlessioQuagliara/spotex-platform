# 🔧 Quick Reference - Database Commands

## 🚀 Quick Start

```bash
# Start database
docker-compose up -d postgres redis

# Check health
./scripts/db-health-check.sh

# View data (Prisma Studio alternative)
docker-compose exec postgres psql -U spotex -d spotex_platform
```

---

## 📊 Database Commands

### Connection
```bash
# Connect to database
docker-compose exec postgres psql -U spotex -d spotex_platform

# Connection string
DATABASE_URL="postgresql://spotex:spotex_dev_password@localhost:5432/spotex_platform"
```

### Schema
```bash
# List tables
\dt

# Describe table
\d tenants

# List schemas
\dn+

# List indexes
\di
```

### Data Queries
```bash
# Count all records
SELECT 
  (SELECT COUNT(*) FROM tenants) as tenants,
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM wordpress_sites) as sites,
  (SELECT COUNT(*) FROM tickets) as tickets,
  (SELECT COUNT(*) FROM domains) as domains;

# View all tenants
SELECT id, name, domain, tier, status FROM tenants;

# View all users
SELECT id, email, role, tenant_id FROM users;

# View tickets with details
SELECT 
  t.subject,
  t.priority,
  t.status,
  u1.email as creator,
  u2.email as assignee,
  w.domain as site
FROM tickets t
JOIN users u1 ON t.created_by = u1.id
LEFT JOIN users u2 ON t.assigned_to = u2.id
LEFT JOIN wordpress_sites w ON t.wordpress_site_id = w.id;
```

---

## 🗃️ Data Management

### Backup
```bash
# Backup entire database
docker-compose exec postgres pg_dump -U spotex spotex_platform > backup.sql

# Backup specific table
docker-compose exec postgres pg_dump -U spotex -t tenants spotex_platform > tenants_backup.sql

# Backup with docker cp
docker-compose exec postgres pg_dump -U spotex spotex_platform > /tmp/backup.sql
docker cp spotex-postgres:/tmp/backup.sql ./backups/
```

### Restore
```bash
# Restore from backup
docker-compose exec -T postgres psql -U spotex -d spotex_platform < backup.sql

# Restore with docker cp
docker cp ./backups/backup.sql spotex-postgres:/tmp/
docker-compose exec postgres psql -U spotex -d spotex_platform -f /tmp/backup.sql
```

### Reset Database
```bash
# ⚠️ WARNING: This deletes ALL data!

# Stop containers
docker-compose down

# Remove volume
docker volume rm central-server_postgres_data

# Recreate
docker-compose up -d postgres redis

# Wait for ready (10 seconds)
sleep 10

# Reapply schema
docker cp shared/migration.sql spotex-postgres:/tmp/
docker-compose exec postgres psql -U spotex -d spotex_platform -f /tmp/migration.sql

# Reseed data
docker cp shared/prisma/seed.sql spotex-postgres:/tmp/
docker-compose exec postgres psql -U spotex -d spotex_platform -f /tmp/seed.sql
```

---

## 🔍 Useful Queries

### Find User by Email
```sql
SELECT u.*, t.name as tenant_name
FROM users u
JOIN tenants t ON u.tenant_id = t.id
WHERE u.email = 'admin@spotex.local';
```

### Sites by Tenant
```sql
SELECT w.domain, w.status, w.wordpress_version
FROM wordpress_sites w
JOIN tenants t ON w.tenant_id = t.id
WHERE t.domain = 'webagency1.com';
```

### Open Tickets with SLA Info
```sql
SELECT 
  t.subject,
  t.priority,
  t.status,
  t.sla_response_deadline,
  t.sla_resolution_deadline,
  CASE 
    WHEN t.sla_resolution_deadline < NOW() THEN 'BREACHED'
    WHEN t.sla_resolution_deadline < NOW() + INTERVAL '1 hour' THEN 'AT_RISK'
    ELSE 'ON_TRACK'
  END as sla_status
FROM tickets t
WHERE t.status IN ('open', 'in_progress');
```

### Domains Expiring Soon
```sql
SELECT 
  d.name,
  d.expires_at,
  d.auto_renew,
  t.name as tenant_name
FROM domains d
JOIN tenants t ON d.tenant_id = t.id
WHERE d.expires_at < NOW() + INTERVAL '30 days'
  AND d.status = 'active'
ORDER BY d.expires_at;
```

### Revenue by Tenant (from payments)
```sql
SELECT 
  t.name,
  COUNT(p.id) as payment_count,
  SUM(p.amount) as total_revenue,
  SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END) as completed_revenue
FROM tenants t
LEFT JOIN payments p ON p.tenant_id = t.id
GROUP BY t.id, t.name
ORDER BY total_revenue DESC;
```

---

## 🧪 Testing Queries

### Insert Test Ticket
```sql
INSERT INTO tickets (
  id, tenant_id, subject, description, 
  status, priority, category, 
  created_by, assigned_to, 
  sla_response_deadline, sla_resolution_deadline,
  created_at, updated_at
) VALUES (
  gen_random_uuid()::text,
  'agency-001',
  'Test Ticket',
  'This is a test ticket',
  'open',
  'medium',
  'technical',
  'client-001',
  'agency1-owner-001',
  NOW() + INTERVAL '4 hours',
  NOW() + INTERVAL '24 hours',
  NOW(),
  NOW()
);
```

### Update User Password
```sql
UPDATE users 
SET password_hash = '$2b$10$newhashere',
    updated_at = NOW()
WHERE email = 'admin@spotex.local';
```

### Mark Notification as Read
```sql
UPDATE notifications
SET read_at = NOW(),
    updated_at = NOW()
WHERE user_id = 'admin-user-001'
  AND read_at IS NULL;
```

---

## 📈 Monitoring Queries

### Active Connections
```sql
SELECT 
  datname,
  usename,
  application_name,
  client_addr,
  state,
  query_start
FROM pg_stat_activity
WHERE datname = 'spotex_platform';
```

### Table Sizes
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Index Usage
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Database Size
```sql
SELECT 
  pg_database.datname,
  pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'spotex_platform';
```

---

## 🔐 Security Queries

### List All Users (PostgreSQL)
```sql
\du
```

### Check Permissions
```sql
SELECT 
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee = 'spotex';
```

### Audit Recent Changes
```sql
-- This will be used once audit_logs is populated
SELECT 
  a.action,
  a.entity_type,
  a.entity_id,
  u.email as user_email,
  a.created_at
FROM audit_logs a
JOIN users u ON a.user_id = u.id
ORDER BY a.created_at DESC
LIMIT 20;
```

---

## 🛠️ Maintenance

### Vacuum Database
```bash
docker-compose exec postgres psql -U spotex -d spotex_platform -c "VACUUM ANALYZE;"
```

### Reindex
```bash
docker-compose exec postgres psql -U spotex -d spotex_platform -c "REINDEX DATABASE spotex_platform;"
```

### Check for Dead Tuples
```sql
SELECT 
  schemaname,
  tablename,
  n_dead_tup,
  n_live_tup,
  round(n_dead_tup * 100.0 / GREATEST(n_live_tup, 1), 2) as dead_percentage
FROM pg_stat_user_tables
WHERE n_dead_tup > 0
ORDER BY dead_percentage DESC;
```

---

## 🚨 Troubleshooting

### Check Locks
```sql
SELECT 
  l.locktype,
  l.mode,
  l.granted,
  a.usename,
  a.query
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE NOT l.granted;
```

### Kill Hanging Query
```sql
-- First find the PID
SELECT pid, query_start, state, query
FROM pg_stat_activity
WHERE datname = 'spotex_platform';

-- Then terminate
SELECT pg_terminate_backend(12345); -- replace 12345 with actual PID
```

### Check Logs
```bash
docker-compose logs postgres -f --tail=100
```

---

## 📝 Notes

- All passwords are bcrypt hashed with 10 rounds
- UUIDs are generated with `gen_random_uuid()`
- Timestamps use `NOW()` for consistency
- `tenant_id` is required on all tables for isolation
- Foreign keys use `ON DELETE CASCADE` for cleanup
- Indexes exist on all foreign keys for performance

---

## 🔗 Test Credentials

```
Super Admin:       admin@spotex.local / admin123
Agency Owner 1:    owner@webagency1.com / agency123
Agency Owner 2:    owner@digitalstudio.eu / agency456
Client:            cliente1@example.com / client123
```

---

## 📚 Additional Resources

- Full Database Report: `DATABASE-INITIALIZATION-REPORT.md`
- Progress Update: `PROGRESS-UPDATE.md`
- Session Summary: `SESSION-SUMMARY.md`
- Schema Definition: `shared/prisma/schema.prisma`
- Health Check Script: `./scripts/db-health-check.sh`

---

**Last Updated:** 2025-01-07  
**PostgreSQL Version:** 15.14  
**Database:** spotex_platform  
**Status:** ✅ Ready for Development
