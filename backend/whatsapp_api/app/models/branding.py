from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import BaseModel, Field, HttpUrl

class BrandingColors(BaseModel):
    primary: str = "#1a56db"
    secondary: str = "#9061f9"
    accent: str = "#e74694"
    background: str = "#ffffff"
    text: str = "#111827"

class BrandingSettings(Document):
    tenant_id: str
    company_name: str
    logo_url: Optional[HttpUrl] = None
    favicon_url: Optional[HttpUrl] = None
    colors: BrandingColors = Field(default_factory=BrandingColors)
    font_family: str = "Inter, system-ui, sans-serif"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "branding_settings"
