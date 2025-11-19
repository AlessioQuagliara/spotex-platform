from pydantic import BaseModel, Field, field_validator
from typing import Optional
from enum import Enum
from app.models.tenant import TenanType

class TenantBase(BaseModel):
    tenant_id: int
    tenant_name: str
    tenant_type: TenanType = TenanType.COMPANY

class TenantCreate(BaseModel):
    tenant_name: str = Field(...,min_length=2, max_length=12, examples="agenzia_alfa" )
    tenant_type: TenanType = TenanType.COMPANY

    @field_validator( 'tenant_name', mode='Before')
    def tutto_minuscolo(cls, v):
        return v.lower() if isinstance(v, str) else v

class TenantUpdate(BaseModel):
    tenant_name: Optional[str] = Field(None, min_length=2, max_length=12, examples="agenzia_alfa")

    @field_validator( 'tenant_name', mode='Before')
    def tutto_minuscolo(cls, v):
        return v.lower() if isinstance(v, str) else v
    
class TenantResponse(BaseModel):
    id : int
    tenant_name : str
    tenant_type : TenanType = TenanType.COMPANY

    class Config:
        form_attributes = True