from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from app.models.tenant import Tenant, WhatsAppBusinessAccount, UsageLimits
from app.api.deps import get_current_admin_user

router = APIRouter()

@router.post("/", response_model=Tenant, status_code=status.HTTP_201_CREATED)
async def create_tenant(
    tenant_data: Tenant,
    current_user = Depends(get_current_admin_user)
):
    new_tenant = await Tenant(**tenant_data.dict()).create()
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
