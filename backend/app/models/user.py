from sqlalchemy import Boolean, Column, Integer, String, Enum
from app.database import Base
from datetime import datetime, timezone
import enum

class UserRole(enum.Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    surname = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    company = Column(String, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.USER)
    is_active = Column(Boolean, default=True)
    created_at = Column(String, default=datetime.now(timezone.utc), nullable=False)
    updated_at = Column(String, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))