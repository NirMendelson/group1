import os
from dotenv import load_dotenv

load_dotenv()

# Secret key setting from .env for Flask sessions
SECRET_KEY = os.environ.get('SECRET_KEY')

# DB base configuration from .env for modularity and security
DB = {
    'host': os.environ.get('MONGO_CLUSTER'),    # e.g. group1.rcded.mongodb.net
    'user': os.environ.get('DB_USERNAME'),      # e.g. groupOne
    'password': os.environ.get('DB_PASSWORD'),  # e.g. ablGBS3y798kN20K
    'database': os.environ.get('MONGO_DB')      # e.g. group1
}
