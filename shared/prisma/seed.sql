-- Seed data for Spotex Platform
-- Run with: psql -U spotex -d spotex_platform -f seed.sql

-- 1. Spotex Tenant (Platform Owner)
INSERT INTO tenants (id, name, domain, tier, status, white_label_config, limits, created_at, updated_at)
VALUES (
  'spotex-platform-001',
  'Spotex SRL',
  'spotex.local',
  'enterprise',
  'active',
  '{"brandName": "Spotex", "primaryColor": "#3B82F6", "logo": "/logo.png"}',
  '{"maxAgencies": -1, "maxSitesPerAgency": -1, "maxUsers": -1}',
  NOW(),
  NOW()
) ON CONFLICT (domain) DO NOTHING;

-- 2. Admin User
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role, status, permissions, created_at, updated_at)
VALUES (
  'admin-user-001',
  'spotex-platform-001',
  'admin@spotex.local',
  '$2b$10$L/zXqild5cA21r5o0FT2P.ch2bHQn32hhjgrDKWFIZzmdOfviOKzy',
  'Admin',
  'Spotex',
  'super_admin',
  'active',
  '["*"]',
  NOW(),
  NOW()
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- 3. Agency 1
INSERT INTO tenants (id, name, domain, parent_tenant_id, tier, status, white_label_config, limits, created_at, updated_at)
VALUES (
  'agency-001',
  'Web Agency Italia',
  'webagency1.com',
  'spotex-platform-001',
  'professional',
  'active',
  '{"brandName": "Web Agency Italia", "primaryColor": "#10B981", "logo": "/logos/agency1.png"}',
  '{"maxSitesPerAgency": 50, "maxUsers": 10}',
  NOW(),
  NOW()
) ON CONFLICT (domain) DO NOTHING;

-- 4. Agency 2
INSERT INTO tenants (id, name, domain, parent_tenant_id, tier, status, white_label_config, limits, created_at, updated_at)
VALUES (
  'agency-002',
  'Digital Studio Europe',
  'digitalstudio.eu',
  'spotex-platform-001',
  'business',
  'active',
  '{"brandName": "Digital Studio", "primaryColor": "#8B5CF6", "logo": "/logos/agency2.png"}',
  '{"maxSitesPerAgency": 25, "maxUsers": 5}',
  NOW(),
  NOW()
) ON CONFLICT (domain) DO NOTHING;

-- 5. Agency 1 Owner
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role, status, permissions, created_at, updated_at)
VALUES (
  'agency1-owner-001',
  'agency-001',
  'owner@webagency1.com',
  '$2b$10$izFNoO55C8xj7MjXXrlZZ.wRJ/48rueToLZlbeO3dj.cWtroTYX3a',
  'Mario',
  'Rossi',
  'agency_owner',
  'active',
  '["manage_clients", "manage_sites", "view_reports", "manage_billing"]',
  NOW(),
  NOW()
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- 6. Agency 2 Owner
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role, status, permissions, created_at, updated_at)
VALUES (
  'agency2-owner-001',
  'agency-002',
  'owner@digitalstudio.eu',
  '$2b$10$fj3t2cj79cZIv6vlT0hnhelzSjr4HPgi1o/9sIHNstXfvDS1FiUo6',
  'Laura',
  'Bianchi',
  'agency_owner',
  'active',
  '["manage_clients", "manage_sites", "view_reports", "manage_billing"]',
  NOW(),
  NOW()
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- 7. Client 1
INSERT INTO users (id, tenant_id, email, password_hash, first_name, last_name, role, status, permissions, created_at, updated_at)
VALUES (
  'client-001',
  'agency-001',
  'cliente1@example.com',
  '$2b$10$VValbesVQGi6NJjwY0U6iOrm5U4ORXEJbII/vbFgr1iiYDAz.lAt6',
  'Giuseppe',
  'Verdi',
  'client',
  'active',
  '["view_own_sites"]',
  NOW(),
  NOW()
) ON CONFLICT (tenant_id, email) DO NOTHING;

-- 8. WordPress Sites
INSERT INTO wordpress_sites (id, tenant_id, name, domain, status, wordpress_version, php_version, server_details, admin_url, admin_username, deployed_at, last_backup_at, created_at, updated_at)
VALUES 
(
  'site-001',
  'agency-001',
  'E-commerce Moda',
  'ecommerce-moda.com',
  'active',
  '6.4.2',
  '8.2',
  '{"serverIp": "192.168.1.100", "sslEnabled": true, "backupSchedule": "daily", "plugins": ["woocommerce", "yoast-seo"], "theme": "storefront"}',
  'https://ecommerce-moda.com/wp-admin',
  'admin',
  NOW(),
  NOW(),
  NOW(),
  NOW()
),
(
  'site-002',
  'agency-001',
  'Blog Personale',
  'blog-giuseppe.com',
  'active',
  '6.4.2',
  '8.1',
  '{"serverIp": "192.168.1.101", "sslEnabled": true, "backupSchedule": "weekly", "plugins": ["jetpack", "akismet"], "theme": "twentytwentyfour"}',
  'https://blog-giuseppe.com/wp-admin',
  'admin',
  NOW(),
  NOW() - INTERVAL '2 days',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- 9. Domains
INSERT INTO domains (id, tenant_id, name, wordpress_site_id, status, ssl_status, registrar, registered_at, expires_at, auto_renew, nameservers, created_at, updated_at)
VALUES
(
  'domain-001',
  'agency-001',
  'ecommerce-moda.com',
  'site-001',
  'active',
  'active',
  'Aruba',
  NOW() - INTERVAL '180 days',
  NOW() + INTERVAL '365 days',
  TRUE,
  '["ns1.spotex.local", "ns2.spotex.local"]',
  NOW(),
  NOW()
),
(
  'domain-002',
  'agency-001',
  'blog-giuseppe.com',
  'site-002',
  'active',
  'active',
  'Register.it',
  NOW() - INTERVAL '180 days',
  NOW() + INTERVAL '180 days',
  FALSE,
  '["ns1.spotex.local", "ns2.spotex.local"]',
  NOW(),
  NOW()
) ON CONFLICT (tenant_id, name) DO NOTHING;

-- 10. Tickets
INSERT INTO tickets (id, tenant_id, subject, description, status, priority, category, created_by, assigned_to, wordpress_site_id, sla_response_deadline, sla_resolution_deadline, created_at, updated_at)
VALUES
(
  'ticket-001',
  'agency-001',
  'Problema con checkout WooCommerce',
  'Il carrello non procede al pagamento, errore 500',
  'open',
  'high',
  'technical',
  'client-001',
  'agency1-owner-001',
  'site-001',
  NOW() + INTERVAL '2 hours',
  NOW() + INTERVAL '4 hours',
  NOW(),
  NOW()
),
(
  'ticket-002',
  'agency-001',
  'Richiesta aggiornamento plugin',
  'Vorrei aggiornare Jetpack alla versione più recente',
  'in_progress',
  'low',
  'maintenance',
  'client-001',
  'agency1-owner-001',
  'site-002',
  NOW() + INTERVAL '24 hours',
  NOW() + INTERVAL '48 hours',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- 11. Ticket Messages
INSERT INTO ticket_messages (id, tenant_id, ticket_id, user_id, message, is_internal, created_at, updated_at)
VALUES
(
  gen_random_uuid()::text,
  'agency-001',
  'ticket-001',
  'client-001',
  'Ho provato a fare il checkout ma continua a darmi errore. Allegato screenshot.',
  FALSE,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- 12. Subscriptions
INSERT INTO subscriptions (id, tenant_id, tier, status, current_period_start, current_period_end, created_at, updated_at)
VALUES
(
  'subscription-001',
  'agency-001',
  'professional',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days',
  NOW(),
  NOW()
) ON CONFLICT (tenant_id) DO NOTHING;

-- 13. Payments
INSERT INTO payments (id, tenant_id, amount, currency, status, payment_method, transaction_id, paid_at, created_at, updated_at)
VALUES
(
  gen_random_uuid()::text,
  'agency-001',
  99.00,
  'EUR',
  'completed',
  'credit_card',
  'tx_' || substr(md5(random()::text), 1, 10),
  NOW(),
  NOW(),
  NOW()
),
(
  gen_random_uuid()::text,
  'agency-001',
  99.00,
  'EUR',
  'pending',
  'bank_transfer',
  'tx_' || substr(md5(random()::text), 1, 10),
  NULL,
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- 14. Notifications
INSERT INTO notifications (id, tenant_id, user_id, type, title, message, channels, metadata, created_at, updated_at)
VALUES
(
  gen_random_uuid()::text,
  'agency-001',
  'agency1-owner-001',
  'ticket',
  'Nuovo ticket ricevuto',
  'Giuseppe Verdi ha aperto un nuovo ticket: "Problema con checkout WooCommerce"',
  '["email", "in_app"]',
  '{"ticketId": "ticket-001", "priority": "high"}',
  NOW(),
  NOW()
),
(
  gen_random_uuid()::text,
  'agency-001',
  'client-001',
  'system',
  'Certificato SSL in scadenza',
  'Il certificato SSL per blog-giuseppe.com scadrà tra 30 giorni',
  '["email"]',
  '{"siteId": "site-002", "domain": "blog-giuseppe.com"}',
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

-- Print success message
\echo '✅ Database seeded successfully!'
\echo ''
\echo '📋 Test Accounts:'
\echo '-----------------------------------'
\echo 'Super Admin:'
\echo '  Email: admin@spotex.local'
\echo '  Password: admin123'
\echo ''
\echo 'Agency Owner (Web Agency Italia):'
\echo '  Email: owner@webagency1.com'
\echo '  Password: agency123'
\echo ''
\echo 'Agency Owner (Digital Studio Europe):'
\echo '  Email: owner@digitalstudio.eu'
\echo '  Password: agency456'
\echo ''
\echo 'Client:'
\echo '  Email: cliente1@example.com'
\echo '  Password: client123'
\echo '-----------------------------------'
