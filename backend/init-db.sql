-- ========================================
-- 🗄️ Script Inizializzazione Database
-- ========================================
-- Questo script viene eseguito automaticamente
-- quando il container PostgreSQL viene creato

-- Crea estensioni necessarie
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Imposta timezone
SET timezone = 'UTC';

-- Log di inizializzazione
DO $$
BEGIN
  RAISE NOTICE '✅ Database spotex_platform inizializzato con successo!';
  RAISE NOTICE '📊 Estensioni installate: uuid-ossp, pg_trgm';
  RAISE NOTICE '🕐 Timezone: UTC';
END $$;
