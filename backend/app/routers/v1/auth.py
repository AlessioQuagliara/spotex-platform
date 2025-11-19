# app/routes/auth.py
from fastapi import APIRouter, HTTPException, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated
from pydantic import BaseModel
import asyncio

router = APIRouter()

@router.post("/login")  
async def login(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    return {"username": username}
