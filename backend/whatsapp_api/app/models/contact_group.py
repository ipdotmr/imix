from datetime import datetime
from typing import List, Optional, Dict, Set
from enum import Enum
from beanie import Document, Link
from pydantic import BaseModel, Field

from app.models.contact import Contact
from app.models.user import Role

class ContactGroupPermission(str, Enum):
    VIEW = "view"
    EDIT = "edit"
    DELETE = "delete"
    MESSAGE = "message"
    ASSIGN = "assign"

class RolePermission(BaseModel):
    role: Role
    permissions: Set[ContactGroupPermission]

class ContactVariantField(BaseModel):
    name: str
    description: Optional[str] = None
    is_visible_to_agent: bool = False
    is_available_in_flows: bool = False

class ContactGroup(Document):
    tenant_id: str
    name: str
    description: Optional[str] = None
    contacts: List[str] = []  # List of contact IDs
    parent_group_id: Optional[str] = None
    role_permissions: List[RolePermission] = []
    variant_fields: Dict[str, ContactVariantField] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "contact_groups"
