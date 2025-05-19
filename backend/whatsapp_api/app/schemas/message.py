from pydantic import BaseModel
from typing import Dict, Any
from app.models.message import MessageType

class MessageCreate(BaseModel):
    whatsapp_account_id: str
    from_number: str
    to_number: str
    message_type: MessageType
    content: Dict[str, Any]

class MessageResponse(BaseModel):
    id: str
    status: str
    message: str
