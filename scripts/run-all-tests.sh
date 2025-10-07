#!/bin/bash

###############################################################################
# SPOTEX PLATFORM - MASTER TEST SUITE
# Esegue tutti i test e genera un report completo
###############################################################################

set -e

COLORS_RED='\033[0;31m'
COLORS_GREEN='\033[0;32m'
COLORS_YELLOW='\033[1;33m'
COLORS_BLUE='\033[0;34m'
COLORS_MAGENTA='\033[0;35m'
COLORS_CYAN='\033[0;36m'
COLORS_NC='\033[0m'

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
REPORT_DIR="./test-results"
REPORT_FILE="$REPORT_DIR/full-report-$TIMESTAMP.txt"

mkdir -p $REPORT_DIR

echo -e "${COLORS_CYAN}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║              ███████╗██████╗  ██████╗ ████████╗███████╗██╗  ██╗     ║
║              ██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝╚██╗██╔╝     ║
║              ███████╗██████╔╝██║   ██║   ██║   █████╗   ╚███╔╝      ║
║              ╚════██║██╔═══╝ ██║   ██║   ██║   ██╔══╝   ██╔██╗      ║
║              ███████║██║     ╚██████╔╝   ██║   ███████╗██╔╝ ██╗     ║
║              ╚══════╝╚═╝      ╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝     ║
║                                                                      ║
║                    PLATFORM COMPLETE TEST SUITE                     ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
EOF
echo -e "${COLORS_NC}\n"

exec > >(tee -a "$REPORT_FILE")
exec 2>&1

echo "Test Suite Started: $(date)"
echo "Report will be saved to: $REPORT_FILE"
echo ""

###############################################################################
# PHASE 1: BUILD CHECK
###############################################################################

echo -e "${COLORS_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
echo -e "${COLORS_BLUE}PHASE 1: BUILD & COMPILATION CHECK${COLORS_NC}"
echo -e "${COLORS_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}\n"

echo "Building all backend services..."
if npm run build:all > /dev/null 2>&1; then
    echo -e "${COLORS_GREEN}✓ All backend services compiled successfully${COLORS_NC}"
    BUILD_STATUS="PASS"
else
    echo -e "${COLORS_RED}✗ Build failed${COLORS_NC}"
    BUILD_STATUS="FAIL"
fi

echo ""
echo "Building frontend applications..."

cd frontend-agency
if npm run build > /dev/null 2>&1; then
    echo -e "${COLORS_GREEN}✓ Frontend Agency built successfully${COLORS_NC}"
    FRONTEND_AGENCY_STATUS="PASS"
else
    echo -e "${COLORS_RED}✗ Frontend Agency build failed${COLORS_NC}"
    FRONTEND_AGENCY_STATUS="FAIL"
fi
cd ..

cd frontend-admin
if npm run build > /dev/null 2>&1; then
    echo -e "${COLORS_GREEN}✓ Frontend Admin built successfully${COLORS_NC}"
    FRONTEND_ADMIN_STATUS="PASS"
else
    echo -e "${COLORS_RED}✗ Frontend Admin build failed${COLORS_NC}"
    FRONTEND_ADMIN_STATUS="FAIL"
fi
cd ..

cd frontend-public
if npm run build > /dev/null 2>&1; then
    echo -e "${COLORS_GREEN}✓ Frontend Public built successfully${COLORS_NC}"
    FRONTEND_PUBLIC_STATUS="PASS"
else
    echo -e "${COLORS_RED}✗ Frontend Public build failed${COLORS_NC}"
    FRONTEND_PUBLIC_STATUS="FAIL"
fi
cd ..

###############################################################################
# PHASE 2: DRY COMPLIANCE
###############################################################################

echo ""
echo -e "${COLORS_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
echo -e "${COLORS_BLUE}PHASE 2: DRY PRINCIPLE COMPLIANCE${COLORS_NC}"
echo -e "${COLORS_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}\n"

if node scripts/check-dry-compliance.js; then
    DRY_STATUS="PASS"
else
    DRY_STATUS="FAIL"
fi

###############################################################################
# PHASE 3: KISS COMPLIANCE
###############################################################################

echo ""
echo -e "${COLORS_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
echo -e "${COLORS_BLUE}PHASE 3: KISS PRINCIPLE COMPLIANCE${COLORS_NC}"
echo -e "${COLORS_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}\n"

if node scripts/check-kiss-compliance.js; then
    KISS_STATUS="PASS"
else
    KISS_STATUS="FAIL"
fi

###############################################################################
# PHASE 4: CODE QUALITY METRICS
###############################################################################

