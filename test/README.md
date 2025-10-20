# Test di Autenticazione con Ruoli

Questo script testa il sistema di autenticazione completo per entrambi i tipi di utente: **AGENCY** e **COMPANY**.

## Script Disponibili

### test-password-recovery.sh
```bash
cd /Users/alessio/Spotex-SRL/apps/central-server
./test/test-password-recovery.sh
```

#### Cosa testa
- Registrazione di un utente di test
- Richiesta di reset password via email
- Verifica che il token venga generato correttamente

#### Test manuale aggiuntivo
Dopo aver eseguito lo script, completa il test:
1. Copia il token dal log del server
2. Esegui il comando fornito per testare il reset password
3. Verifica che la password sia stata cambiata correttamente

### test-roles.sh
Test completo del sistema di autenticazione con ruoli.

### test-password-recovery.sh
Test del sistema di recupero password con token email.

## Come eseguire i test

### Prerequisiti
- Server backend in esecuzione su `http://localhost:3000`
- Database PostgreSQL configurato

### Esecuzione
```bash
cd /Users/alessio/Spotex-SRL/apps/central-server
./test/test-roles.sh
```

## Cosa testa lo script

### 1. Registrazione
- Registra un utente **AGENCY** con email `agency.test2@example.com`
- Registra un utente **COMPANY** con email `company.test2@example.com`

### 2. Verifica Email
- Utilizza un endpoint di test per verificare automaticamente gli utenti
- Questo bypassa il normale processo di verifica email per velocizzare i test

### 3. Login
- Effettua login per entrambi gli utenti
- Verifica che il token JWT venga restituito correttamente

### 4. Verifica Profilo
- Utilizza l'endpoint `/me` per verificare che:
  - Il ruolo sia corretto (AGENCY/COMPANY)
  - L'utente sia verificato
  - I dati del profilo siano completi

## Output del Test

Lo script fornisce output colorato che indica:
- ✅ **SUCCESS**: Operazione completata correttamente
- ❌ **ERROR**: Operazione fallita
- ⚠️ **WARNING**: Operazione completata ma con avvertenze

## Endpoint di Test

Lo script utilizza un endpoint speciale `/api/auth/verify-user-test` che:
- È disponibile solo per scopi di testing
- Permette di verificare automaticamente un utente tramite email
- Imposta `verified: true` nel database

## Test del Frontend

Dopo aver eseguito i test backend, puoi verificare il frontend:
1. Vai su `http://localhost:5173`
2. Registrati come AGENCY o COMPANY
3. Verifica che la sidebar e dashboard corrispondano al ruolo

## Pulizia

Gli utenti di test creati hanno email che terminano con numeri incrementali (`test2`, `test3`, etc.) per evitare conflitti con test precedenti.