from fastapi import APIRouter
from database import db

router = APIRouter()

products_collection = db["products"]

# Add product
@router.post("/add-product")
def add_product(product: dict):
    result = products_collection.insert_one(product)
    return {"message": "Product added", "id": str(result.inserted_id)}

# Get all products
@router.get("/get-products")
def get_products():
    products = []
    for item in products_collection.find():
        item["_id"] = str(item["_id"])
        products.append(item)
    return products

