# lo scopo è configurare la connessione al database e fornire i componenti base da usare poi nei modelli SQLAlchemy e per gestire le sessioni
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os, dotenv
dotenv.load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    )

# Istanzia la base per i modelli SQLAlchemy (è quel import Base che non so da dove venga in testa a chi ha sviluppato python)
Base = declarative_base()

# Factory per creare Session locali (sulla documentazione e su StackOverflow dicono di chiamarla SessionLocal)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)