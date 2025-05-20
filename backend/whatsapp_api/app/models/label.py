from datetime import datetime
from enum import Enum
from typing import Optional, List
from pydantic import Field, BaseModel
from beanie import Document

class LabelColor(str, Enum):
    RED = "red"
    ORANGE = "orange"
    YELLOW = "yellow"
    GREEN = "green"
    BLUE = "blue"
    PURPLE = "purple"
    PINK = "pink"
    GRAY = "gray"

class Label(Document):
    tenant_id: str
    name: str
    color: LabelColor = LabelColor.BLUE
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "labels"

class ConversationLabel(BaseModel):
    label_id: str
    added_at: datetime = Field(default_factory=datetime.utcnow)
    added_by: str
