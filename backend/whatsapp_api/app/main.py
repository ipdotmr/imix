from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.api.routes.tenants import router as tenants_router
from app.api.routes.users import router as users_router
from app.api.routes.messages import router as messages_router
from app.api.routes.webhooks import router as webhooks_router
from app.api.routes.flows import router as flows_router
from app.api.routes.ai import router as ai_router
from app.api.routes.contact_groups import router as contact_groups_router
from app.api.routes.system import router as system_router
from app.core.config import app_settings
from app.db.database import init_db

app = FastAPI(title=app_settings.app_name)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

@app.on_event("startup")
async def startup_db_client():
    await init_db(app_settings)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

app.include_router(tenants_router, prefix="/api/tenants", tags=["tenants"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(messages_router, prefix="/api/messages", tags=["messages"])
app.include_router(webhooks_router, prefix="/webhooks", tags=["webhooks"])
app.include_router(flows_router, prefix="/api/flows", tags=["flows"])
app.include_router(ai_router, prefix="/api/ai", tags=["ai"])
app.include_router(contact_groups_router, prefix="/api/contact-groups", tags=["contact-groups"])
app.include_router(system_router, prefix="/api/system", tags=["system"])
