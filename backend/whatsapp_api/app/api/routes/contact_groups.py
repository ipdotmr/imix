from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Optional

from app.models.contact_group import ContactGroup, ContactVariantField, ContactGroupPermission, RolePermission
from app.models.contact import Contact
from app.models.tenant import Tenant
from app.api.deps import get_current_user
from app.models.user import User, Role

router = APIRouter()

@router.post("/", response_model=ContactGroup, status_code=status.HTTP_201_CREATED)
async def create_contact_group(
    group_data: ContactGroup,
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [Role.ADMIN, Role.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    tenant = await Tenant.find_one({"_id": current_user.tenant_id})
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tenant not found"
        )
    
    existing_groups_count = await ContactGroup.find({"tenant_id": current_user.tenant_id}).count()
    if existing_groups_count >= tenant.usage_limits.max_contact_groups:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contact group limit reached"
        )
    
    group_data.tenant_id = current_user.tenant_id
    new_group = await ContactGroup(**group_data.dict()).create()
    return new_group

@router.get("/", response_model=List[ContactGroup])
async def get_contact_groups(
    parent_id: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    if parent_id:
        groups = await ContactGroup.find({
            "tenant_id": current_user.tenant_id,
            "parent_group_id": parent_id
        }).to_list()
    else:
        groups = await ContactGroup.find({
            "tenant_id": current_user.tenant_id,
            "parent_group_id": None  # Only return top-level groups
        }).to_list()
    
    return groups

@router.get("/{group_id}", response_model=ContactGroup)
async def get_contact_group(
    group_id: str,
    current_user: User = Depends(get_current_user)
):
    group = await ContactGroup.find_one({
        "_id": group_id,
        "tenant_id": current_user.tenant_id
    })
    
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact group not found"
        )
    
    has_permission = False
    for role_perm in group.role_permissions:
        if role_perm.role == current_user.role and "view" in role_perm.permissions:
            has_permission = True
            break
    
    if not has_permission and current_user.role not in [Role.ADMIN, Role.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to view this group"
        )
    
    return group

@router.put("/{group_id}", response_model=ContactGroup)
async def update_contact_group(
    group_id: str,
    group_data: ContactGroup,
    current_user: User = Depends(get_current_user)
):
    group = await ContactGroup.find_one({
        "_id": group_id,
        "tenant_id": current_user.tenant_id
    })
    
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact group not found"
        )
    
    has_permission = False
    for role_perm in group.role_permissions:
        if role_perm.role == current_user.role and "edit" in role_perm.permissions:
            has_permission = True
            break
    
    if not has_permission and current_user.role not in [Role.ADMIN, Role.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to edit this group"
        )
    
    group_data.tenant_id = current_user.tenant_id
    for field, value in group_data.dict(exclude={"id"}).items():
        setattr(group, field, value)
    
    await group.save()
    return group

@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact_group(
    group_id: str,
    current_user: User = Depends(get_current_user)
):
    group = await ContactGroup.find_one({
        "_id": group_id,
        "tenant_id": current_user.tenant_id
    })
    
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact group not found"
        )
    
    has_permission = False
    for role_perm in group.role_permissions:
        if role_perm.role == current_user.role and "delete" in role_perm.permissions:
            has_permission = True
            break
    
    if not has_permission and current_user.role not in [Role.ADMIN, Role.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this group"
        )
    
    child_groups = await ContactGroup.find({"parent_group_id": group_id}).to_list()
    if child_groups:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete group with child groups"
        )
    
    contacts = await Contact.find({"group_ids": group_id}).to_list()
    for contact in contacts:
        contact.group_ids.remove(group_id)
        await contact.save()
    
    await group.delete()
    return None

@router.post("/{group_id}/contacts", status_code=status.HTTP_204_NO_CONTENT)
async def add_contacts_to_group(
    group_id: str,
    contact_ids: List[str],
    current_user: User = Depends(get_current_user)
):
    group = await ContactGroup.find_one({
        "_id": group_id,
        "tenant_id": current_user.tenant_id
    })
    
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact group not found"
        )
    
    has_permission = False
    for role_perm in group.role_permissions:
        if role_perm.role == current_user.role and "edit" in role_perm.permissions:
            has_permission = True
            break
    
    if not has_permission and current_user.role not in [Role.ADMIN, Role.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to edit this group"
        )
    
    existing_contacts = set(group.contacts)
    new_contacts = set(contact_ids)
    updated_contacts = list(existing_contacts.union(new_contacts))
    group.contacts = updated_contacts
    await group.save()
    
    for contact_id in contact_ids:
        contact = await Contact.get(contact_id)
        if contact and contact.tenant_id == current_user.tenant_id:
            if group_id not in contact.group_ids:
                contact.group_ids.append(group_id)
                await contact.save()
    
    return None

@router.delete("/{group_id}/contacts", status_code=status.HTTP_204_NO_CONTENT)
async def remove_contacts_from_group(
    group_id: str,
    contact_ids: List[str],
    current_user: User = Depends(get_current_user)
):
    group = await ContactGroup.find_one({
        "_id": group_id,
        "tenant_id": current_user.tenant_id
    })
    
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact group not found"
        )
    
    has_permission = False
    for role_perm in group.role_permissions:
        if role_perm.role == current_user.role and "edit" in role_perm.permissions:
            has_permission = True
            break
    
    if not has_permission and current_user.role not in [Role.ADMIN, Role.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to edit this group"
        )
    
    group.contacts = [c for c in group.contacts if c not in contact_ids]
    await group.save()
    
    for contact_id in contact_ids:
        contact = await Contact.get(contact_id)
        if contact and contact.tenant_id == current_user.tenant_id:
            if group_id in contact.group_ids:
                contact.group_ids.remove(group_id)
                await contact.save()
    
    return None

@router.put("/{group_id}/variant-fields", response_model=Dict[str, ContactVariantField])
async def update_group_variant_fields(
    group_id: str,
    variant_fields: Dict[str, ContactVariantField],
    current_user: User = Depends(get_current_user)
):
    group = await ContactGroup.find_one({
        "_id": group_id,
        "tenant_id": current_user.tenant_id
    })
    
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact group not found"
        )
    
    if current_user.role not in [Role.ADMIN, Role.MANAGER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update variant fields"
        )
    
    visible_fields_count = sum(1 for field in variant_fields.values() if field.is_visible_to_agent)
    if visible_fields_count > 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 3 variant fields can be visible to agents"
        )
    
    group.variant_fields = variant_fields
    await group.save()
    return group.variant_fields
