from datetime import datetime
from enum import Enum
from typing import Optional, List
from beanie import Document
from pydantic import BaseModel, Field

class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class TaskStatus(str, Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class TaskAssignment(BaseModel):
    agent_id: str
    assigned_at: datetime = Field(default_factory=datetime.utcnow)
    assigned_by: str  # User ID who assigned the task

class Task(Document):
    tenant_id: str
    title: str
    description: str
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.OPEN
    due_date: Optional[datetime] = None
    assigned_to: List[TaskAssignment] = []
    created_by: str  # User ID who created the task
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    completed_by: Optional[str] = None  # User ID who completed the task
    related_contact_id: Optional[str] = None  # Optional link to a contact
    related_message_id: Optional[str] = None  # Optional link to a message
    
    class Settings:
        name = "tasks"
