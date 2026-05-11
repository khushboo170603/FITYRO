from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId
from auth import get_current_user
from database import users_collection
from services.ml_model import predict_size_from_model
from passlib.context import CryptContext
from users_db import users_collection

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔥 Router
router = APIRouter()

class PasswordUpdateRequest(BaseModel):
    current_password: str
    new_password: str

# 📏 Request Model
class ProfileRequest(BaseModel):
    height: float
    weight: float
    chest: float
    waist: float
    hip: float

# ✅ SAVE PROFILE
@router.post("/save-profile")
def save_profile(
    data: ProfileRequest,
    user=Depends(get_current_user)
):
    user_id = user["user_id"]

    result = predict_size_from_model(data)

    # 🔥 HANDLE MODEL ERROR
    if "error" in result:
        print("❌ MODEL ERROR:", result["error"])
        raise HTTPException(
            status_code=500,
            detail=result["error"]
        )
    
    users_collection.update_one(
    {"_id": ObjectId(user_id)},
    {
        "$set": {
            "profile.measurements": {
                "height": data.height,
                "weight": data.weight,
                "chest": data.chest,
                "waist": data.waist,
                "hip": data.hip,
            },
            "profile.updated_at": datetime.utcnow()
        }
    }
)
    return {
        "message": "Profile saved",
        "recommended_size": result["size"],
        "confidence": result["confidence"]
    }


# ✅ GET PROFILE
@router.get("/get-profile")
def get_profile(user=Depends(get_current_user)):
    db_user = users_collection.find_one({
        "_id": ObjectId(user["user_id"])
    })

    if not db_user:
        return {
            "name": "User",
            "email": ""
        }

    return {
    "name": db_user.get("name", "User"),
    "email": db_user.get("email", ""),
    "profile": db_user.get("profile", {})
}
# ================== PHOTOS SECTION ==================

# ✅ SAVE PHOTO
@router.post("/save-photo")
def save_photo(data: dict, user=Depends(get_current_user)):
    user_id = user["user_id"]

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$push": {
                "profile.photos": data
            }
        }
    )

    return {"message": "Photo saved"}

# ✅ GET PHOTOS
@router.get("/get-photos")
def get_photos(user=Depends(get_current_user)):
    user_id = user["user_id"]

    user_data = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    return user_data.get("profile", {}).get("photos", [])

# ✅ DELETE PHOTO
@router.delete("/delete-photo/{photo_id}")
def delete_photo(photo_id: str, user=Depends(get_current_user)):
    user_id = user["user_id"]

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$pull": {
                "profile.photos": {"id": photo_id}
            }
        }
    )

    return {"message": "Photo deleted"}

# ✅ UPDATE PHOTO NAME
@router.put("/update-photo-name")
def update_photo_name(data: dict, user=Depends(get_current_user)):
    user_id = user["user_id"]

    users_collection.update_one(
        {
            "_id": ObjectId(user_id),
            "profile.photos.id": data["id"]
        },
        {
            "$set": {
                "profile.photos.$.name": data["name"]
            }
        }
    )

    return {"message": "Photo name updated"}
    
@router.post("/update-password")
def update_password(data: PasswordUpdateRequest, user=Depends(get_current_user)):
    user_id = user["user_id"]

    user_data = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")

    # 🔐 verify current password
    stored_password = user_data.get("password_hash")

    if not stored_password:
        raise HTTPException(
            status_code=400,
            detail="Password not set for this user"
        )

    if not pwd_context.verify(data.current_password, stored_password):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    # 🔐 hash new password
    hashed_password = pwd_context.hash(data.new_password)

    users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password_hash": hashed_password}}
    )

    return {"message": "Password updated successfully"}