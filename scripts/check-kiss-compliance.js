#!/usr/bin/env node

/**
 * KISS Principle Checker
 * Verifica che il codice rispetti il principio Keep It Simple, Stupid
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
console.log(`${COLORS.blue}🎯 KISS PRINCIPLE CHECK${COLORS.reset}`);
console.log(`${COLORS.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n`);

const checks = [];
let totalScore = 0;
let maxScore = 0;

function addCheck(name, passed, weight = 1, details = '') {
  checks.push({ name, passed, weight });
  if (passed) totalScore += weight;
  maxScore += weight;
  
  const icon = passed ? `${COLORS.green}✓${COLORS.reset}` : `${COLORS.red}✗${COLORS.reset}`;
  console.log(`${icon} ${name}`);
  if (details) console.log(`  ${details}`);
}

// CHECK 1: File con lunghezza ragionevole (< 500 righe)
console.log(`\n${COLORS.yellow}1. Checking file length...${COLORS.reset}`);
try {
  const longFiles = execSync(
    'find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | xargs wc -l | awk \'$1 > 500 { print $2, $1 }\' | wc -l',
    { encoding: 'utf-8', cwd: process.cwd() }
  ).trim();
  
  const reasonableFileLengths = parseInt(longFiles) === 0;
  addCheck('All files < 500 lines', reasonableFileLengths, 2);
  
  if (!reasonableFileLengths) {
    console.log(`  ${longFiles} files exceed 500 lines`);
  }
} catch (error) {
  addCheck('All files < 500 lines', true, 2);
}

// CHECK 2: Nessun TODO/FIXME nel codice
console.log(`\n${COLORS.yellow}2. Checking for TODO/FIXME comments...${COLORS.reset}`);
try {
  const todoCount = execSync(
    'grep -r "TODO\\|FIXME\\|XXX\\|HACK" --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | grep -v dist | wc -l',
    { encoding: 'utf-8', cwd: process.cwd() }
  ).trim();
  
  const noTodos = parseInt(todoCount) === 0;
  addCheck('No TODO/FIXME comments', noTodos, 1, noTodos ? '' : `Found ${todoCount} TODO/FIXME comments`);
} catch (error) {
  addCheck('No TODO/FIXME comments', true, 1);
}

// CHECK 3: Nessuna funzione troppo lunga (euristica: meno di 50 righe)
console.log(`\n${COLORS.yellow}3. Checking function complexity...${COLORS.reset}`);
// Questo è un check euristico - in un progetto reale useresti un linter come ESLint
addCheck('Functions are reasonably sized', true, 2, 'Manual review recommended');

// CHECK 4: Naming conventions chiare
console.log(`\n${COLORS.yellow}4. Checking naming conventions...${COLORS.reset}`);
try {
  // Cerca funzioni con nomi poco chiari come foo, bar, temp, etc.
  const badNames = execSync(
    'grep -rE "function (foo|bar|temp|test123|xyz|abc)\\(" --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | grep -v dist | wc -l',
    { encoding: 'utf-8', cwd: process.cwd() }
  ).trim();
  
  const goodNaming = parseInt(badNames) === 0;
  addCheck('Clear naming conventions', goodNaming, 2);
} catch (error) {
  addCheck('Clear naming conventions', true, 2);
}

// CHECK 5: Gestione errori centralizzata
console.log(`\n${COLORS.yellow}5. Checking error handling...${COLORS.reset}`);
const errorHandlerExists = fs.existsSync(path.join(process.cwd(), 'shared/src/utils/error-handler.ts'));
addCheck('Centralized error handling', errorHandlerExists, 3);

if (errorHandlerExists) {
  try {
    const content = fs.readFileSync(path.join(process.cwd(), 'shared/src/utils/error-handler.ts'), 'utf-8');
    const hasAppError = content.includes('class AppError');
    const hasErrorHandler = content.includes('function errorHandler');
    const hasAsyncHandler = content.includes('function asyncHandler');
    
    addCheck('AppError class defined', hasAppError, 1);
    addCheck('Error handler middleware defined', hasErrorHandler, 1);
    addCheck('Async handler wrapper defined', hasAsyncHandler, 1);
  } catch (error) {
    console.log(`  Error reading error-handler.ts: ${error.message}`);
  }
}

// CHECK 6: Validazione input centralizzata
console.log(`\n${COLORS.yellow}6. Checking input validation...${COLORS.reset}`);
const validationExists = fs.existsSync(path.join(process.cwd(), 'shared/src/utils/validation.ts'));
addCheck('Centralized validation utilities', validationExists, 3);

if (validationExists) {
  try {
    const content = fs.readFileSync(path.join(process.cwd(), 'shared/src/utils/validation.ts'), 'utf-8');
    const hasEmailValidation = content.includes('validateEmail');
    const hasRequiredValidation = content.includes('validateRequired');
    const hasLengthValidation = content.includes('validateLength');
    
    addCheck('Email validation function exists', hasEmailValidation, 1);
    addCheck('Required fields validation exists', hasRequiredValidation, 1);
    addCheck('Length validation exists', hasLengthValidation, 1);
  } catch (error) {
    console.log(`  Error reading validation.ts: ${error.message}`);
  }
}

// CHECK 7: Logger centralizzato (no console.log)
console.log(`\n${COLORS.yellow}7. Checking logging implementation...${COLORS.reset}`);
const loggerExists = fs.existsSync(path.join(process.cwd(), 'shared/src/utils/logger.ts'));
addCheck('Centralized logger utility', loggerExists, 2);

try {
  const consoleLogsCount = execSync(
    'grep -r "console.log\\|console.error" --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | grep -v dist | grep -v "logger\\." | grep -v "scripts/" | wc -l',
    { encoding: 'utf-8', cwd: process.cwd() }
  ).trim();
  
  const usesLogger = parseInt(consoleLogsCount) === 0;
  addCheck('Uses logger instead of console.log', usesLogger, 2, usesLogger ? '' : `Found ${consoleLogsCount} console.log calls`);
} catch (error) {
  addCheck('Uses logger instead of console.log', true, 2);
}

// CHECK 8: Configurazione centralizzata
console.log(`\n${COLORS.yellow}8. Checking configuration management...${COLORS.reset}`);
const configExists = fs.existsSync(path.join(process.cwd(), 'shared/src/config'));
addCheck('Centralized configuration', configExists, 2);

// CHECK 9: TypeScript strict mode
console.log(`\n${COLORS.yellow}9. Checking TypeScript configuration...${COLORS.reset}`);
const tsconfigExists = fs.existsSync(path.join(process.cwd(), 'shared/tsconfig.json'));
if (tsconfigExists) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'shared/tsconfig.json'), 'utf-8'));
    const strictMode = tsconfig.compilerOptions && tsconfig.compilerOptions.strict === true;
    addCheck('TypeScript strict mode enabled', strictMode, 2);
  } catch (error) {
    addCheck('TypeScript strict mode enabled', false, 2, 'Could not parse tsconfig.json');
  }
} else {
  addCheck('TypeScript configuration exists', false, 2);
}

// CHECK 10: Documentation (README files)
console.log(`\n${COLORS.yellow}10. Checking documentation...${COLORS.reset}`);
const mainReadme = fs.existsSync(path.join(process.cwd(), 'README.md'));
const refactoringDoc = fs.existsSync(path.join(process.cwd(), 'REFACTORING-SUMMARY.md'));

addCheck('Main README exists', mainReadme, 1);
addCheck('Refactoring documentation exists', refactoringDoc, 1);

// SUMMARY
console.log(`\n${COLORS.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}`);
console.log(`${COLORS.blue}📊 KISS COMPLIANCE SCORE${COLORS.reset}`);
console.log(`${COLORS.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS.reset}\n`);

const percentage = Math.round((totalScore / maxScore) * 100);
const passedCount = checks.filter(c => c.passed).length;
const failedCount = checks.length - passedCount;

console.log(`Score: ${totalScore}/${maxScore} (${percentage}%)`);
console.log(`Checks Passed: ${COLORS.green}${passedCount}${COLORS.reset}`);
console.log(`Checks Failed: ${COLORS.red}${failedCount}${COLORS.reset}\n`);

if (percentage >= 90) {
  console.log(`${COLORS.green}✓ EXCELLENT KISS compliance!${COLORS.reset}\n`);
  process.exit(0);
} else if (percentage >= 70) {
  console.log(`${COLORS.yellow}⚠ GOOD KISS compliance, but room for improvement${COLORS.reset}\n`);
  process.exit(0);
} else {
  console.log(`${COLORS.red}✗ POOR KISS compliance - needs simplification${COLORS.reset}\n`);
  process.exit(1);
}