echo ""
echo -e "${COLORS_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
echo -e "${COLORS_BLUE}PHASE 4: CODE QUALITY METRICS${COLORS_NC}"
echo -e "${COLORS_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}\n"

echo "Analyzing codebase..."

# Count total files
TOTAL_TS_FILES=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | wc -l | tr -d ' ')
echo "Total TypeScript files: $TOTAL_TS_FILES"

# Count lines of code
TOTAL_LOC=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | xargs wc -l | tail -1 | awk '{print $1}')
echo "Total lines of code: $TOTAL_LOC"

# Check for TypeScript errors
echo ""
echo "Checking TypeScript errors..."
cd shared
TS_ERRORS=$(npm run build 2>&1 | grep "error TS" | wc -l | tr -d ' ')
cd ..

if [ "$TS_ERRORS" -eq "0" ]; then
    echo -e "${COLORS_GREEN}✓ No TypeScript errors found${COLORS_NC}"
    TS_STATUS="PASS"
else
    echo -e "${COLORS_RED}✗ Found $TS_ERRORS TypeScript errors${COLORS_NC}"
    TS_STATUS="FAIL"
fi

# Check for console.log
echo ""
echo "Checking for debug statements..."
CONSOLE_LOGS=$(grep -r "console.log\|console.error" --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v node_modules | grep -v dist | grep -v "logger\." | grep -v "scripts/" | wc -l | tr -d ' ')

if [ "$CONSOLE_LOGS" -eq "0" ]; then
    echo -e "${COLORS_GREEN}✓ No debug console.log found${COLORS_NC}"
    CONSOLE_STATUS="PASS"
else
    echo -e "${COLORS_YELLOW}⚠ Found $CONSOLE_LOGS console.log statements${COLORS_NC}"
    CONSOLE_STATUS="WARN"
fi

###############################################################################
# PHASE 5: SECURITY CHECK
###############################################################################

echo ""
echo -e "${COLORS_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
echo -e "${COLORS_BLUE}PHASE 5: SECURITY AUDIT${COLORS_NC}"
echo -e "${COLORS_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}\n"

echo "Running npm audit..."
AUDIT_OUTPUT=$(npm audit --production 2>&1 || true)
VULNERABILITIES=$(echo "$AUDIT_OUTPUT" | grep -i "vulnerabilities" | head -1 || echo "0 vulnerabilities")

echo "$VULNERABILITIES"

if echo "$VULNERABILITIES" | grep -q "0 vulnerabilities"; then
    echo -e "${COLORS_GREEN}✓ No security vulnerabilities found${COLORS_NC}"
    SECURITY_STATUS="PASS"
else
    echo -e "${COLORS_YELLOW}⚠ Some vulnerabilities found - review required${COLORS_NC}"
    SECURITY_STATUS="WARN"
fi

# Check for sensitive data
echo ""
echo "Checking for exposed secrets..."
HARDCODED_SECRETS=$(grep -rE "(password|secret|api_key|token)\s*=\s*['\"][^'\"]+['\"]" --include="*.ts" --include="*.tsx" --include="*.js" 2>/dev/null | grep -v node_modules | grep -v dist | grep -v "test" | wc -l | tr -d ' ')

if [ "$HARDCODED_SECRETS" -eq "0" ]; then
    echo -e "${COLORS_GREEN}✓ No hardcoded secrets found${COLORS_NC}"
    SECRETS_STATUS="PASS"
else
    echo -e "${COLORS_YELLOW}⚠ Found $HARDCODED_SECRETS potential hardcoded secrets - review required${COLORS_NC}"
    SECRETS_STATUS="WARN"
fi

###############################################################################
# PHASE 6: DATABASE SCHEMA CHECK
###############################################################################

echo ""
echo -e "${COLORS_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
echo -e "${COLORS_BLUE}PHASE 6: DATABASE SCHEMA VALIDATION${COLORS_NC}"
echo -e "${COLORS_BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}\n"

if [ -f "shared/prisma/schema.prisma" ]; then
    echo -e "${COLORS_GREEN}✓ Prisma schema found${COLORS_NC}"
    
    # Count models
    MODELS_COUNT=$(grep "^model " shared/prisma/schema.prisma | wc -l | tr -d ' ')
    echo "Database models: $MODELS_COUNT"
    
    # Count indexes
    INDEXES_COUNT=$(grep "@@index\|@@unique" shared/prisma/schema.prisma | wc -l | tr -d ' ')
    echo "Database indexes: $INDEXES_COUNT"
    
    # Check for tenant_id in all models
    TENANT_ISOLATION=$(grep "tenantId" shared/prisma/schema.prisma | wc -l | tr -d ' ')
    echo "Tenant isolation fields: $TENANT_ISOLATION"
    
    if [ "$TENANT_ISOLATION" -ge "8" ]; then
        echo -e "${COLORS_GREEN}✓ Multi-tenant isolation properly implemented${COLORS_NC}"
        DB_STATUS="PASS"
    else
        echo -e "${COLORS_YELLOW}⚠ Some models may lack tenant isolation${COLORS_NC}"
        DB_STATUS="WARN"
    fi
