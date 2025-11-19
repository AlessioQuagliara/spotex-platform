# Non so se serve, ma lo lascio
from typing import Union 
# Lo devo anche spiegare?
from fastapi import FastAPI
# Importazione delle funzione asincrona figa (meno performante di Node.JS, ma VA BENE LO STESSOO)
import asyncio
# importo BaseModel da pydantic per la definizione dei modelli dati (non si sa mai)
from pydantic import BaseModel
# importo il server ASGI Uvicorn
import uvicorn
# Importo l'ambiente
import os, dotenv
# Importo tutti i database
from app.database import Base, engine
from .models import *
# Importo le rotte API da /routers/__init__.py
from app.routers import api_router_v1

# L'istanza dobbiamo crearla per forza, altrimenti non va
app = FastAPI()

# Carico le variabili d'ambiente dal file .env
dotenv.load_dotenv()

# Creo le tabelle
def crea_tabelle():
    Base.metadata.create_all(bind=engine)

# Qui includo tutte le rotte definite in /app/routers/__init__.py // OVVIAMENTE VERSIONE 1
app.include_router(api_router_v1, prefix="/api/v1")

