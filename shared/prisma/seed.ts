import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Crea tenant principale (Spotex SRL - Platform Owner)
  const spotexTenant = await prisma.tenant.upsert({
    where: { domain: 'spotex.local' },
    update: {},
    create: {
      name: 'Spotex SRL',
      domain: 'spotex.local',
      tier: 'enterprise',
      status: 'active',
      whiteLabelConfig: {
        brandName: 'Spotex',
        primaryColor: '#3B82F6',
        logo: '/logo.png',
      },
      limits: {
        maxAgencies: -1, // unlimited
        maxSitesPerAgency: -1,
        maxUsers: -1,
      },
    },
  });
  console.log('✅ Created Spotex tenant:', spotexTenant.id);

  // 2. Crea admin utente per Spotex
  const adminPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { 
      tenantId_email: {
        tenantId: spotexTenant.id,
        email: 'admin@spotex.local'
      }
    },
    update: {},
    create: {
      email: 'admin@spotex.local',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'Spotex',
      role: 'super_admin',
      tenantId: spotexTenant.id,
      status: 'active',
      permissions: ['*'],
    },
  });
  console.log('✅ Created admin user:', adminUser.email);

  // 3. Crea agenzie di test
  const agency1 = await prisma.tenant.upsert({
    where: { domain: 'webagency1.com' },
    update: {},
    create: {
      name: 'Web Agency Italia',
      domain: 'webagency1.com',
      parentTenantId: spotexTenant.id,
      tier: 'professional',
      status: 'active',
      whiteLabelConfig: {
        brandName: 'Web Agency Italia',
        primaryColor: '#10B981',
        logo: '/logos/agency1.png',
      },
      limits: {
        maxSitesPerAgency: 50,
        maxUsers: 10,
      },
    },
  });
  console.log('✅ Created agency1:', agency1.name);

  const agency2 = await prisma.tenant.upsert({
    where: { domain: 'digitalstudio.eu' },
    update: {},
    create: {
      name: 'Digital Studio Europe',
      domain: 'digitalstudio.eu',
      parentTenantId: spotexTenant.id,
      tier: 'business',
      status: 'active',
      whiteLabelConfig: {
        brandName: 'Digital Studio',
        primaryColor: '#8B5CF6',
        logo: '/logos/agency2.png',
      },
      limits: {
        maxSitesPerAgency: 25,
        maxUsers: 5,
      },
    },
  });
  console.log('✅ Created agency2:', agency2.name);

  // 4. Crea utenti per le agenzie
  const agency1Password = await bcrypt.hash('agency123', 10);
  const agency1Owner = await prisma.user.upsert({
    where: { 
      tenantId_email: {
        tenantId: agency1.id,
        email: 'owner@webagency1.com'
      }
    },
    update: {},
    create: {
      email: 'owner@webagency1.com',
      passwordHash: agency1Password,
      firstName: 'Mario',
      lastName: 'Rossi',
      role: 'agency_owner',
      tenantId: agency1.id,
      status: 'active',
      permissions: ['manage_clients', 'manage_sites', 'view_reports', 'manage_billing'],
    },
  });
  console.log('✅ Created agency1 owner:', agency1Owner.email);

  const agency2Password = await bcrypt.hash('agency456', 10);
  const agency2Owner = await prisma.user.upsert({
    where: { 
      tenantId_email: {
        tenantId: agency2.id,
        email: 'owner@digitalstudio.eu'
      }
    },
    update: {},
    create: {
      email: 'owner@digitalstudio.eu',
      passwordHash: agency2Password,
      firstName: 'Laura',
      lastName: 'Bianchi',
      role: 'agency_owner',
      tenantId: agency2.id,
      status: 'active',
      permissions: ['manage_clients', 'manage_sites', 'view_reports', 'manage_billing'],
    },
  });
  console.log('✅ Created agency2 owner:', agency2Owner.email);

  // 5. Crea clienti per agency1
  const client1 = await prisma.user.upsert({
    where: { 
      tenantId_email: {
        tenantId: agency1.id,
        email: 'cliente1@example.com'
      }
    },
    update: {},
    create: {
      email: 'cliente1@example.com',
      passwordHash: await bcrypt.hash('client123', 10),
      firstName: 'Giuseppe',
      lastName: 'Verdi',
      role: 'client',
      tenantId: agency1.id,
      status: 'active',
      permissions: ['view_own_sites'],
    },
  });
  console.log('✅ Created client1:', client1.email);

  // 6. Crea siti WordPress per i clienti
  const site1 = await prisma.wordPressSite.create({
    data: {
      tenantId: agency1.id,
      name: 'E-commerce Moda',
      domain: 'ecommerce-moda.com',
      status: 'active',
      wordpressVersion: '6.4.2',
      phpVersion: '8.2',
      serverDetails: {
        serverIp: '192.168.1.100',
        sslEnabled: true,
        sslExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 giorni
        backupSchedule: 'daily',
        autoUpdate: true,
        staging: false,
        plugins: ['woocommerce', 'yoast-seo', 'wpforms'],
        theme: 'storefront',
        maxUploadSize: '64M',
        memoryLimit: '256M',
      },
      adminUrl: 'https://ecommerce-moda.com/wp-admin',
      adminUsername: 'admin',
      deployedAt: new Date(),
      lastBackupAt: new Date(),
    },
  });
  console.log('✅ Created site1:', site1.domain);

  const site2 = await prisma.wordPressSite.create({
    data: {
      tenantId: agency1.id,
      name: 'Blog Personale',
      domain: 'blog-giuseppe.com',
      status: 'active',
      wordpressVersion: '6.4.2',
      phpVersion: '8.1',
      serverDetails: {
        serverIp: '192.168.1.101',
        sslEnabled: true,
        sslExpiresAt: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000), // 75 giorni
        backupSchedule: 'weekly',
        autoUpdate: false,
        staging: false,
        plugins: ['jetpack', 'akismet'],
        theme: 'twentytwentyfour',
      },
      adminUrl: 'https://blog-giuseppe.com/wp-admin',
      adminUsername: 'admin',
      deployedAt: new Date(),
      lastBackupAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 giorni fa
    },
  });
  console.log('✅ Created site2:', site2.domain);

  // 7. Crea tickets di test
  const ticket1 = await prisma.ticket.create({
    data: {
      tenantId: agency1.id,
      createdBy: client1.id,
      wordPressSiteId: site1.id,
      subject: 'Problema con checkout WooCommerce',
      description: 'Il carrello non procede al pagamento, errore 500',
      priority: 'high',
      status: 'open',
      category: 'technical',
      slaResponseDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 ore
      slaResolutionDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 ore
      assignedTo: agency1Owner.id,
    },
  });
  console.log('✅ Created ticket1:', ticket1.id);

  await prisma.ticketMessage.create({
    data: {
      tenantId: agency1.id,
      ticketId: ticket1.id,
      userId: client1.id,
      message: 'Ho provato a fare il checkout ma continua a darmi errore. Allegato screenshot.',
      isInternal: false,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      tenantId: agency1.id,
      createdBy: client1.id,
      wordPressSiteId: site2.id,
      subject: 'Richiesta aggiornamento plugin',
      description: 'Vorrei aggiornare Jetpack alla versione più recente',
      priority: 'low',
      status: 'in_progress',
      category: 'maintenance',
      slaResponseDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 ore
      slaResolutionDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 ore
      assignedTo: agency1Owner.id,
    },
  });
  console.log('✅ Created ticket2:', ticket2.id);

  // 8. Crea domini
  await prisma.domain.create({
    data: {
      tenantId: agency1.id,
      name: 'ecommerce-moda.com',
      wordPressSiteId: site1.id,
      registrar: 'Aruba',
      status: 'active',
      sslStatus: 'active',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 anno
      autoRenew: true,
      nameservers: ['ns1.spotex.local', 'ns2.spotex.local'],
      registeredAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 mesi fa
    },
  });

  await prisma.domain.create({
    data: {
      tenantId: agency1.id,
      name: 'blog-giuseppe.com',
      wordPressSiteId: site2.id,
      registrar: 'Register.it',
      status: 'active',
      sslStatus: 'active',
      expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 mesi
      autoRenew: false,
      nameservers: ['ns1.spotex.local', 'ns2.spotex.local'],
      registeredAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 mesi fa
    },
  });
  console.log('✅ Created domains');

  // 9. Crea subscription per agency1
  const subscription = await prisma.subscription.create({
    data: {
      tenantId: agency1.id,
      tier: 'professional',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 giorni
    },
  });
  console.log('✅ Created subscription:', subscription.id);

  // 10. Crea pagamenti di esempio
  await prisma.payment.create({
    data: {
      tenantId: agency1.id,
      amount: 99.00,
      currency: 'EUR',
      status: 'completed',
      paymentMethod: 'credit_card',
      transactionId: 'tx_' + Math.random().toString(36).substring(7),
      paidAt: new Date(),
    },
  });

  await prisma.payment.create({
    data: {
      tenantId: agency1.id,
      amount: 99.00,
      currency: 'EUR',
      status: 'pending',
      paymentMethod: 'bank_transfer',
      transactionId: 'tx_' + Math.random().toString(36).substring(7),
    },
  });
  console.log('✅ Created payments');

  // 11. Crea notifiche
  await prisma.notification.create({
    data: {
      tenantId: agency1.id,
      userId: agency1Owner.id,
      type: 'ticket',
      title: 'Nuovo ticket ricevuto',
      message: 'Giuseppe Verdi ha aperto un nuovo ticket: "Problema con checkout WooCommerce"',
      channels: ['email', 'in_app'],
      metadata: {
        ticketId: ticket1.id,
        priority: 'high',
      },
    },
  });

  await prisma.notification.create({
    data: {
      tenantId: agency1.id,
      userId: client1.id,
      type: 'system',
      title: 'Certificato SSL in scadenza',
      message: 'Il certificato SSL per blog-giuseppe.com scadrà tra 30 giorni',
      channels: ['email'],
      metadata: {
        siteId: site2.id,
        domain: 'blog-giuseppe.com',
      },
    },
  });
  console.log('✅ Created notifications');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('-----------------------------------');
  console.log('Super Admin:');
  console.log('  Email: admin@spotex.local');
  console.log('  Password: admin123');
  console.log('\nAgency Owner (Web Agency Italia):');
  console.log('  Email: owner@webagency1.com');
  console.log('  Password: agency123');
  console.log('\nAgency Owner (Digital Studio Europe):');
  console.log('  Email: owner@digitalstudio.eu');
  console.log('  Password: agency456');
  console.log('\nClient:');
  console.log('  Email: cliente1@example.com');
  console.log('  Password: client123');
  console.log('-----------------------------------\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
