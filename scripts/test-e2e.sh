#!/bin/bash

# Configuration
API_BASE="http://localhost:3000"
API_BASE_API="http://localhost:3000/api"
# SPOTEX PLATFORM - END-TO-END TEST SCRIPT
# Testa il flusso completo: Registrazione → Deploy → Ticket
# ===========================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE="http://localhost:3000"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="test-e2e-${TIMESTAMP}.log"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

# Initialize log file
echo "=== SPOTEX E2E TEST STARTED: $(date) ===" > "$LOG_FILE"
echo "API Base: $API_BASE" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

run_test() {
    local test_name="$1"
    local test_function="$2"

    TESTS_RUN=$((TESTS_RUN + 1))
    log "Running test: $test_name"

    if $test_function; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        success "Test passed: $test_name"
        return 0
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
        error "Test failed: $test_name"
        return 1
    fi
}

# ===========================================
# TEST FUNCTIONS
# ===========================================

test_health_check() {
    local response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" "$API_BASE/health")
    local body=$(echo "$response" | sed '$d')
    local status=$(echo "$response" | tail -n 1 | sed 's/.*HTTPSTATUS://')

    if [ "$status" -eq 200 ]; then
        echo "$body" | jq -e '.success == true' >/dev/null
        return $?
    fi
    return 1
}

test_tenant_registration() {
    local timestamp=$(date +%s)
    local agency_data='{
        "name": "Test Agency E2E",
        "domain": "test-agency-e2e-'$timestamp'.spotexsrl.com",
        "tier": "starter",
        "adminEmail": "admin@testagencye2e'$timestamp'@test.com",
        "adminPassword": "testpassword123"
    }'

    local response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" \
        -X POST "$API_BASE_API/tenants/register" \
        -H "Content-Type: application/json" \
        -d "$agency_data")

    local body=$(echo "$response" | sed '$d')
    local status=$(echo "$response" | tail -n 1 | sed 's/.*HTTPSTATUS://')

    if [ "$status" -eq 201 ]; then
        export TENANT_ID=$(echo "$body" | jq -r '.data.id')
        echo "$body" | jq -e '.success == true and .data.id' >/dev/null
        return $?
    fi
    return 1
}

test_tenant_retrieval() {
    if [ -z "$TENANT_ID" ]; then
        error "No tenant ID from registration test"
        return 1
    fi

    local response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" "$API_BASE_API/test/tenants")
    local body=$(echo "$response" | sed '$d')
    local status=$(echo "$response" | tail -n 1 | sed 's/.*HTTPSTATUS://')

    if [ "$status" -eq 200 ]; then
        # Check if our tenant ID exists in the list
        echo "$body" | jq -e ".success == true and (.data | map(.id) | contains([\"$TENANT_ID\"]))" >/dev/null
        return $?
    fi
    return 1
}

test_site_deployment() {
    if [ -z "$TENANT_ID" ]; then
        error "No tenant ID for site deployment"
        return 1
    fi

    local site_data='{
        "tenantId": "'"$TENANT_ID"'",
        "name": "Test Site E2E",
        "domain": "test-site-e2e.spotexsrl.com",
        "wordpressVersion": "6.4.2",
        "phpVersion": "8.2",
        "adminUsername": "admin",
        "status": "completed"
    }'

    local response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" \
        -X POST "$API_BASE_API/test/sites" \
        -H "Content-Type: application/json" \
        -d "$site_data")

    local body=$(echo "$response" | sed '$d')
    local status=$(echo "$response" | tail -n 1 | sed 's/.*HTTPSTATUS://')

    if [ "$status" -eq 201 ]; then
        export SITE_ID=$(echo "$body" | jq -r '.data.id')
        echo "$body" | jq -e '.success == true and .data.tenantId == "'"$TENANT_ID"'"' >/dev/null
        return $?
    fi
    return 1
}

test_ticket_creation() {
    if [ -z "$TENANT_ID" ]; then
        error "No tenant ID for ticket creation"
        return 1
    fi

    local ticket_data='{
        "tenantId": "'"$TENANT_ID"'",
        "subject": "Test Ticket E2E",
        "description": "This is an end-to-end test ticket",
        "priority": "high",
        "category": "technical_issue"
    }'

    local response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" \
        -X POST "$API_BASE_API/test/tickets" \
        -H "Content-Type: application/json" \
        -d "$ticket_data")

    local body=$(echo "$response" | sed '$d')
    local status=$(echo "$response" | tail -n 1 | sed 's/.*HTTPSTATUS://')

    if [ "$status" -eq 201 ]; then
        export TICKET_ID=$(echo "$body" | jq -r '.data.id')
        echo "$body" | jq -e '.success == true and .data.priority == "high"' >/dev/null
        return $?
    fi
    return 1
}

