from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict
import string
import secrets

from app.models.tenant import Tenant, WhatsAppBusinessAccount, UsageLimits
from app.api.deps import get_current_admin_user
from app.services.webhook import generate_webhook_credentials

router = APIRouter()

@router.post("/", response_model=Tenant, status_code=status.HTTP_201_CREATED)
async def create_tenant(
    tenant_data: Tenant,
    current_user = Depends(get_current_admin_user)
):
    webhook_creds = generate_webhook_credentials()
    
    tenant_dict = tenant_data.dict()
    tenant_dict["webhook_uri"] = webhook_creds["webhook_uri"]
    tenant_dict["webhook_token"] = webhook_creds["webhook_token"]
    tenant_dict["webhook_secret"] = webhook_creds["webhook_secret"]
    
    new_tenant = await Tenant(**tenant_dict).create()
    return new_tenant

@router.get("/", response_model=List[Tenant])
async def get_tenants(
    current_user = Depends(get_current_admin_user)
):
    tenants = await Tenant.find().to_list()
    return tenants

@router.get("/{tenant_id}", response_model=Tenant)
async def get_tenant(
    tenant_id: str,
    current_user = Depends(get_current_admin_user)
):
    tenant = await Tenant.get(tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    return tenant

@router.put("/{tenant_id}", response_model=Tenant)
async def update_tenant(
    tenant_id: str,
    tenant_data: Tenant,
    current_user = Depends(get_current_admin_user)
):
    tenant = await Tenant.get(tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    for field, value in tenant_data.dict(exclude={"id"}).items():
        setattr(tenant, field, value)
    
    await tenant.save()
    return tenant

@router.post("/{tenant_id}/regenerate-webhook-token", response_model=Dict[str, str])
async def regenerate_webhook_token(
    tenant_id: str,
    current_user = Depends(get_current_admin_user)
):
    """
    Regenerate the webhook token for a tenant.
    The webhook URI remains the same, only the token is regenerated.
    """
    tenant = await Tenant.get(tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    token_chars = string.ascii_letters + string.digits
    new_webhook_token = ''.join(secrets.choice(token_chars) for _ in range(32))
    
    tenant.webhook_token = new_webhook_token
    await tenant.save()
    
    return {
        "success": True,
        "message": "Webhook token regenerated successfully",
        "webhook_token": new_webhook_token
    }
