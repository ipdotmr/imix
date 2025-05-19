from datetime import datetime
from enum import Enum
from typing import List, Dict, Any, Optional
from beanie import Document
from pydantic import BaseModel, Field

class FormFieldType(str, Enum):
    TEXT = "text"
    NUMBER = "number"
    EMAIL = "email"
    PHONE = "phone"
    DATE = "date"
    SELECT = "select"
    CHECKBOX = "checkbox"
    RADIO = "radio"

class FormField(BaseModel):
    id: str
    label: str
    type: FormFieldType
    required: bool = False
    options: Optional[List[str]] = None
    placeholder: Optional[str] = None

class FormSubmission(BaseModel):
    submission_id: str
    contact_id: str
    values: Dict[str, Any]
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

class Form(Document):
    tenant_id: str
    name: str
    description: Optional[str] = None
    fields: List[FormField] = []
    submissions: List[FormSubmission] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "forms"
