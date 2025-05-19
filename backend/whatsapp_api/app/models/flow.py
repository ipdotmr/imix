from datetime import datetime
from enum import Enum
from typing import List, Dict, Any, Optional
from beanie import Document
from pydantic import BaseModel, Field

class TriggerType(str, Enum):
    KEYWORD = "keyword"
    INTENT = "intent"
    TIME = "time"

class ActionType(str, Enum):
    SEND_MESSAGE = "send_message"
    HANDOFF = "handoff"
    WEBHOOK = "webhook"
    UPDATE_CRM = "update_crm"

class NodeType(str, Enum):
    TRIGGER = "trigger"
    CONDITION = "condition"
    ACTION = "action"

class FlowNode(BaseModel):
    id: str
    type: NodeType
    config: Dict[str, Any]
    position: Dict[str, int]

class FlowEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None

class ChatFlow(Document):
    tenant_id: str
    name: str
    description: Optional[str] = None
    nodes: List[FlowNode] = []
    edges: List[FlowEdge] = []
    active: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "chat_flows"
