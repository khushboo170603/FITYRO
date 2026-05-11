from pymongo import MongoClient
import os

MONGO_URI = "mongodb+srv://fityro_user:tNXmU1sVnrBltNgi@cluster0.7zsbalr.mongodb.net/?appName=Cluster0"

client = MongoClient(MONGO_URI)

db = client["fityro_db"]

# Collections
users_collection = db["users"]
products_collection = db["products"]
tryon_collection = db["tryon_history"]
saved_looks_collection = db["saved_looks"]
analytics_collection = db["analytics"]
feedback_collection = db["feedback"]

print("✅ Connected to MongoDB")
