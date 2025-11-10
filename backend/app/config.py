import os
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY", "AAAAAAAAAAAAH!!!-MALEDETTA-AAAAAAAAAAAA")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # minuti
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # minuti (7 giorni)
API_PREFIX = "/api"
API_VERSION = "1.0.0"
APP_NAME = "Spotex Platform API"
APP_DESCRIPTION = "API backend per la piattaforma Spotex"
APP_HOST = "localhost"
APP_PORT = 8000
ENV = os.getenv("ENV", "development")  # development o production