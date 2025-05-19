from datetime import datetime
from typing import List, Optional, Dict
from beanie import Document
from pydantic import BaseModel, Field

class Label(BaseModel):
    name: str
    color: str = "#000000"

class Contact(Document):
    tenant_id: str
    whatsapp_account_id: str
    phone_number: str
    name: Optional[str] = None
    profile_name: Optional[str] = None
    labels: List[Label] = []
    custom_fields: Dict[str, str] = {}
    variant_field_values: Dict[str, str] = {}  # Added for storing variant field values
    group_ids: List[str] = []  # Added for storing group memberships
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "contacts"
