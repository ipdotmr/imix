from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import List

from app.models.message import Message, MessageType
from app.schemas.message import MessageCreate, MessageResponse
from app.services.whatsapp import send_whatsapp_message
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def send_message(
    message: MessageCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    db_message = Message(
        tenant_id=current_user.tenant_id,
        whatsapp_account_id=message.whatsapp_account_id,
        from_number=message.from_number,
        to_number=message.to_number,
        message_type=message.message_type,
        content=message.content
    )
    await db_message.create()
    
    background_tasks.add_task(
        send_whatsapp_message, 
        db_message.id
    )
    
    return MessageResponse(
        id=str(db_message.id),
        status="queued",
        message="Message queued for delivery"
    )

@router.get("/", response_model=List[Message])
async def get_messages(
    current_user: User = Depends(get_current_user)
):
    messages = await Message.find(
        {"tenant_id": current_user.tenant_id}
    ).to_list()
    return messages

@router.get("/{message_id}", response_model=Message)
async def get_message(
    message_id: str,
    current_user: User = Depends(get_current_user)
):
    message = await Message.get(message_id)
    if not message or message.tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    return message
