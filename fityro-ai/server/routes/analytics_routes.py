from fastapi import APIRouter, Depends
from database import db
from auth import get_current_user, admin_only
from datetime import datetime, timedelta
from gradio_client import Client

router = APIRouter()

# Collections
users_collection = db["users"]
tryon_collection = db["tryon_history"]
profiles_collection = db["profiles"]  # optional


# ================================
# ✅ 1. SUMMARY (Top Cards)
# ================================
@router.get("/analytics/summary")
async def analytics_summary():

    total_users = users_collection.count_documents({})

    total_tryons = tryon_collection.count_documents({
        "status": "success"
    })

    failed_tryons = tryon_collection.count_documents({
        "status": "failed"
    })

    last_5_min = datetime.utcnow() - timedelta(minutes=5)

    active_users = users_collection.count_documents({
        "role": {"$ne": "admin"},
        "last_seen": {
            "$gte": last_5_min
        }
    })
    

    # ✅ Top Category
    top_pipeline = [
        {
            "$group": {
                "_id": "$category",
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {"count": -1}
        },
        {
            "$limit": 1
        }
    ]

    top = list(
        tryon_collection.aggregate(top_pipeline)
    )

    top_category = (
        top[0]["_id"]
        if top else "Topwear"
    )

    # ✅ Average Generation Time
    avg_pipeline = [
        {
            "$group": {
                "_id": None,
                "avgTime": {
                    "$avg": "$generation_time"
                }
            }
        }
    ]

    avg = list(
        tryon_collection.aggregate(avg_pipeline)
    )

    avg_time = (
        round(avg[0]["avgTime"], 2)
        if avg and avg[0]["avgTime"]
        else 0
    )

    return {
        "total_users": total_users,
        "total_tryons": total_tryons,
        "failed_tryons": failed_tryons,
        "active_users": active_users,
        "top_category": top_category,
        "avg_generation_time": avg_time
    }

# ================================
# ✅ 2. ACTIVE USERS (Last 24 hrs)
# ================================
@router.get("/analytics/active-users")
def active_users(user=Depends(get_current_user)):
    last_5_min = datetime.utcnow() - timedelta(minutes=5)

    active = users_collection.count_documents({
        "role": {"$ne": "admin"},
        "last_seen": {
            "$gte": last_5_min
        }
    })
    return {"active_users": active}


# ================================
# ✅ 3. DAILY USAGE (Line Chart)
# ================================
@router.get("/analytics/daily-usage")
def daily_usage(user=Depends(get_current_user)):
    last_7_days = datetime.utcnow() - timedelta(days=7)

    pipeline = [
        {"$match": {"created_at": {"$gte": last_7_days}}},
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$created_at"
                    }
                },
                "count": {"$sum": 1},
            }
        },
        {"$sort": {"_id": 1}},
    ]

    data = list(tryon_collection.aggregate(pipeline))

    return [
        {"date": item["_id"], "count": item["count"]}
        for item in data
    ]


# ================================
# ✅ 4. TOP OUTFITS (Bar Chart)
# ================================
@router.get("/analytics/top-outfits")
def get_top_outfits():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": "$category",
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]

        results = list(tryon_collection.aggregate(pipeline))

        return [
            {
                "category": item["_id"],
                "count": item["count"]
            }
            for item in results
        ]

    except Exception as e:
        return {"error": str(e)}

@router.get("/analytics/success-rate")
def success_rate(user=Depends(get_current_user)):
    total = tryon_collection.count_documents({})

    success = tryon_collection.count_documents({
        "product_id": {"$ne": None}
    })

    rate = (success / total * 100) if total > 0 else 0

    return {"success_rate": round(rate, 2)}

@router.get("/debug/tryons")
def debug_tryons():
    data = list(tryon_collection.find().limit(5))
    for d in data:
        d["_id"] = str(d["_id"])
    return data

# ================================
# ✅ 6. RECENT ACTIVITY
# ================================
@router.get("/analytics/recent-activity")
def recent_activity(user=Depends(get_current_user)):

    recent = list(
        tryon_collection.find({})
        .sort("created_at", -1)
        .limit(5)
    )

    for item in recent:
        item["_id"] = str(item["_id"])

    return recent

@router.get("/health")
def health_check():

    # ✅ MongoDB check
    try:
        db.command("ping")
        mongo_ok = True
    except:
        mongo_ok = False

    # ✅ AI server check
    try:
        Client("levihsu/OOTDiffusion")
        ai_ok = True
    except:
        ai_ok = False

    return {
        "ai_server": ai_ok,
        "mongodb": mongo_ok,
        "api": True
    }