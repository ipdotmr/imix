from datetime import datetime
from typing import Optional
from enum import Enum
from beanie import Document
from pydantic import BaseModel, Field

class AIProvider(str, Enum):
    CHATGPT = "chatgpt"
    DEEPSEEK = "deepseek"

class AIConfig(Document):
    tenant_id: str
    provider: AIProvider = AIProvider.CHATGPT
    api_key: Optional[str] = None
    model: str = "gpt-3.5-turbo"
    temperature: float = 0.7
    max_tokens: int = 500
    deepseek_url: str = "https://dayloul.sat.mr/api/v1/chat/completions"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "ai_configs"
