import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

###### App setup
load_dotenv()  # Load environment variables from .env
app = Flask(__name__)
app.config.from_pyfile('settings.py')  # Reads additional config from settings.py

# If your settings.py doesn't set SECRET_KEY, we pull it from .env:
app.secret_key = os.getenv("SECRET_KEY")

CORS(app)  # Enable Cross-Origin Resource Sharing if needed

###### Database connection
from utilities.db_connector import get_db
db = get_db()

###### Pages
## Delivery
from pages.delivery.delivery import delivery_bp
app.register_blueprint(delivery_bp, url_prefix='/delivery')
delivery_bp.db = db

## Signup
from pages.signup.signup import signup_bp
app.register_blueprint(signup_bp, url_prefix='/signup')
signup_bp.db = db

## Login
from pages.login.login import login_bp
app.register_blueprint(login_bp, url_prefix='/login')
login_bp.db = db

## Index
from pages.index.index import index_bp
app.register_blueprint(index_bp, url_prefix='/')
index_bp.db = db

## Profile
from pages.profile.profile import profile_bp
app.register_blueprint(profile_bp, url_prefix='/profile')
profile_bp.db = db

###### Run the Flask App
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
