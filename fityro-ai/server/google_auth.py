from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from firebase_admin import auth
from auth import create_access_token
router = APIRouter()

class TokenRequest(BaseModel):
    token: str

@router.post("/google-login")
def google_login(data: TokenRequest):
    try:
        decoded_token = auth.verify_id_token(data.token)

        uid = decoded_token["uid"]
        email = decoded_token.get("email")

        # 🔥 optional: store user in DB here

        access_token = create_access_token({"sub": email})

        return {
            "access_token": access_token,
            "email": email
        }

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
