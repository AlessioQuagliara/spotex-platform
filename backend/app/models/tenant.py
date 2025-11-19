from sqlalchemy import Boolean, Integer, Column, String, Enum
from app.database import Base
from datetime import datetime
import enum

class TenanType(enum.Enum):
    COMPANY = "company",
    AGENCY = "agency"

class Tenant(Base):
    __tablename__ = "tenant"

    id = Column(Integer, primary_key = True, index = True)
    tenant_name = Column(String, unique = True, index = True, nullable = False)
    tenant_type = Column(Enum(TenanType), default=TenanType.COMPANY)