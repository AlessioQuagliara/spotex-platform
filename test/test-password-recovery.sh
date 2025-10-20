#!/bin/bash

# Test script per il sistema di recupero password

echo "🚀 Avvio test del sistema di recupero password..."

# Prima registriamo un utente per il test
echo "📝 Registrazione utente di test..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"password-test@example.com","password":"password123","name":"Password Test User","role":"COMPANY"}')

echo "Risposta registrazione: $REGISTER_RESPONSE"

# Attendiamo un momento per la registrazione
sleep 2

# Test richiesta reset password
echo "🔑 Test richiesta reset password..."
FORGOT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"password-test@example.com"}')

echo "Risposta forgot password: $FORGOT_RESPONSE"

# Verifichiamo che la risposta sia positiva
if echo "$FORGOT_RESPONSE" | grep -q '"success":true'; then
  echo "✅ Richiesta reset password riuscita"

  # Estraiamo il token dal log del server (in produzione sarebbe inviato via email)
  echo "📧 Controlla il log del server per il token di reset password"
  echo "💡 Il token apparirà in un log come: 'Reset password token for password-test@example.com: [TOKEN]'"

  # Nota: Per testare il reset password, dovresti:
  # 1. Copiare il token dal log del server
  # 2. Usare il token in una richiesta POST a /api/auth/reset-password
  # Esempio: curl -X POST http://localhost:3000/api/auth/reset-password -H "Content-Type: application/json" -d '{"token":"[TOKEN]","password":"newpassword123"}'

else
  echo "❌ Richiesta reset password fallita"
fi

echo "🎉 Test recupero password completato!"
echo ""
echo "📋 Per completare il test manuale:"
echo "1. Copia il token dal log del server"
echo "2. Usa questo comando sostituendo [TOKEN] con il token reale:"
echo 'curl -X POST http://localhost:3000/api/auth/reset-password -H "Content-Type: application/json" -d '\''{"token":"[TOKEN]","password":"newpassword123"}'\'''