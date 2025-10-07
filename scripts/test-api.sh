#!/bin/bash

###############################################################################
# SPOTEX PLATFORM - API TEST SUITE
# Test automatico degli endpoint critici della piattaforma
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${API_BASE_URL:-http://localhost:3000/api}"
RESULTS_DIR="./test-results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_FILE="$RESULTS_DIR/api-test-$TIMESTAMP.json"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

###############################################################################
# HELPER FUNCTIONS
###############################################################################

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_test() {
    echo -e "${YELLOW}Testing:${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED_TESTS++))
    ((TOTAL_TESTS++))
}

print_failure() {
    echo -e "${RED}✗${NC} $1"
    echo -e "${RED}  Error:${NC} $2"
    ((FAILED_TESTS++))
    ((TOTAL_TESTS++))
}

test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local data=${4:-}
    local headers=${5:-}
    
    print_test "$method $endpoint"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" $headers)
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            $headers \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq "$expected_status" ]; then
        print_success "Status: $http_code"
        return 0
    else
        print_failure "Status: $http_code (expected $expected_status)" "$body"
        return 1
    fi
}

###############################################################################
# SETUP
###############################################################################

print_header "🧪 SPOTEX PLATFORM - API TEST SUITE"

echo "Configuration:"
echo "  Base URL: $BASE_URL"
echo "  Results:  $RESULTS_FILE"
echo ""

# Create results directory
mkdir -p $RESULTS_DIR

# Check if API is reachable
echo -n "Checking API availability... "
if curl -s -f -o /dev/null "$BASE_URL/../health" 2>/dev/null; then
    echo -e "${GREEN}✓ API is reachable${NC}"
else
    echo -e "${RED}✗ API is not reachable${NC}"
    echo "Please ensure the API server is running on $BASE_URL"
    exit 1
fi

###############################################################################
# TEST 1: HEALTH CHECK
###############################################################################

print_header "1. HEALTH CHECK & SYSTEM STATUS"

test_endpoint "GET" "/../health" 200

###############################################################################
# TEST 2: AUTHENTICATION FLOW
###############################################################################

print_header "2. AUTHENTICATION FLOW"

# Test login with invalid credentials
print_test "POST /auth/login (invalid credentials)"
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "invalid@test.com",
        "password": "wrongpassword"
    }')

http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 401 ]; then
    print_success "Correctly rejected invalid credentials"
else
    print_failure "Invalid credentials not rejected" "Expected 401, got $http_code"
fi

# Test login with valid credentials (if test user exists)
print_test "POST /auth/login (valid credentials - if test user exists)"
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "admin@spotexsrl.com",
        "password": "Admin123!"
    }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" -eq 200 ]; then
    TOKEN=$(echo "$body" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    if [ ! -z "$TOKEN" ]; then
        print_success "Login successful, token retrieved"
        echo "  Token (truncated): ${TOKEN:0:20}..."
    else
        print_failure "Login successful but no token in response" "$body"
    fi
else
    echo -e "${YELLOW}⚠${NC} Test user not found (expected for fresh install)"
    ((TOTAL_TESTS++))
fi

###############################################################################
# TEST 3: TENANT MANAGEMENT
###############################################################################

print_header "3. TENANT MANAGEMENT"

# Test get tenants without auth
print_test "GET /tenants (without auth)"
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/tenants")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" -eq 401 ]; then
    print_success "Correctly requires authentication"
else
    print_failure "Should require authentication" "Expected 401, got $http_code"
fi

# If we have a token, test with auth
if [ ! -z "$TOKEN" ]; then
    test_endpoint "GET" "/tenants" 200 "" "-H \"Authorization: Bearer $TOKEN\""
fi

###############################################################################
# TEST 4: INPUT VALIDATION
###############################################################################

print_header "4. INPUT VALIDATION"

# Test invalid email format
print_test "POST /auth/register (invalid email)"
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "invalid-email",
        "password": "Test123!",
        "firstName": "Test",
        "lastName": "User"
    }')

http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 400 ] || [ "$http_code" -eq 422 ]; then
    print_success "Invalid email correctly rejected"
else
    print_failure "Invalid email not rejected" "Expected 400/422, got $http_code"
fi

# Test missing required fields
print_test "POST /auth/register (missing fields)"
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email": "test@test.com"}')

http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 400 ] || [ "$http_code" -eq 422 ]; then
    print_success "Missing fields correctly rejected"
else
    print_failure "Missing fields not rejected" "Expected 400/422, got $http_code"
fi

###############################################################################
# TEST 5: WORDPRESS DEPLOYMENT (if authenticated)
###############################################################################

if [ ! -z "$TOKEN" ]; then
    print_header "5. WORDPRESS DEPLOYMENT"
    
    # Test list deployments
    test_endpoint "GET" "/deployments" 200 "" "-H \"Authorization: Bearer $TOKEN\""
    
    # Note: We don't actually deploy to avoid creating real resources
    echo -e "${YELLOW}⚠${NC} Skipping actual deployment test to avoid creating real resources"
    ((TOTAL_TESTS++))
else
    print_header "5. WORDPRESS DEPLOYMENT"
    echo -e "${YELLOW}⚠${NC} Skipped (no authentication token)"
fi

###############################################################################
# TEST 6: TICKET SYSTEM (if authenticated)
###############################################################################

if [ ! -z "$TOKEN" ]; then
    print_header "6. TICKET SYSTEM"
    
    # Test list tickets
    test_endpoint "GET" "/tickets" 200 "" "-H \"Authorization: Bearer $TOKEN\""
    
    # Test create ticket with invalid data
    print_test "POST /tickets (invalid priority)"
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/tickets" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{
            "subject": "Test",
            "description": "Test",
            "priority": "invalid_priority"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    if [ "$http_code" -eq 400 ] || [ "$http_code" -eq 422 ]; then
        print_success "Invalid priority correctly rejected"
    else
        print_failure "Invalid priority not rejected" "Expected 400/422, got $http_code"
    fi
else
    print_header "6. TICKET SYSTEM"
    echo -e "${YELLOW}⚠${NC} Skipped (no authentication token)"
fi

###############################################################################
# TEST 7: DOMAIN MANAGEMENT (if authenticated)
###############################################################################

if [ ! -z "$TOKEN" ]; then
    print_header "7. DOMAIN MANAGEMENT"
    
    # Test check domain availability
    print_test "POST /domains/check"
    response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/domains/check" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{"domain": "test-domain-check-123.com"}')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        print_success "Domain check endpoint working"
    else
        print_failure "Domain check failed" "Expected 200, got $http_code - $body"
    fi
else
    print_header "7. DOMAIN MANAGEMENT"
    echo -e "${YELLOW}⚠${NC} Skipped (no authentication token)"
fi

###############################################################################
# TEST SUMMARY
###############################################################################

print_header "📊 TEST SUMMARY"

echo "Total Tests:  $TOTAL_TESTS"
echo -e "Passed:       ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed:       ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "\nPass Rate:    $PASS_RATE%"
    echo -e "\n${RED}✗ Some tests failed${NC}"
    exit 1
fi
