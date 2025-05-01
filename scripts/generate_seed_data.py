from datetime import datetime, timezone, timedelta
from bson import ObjectId
from pymongo import MongoClient
from faker import Faker
from dotenv import load_dotenv
import os
import random
from collections import defaultdict

# Load environment variables
load_dotenv()
mongo_uri = os.getenv("MONGO_URI", "mongodb://root:example@localhost:27017")
client = MongoClient(mongo_uri)
db = client["booktable"]
fake = Faker()

# Clean existing data
for collection in ["users", "restaurant", "table", "reservations", "review"]:
    db[collection].delete_many({})

roles = ["ADMIN", "RESTAURANT_MANAGER", "CUSTOMER"]
users_by_role = {role: [] for role in roles}

# Users
for role in roles:
    for _ in range(3):
        user = {
            "_id": ObjectId(),
            "name": fake.name(),
            "email": fake.email(),
            "password": "hashedpassword",
            "roles": [role],
            "provider": "LOCAL"
        }
        db["users"].insert_one(user)
        users_by_role[role].append(user)

# Restaurants & Tables
restaurants = []
for manager in users_by_role["RESTAURANT_MANAGER"]:
    for _ in range(2):
        restaurant = {
            "_id": ObjectId(),
            "name": fake.company(),
            "description": fake.text(),
            "addressStreet": fake.street_address(),
            "addressCity": fake.city(),
            "addressState": fake.state_abbr(),
            "addressZip": fake.zipcode(),
            "phone": fake.phone_number(),
            "email": fake.company_email(),
            "imageUrl": f"https://picsum.photos/seed/{random.randint(1000,9999)}/600/400",
            "managerId": manager["_id"],
            "coordinatesLatitude": float(round(fake.latitude(), 6)),
            "coordinatesLongitude": float(round(fake.longitude(), 6)),
            "cuisines": fake.words(nb=3),
            "createdAt": datetime.now(timezone.utc),
            "openingHour": "10:00:00",
            "closingHour": "22:00:00",
            "averageRating": 0.0,
            "reviewCount": 0,
            "approved": True
        }
        db["restaurant"].insert_one(restaurant)
        restaurants.append(restaurant)

        for i in range(5):
            table = {
                "_id": ObjectId(),
                "restaurantId": restaurant["_id"],
                "tableNumber": str(i + 1),
                "capacity": random.choice([2, 4, 6]),
                "isActive": True
            }
            db["table"].insert_one(table)

# Reservations & Reviews
for customer in users_by_role["CUSTOMER"]:
    for _ in range(4):
        restaurant = random.choice(restaurants)
        table = db["table"].find_one({"restaurantId": restaurant["_id"]})
        reservation_date = datetime.now(timezone.utc) - timedelta(days=random.randint(0, 30))
        reservation = {
            "_id": ObjectId(),
            "customerId": customer["_id"],
            "restaurantId": restaurant["_id"],
            "tableId": table["_id"],
            "date": reservation_date.date().isoformat(),
            "startSlotTime": "18:00:00",
            "endSlotTime": "19:30:00",
            "partySize": table["capacity"],
            "status": "CONFIRMED",
            "totalAmount": float(round(random.uniform(50, 150), 2)),
            "createdAt": reservation_date
        }
        db["reservations"].insert_one(reservation)

        review = {
            "_id": ObjectId(),
            "restaurantId": restaurant["_id"],
            "customerId": customer["_id"],
            "rating": random.randint(3, 5),
            "comment": fake.sentence(),
            "createdAt": reservation_date
        }
        db["review"].insert_one(review)

print("Sample data successfully generated.")


# Calculate and update restaurant ratings and review counts
# Step 1: Collect ratings for each restaurant
ratings_map = defaultdict(list)
for review in db["review"].find({}):
    restaurant_id = review["restaurantId"]
    ratings_map[restaurant_id].append(review["rating"])

# Step 2: Calculate and update each restaurant
for restaurant_id, ratings in ratings_map.items():
    review_count = len(ratings)
    average_rating = round(sum(ratings) / review_count, 2)

    db["restaurant"].update_one(
        {"_id": restaurant_id},
        {
            "$set": {
                "averageRating": average_rating,
                "reviewCount": review_count
            }
        }
    )

print("Restaurant ratings and review counts updated.")
