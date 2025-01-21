from flask import Flask
from flask_cors import CORS
from pages.delivery.delivery import delivery_bp
from pages.signup.signup import signup_bp
from pages.login.login import login_bp
from pages.index.index import index_bp
from utilities.db_connector import get_db  # Import the database connection utility

app = Flask(__name__)
CORS(app)  # Enable CORS if needed

# Database connection
db = get_db()

# Register Blueprints
app.register_blueprint(delivery_bp, url_prefix='/delivery')  # Routes under /delivery
app.register_blueprint(signup_bp, url_prefix='/signup')      # Routes under /signup
app.register_blueprint(login_bp, url_prefix='/login')        # Routes under /login
app.register_blueprint(index_bp, url_prefix='/')             # Routes under /

# Pass the database to each blueprint
signup_bp.db = db
login_bp.db = db

# Run the Flask App
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
