import os
from pymongo import MongoClient
from urllib.parse import quote_plus
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Retrieve DB credentials from environment variables
username = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASSWORD")
cluster = os.getenv("MONGO_CLUSTER")
database_name = os.getenv("MONGO_DB")

# Ensure credentials are URL-encoded
encoded_username = quote_plus(username)
encoded_password = quote_plus(password)

# Construct the MongoDB URI
MONGO_URI = f"mongodb+srv://{encoded_username}:{encoded_password}@{cluster}/{database_name}?retryWrites=true&w=majority"

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[database_name]

def get_db():
    """Return the database connection."""
    return db
