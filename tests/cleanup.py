import asyncio
from dotenv import dotenv_values
from motor.motor_asyncio import AsyncIOMotorClient

benv = dotenv_values("/app/backend/.env")

async def main():
    c = AsyncIOMotorClient(benv["MONGO_URL"])
    db = c[benv["DB_NAME"]]
    r1 = await db.login_attempts.delete_many({"identifier": {"$regex": "qa_lockout_probe"}})
    r2 = await db.enquiries.delete_many({"$or": [{"name": {"$regex": "^TEST_"}}, {"email": "qa_rfq_marker@example.com"}]})
    r3 = await db.status_checks.delete_many({"client_name": {"$regex": "^TEST_"}})
    img = await db.site_config.find_one({"key": "images"}, {"_id": 0})
    print("deleted attempts:", r1.deleted_count, "enquiries:", r2.deleted_count, "status:", r3.deleted_count)
    print("site_config images:", img)
    c.close()

asyncio.run(main())
