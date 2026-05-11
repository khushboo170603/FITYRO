from fastapi import APIRouter, HTTPException
from datetime import datetime
from database import users_collection, db
from auth import create_access_token, hash_password, verify_password
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests

router = APIRouter()

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str = "User"
    role: str = "user"

@router.post("/register")
def register(user: RegisterRequest):

    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")

    try:
        hashed_password = hash_password(user.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    new_user = {
        "name": user.name,
        "email": user.email,
        "password_hash": hashed_password,
        "google_id": None,
        "auth_provider": "local",
        "created_at": datetime.utcnow(),
        "role": "user",

        "profile": {
            "gender": None,
            "date_of_birth": None,
            "profile_image": None,
            "measurements": {}
        }
    }

    result = users_collection.insert_one(new_user)

    token = create_access_token({"user_id": str(result.inserted_id)})

    return {"access_token": token}

    

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

@router.post("/login")
def login(data: LoginRequest):

    user = users_collection.find_one({"email": data.email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    stored_password = user.get("password_hash") or user.get("password")

    if not stored_password:
        raise HTTPException(status_code=500, detail="Password missing")

    if not verify_password(data.password, stored_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if user.get("role", "user") != data.role:
        raise HTTPException(status_code=403, detail="Unauthorized role")

    token = create_access_token({
        "sub": user["email"],
        "role": user.get("role", "user")
    })

    return {
    "access_token": token,
    "user": {
        "name": user["name"],
        "email": user["email"]
    }
}
