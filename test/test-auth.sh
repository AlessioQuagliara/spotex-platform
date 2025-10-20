#!/bin/bash

# Test script per il sistema di autenticazione

echo "🚀 Avvio test del sistema di autenticazione..."

# Test registrazione
echo "📝 Test registrazione..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"COMPANY"}')

echo "Risposta registrazione: $REGISTER_RESPONSE"

# Se la registrazione è andata bene, dovremmo vedere il messaggio nel log del server
echo "✅ Controlla il log del server per vedere il link di verifica email"

echo "🎉 Test completato!"