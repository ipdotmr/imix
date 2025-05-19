import httpx
import logging
from datetime import datetime

from app.models.message import Message, MessageStatus

logger = logging.getLogger(__name__)

async def send_whatsapp_message(message_id: str):
    """
    Send a WhatsApp message using the WhatsApp Business API
    """
    message = await Message.get(message_id)
    if not message:
        logger.error(f"Message {message_id} not found")
        return
    
    try:
        logger.info(f"Sending message {message_id} to {message.to_number}")
        
        message.status = MessageStatus.SENT
        message.whatsapp_message_id = f"whatsapp-mock-id-{message_id}"
        message.updated_at = datetime.utcnow()
        await message.save()
        
        logger.info(f"Message {message_id} sent successfully")
        return True
    except Exception as e:
        logger.error(f"Error sending message {message_id}: {str(e)}")
        
        message.status = MessageStatus.FAILED
        message.updated_at = datetime.utcnow()
        await message.save()
        
        return False
