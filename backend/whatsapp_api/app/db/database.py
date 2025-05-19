import motor.motor_asyncio
from beanie import init_beanie
from app.models.tenant import Tenant
from app.models.user import User
from app.models.message import Message
from app.models.contact import Contact
from app.models.flow import ChatFlow
from app.models.form import Form
from app.models.branding import BrandingSettings
from app.models.ai_config import AIConfig
from app.models.task import Task
from app.models.contact_group import ContactGroup

async def init_db(app_settings):
    client = motor.motor_asyncio.AsyncIOMotorClient(
        app_settings.mongodb_uri
    )
    
    await init_beanie(
        database=client[app_settings.db_name],
        document_models=[
            Tenant,
            User,
            Message,
            Contact,
            ChatFlow,
            Form,
            BrandingSettings,
            AIConfig,
            Task,
            ContactGroup
        ]
    )
