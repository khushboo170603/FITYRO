from fastapi import APIRouter, HTTPException
from users_db import users_collection
from database import tryon_collection
from bson import ObjectId
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/admin/users")
async def get_users():

    users = []

    now = datetime.utcnow()

    for user in users_collection.find({
        "role": {"$ne": "admin"}
    }):

        user_id = str(user["_id"])

        tryon_count = tryon_collection.count_documents({
            "user_id": user_id
        })

        last_seen = user.get("last_seen")

        if (
            user.get("role") != "admin"
            and last_seen 
            and now - last_seen < timedelta(minutes=5)
        ):
            status = "Active"
        else:
            status = "Inactive"

        users.append({
            "id": user_id,
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "created_at": str(user.get("created_at", "")),
            "tryons": tryon_count,
            "status": "Active" if tryon_count > 0 else "Inactive"
        })

    return users

@router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str):

    result = users_collection.delete_one({
        "_id": ObjectId(user_id)
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}

@router.get("/admin/users/{user_id}")
async def get_single_user(user_id: str):

    user = users_collection.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "created_at": str(user.get("created_at", "")),
    }