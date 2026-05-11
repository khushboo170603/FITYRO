from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import StreamingResponse
from datetime import datetime
import os, io, cv2
from bson import ObjectId 
from auth import get_current_user
from database import db

router = APIRouter()

tryon_collection = db["tryon_history"]
products_collection = db["products"]

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PRODUCT_NAMES = {
    1: "White Graphic Tee",
    2: "Denim Jacket",
    3: "Casual Shirt",
}

@router.get("/tryon-history")
def get_tryon_history(user=Depends(get_current_user)):
    user_id = str(user["user_id"])

    history = list(
        tryon_collection.find({"user_id": str(user_id)}).sort("created_at", -1)
    )

    for item in history:
        item["_id"] = str(item["_id"])
        if not item.get("product_name") and item.get("product_id"):
            product = db["products"].find_one({
                "_id": ObjectId(item["product_id"])
            })

            if product:
                item["product_name"] = product["name"]

    return history
        

@router.delete("/delete-tryon/{id}")
def delete_tryon(id: str, user=Depends(get_current_user)):
    result = tryon_collection.delete_one({
        "_id": ObjectId(id),
        "user_id": user["user_id"]
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")

    return {"message": "Deleted"}
