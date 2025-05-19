from datetime import datetime
from typing import List, Optional
from enum import Enum
from beanie import Document, Link
from pydantic import BaseModel, Field, EmailStr, HttpUrl

class WhatsAppBusinessAccount(BaseModel):
    phone_number_id: str
    display_phone_number: str
    business_name: str
    verified: bool = False
    api_key: Optional[str] = None

class UsageLimits(BaseModel):
    max_messages_per_day: int = 1000
    max_media_per_day: int = 100
    max_templates: int = 10
    max_agents: int = 5

class Currency(str, Enum):
    MRU = "mru"
    USD = "usd"
    EUR = "eur"

class CostSettings(BaseModel):
    platform_fee_per_message: float = 0.01
    meta_business_fee_per_message: float = 0.005
    maintenance_hosting_fee_per_month: float = 50.0
    currency: Currency = Currency.USD
    voice_note_retention_days: int = 30  # Default 30 days retention

class TenantAddress(BaseModel):
    street: str
    city: str
    state: Optional[str] = None
    postal_code: str
    country: str

class TenantDocument(BaseModel):
    name: str
    file_url: HttpUrl
    file_type: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

class EmailSettings(BaseModel):
    smtp_server: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str
    smtp_password: str
    from_email: EmailStr
    use_tls: bool = True
    notification_enabled: bool = True
    welcome_template: Optional[str] = None
    password_reset_template: Optional[str] = None
    message_notification_template: Optional[str] = None

class Tenant(Document):
    name: str
    organization: str
    business_id: str = Field(unique=True)
    address: Optional[TenantAddress] = None
    phone: Optional[str] = None
    mobile: Optional[str] = None
    email: EmailStr
    private_notes: Optional[str] = None
    logo_url: Optional[HttpUrl] = None
    documents: List[TenantDocument] = []
    whatsapp_accounts: List[WhatsAppBusinessAccount] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    active: bool = True
    usage_limits: UsageLimits = Field(default_factory=UsageLimits)
    cost_settings: CostSettings = Field(default_factory=CostSettings)
    email_settings: Optional[EmailSettings] = None
    
    class Settings:
        name = "tenants"
