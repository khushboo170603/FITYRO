from fastapi import APIRouter
from database import db
from datetime import datetime

router = APIRouter()

history_collection = db["tryon_history"]

@router.post("/save-tryon")
def save_tryon(data: dict):
    data["created_at"] = datetime.now().isoformat()
    result = history_collection.insert_one(data)
    return {"message": "Saved", "id": str(result.inserted_id)}