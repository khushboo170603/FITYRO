from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Body, APIRouter, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer
from PIL import Image
import io, os, cv2, uuid, shutil, base64, joblib, time
import numpy as np
from typing import Optional
import asyncio, requests
import mediapipe as mp
from utils.tryon import run_tryon
from utils.ootd_tryon import run_ootd_tryon
from pymongo import MongoClient
from products import router as products_router
from tryon_history import router as history_router
from routes.google_auth import router as google_router
from datetime import datetime
from routes.auth_routes import router as auth_router
from routes.profile_routes import router as profile_router
from routes.tryon_routes import router as tryon_router
from routes.analytics_routes import router as analytics_router
from routes.catalogue import router as catalogue_router
from auth import create_access_token, hash_password, verify_password, get_current_user
from users_db import save_user_profile, get_user_profile, users_collection
from database import tryon_collection
from routes.tryon_routes import router as tryon_router
from routes.admin_users import router as admin_users_router
from bson import ObjectId
asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

app = FastAPI()
security = HTTPBearer()


client = MongoClient("mongodb+srv://fityro_user:tNXmU1sVnrBltNgi@cluster0.7zsbalr.mongodb.net/?appName=Cluster0")
db = client["fityro_db"]
app.include_router(products_router)
app.include_router(history_router)
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(analytics_router)
app.include_router(google_router) 
app.include_router(tryon_router)
app.include_router(admin_users_router)
app.include_router(catalogue_router)


@app.get("/")
def home():
    return {"message": "API working"}

@app.post("/test-insert")
def test_insert():
    products = db["products"]

    products.insert_one({
        "name": "Test Product",
        "category": "top"
    })

    return {"message": "Inserted successfully"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/download/{filename}")
async def download_image(filename: str):

    file_path = os.path.join("static", filename)

    return FileResponse(
        path=file_path,
        media_type="application/octet-stream",
        filename=filename
    )
# Load trained model
model = joblib.load("size_model.pkl")

# ------------------ MOCK DATABASES ------------------

products_db = [
    {"id": 1, "name": "Classic Blue T-Shirt", "category": "Topwear", "image_url": "/i1.jpg", "sizes": ["S","M","L","XL"]},
    {"id": 2, "name": "Casual White Shirt", "category": "Topwear", "image_url": "/i2.jpg", "sizes": ["M","L","XL"]},
    {"id": 3, "name": "Brown Jacket", "category": "Outerwear", "image_url": "/i3.jpg", "sizes": ["S","M","L"]}
]

# ------------------ TRYON (WORKING) ------------------
@app.post("/tryon")
async def tryon(
    person: UploadFile = File(...),
    cloth: Optional[UploadFile] = File(None),
    cloth_url: Optional[str] = Form(None),
    product_id: Optional[str] = Form(None),
    user=Depends(get_current_user)
):

    import traceback

    os.makedirs("temp", exist_ok=True)
    os.makedirs("static", exist_ok=True)

    person_path = f"temp/{uuid.uuid4()}_person.jpg"
    cloth_path = f"temp/{uuid.uuid4()}_cloth.jpg"

    # ---------------- PERSON ----------------

    with open(person_path, "wb") as f:
        f.write(await person.read())

    person_filename = f"person_{uuid.uuid4()}.jpg"

    saved_person_path = os.path.join(
        "static",
        person_filename
    )

    shutil.copy(person_path, saved_person_path)

    person_image_url = f"/static/{person_filename}"

    # ---------------- CLOTH ----------------

    if cloth:

        with open(cloth_path, "wb") as f:
            f.write(await cloth.read())

        cloth_filename = f"cloth_{uuid.uuid4()}.jpg"

        saved_cloth_path = os.path.join(
            "static",
            cloth_filename
        )

        shutil.copy(cloth_path, saved_cloth_path)

        cloth_image_url = f"/static/{cloth_filename}"

    elif cloth_url:

        response = requests.get(cloth_url)

        if response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="Failed to fetch cloth image"
            )

        with open(cloth_path, "wb") as f:
            f.write(response.content)

        cloth_filename = f"cloth_{uuid.uuid4()}.jpg"

        saved_cloth_path = os.path.join(
            "static",
            cloth_filename
        )

        with open(saved_cloth_path, "wb") as img:
            img.write(response.content)

        cloth_image_url = f"/static/{cloth_filename}"

    else:

        raise HTTPException(
            status_code=400,
            detail="No cloth provided"
        )

    # ---------------- PRODUCT ----------------

    if product_id:

        product = db["products"].find_one({
            "_id": ObjectId(product_id)
        })

    else:

        product = None

    # ---------------- CATEGORY ----------------

    product_category = (
        str(product.get("category", "")).strip().lower()
        if product else ""
    )

    if product_category in [
        "top",
        "topwear",
        "shirt",
        "hoodie"
    ]:

        category = "Upper-body"

    elif product_category in [
        "bottom",
        "bottomwear",
        "pants",
        "jeans"
    ]:

        category = "Lower-body"

    elif product_category in [
        "dress",
        "dresses",
        "gown"
    ]:
        category = "Dresses"

    else:

        category = "Upper-body"

    # ---------------- TRYON ----------------

    try:
        print("PRODUCT:", product)
        print("PRODUCT CATEGORY:", product_category)
        print("FINAL AI CATEGORY:", category)
        start = time.time()
        output_path = run_ootd_tryon(
            person_path,
            cloth_path,
            category
        )
        end = time.time()
        generation_time = round(end - start, 2)

        filename = (
            f"tryon_{user['user_id']}_{uuid.uuid4()}.png"
        )

        static_path = os.path.join(
            "static",
            filename
        )

        shutil.copy(output_path, static_path)
        

        tryon_collection.insert_one({

            "user_id": str(user["user_id"]),
            "user_email": user["email"],

            "product_id": product_id,
            "product_name": product["name"] if product else "Outfit",
            "person_image": person_image_url,
            "cloth_image": cloth_image_url,
            "result_image": f"/static/{filename}",

            "category": category,
            "status": "success",

            "created_at": datetime.utcnow(),
            "generation_time": generation_time,
        })

        return {

            "success": True,

            "person_image": person_image_url,
            "cloth_image": cloth_image_url,
            "result_image": f"/static/{filename}",

            "category": category,
            "status": "success"
        }

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }
        
    # ------------------ PRODUCTS ------------------
class Product(BaseModel):
    id: int
    name: str
    category: str
    image_url: str
    sizes: list[str]

@app.get("/products")
def get_products():
    return products_db

@app.get("/products/{product_id}")
def get_product(product_id: int):
    for product in products_db:
        if product["id"] == product_id:
            return product
    raise HTTPException(status_code=404, detail="Product not found")