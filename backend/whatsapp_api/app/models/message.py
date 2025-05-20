from datetime import datetime
from enum import Enum
from typing import Optional, List, Dict, Any
from beanie import Document
from pydantic import BaseModel, Field

from app.models.label import ConversationLabel

class MessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    DOCUMENT = "document"
    AUDIO = "audio"
    STICKER = "sticker"
    LOCATION = "location"
    CONTACT = "contact"
    TEMPLATE = "template"
    INTERACTIVE = "interactive"
    FORM = "form"  # New type for in-chat forms

class MessageStatus(str, Enum):
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"

class Currency(str, Enum):
    MRU = "mru"
    USD = "usd"
    EUR = "eur"

class MessageCost(BaseModel):
    platform_fee: float = 0.0
    meta_business_fee: float = 0.0
    maintenance_hosting_fee: float = 0.0
    currency: Currency = Currency.USD
    total: float = 0.0

class Message(Document):
    tenant_id: str
    whatsapp_account_id: str
    from_number: str
    to_number: str
    message_type: MessageType
    content: Dict[str, Any]
    whatsapp_message_id: Optional[str] = None
    status: MessageStatus = MessageStatus.SENT
    labels: List[ConversationLabel] = []  # Add labels to messages
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_business_initiated: bool = False
    cost: Optional[MessageCost] = None
    assigned_agent_id: Optional[str] = None
    responded_by_agent_id: Optional[str] = None  # Track which agent responded to this message
    response_time: Optional[int] = None  # Time in seconds between message receipt and agent response
    voice_note_duration: Optional[int] = None  # Duration in seconds
    voice_note_expiry: Optional[datetime] = None  # When the voice note should be deleted
    
    class Settings:
        name = "messages"
