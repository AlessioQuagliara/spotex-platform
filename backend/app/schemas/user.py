# Devo ancora capire cos'è pydantic
from pydantic import BaseModel, Field, EmailStr
# Non so cosa sia Optional
from typing import Optional
# Spero che datetime sia per le date
from datetime import datetime
# Questa serve solo per ROLE
from enum import Enum
# Importo UserRole da models.user
from app.models.user import UserRole

# N.B. hashed_password non lo metto mai negli schemi, poiché il service hasherà la password in fase di creazione/aggiornamento

# Provo a creare uno schema per l'utente, giusto per ricordare che cosa ho messo (ho già paura)
class UserBase(BaseModel):
    email: EmailStr
    name: str
    surname: str
    company: Optional[str] = None
    role: UserRole = UserRole.USER
    is_active: Optional[bool] = True

# Schema per la creazione (Speriamo) dell'utente
class UserCreate(BaseModel):
    name: str = Field(...,min_length=3, max_length=50, example="Alessio")
    surname: str = Field(...,min_length=3, max_length=50, example="Quagliara")
    email : EmailStr = Field(..., example="alessio.quagliara@spotexsrl.com")
    password: str = Field(..., min_length=8)
    company: Optional[str] = Field(None, max_length=100, example="Spotex SRL")
    role: UserRole = UserRole.USER
    is_active: Optional[bool] = True

# Schema per aggionrnare l'utente (sperando che funzioni 🤣)
class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=50, example="Alessio")
    surname: Optional[str] = Field(None, min_length=3, max_length=50, example="Quagliara")
    email : Optional[EmailStr] = Field(None, example="alessio.quagliara@spotexsrl.com")
    password: Optional[str] = Field(None, min_length=8)
    company: Optional[str] = Field(None, max_length=100, example="Spotex SRL")
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

# Schema per la risposta dell'utente (Sperando che risponda)
class UserResponse(BaseModel):
    id : int
    email : EmailStr = Field(..., example="alessio.quagliara@spotexsrl.com")
    name : str
    surname : str
    company : Optional[str] = None
    role : UserRole = UserRole.USER
    is_active : bool

    class Config:
        from_attributes = True # Su StackOverflow dicono che serve per convertire da ORM SQLAlchemy a Pydantic

# Schema per il login (Arrivati a questo punto facciamoci il segno della croce)
class UserLogin(BaseModel):
    email : EmailStr
    password: str = Field(..., min_length=8)

# FINALMENTE USIAMO JWT PER I TOKEN
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer" # di solito è bearer, non so perché

# OVVIAMENTE IL BASTARDO VOLEVA ANCHE I DATI NELL'ACCESS TOKEN
class TokenData(BaseModel):
    email : Optional[EmailStr] = None
    role : Optional[UserRole] = None