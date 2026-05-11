from fastapi import APIRouter, UploadFile, File, Form
from database import products_collection
from bson import ObjectId
import shutil
import os, json

router = APIRouter()

UPLOAD_DIR = "uploads"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


# ✅ GET ALL CLOTHES
@router.get("/catalogue")
async def get_catalogue():

    clothes = []

    for item in products_collection.find():

        clothes.append({
            "id": str(item["_id"]),
            "name": item.get("name"),
            "category": item.get("category"),
            "sizes": item.get("sizes", []),
            "image_url": item.get("image_url"),
        })

    return clothes


# ✅ ADD CLOTH
@router.post("/catalogue")
async def add_cloth(
    name: str = Form(...),
    category: str = Form(...),
    sizes: str = Form(...),
    image: UploadFile = File(...)
):

    sizes = json.loads(sizes)

    filepath = f"{UPLOAD_DIR}/{image.filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    cloth = {
        "name": name,
        "category": category,
        "sizes": sizes,
        "image_url": f"http://127.0.0.1:8000/uploads/{image.filename}"
    }

    result = products_collection.insert_one(cloth)

    return {
        "id": str(result.inserted_id),
        "name": cloth["name"],
        "category": cloth["category"],
        "sizes": cloth["sizes"],
        "image_url": cloth["image_url"]
    }


# ✅ DELETE CLOTH
@router.delete("/catalogue/{item_id}")
async def delete_cloth(item_id: str):

    products_collection.delete_one({
        "_id": ObjectId(item_id)
    })

    return {"message": "Deleted"}

@router.put("/catalogue/{item_id}")
async def update_cloth(
    item_id: str,
    name: str = Form(...),
    category: str = Form(...),
    sizes: str = Form(...),
    image: UploadFile = File(None)
):
    sizes = json.loads(sizes)
    update_data = {
        "name": name,
        "category": category,
        "sizes": sizes,
    }

    # ✅ if new image uploaded
    if image:

        filepath = f"{UPLOAD_DIR}/{image.filename}"

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        update_data["image_url"] = (
            f"http://127.0.0.1:8000/uploads/{image.filename}"
        )

    products_collection.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": update_data}
    )

    updated = products_collection.find_one({
        "_id": ObjectId(item_id)
    })

    return {
        "id": str(updated["_id"]),
        "name": updated.get("name"),
        "category": updated.get("category"),
        "sizes": updated.get("sizes"),
        "image_url": updated.get("image_url"),
    }