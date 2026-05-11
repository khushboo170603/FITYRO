from fastapi import APIRouter, HTTPException
from datetime import datetime
import requests

from auth import create_access_token
from users_db import users_collection

router = APIRouter()


@router.post("/google-login")
def google_login(data: dict):
    try:
        # 🔥 Get user info from Google using access token
        google_user = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {data['access_token']}"}
        ).json()

        email = google_user.get("email")
        name = google_user.get("name", "User")
        picture = google_user.get("picture")
        google_id = google_user.get("sub")

        if not email:
            raise HTTPException(status_code=400, detail="Email not found")

        # 🔍 Check if user exists
        user = users_collection.find_one({"email": email})

        if user:
            access_token = create_access_token({
                "sub": email,
                "user_id": str(user["_id"]),
                "role": user.get("role", "user")
            })
            return {"access_token": access_token}

        # 🆕 Create new user
        new_user = {
            "name": name,
            "email": email,
            "password_hash": None,
            "google_id": google_id,
            "auth_provider": "google",
            "role": "user",
            "created_at": datetime.utcnow(),

            "profile": {
                "gender": None,
                "date_of_birth": None,
                "profile_image": picture,
                "measurements": {}
            }
        }

        result = users_collection.insert_one(new_user)

        access_token = create_access_token({
            "sub": email,
            "user_id": str(result.inserted_id),
            "role": "user"
        })

        return {"access_token": access_token}

    except Exception as e:
        print("Google login error:", e)
        raise HTTPException(status_code=401, detail="Google login failed")
