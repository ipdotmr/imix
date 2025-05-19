from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime

from app.models.flow import ChatFlow
from app.api.deps import get_current_user
from app.models.user import User, Role

router = APIRouter()

@router.post("/", response_model=ChatFlow, status_code=status.HTTP_201_CREATED)
async def create_flow(
    flow_data: ChatFlow,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [Role.ADMIN, Role.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    flow_data.tenant_id = current_user.tenant_id
    
    new_flow = await ChatFlow(**flow_data.dict()).create()
    return new_flow

@router.get("/", response_model=List[ChatFlow])
async def get_flows(
    current_user: User = Depends(get_current_user)
):
    flows = await ChatFlow.find(
        {"tenant_id": current_user.tenant_id}
    ).to_list()
    return flows

@router.get("/{flow_id}", response_model=ChatFlow)
async def get_flow(
    flow_id: str,
    current_user: User = Depends(get_current_user)
):
    flow = await ChatFlow.get(flow_id)
    if not flow or flow.tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flow not found"
        )
    return flow

@router.put("/{flow_id}", response_model=ChatFlow)
async def update_flow(
    flow_id: str,
    flow_data: ChatFlow,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [Role.ADMIN, Role.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    flow = await ChatFlow.get(flow_id)
    if not flow or flow.tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flow not found"
        )
    
    for field, value in flow_data.dict(exclude={"id", "tenant_id"}).items():
        setattr(flow, field, value)
    
    flow.updated_at = datetime.utcnow()
    await flow.save()
    
    return flow

@router.delete("/{flow_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_flow(
    flow_id: str,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [Role.ADMIN, Role.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    flow = await ChatFlow.get(flow_id)
    if not flow or flow.tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flow not found"
        )
    
    await flow.delete()
    
    return None
