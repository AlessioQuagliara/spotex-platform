#!/bin/bash
set -e

# Script per inizializzare il database PostgreSQL con i permessi corretti

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Grant all privileges on database
    GRANT ALL PRIVILEGES ON DATABASE spotex_platform TO spotex;
    
    -- Grant all privileges on schema public
    GRANT ALL ON SCHEMA public TO spotex;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO spotex;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO spotex;
    
    -- Set default privileges for future objects
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO spotex;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO spotex;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO spotex;
    
    -- Make spotex the owner of the public schema
    ALTER SCHEMA public OWNER TO spotex;
EOSQL

echo "✅ Database initialized with correct permissions"
