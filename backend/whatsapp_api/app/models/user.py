from datetime import datetime
from typing import List, Optional
from enum import Enum
from beanie import Document, Link
from pydantic import BaseModel, Field, EmailStr

from app.models.tenant import Language

class Role(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    AGENT = "agent"
    SUPERVISOR = "supervisor"
    READONLY = "readonly"
    BILLING = "billing"
    CUSTOM = "custom"

class Permission(str, Enum):
    VIEW_DASHBOARD = "view_dashboard"
    MANAGE_TENANTS = "manage_tenants"
    MANAGE_USERS = "manage_users"
    SEND_MESSAGES = "send_messages"
    VIEW_MESSAGES = "view_messages"
    MANAGE_TEMPLATES = "manage_templates"
    MANAGE_CONTACTS = "manage_contacts"
    MANAGE_FLOWS = "manage_flows"
    MANAGE_FORMS = "manage_forms"
    MANAGE_BILLING = "manage_billing"
    MANAGE_SETTINGS = "manage_settings"
    ASSIGN_CONTACTS = "assign_contacts"
    VIEW_ANALYTICS = "view_analytics"

class UserPermissions(BaseModel):
    permissions: List[Permission] = []

class User(Document):
    email: EmailStr
    password_hash: str
    first_name: str
    last_name: str
    tenant_id: str
    role: Role = Role.AGENT
    custom_permissions: Optional[UserPermissions] = None
    active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    language_preference: Optional[Language] = None  # If None, use tenant's default language
    
    class Settings:
        name = "users"
