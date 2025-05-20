from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional

from app.models.label import Label, LabelColor
from app.models.message import Message
from app.api.deps import get_current_user
from app.models.user import User
from app.models.label import ConversationLabel

router = APIRouter()

@router.post("/", response_model=Label, status_code=status.HTTP_201_CREATED)
async def create_label(
    label_data: Label,
    current_user: User = Depends(get_current_user)
):
    label_data.tenant_id = current_user.tenant_id
    return await label_data.create()

@router.get("/", response_model=List[Label])
async def get_labels(
    current_user: User = Depends(get_current_user)
):
    return await Label.find({"tenant_id": current_user.tenant_id}).to_list()

@router.put("/{label_id}", response_model=Label)
async def update_label(
    label_id: str,
    label_data: Label,
    current_user: User = Depends(get_current_user)
):
    label = await Label.get(label_id)
    if not label or label.tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Label not found"
        )
    
    for field, value in label_data.dict(exclude={"id", "tenant_id"}).items():
        setattr(label, field, value)
    
    await label.save()
    return label

@router.delete("/{label_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_label(
    label_id: str,
    current_user: User = Depends(get_current_user)
):
    label = await Label.get(label_id)
    if not label or label.tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Label not found"
        )
    
    await label.delete()
    return None

@router.post("/conversation/{message_id}/label/{label_id}")
async def add_label_to_conversation(
    message_id: str,
    label_id: str,
    current_user: User = Depends(get_current_user)
):
    message = await Message.get(message_id)
    if not message or message.tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    label = await Label.get(label_id)
    if not label or label.tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Label not found"
        )
    
    if any(l.label_id == label_id for l in message.labels):
        return {"message": "Label already added to conversation"}
    
    conversation_label = ConversationLabel(
        label_id=label_id,
        added_by=str(current_user.id)
    )
    message.labels.append(conversation_label)
    await message.save()
    
    return {"message": "Label added to conversation"}

@router.delete("/conversation/{message_id}/label/{label_id}")
async def remove_label_from_conversation(
    message_id: str,
    label_id: str,
    current_user: User = Depends(get_current_user)
):
    message = await Message.get(message_id)
    if not message or message.tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    message.labels = [l for l in message.labels if l.label_id != label_id]
    await message.save()
    
    return {"message": "Label removed from conversation"}
