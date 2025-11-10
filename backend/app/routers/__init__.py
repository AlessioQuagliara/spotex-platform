from fastapi import APIRouter 
from .v1.auth import router as auth_router
from .v1.backups import router as backups_router 
from .v1.databases import router as database_router
from .v1.domains import router as domains_router
from .v1.emails import router as emails_router
from .v1.monitoring import router as monitoring_router
from .v1.tenants import router as tenants_router
from .v1.users import router as users_router
from .v1.websites import router as websites_router

api_router_v1 = APIRouter()

api_router_v1.include_router(auth_router, prefix="/auth", tags=["Auth"])
api_router_v1.include_router(backups_router, prefix="/backups", tags=["Backups"])
api_router_v1.include_router(database_router, prefix="/database", tags=["Database"])
api_router_v1.include_router(domains_router, prefix="/domains", tags=["Domains"])
api_router_v1.include_router(emails_router, prefix="/emails", tags=["Emails"])
api_router_v1.include_router(monitoring_router, prefix="/monitoring", tags=["Monitoring"])
api_router_v1.include_router(tenants_router, prefix="/tenants", tags=["Tenants"])
api_router_v1.include_router(users_router, prefix="/users", tags=["Users"])
api_router_v1.include_router(websites_router, prefix="/websites", tags=["Websites"])