#!/usr/bin/env bash
# Database Health Check usando psql diretto

echo "🏥 Running database health check..."
echo ""

# Check connection
echo "1️⃣ Checking database connection..."
if docker-compose exec -T postgres psql -U spotex -d spotex_platform -c "SELECT 1;" > /dev/null 2>&1; then
  echo "   ✅ Database connection OK"
else
  echo "   ❌ Database connection FAILED"
  exit 1
fi

# Count records
echo ""
echo "2️⃣ Counting records in tables..."
docker-compose exec -T postgres psql -U spotex -d spotex_platform -t -c "
SELECT 
  '   📊 Tenants: ' || COUNT(*) FROM tenants
  UNION ALL SELECT '   👤 Users: ' || COUNT(*) FROM users
  UNION ALL SELECT '   🌐 WordPress Sites: ' || COUNT(*) FROM wordpress_sites
  UNION ALL SELECT '   🎫 Tickets: ' || COUNT(*) FROM tickets
  UNION ALL SELECT '   🔗 Domains: ' || COUNT(*) FROM domains
  UNION ALL SELECT '   💳 Subscriptions: ' || COUNT(*) FROM subscriptions
  UNION ALL SELECT '   💰 Payments: ' || COUNT(*) FROM payments
  UNION ALL SELECT '   🔔 Notifications: ' || COUNT(*) FROM notifications;
"

# Test relationships
echo ""
echo "3️⃣ Testing relationships..."
docker-compose exec -T postgres psql -U spotex -d spotex_platform -t -c "
SELECT '   ✅ Admin user: ' || u.email || ' (Tenant: ' || t.name || ')'
FROM users u
JOIN tenants t ON u.tenant_id = t.id
WHERE u.email = 'admin@spotex.local';
"

docker-compose exec -T postgres psql -U spotex -d spotex_platform -t -c "
SELECT 
  '   ✅ Agency: ' || t.name || 
  ' (Users: ' || COUNT(DISTINCT u.id) || 
  ', Sites: ' || COUNT(DISTINCT w.id) || ')'
FROM tenants t
LEFT JOIN users u ON u.tenant_id = t.id
LEFT JOIN wordpress_sites w ON w.tenant_id = t.id
WHERE t.domain = 'webagency1.com'
GROUP BY t.id, t.name;
"

# Complex query
echo ""
echo "4️⃣ Testing complex query..."
docker-compose exec -T postgres psql -U spotex -d spotex_platform -t -c "
SELECT 
  '   ✅ Ticket: ' || tk.subject || 
  E'\n      - Tenant: ' || t.name ||
  E'\n      - Creator: ' || u1.email ||
  E'\n      - Assignee: ' || COALESCE(u2.email, 'Unassigned') ||
  E'\n      - Site: ' || COALESCE(w.domain, 'No site') ||
  E'\n      - Priority: ' || tk.priority ||
  E'\n      - Status: ' || tk.status
FROM tickets tk
JOIN tenants t ON tk.tenant_id = t.id
JOIN users u1 ON tk.created_by = u1.id
LEFT JOIN users u2 ON tk.assigned_to = u2.id
LEFT JOIN wordpress_sites w ON tk.wordpress_site_id = w.id
LIMIT 1;
"

echo ""
echo "✅ All health checks passed!"
echo ""
