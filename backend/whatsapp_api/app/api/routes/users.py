from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List, Optional
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

from app.models.user import User, Role
from app.core.config import app_settings
from app.api.deps import get_current_user, get_current_admin_user

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, app_settings.secret_key, algorithm="HS256")
    return encoded_jwt

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one({"email": form_data.username})
    if not user or not pwd_context.verify(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user.last_login = datetime.utcnow()
    await user.save()
    
    access_token_expires = timedelta(minutes=app_settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: dict,
    current_user: User = Depends(get_current_admin_user)
):
    existing_user = await User.find_one({"email": user_data["email"]})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user_data["password_hash"] = pwd_context.hash(user_data.pop("password"))
    
    new_user = await User(**user_data).create()
    return new_user

@router.get("/", response_model=List[User])
async def get_users(
    current_user: User = Depends(get_current_admin_user)
):
    users = await User.find(
        {"tenant_id": current_user.tenant_id}
    ).to_list()
    return users

@router.get("/{user_id}", response_model=User)
async def get_user(
    user_id: str,
    current_user: User = Depends(get_current_admin_user)
):
    user = await User.get(user_id)
    if not user or user.tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: str,
    user_data: dict,
    current_user: User = Depends(get_current_admin_user)
):
    user = await User.get(user_id)
    if not user or user.tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if "password" in user_data:
        user_data["password_hash"] = pwd_context.hash(user_data.pop("password"))
    
    for field, value in user_data.items():
        setattr(user, field, value)
    
    await user.save()
    return user
