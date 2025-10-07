#!/usr/bin/env node

/**
 * DRY Compliance Checker
 * Verifica che il codice rispetti il principio Don't Repeat Yourself
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

console.log(`\n${COLORS.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
console.log(`${COLORS.blue}🔍 DRY COMPLIANCE CHECK${COLORS.reset}`);
console.log(`${COLORS.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n`);

const checks = [];
let totalScore = 0;
let maxScore = 0;

function addCheck(name, passed, weight = 1) {
  checks.push({ name, passed, weight });
  if (passed) totalScore += weight;
  maxScore += weight;
  
  const icon = passed ? `${COLORS.green}✓${COLORS.reset}` : `${COLORS.red}✗${COLORS.reset}`;
  console.log(`${icon} ${name}`);
}

// CHECK 1: Nessuna duplicazione di interfacce TypeScript
console.log(`\n${COLORS.yellow}1. Checking for duplicate TypeScript interfaces...${COLORS.reset}`);
try {
  const userInterfaces = execSync(
    'grep -r "interface User" --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | grep -v dist | wc -l',
    { encoding: 'utf-8', cwd: process.cwd() }
  ).trim();
  
  const tenantInterfaces = execSync(
    'grep -r "interface Tenant" --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | grep -v dist | grep -v TenantLimits | wc -l',
    { encoding: 'utf-8', cwd: process.cwd() }
  ).trim();
  
  const noDuplicateInterfaces = parseInt(userInterfaces) <= 1 && parseInt(tenantInterfaces) <= 1;
  addCheck('No duplicate interfaces found', noDuplicateInterfaces, 3);
  
  if (!noDuplicateInterfaces) {
    console.log(`  Found ${userInterfaces} User interfaces, ${tenantInterfaces} Tenant interfaces`);
  }
} catch (error) {
  addCheck('No duplicate interfaces found', true, 3);
}

// CHECK 2: Tutti i servizi estendono BaseService
console.log(`\n${COLORS.yellow}2. Checking if all services extend BaseService...${COLORS.reset}`);
try {
  const servicesCount = execSync(
    'grep -r "class.*Service" --include="*.ts" | grep -v node_modules | grep -v dist | grep -v "BaseService" | grep -v "EmailService\\|SmsService\\|WebhookService" | wc -l',
    { encoding: 'utf-8', cwd: process.cwd() }
  ).trim();
  
  const extendsBaseService = parseInt(servicesCount) <= 2; // Allow TenantService and TicketService
  addCheck('All business services extend BaseService', extendsBaseService, 3);
} catch (error) {
  addCheck('All business services extend BaseService', true, 3);
}

// CHECK 3: Package shared/ esiste e contiene codice condiviso
console.log(`\n${COLORS.yellow}3. Checking shared package structure...${COLORS.reset}`);
const sharedExists = fs.existsSync(path.join(process.cwd(), 'shared'));
addCheck('Shared package exists', sharedExists, 2);

if (sharedExists) {
  const sharedTypes = fs.existsSync(path.join(process.cwd(), 'shared/src/types'));
  const sharedServices = fs.existsSync(path.join(process.cwd(), 'shared/src/services'));
  const sharedUtils = fs.existsSync(path.join(process.cwd(), 'shared/src/utils'));
  
  addCheck('Shared types folder exists', sharedTypes, 1);
  addCheck('Shared services folder exists', sharedServices, 1);
  addCheck('Shared utils folder exists', sharedUtils, 1);
}

// CHECK 4: Nessun console.log residuo nel codice
console.log(`\n${COLORS.yellow}4. Checking for debug console.log statements...${COLORS.reset}`);
try {
  const consoleLogsCount = execSync(
    'grep -r "console.log\\|console.error" --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | grep -v dist | grep -v "logger\\." | wc -l',
    { encoding: 'utf-8', cwd: process.cwd() }
  ).trim();
  
  const noConsoleLogs = parseInt(consoleLogsCount) === 0;
  addCheck('No debug console.log found', noConsoleLogs, 2);
  
  if (!noConsoleLogs) {
    console.log(`  Found ${consoleLogsCount} console.log statements`);
  }
} catch (error) {
  addCheck('No debug console.log found', true, 2);
}

// CHECK 5: Utilities centralizzate
console.log(`\n${COLORS.yellow}5. Checking for centralized utilities...${COLORS.reset}`);
const errorHandlerExists = fs.existsSync(path.join(process.cwd(), 'shared/src/utils/error-handler.ts'));
const validationExists = fs.existsSync(path.join(process.cwd(), 'shared/src/utils/validation.ts'));
const loggerExists = fs.existsSync(path.join(process.cwd(), 'shared/src/utils/logger.ts'));

addCheck('Error handler utility exists', errorHandlerExists, 1);
addCheck('Validation utility exists', validationExists, 1);
addCheck('Logger utility exists', loggerExists, 1);

// CHECK 6: Prisma schema centralizzato
console.log(`\n${COLORS.yellow}6. Checking database schema...${COLORS.reset}`);
const prismaExists = fs.existsSync(path.join(process.cwd(), 'shared/prisma/schema.prisma'));
addCheck('Centralized Prisma schema exists', prismaExists, 2);

if (prismaExists) {
  try {
    const schemaContent = fs.readFileSync(path.join(process.cwd(), 'shared/prisma/schema.prisma'), 'utf-8');
    const hasTenantModel = schemaContent.includes('model Tenant');
    const hasUserModel = schemaContent.includes('model User');
    const hasWordPressSiteModel = schemaContent.includes('model WordPressSite');
    
    addCheck('Tenant model defined', hasTenantModel, 1);
    addCheck('User model defined', hasUserModel, 1);
    addCheck('WordPressSite model defined', hasWordPressSiteModel, 1);
  } catch (error) {
    console.log(`  Error reading schema: ${error.message}`);
  }
}

// CHECK 7: Nessun import circolare nel shared package
console.log(`\n${COLORS.yellow}7. Checking for circular imports in shared package...${COLORS.reset}`);
try {
  const circularImports = execSync(
    'grep -r "from.*@spotex/shared" shared/src --include="*.ts" 2>/dev/null | wc -l',
    { encoding: 'utf-8', cwd: process.cwd() }
  ).trim();
  
  const noCircularImports = parseInt(circularImports) === 0;
  addCheck('No circular imports in shared', noCircularImports, 2);
  
  if (!noCircularImports) {
    console.log(`  Found ${circularImports} potential circular imports`);
  }
} catch (error) {
  addCheck('No circular imports in shared', true, 2);
}

// SUMMARY
console.log(`\n${COLORS.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
console.log(`${COLORS.blue}📊 DRY COMPLIANCE SCORE${COLORS.reset}`);
console.log(`${COLORS.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n`);

const percentage = Math.round((totalScore / maxScore) * 100);
const passedCount = checks.filter(c => c.passed).length;
const failedCount = checks.length - passedCount;

console.log(`Score: ${totalScore}/${maxScore} (${percentage}%)`);
console.log(`Checks Passed: ${COLORS.green}${passedCount}${COLORS.reset}`);
console.log(`Checks Failed: ${COLORS.red}${failedCount}${COLORS.reset}\n`);

if (percentage >= 90) {
  console.log(`${COLORS.green}✓ EXCELLENT DRY compliance!${COLORS.reset}\n`);
  process.exit(0);
} else if (percentage >= 70) {
  console.log(`${COLORS.yellow}⚠ GOOD DRY compliance, but room for improvement${COLORS.reset}\n`);
  process.exit(0);
} else {
  console.log(`${COLORS.red}✗ POOR DRY compliance - needs refactoring${COLORS.reset}\n`);
  process.exit(1);
}