test_agency_dashboard() {
    if [ -z "$TENANT_ID" ]; then
        error "No tenant ID for agency dashboard test"
        return 1
    fi

    # Simulate tenant header (in real implementation, this would be JWT)
    local response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" \
        -H "x-tenant-id: $TENANT_ID" \
        "$API_BASE_API/agency/dashboard")

    local body=$(echo "$response" | sed '$d')
    local status=$(echo "$response" | tail -n 1 | sed 's/.*HTTPSTATUS://')

    if [ "$status" -eq 200 ]; then
        echo "$body" | jq -e '.success == true and .data.tenant.id == "'"$TENANT_ID"'"' >/dev/null
        return $?
    fi
    return 1
}

test_admin_dashboard() {
    local response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" "$API_BASE_API/admin/dashboard")
    local body=$(echo "$response" | sed '$d')
    local status=$(echo "$response" | tail -n 1 | sed 's/.*HTTPSTATUS://')

    if [ "$status" -eq 200 ]; then
        echo "$body" | jq -e '.success == true and .data.metrics' >/dev/null
        return $?
    fi
    return 1
}

test_data_consistency() {
    # Test that data created in different services is consistent

    # Check tenant has sites using test API
    if [ -n "$TENANT_ID" ] && [ -n "$SITE_ID" ]; then
        local sites_response=$(curl -s "$API_BASE_API/test/sites")
        local site_count=$(echo "$sites_response" | jq -r ".data | map(select(.tenantId == \"$TENANT_ID\")) | length")

        if [ "$site_count" -gt 0 ]; then
            success "Tenant $TENANT_ID has $site_count sites"
        else
            error "Tenant $TENANT_ID has no sites"
            return 1
        fi
    fi

    # Check tenant has tickets using test API
    if [ -n "$TENANT_ID" ] && [ -n "$TICKET_ID" ]; then
        local tickets_response=$(curl -s "$API_BASE_API/test/tickets")
        local ticket_count=$(echo "$tickets_response" | jq -r ".data | map(select(.tenantId == \"$TENANT_ID\")) | length")

        if [ "$ticket_count" -gt 0 ]; then
            success "Tenant $TENANT_ID has $ticket_count tickets"
        else
            error "Tenant $TENANT_ID has no tickets"
            return 1
        fi
    fi

    return 0
}

# ===========================================
# MAIN TEST EXECUTION
# ===========================================

log "🧪 STARTING SPOTEX PLATFORM END-TO-END TESTS"
log "=============================================="

# Pre-flight checks
log "Checking if services are running..."

if ! curl -s "$API_BASE/health" >/dev/null; then
    error "Backend API is not running on $API_BASE"
    error "Please start the services with: docker-compose up"
    exit 1
fi

success "Backend API is running"

# Run tests in sequence
run_test "Health Check" test_health_check
run_test "Tenant Registration" test_tenant_registration
run_test "Tenant Retrieval" test_tenant_retrieval
run_test "Site Deployment" test_site_deployment
run_test "Ticket Creation" test_ticket_creation
run_test "Agency Dashboard" test_agency_dashboard
run_test "Admin Dashboard" test_admin_dashboard
run_test "Data Consistency" test_data_consistency

# ===========================================
# TEST SUMMARY
# ===========================================

log ""
log "=============================================="
log "🧪 E2E TEST RESULTS SUMMARY"
log "=============================================="
log "Tests Run: $TESTS_RUN"
log "Tests Passed: $TESTS_PASSED"
log "Tests Failed: $TESTS_FAILED"
log ""

if [ "$TESTS_FAILED" -eq 0 ]; then
    success "🎉 ALL TESTS PASSED! Platform is working correctly."
    success "✅ End-to-end flow: Registration → Deployment → Ticketing"
    echo ""
    echo "📊 Test Data Created:"
    [ -n "$TENANT_ID" ] && echo "   • Tenant: $TENANT_ID"
    [ -n "$SITE_ID" ] && echo "   • Site: $SITE_ID"
    [ -n "$TICKET_ID" ] && echo "   • Ticket: $TICKET_ID"
    echo ""
    warning "💡 Clean up test data manually if needed"
    exit 0
else
    error "❌ $TESTS_FAILED test(s) failed. Check the log file: $LOG_FILE"
    echo ""
    echo "🔍 Common issues:"
    echo "   • Services not running: docker-compose ps"
    echo "   • Database connection: check docker-compose logs postgres"
    echo "   • API errors: check individual service logs"
    echo ""
    exit 1
fi