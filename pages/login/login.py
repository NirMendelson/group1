from flask import Blueprint, render_template, request, jsonify
from werkzeug.security import check_password_hash

login_bp = Blueprint('login', __name__, template_folder='templates', static_folder='static')

@login_bp.route('/', methods=['GET'])
def create_login_page():
    """Render the login page."""
    return render_template('login.html')

@login_bp.route('/', methods=['POST'])
def login():
    """Handle user login."""
    # Retrieve the database object from the blueprint
    db = login_bp.db
    customers_collection = db["customers"]

    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Both email and password are required."}), 400

    # Find customer by email
    customer = customers_collection.find_one({"email": email})
    if not customer:
        return jsonify({"success": False, "message": "User not found."}), 404

    # Check password hash
    if not check_password_hash(customer["password"], password):
        return jsonify({"success": False, "message": "Incorrect password."}), 401

    # Successful login
    return jsonify({"success": True, "message": "Login successful."}), 200
