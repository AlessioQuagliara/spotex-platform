#!/bin/bash

# Test script completo per il sistema di autenticazione con ruoli AGENCY e COMPANY

echo "🚀 Avvio test completo del sistema di autenticazione con ruoli..."

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzione per testare registrazione
test_register() {
    local email=$1
    local name=$2
    local role=$3

    echo -e "${BLUE}📝 Registrando utente ${role}: ${email}${NC}"

    REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"${email}\",\"password\":\"password123\",\"name\":\"${name}\",\"role\":\"${role}\"}")

    echo -e "${YELLOW}Risposta registrazione:${NC} $REGISTER_RESPONSE"

    # Verifica se la registrazione è andata bene
    if echo "$REGISTER_RESPONSE" | grep -q "success.*true"; then
        echo -e "${GREEN}✅ Registrazione ${role} completata${NC}"
        return 0
    else
        echo -e "${RED}❌ Registrazione ${role} fallita${NC}"
        return 1
    fi
}

# Funzione per verificare utente tramite endpoint di test
verify_email_test() {
    local email=$1
    local role=$2

    echo -e "${BLUE}✉️  Verificando utente ${role} tramite endpoint di test${NC}"

    VERIFY_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/verify-user-test \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"${email}\"}")

    echo -e "${YELLOW}Risposta verifica test:${NC} $VERIFY_RESPONSE"

    if echo "$VERIFY_RESPONSE" | grep -q "success.*true"; then
        echo -e "${GREEN}✅ Verifica test ${role} completata${NC}"
        return 0
    else
        echo -e "${RED}❌ Verifica test ${role} fallita${NC}"
        return 1
    fi
}

# Funzione per testare login
test_login() {
    local email=$1
    local role=$2

    echo -e "${BLUE}🔐 Facendo login per ${role}: ${email}${NC}"

    LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"${email}\",\"password\":\"password123\"}")

    echo -e "${YELLOW}Risposta login:${NC} $LOGIN_RESPONSE"

    # Estrai il token dalla risposta
    TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

    if [ -n "$TOKEN" ]; then
        echo -e "${GREEN}✅ Login ${role} riuscito - Token ottenuto${NC}"

        # Test dell'endpoint /me per verificare che il ruolo sia corretto
        echo -e "${BLUE}🔍 Verificando profilo utente ${role}${NC}"
        ME_RESPONSE=$(curl -s -X GET http://localhost:3000/api/auth/me \
          -H "Authorization: Bearer ${TOKEN}")

        echo -e "${YELLOW}Risposta profilo:${NC} $ME_RESPONSE"

        if echo "$ME_RESPONSE" | grep -q "\"role\":\"${role}\""; then
            echo -e "${GREEN}✅ Ruolo ${role} confermato nel profilo${NC}"
        else
            echo -e "${RED}❌ Ruolo ${role} non trovato nel profilo${NC}"
        fi

        return 0
    else
        echo -e "${RED}❌ Login ${role} fallito${NC}"
        return 1
    fi
}

# Verifica che il server sia in esecuzione
echo -e "${BLUE}🔍 Verificando che il server sia in esecuzione...${NC}"
SERVER_CHECK=$(curl -s http://localhost:3000/api/auth/me 2>/dev/null || echo "server_down")

if [ "$SERVER_CHECK" = "server_down" ]; then
    echo -e "${RED}❌ Server non in esecuzione su http://localhost:3000${NC}"
    echo -e "${YELLOW}💡 Assicurati di avviare il server con: cd backend && npm run dev${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Server attivo${NC}"

echo ""
echo "==============================================="
echo "🧪 TEST UTENTE AGENCY"
echo "==============================================="

# Test registrazione agency
if test_register "agency.test2@example.com" "Test Agency" "AGENCY"; then
    # Verifica email tramite endpoint di test
    verify_email_test "agency.test2@example.com" "AGENCY"

    # Test login
    test_login "agency.test2@example.com" "AGENCY"
fi

echo ""
echo "==============================================="
echo "🧪 TEST UTENTE COMPANY"
echo "==============================================="

# Test registrazione company
if test_register "company.test2@example.com" "Test Company" "COMPANY"; then
    # Verifica email tramite endpoint di test
    verify_email_test "company.test2@example.com" "COMPANY"

    # Test login
    test_login "company.test2@example.com" "COMPANY"
fi

echo ""
echo "==============================================="
echo "🎉 TEST COMPLETATO"
echo "==============================================="
echo -e "${GREEN}✅ Script di test eseguito${NC}"
echo -e "${BLUE}💡 Puoi ora testare il frontend:${NC}"
echo -e "   - Vai su http://localhost:5173"
echo -e "   - Registrati/Login come agency o company"
echo -e "   - Verifica che la sidebar e dashboard siano corrette"