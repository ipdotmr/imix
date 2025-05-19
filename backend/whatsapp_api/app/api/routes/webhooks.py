from fastapi import APIRouter, Request, HTTPException, Depends, status
from datetime import datetime

from app.models.message import Message, MessageType, MessageStatus
from app.models.tenant import Tenant

router = APIRouter()

@router.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    data = await request.json()
    
    
    try:
        entry = data.get("entry", [])[0]
        changes = entry.get("changes", [])[0]
        value = changes.get("value", {})
        
        messages = value.get("messages", [])
        
        for msg in messages:
            whatsapp_message_id = msg.get("id")
            from_number = msg.get("from")
            timestamp = msg.get("timestamp")
            
            message_type = msg.get("type")
            content = msg.get(message_type, {})
            
            tenant = await Tenant.find_one(
                {"whatsapp_accounts.phone_number_id": value.get("metadata", {}).get("phone_number_id")}
            )
            
            if not tenant:
                continue
                
            await Message(
                tenant_id=str(tenant.id),
                whatsapp_account_id=value.get("metadata", {}).get("phone_number_id"),
                from_number=from_number,
                to_number=value.get("metadata", {}).get("display_phone_number"),
                message_type=message_type,
                content=content,
                whatsapp_message_id=whatsapp_message_id,
                status=MessageStatus.DELIVERED,
                created_at=datetime.fromtimestamp(int(timestamp)),
                updated_at=datetime.utcnow()
            ).create()
            
        return {"success": True}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing webhook: {str(e)}"
        )
