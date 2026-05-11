from pymongo import MongoClient
from datetime import datetime

# 🔌 Connect to MongoDB
client = MongoClient("mongodb+srv://fityro_user:tNXmU1sVnrBltNgi@cluster0.7zsbalr.mongodb.net/?appName=Cluster0")
db = client["fityro_db"]

users_collection = db["users"]

# ✅ Save user profile
def save_user_profile(profile_data):
    # prevent duplicate users (based on email)
    existing_user = users_collection.find_one({"email": profile_data["email"]})
    
    if existing_user:
        users_collection.update_one(
            {"email": profile_data["email"]},
            {"$set": profile_data}
        )
        return "updated"
    
    profile_data["created_at"] = datetime.utcnow()
    result = users_collection.insert_one(profile_data)
    return str(result.inserted_id)


# ✅ Get user profile
def get_user_profile(email):
    user = users_collection.find_one({"email": email}, {"_id": 0})
    return user


# ✅ Update recommended size
def update_user_size(email, sizes):
    users_collection.update_one(
        {"email": email},
        {"$set": {"preferred_sizes": sizes}}
    )
