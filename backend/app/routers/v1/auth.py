# app/routes/auth.py
from fastapi import APIRouter, HTTPException
import asyncio

router = APIRouter()

@router.post("/login")
async def login():
    return {"message": "Coglione"}