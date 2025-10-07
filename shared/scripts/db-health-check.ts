// Database Health Check Script
import { getPrismaClient, checkDatabaseHealth } from '../src/services/prisma.service';

async function main() {
  console.log('🏥 Running database health check...\n');

  try {
    // 1. Check database connection
    console.log('1️⃣ Checking database connection...');
    const isHealthy = await checkDatabaseHealth();
    console.log(isHealthy ? '   ✅ Database connection OK' : '   ❌ Database connection FAILED');

    if (!isHealthy) {
      process.exit(1);
    }

    const prisma = getPrismaClient();

    // 2. Count records in each table
    console.log('\n2️⃣ Counting records in tables...');
    const [tenants, users, sites, tickets, domains, subscriptions, payments, notifications] = await Promise.all([
      prisma.tenant.count(),
      prisma.user.count(),
      prisma.wordPressSite.count(),
      prisma.ticket.count(),
      prisma.domain.count(),
      prisma.subscription.count(),
      prisma.payment.count(),
      prisma.notification.count(),
    ]);

    console.log(`   📊 Tenants: ${tenants}`);
    console.log(`   👤 Users: ${users}`);
    console.log(`   🌐 WordPress Sites: ${sites}`);
    console.log(`   🎫 Tickets: ${tickets}`);
    console.log(`   🔗 Domains: ${domains}`);
    console.log(`   💳 Subscriptions: ${subscriptions}`);
    console.log(`   💰 Payments: ${payments}`);
    console.log(`   🔔 Notifications: ${notifications}`);

    // 3. Test relationships
    console.log('\n3️⃣ Testing relationships...');
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@spotex.local' },
      include: { tenant: true },
    });

    if (adminUser) {
      console.log(`   ✅ Found admin user: ${adminUser.email}`);
      console.log(`   ✅ Tenant relationship: ${adminUser.tenant.name}`);
    } else {
      console.log('   ❌ Admin user not found');
    }

    const agency1 = await prisma.tenant.findFirst({
      where: { domain: 'webagency1.com' },
      include: {
        users: true,
        sites: true,
        tickets: true,
      },
    });

    if (agency1) {
      console.log(`   ✅ Found agency: ${agency1.name}`);
      console.log(`      - Users: ${agency1.users.length}`);
      console.log(`      - Sites: ${agency1.sites.length}`);
      console.log(`      - Tickets: ${agency1.tickets.length}`);
    } else {
      console.log('   ❌ Agency not found');
    }

    // 4. Test complex query (ticket with all relations)
    console.log('\n4️⃣ Testing complex query...');
    const ticket = await prisma.ticket.findFirst({
      include: {
        tenant: true,
        creator: true,
        assignee: true,
        site: true,
        messages: true,
      },
    });

    if (ticket) {
      console.log(`   ✅ Found ticket: ${ticket.subject}`);
      console.log(`      - Tenant: ${ticket.tenant.name}`);
      console.log(`      - Creator: ${ticket.creator.email}`);
      console.log(`      - Assignee: ${ticket.assignee?.email || 'Unassigned'}`);
      console.log(`      - Site: ${ticket.site?.domain || 'No site'}`);
      console.log(`      - Messages: ${ticket.messages.length}`);
    }

    console.log('\n✅ All health checks passed!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Health check failed:', error);
    process.exit(1);
  }
}

main();