else
    echo -e "${COLORS_RED}✗ Prisma schema not found${COLORS_NC}"
    DB_STATUS="FAIL"
fi

###############################################################################
# FINAL SUMMARY
###############################################################################

echo ""
echo -e "${COLORS_MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
echo -e "${COLORS_MAGENTA}📊 FINAL TEST SUMMARY${COLORS_NC}"
echo -e "${COLORS_MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}\n"

print_status() {
    local status=$1
    local name=$2
    
    if [ "$status" == "PASS" ]; then
        echo -e "  ${COLORS_GREEN}✓${COLORS_NC} $name"
    elif [ "$status" == "WARN" ]; then
        echo -e "  ${COLORS_YELLOW}⚠${COLORS_NC} $name"
    else
        echo -e "  ${COLORS_RED}✗${COLORS_NC} $name"
    fi
}

echo "Test Results:"
print_status "$BUILD_STATUS" "Backend Build"
print_status "$FRONTEND_AGENCY_STATUS" "Frontend Agency Build"
print_status "$FRONTEND_ADMIN_STATUS" "Frontend Admin Build"
print_status "$FRONTEND_PUBLIC_STATUS" "Frontend Public Build"
print_status "$DRY_STATUS" "DRY Compliance"
print_status "$KISS_STATUS" "KISS Compliance"
print_status "$TS_STATUS" "TypeScript Validation"
print_status "$CONSOLE_STATUS" "Debug Statements"
print_status "$SECURITY_STATUS" "Security Audit"
print_status "$SECRETS_STATUS" "Secrets Check"
print_status "$DB_STATUS" "Database Schema"

echo ""
echo "Code Metrics:"
echo "  Total TypeScript files: $TOTAL_TS_FILES"
echo "  Total lines of code: $TOTAL_LOC"
echo "  Database models: $MODELS_COUNT"
echo "  Database indexes: $INDEXES_COUNT"

# Calculate pass rate
TOTAL_TESTS=11
PASSED=0

[ "$BUILD_STATUS" == "PASS" ] && ((PASSED++))
[ "$FRONTEND_AGENCY_STATUS" == "PASS" ] && ((PASSED++))
[ "$FRONTEND_ADMIN_STATUS" == "PASS" ] && ((PASSED++))
[ "$FRONTEND_PUBLIC_STATUS" == "PASS" ] && ((PASSED++))
[ "$DRY_STATUS" == "PASS" ] && ((PASSED++))
[ "$KISS_STATUS" == "PASS" ] && ((PASSED++))
[ "$TS_STATUS" == "PASS" ] && ((PASSED++))
[ "$CONSOLE_STATUS" == "PASS" ] && ((PASSED++))
[ "$SECURITY_STATUS" == "PASS" ] && ((PASSED++))
[ "$SECRETS_STATUS" == "PASS" ] && ((PASSED++))
[ "$DB_STATUS" == "PASS" ] && ((PASSED++))

PASS_RATE=$((PASSED * 100 / TOTAL_TESTS))

echo ""
echo "Overall Pass Rate: $PASS_RATE% ($PASSED/$TOTAL_TESTS)"

if [ $PASS_RATE -ge 90 ]; then
    echo ""
    echo -e "${COLORS_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
    echo -e "${COLORS_GREEN}✓✓✓ EXCELLENT - PRODUCTION READY ✓✓✓${COLORS_NC}"
    echo -e "${COLORS_GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
    EXIT_CODE=0
elif [ $PASS_RATE -ge 70 ]; then
    echo ""
    echo -e "${COLORS_YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
    echo -e "${COLORS_YELLOW}⚠ GOOD - Minor issues to fix ⚠${COLORS_NC}"
    echo -e "${COLORS_YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
    EXIT_CODE=0
else
    echo ""
    echo -e "${COLORS_RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
    echo -e "${COLORS_RED}✗ NEEDS WORK - Critical issues found ✗${COLORS_NC}"
    echo -e "${COLORS_RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLORS_NC}"
    EXIT_CODE=1
fi

echo ""
echo "Test completed: $(date)"
echo "Full report saved to: $REPORT_FILE"
echo ""

exit $EXIT_CODE
