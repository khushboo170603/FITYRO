print("🔥 AUTH.PY LOADED FROM:", __file__)

import hashlib
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from database import users_collection
from bson import ObjectId

security = HTTPBearer()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

SECRET_KEY = "fityro-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 🔐 Fix for bcrypt 72-byte limit (SAFE approach)
def safe_password(password: str) -> str:
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password too long (max 72 characters).")
    return password

def hash_password(password: str):
    return pwd_context.hash(safe_password(password))

def verify_password(password: str, hashed: str):
    return pwd_context.verify(safe_password(password), hashed)


# 🔐 Get current user from token
def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        token = None

        # ✅ Try normal extraction
        if credentials:
            token = credentials.credentials
            print("✅ TOKEN via HTTPBearer:", token)

        # 🔥 Fallback if HTTPBearer fails
        if not token:
            auth_header = request.headers.get("authorization")
            print("⚠️ RAW HEADER:", auth_header)

            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            raise HTTPException(status_code=401, detail="Token missing")

        # ✅ Decode token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("🔥 PAYLOAD:", payload)

        email = payload.get("sub")

        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = users_collection.find_one({"email": email})

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        # ✅ Update last activity
        users_collection.update_one(
            {
                "_id": ObjectId(user["_id"])
            },
            {
                "$set": {
                    "last_seen": datetime.utcnow()
                }
            }
        )

        return {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "role": payload.get("role", "user")
        }

    except JWTError as e:
        print("JWT ERROR:", str(e))
        raise HTTPException(status_code=401, detail="Invalid token")
# 🔒 Admin-only protection
def admin_only(user: dict):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# 🎟️ Create JWT token (FIXED)
def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
