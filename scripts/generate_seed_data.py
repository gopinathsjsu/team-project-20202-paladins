import os
import random
from datetime import datetime, timezone, timedelta, time
from bson import ObjectId
from pymongo import MongoClient
from faker import Faker
from dotenv import load_dotenv
from bcrypt import hashpw, gensalt

# Load .env
load_dotenv()
mongo_uri = os.getenv("MONGO_URI", "mongodb://root:example@localhost:27017")
client = MongoClient(mongo_uri)
db = client["booktable"]
fake = Faker()

# Clear existing data
collections = ["users", "restaurant", "table", "reservations", "review"]
for col in collections:
    db[col].delete_many({})

# Encode password
def encode_password(raw_password):
    return hashpw(raw_password.encode('utf-8'), gensalt()).decode('utf-8')

# Users
roles = ["ADMIN", "RESTAURANT_MANAGER", "CUSTOMER"]
users_by_role = {role: [] for role in roles}
for role in roles:
    for _ in range(3):
        user = {
            "_id": ObjectId(),
            "name": fake.name(),
            "email": fake.unique.email(),
            "password": encode_password(role.lower()),
            "roles": [role],
            "provider": "LOCAL"
        }
        db["users"].insert_one(user)
        users_by_role[role].append(user)

# Opening hours group
opening_hours = [time(10, 0), time(9, 0), time(8, 0)]

image_urls = [
    "https://images.unsplash.com/photo-1595917248955-a96ace4780b6?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1687068328974-13261a846e58?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1681841594224-ad729a249113?q=80&w=2854&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D"
]

# Restaurants & Tables
restaurants = []
tables_by_restaurant = {}
for idx in range(30):
    manager = random.choice(users_by_role["RESTAURANT_MANAGER"])
    restaurant_id = ObjectId()
    opening_hour = opening_hours[idx // 10]
    closing_hour = (datetime.combine(datetime.today(), opening_hour) + timedelta(hours=12)).time()

    restaurant = {
        "_id": restaurant_id,
        "name": fake.company(),
        "description": fake.text(),
        "addressStreet": fake.street_address(),
        "addressCity": fake.city(),
        "addressState": fake.state_abbr(),
        "addressZip": fake.zipcode(),
        "phone": fake.phone_number(),
        "email": fake.company_email(),
        "imageUrl": random.choice(image_urls),
        "managerId": str(manager["_id"]),
        "coordinatesLatitude": float(fake.latitude()),
        "coordinatesLongitude": float(fake.longitude()),
        "cuisines": fake.words(nb=3),
        "createdAt": datetime.now(timezone.utc),
        "openingHour": datetime.combine(datetime.today(), opening_hour).replace(tzinfo=timezone.utc),
        "closingHour": datetime.combine(datetime.today(), closing_hour).replace(tzinfo=timezone.utc),
        "averageRating": 0.0,
        "reviewCount": 0,
        "approved": True
    }

    db["restaurant"].insert_one(restaurant)
    restaurants.append(restaurant)

    tables = []
    for i in range(5):
        table = {
            "_id": ObjectId(),
            "restaurantId": restaurant_id,
            "tableNumber": str(i + 1),
            "capacity": random.choice([2, 4, 6]),
            "isActive": True
        }
        db["table"].insert_one(table)
        tables.append(table)
    tables_by_restaurant[restaurant_id] = tables

# Reservations and Reviews
for customer in users_by_role["CUSTOMER"]:
    for _ in range(4):
        restaurant = random.choice(restaurants)
        tables = tables_by_restaurant[restaurant["_id"]]
        table = random.choice(tables)
        date = datetime.now(timezone.utc) - timedelta(days=random.randint(0, 30))
        start_time = time(18, 0)
        end_time = time(19, 30)

        reservation = {
            "_id": ObjectId(),
            "customerId": customer["_id"],
            "restaurantId": restaurant["_id"],
            "tableId": table["_id"],
            "date": date.date().isoformat(),
            "startSlotTime": datetime.combine(date.date(), start_time).replace(tzinfo=timezone.utc),
            "endSlotTime": datetime.combine(date.date(), end_time).replace(tzinfo=timezone.utc),
            "partySize": table["capacity"],
            "status": "CONFIRMED",
            "totalAmount": round(random.uniform(50, 150), 2),
            "createdAt": date
        }
        db["reservations"].insert_one(reservation)

        rating = random.randint(3, 5)
        review = {
            "_id": ObjectId(),
            "restaurantId": restaurant["_id"],
            "customerId": customer["_id"],
            "rating": rating,
            "comment": fake.sentence(),
            "createdAt": date
        }
        db["review"].insert_one(review)

        # Aggregate for averageRating
        restaurant["reviewCount"] += 1
        restaurant["averageRating"] += rating

# Final update of rating fields
for r in restaurants:
    if r["reviewCount"] > 0:
        avg = r["averageRating"] / r["reviewCount"]
        db["restaurant"].update_one(
            {"_id": r["_id"]},
            {"$set": {
                "averageRating": round(avg, 2),
                "reviewCount": r["reviewCount"]
            }}
        )

print("Sample data inserted successfully into MongoDB.")
