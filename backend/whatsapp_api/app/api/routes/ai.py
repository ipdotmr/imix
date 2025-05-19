from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, Optional

from app.models.ai_config import AIConfig
from app.services.ai_assistant import AIAssistant, AIProvider
from app.api.deps import get_current_user
from app.models.user import User, Role

router = APIRouter()

@router.get("/config", response_model=Dict[str, Any])
async def get_ai_config(current_user: User = Depends(get_current_user)):
    """
    Get AI assistant configuration for the current tenant
    """
    config = await AIConfig.find_one({"tenant_id": current_user.tenant_id})
    
    if not config:
        return {
            "provider": "chatgpt",
            "model": "gpt-3.5-turbo",
            "temperature": 0.7,
            "max_tokens": 500,
            "deepseek_url": "https://dayloul.sat.mr/api/v1/chat/completions"
        }
    
    return {
        "provider": config.provider,
        "model": config.model,
        "temperature": config.temperature,
        "max_tokens": config.max_tokens,
        "deepseek_url": config.deepseek_url
    }

@router.put("/config", response_model=Dict[str, Any])
async def update_ai_config(
    config_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """
    Update AI assistant configuration for the current tenant
    """
    if current_user.role not in [Role.ADMIN, Role.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    config = await AIConfig.find_one({"tenant_id": current_user.tenant_id})
    
    if not config:
        config = AIConfig(tenant_id=current_user.tenant_id)
    
    if "provider" in config_data:
        config.provider = config_data["provider"]
    
    if "api_key" in config_data and config_data["api_key"]:
        config.api_key = config_data["api_key"]
    
    if "model" in config_data:
        config.model = config_data["model"]
    
    if "temperature" in config_data:
        config.temperature = float(config_data["temperature"])
    
    if "max_tokens" in config_data:
        config.max_tokens = int(config_data["max_tokens"])
    
    if "deepseek_url" in config_data:
        config.deepseek_url = config_data["deepseek_url"]
    
    await config.save()
    
    return {
        "provider": config.provider,
        "model": config.model,
        "temperature": config.temperature,
        "max_tokens": config.max_tokens,
        "deepseek_url": config.deepseek_url
    }

@router.post("/test-connection", response_model=Dict[str, Any])
async def test_ai_connection(
    config_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """
    Test connection to the AI provider
    """
    try:
        provider = config_data.get("provider", "chatgpt")
        
        assistant = AIAssistant(
            tenant_id=current_user.tenant_id,
            config={
                "provider": provider,
                "api_key": config_data.get("api_key"),
                "model": config_data.get("model", "gpt-3.5-turbo"),
                "temperature": float(config_data.get("temperature", 0.7)),
                "max_tokens": int(config_data.get("max_tokens", 500)),
                "deepseek_url": config_data.get("deepseek_url", "https://dayloul.sat.mr/api/v1/chat/completions")
            }
        )
        
        response = await assistant._get_ai_response("Hello, this is a test message.")
        
        if response:
            return {
                "success": True,
                "message": f"Successfully connected to {provider.upper()} API"
            }
        else:
            return {
                "success": False,
                "message": f"Failed to get response from {provider.upper()} API"
            }
    
    except Exception as e:
        return {
            "success": False,
            "message": f"Error testing connection: {str(e)}"
        }
