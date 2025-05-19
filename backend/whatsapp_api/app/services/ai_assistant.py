import logging
import httpx
from typing import List, Dict, Any, Optional, Literal
from datetime import datetime
from enum import Enum
from pydantic import BaseModel

from app.models.message import Message
from app.models.tenant import Tenant

logger = logging.getLogger(__name__)

class AIProvider(str, Enum):
    CHATGPT = "chatgpt"
    DEEPSEEK = "deepseek"

class AIMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str

class AIAssistantConfig(BaseModel):
    provider: AIProvider = AIProvider.CHATGPT
    api_key: Optional[str] = None
    model: str = "gpt-3.5-turbo"
    temperature: float = 0.7
    max_tokens: int = 500
    deepseek_url: str = "https://dayloul.sat.mr/api/v1/chat/completions"

class AIAssistant:
    """
    AI Assistant service for processing messages and generating responses
    with support for multiple providers (ChatGPT and DeepSeek)
    """
    
    def __init__(self, tenant_id: str, config: Optional[AIAssistantConfig] = None):
        self.tenant_id = tenant_id
        self.config = config or AIAssistantConfig()
    
    async def process_message(self, message: Message) -> Optional[Dict[str, Any]]:
        """
        Process an incoming message and generate a response if appropriate
        """
        try:
            message_text = message.content.get("text", "").lower()
            
            # For simple patterns, use rule-based responses
            if self._should_use_rule_based(message_text):
                return self._get_rule_based_response(message_text)
            
            ai_response = await self._get_ai_response(message_text)
            if ai_response:
                return {
                    "message_type": "text",
                    "content": {
                        "text": ai_response
                    }
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error processing message with AI: {str(e)}")
            return None
    
    def _should_use_rule_based(self, message_text: str) -> bool:
        """Determine if we should use rule-based responses"""
        simple_patterns = ["hello", "hi", "help", "order status"]
        return any(pattern in message_text for pattern in simple_patterns)
    
    def _get_rule_based_response(self, message_text: str) -> Dict[str, Any]:
        """Get a rule-based response for simple patterns"""
        if "hello" in message_text or "hi" in message_text:
            return {
                "message_type": "text",
                "content": {
                    "text": "Hello! How can I assist you today?"
                }
            }
        elif "help" in message_text:
            return {
                "message_type": "text",
                "content": {
                    "text": "I'm here to help! What do you need assistance with?"
                }
            }
        elif "order" in message_text and "status" in message_text:
            return {
                "message_type": "text",
                "content": {
                    "text": "To check your order status, please provide your order number."
                }
            }
        
        return {
            "message_type": "text",
            "content": {
                "text": "I'm not sure I understand. Could you please rephrase your question?"
            }
        }
    
    async def _get_ai_response(self, message_text: str) -> Optional[str]:
        """Get a response from the configured AI provider"""
        try:
            messages = [
                AIMessage(
                    role="system", 
                    content="You are a helpful WhatsApp Business assistant. Provide concise, accurate responses."
                ),
                AIMessage(role="user", content=message_text)
            ]
            
            if self.config.provider == AIProvider.CHATGPT:
                return await self._get_chatgpt_response(messages)
            elif self.config.provider == AIProvider.DEEPSEEK:
                return await self._get_deepseek_response(messages)
            else:
                logger.error(f"Unknown AI provider: {self.config.provider}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting AI response: {str(e)}")
            return None
    
    async def _get_chatgpt_response(self, messages: List[AIMessage]) -> Optional[str]:
        """Get a response from ChatGPT"""
        if not self.config.api_key:
            logger.warning("ChatGPT API key not configured")
            return None
            
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.config.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.config.model,
                        "messages": [msg.dict() for msg in messages],
                        "temperature": self.config.temperature,
                        "max_tokens": self.config.max_tokens
                    }
                )
                
                if response.status_code != 200:
                    logger.error(f"ChatGPT API error: {response.status_code} {response.text}")
                    return None
                
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"Error calling ChatGPT API: {str(e)}")
            return None
    
    async def _get_deepseek_response(self, messages: List[AIMessage]) -> Optional[str]:
        """Get a response from self-hosted DeepSeek R1"""
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.config.deepseek_url,
                    json={
                        "messages": [msg.dict() for msg in messages],
                        "temperature": self.config.temperature,
                        "max_tokens": self.config.max_tokens
                    }
                )
                
                if response.status_code != 200:
                    logger.error(f"DeepSeek API error: {response.status_code} {response.text}")
                    return None
                
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"Error calling DeepSeek API: {str(e)}")
            return None
    
    async def train_model(self, training_data: List[Dict[str, Any]], provider: Optional[AIProvider] = None) -> bool:
        """
        Train the AI model with new data
        """
        try:
            provider = provider or self.config.provider
            logger.info(f"Training request received for tenant {self.tenant_id} with {len(training_data)} examples using provider {provider}")
            
            
            return True
            
        except Exception as e:
            logger.error(f"Error training AI model: {str(e)}")
            return False
