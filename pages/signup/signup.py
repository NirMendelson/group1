from flask import Blueprint, render_template, request, jsonify
from werkzeug.security import generate_password_hash
from bson.objectid import ObjectId

signup_bp = Blueprint('signup', __name__, template_folder='templates', static_folder='static')

@signup_bp.route('/', methods=['GET'])
def create_signup_page():
    """Render the sign-up page."""
    return render_template('signup.html')

@signup_bp.route('/', methods=['POST'])
def handle_signup():
    """Handle the sign-up form submission."""
    db = signup_bp.db  # Access the database passed from app.py
    customers_collection = db['customers']  # Access the 'customers' collection

    try:
        # Parse the incoming JSON data
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Check required fields
        required_fields = ['phone', 'email', 'name', 'password', 'number', 'street', 'city', 'supermarket']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        # Check if the email is already registered
        if customers_collection.find_one({"email": data['email']}):
            return jsonify({"error": "Email is already registered."}), 400

        # Hash the password
        hashed_password = generate_password_hash(data['password'])

        # Prepare the document for MongoDB
        customer_data = {
            "phone": data['phone'],
            "email": data['email'],
            "name": data['name'],
            "password": hashed_password,  # Store the hashed password
            "address": {
                "number": data['number'],
                "street": data['street'],
                "city": data['city']
            },
            "supermarket": data['supermarket']
        }

        # Insert the data into the 'customers' collection
        result = customers_collection.insert_one(customer_data)

        # Respond with success
        return jsonify({"success": "ההרשמה בוצעה בהצלחה", "customer_id": str(result.inserted_id)}), 201

    except Exception as e:
        # Handle unexpected errors
        return jsonify({"error": str(e)}), 500
