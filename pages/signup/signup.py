from flask import Blueprint, render_template, request, jsonify, session
from werkzeug.security import generate_password_hash

signup_bp = Blueprint('signup', __name__, template_folder='templates', static_folder='static')

@signup_bp.route('/', methods=['GET'])
def create_signup_page():
    """Render the sign-up page with supermarket options."""
    db = signup_bp.db  # Access the database
    supermarkets_collection = db['supermarkets']  # Access the 'supermarkets' collection

    # Fetch all supermarkets and extract their names
    supermarkets = supermarkets_collection.find({}, {"name": 1, "_id": 0})
    supermarket_names = [supermarket["name"] for supermarket in supermarkets]

    return render_template('signup.html', supermarkets=supermarket_names)


@signup_bp.route('/', methods=['POST'])
def handle_signup():
    """Handle the sign-up form submission."""
    db = signup_bp.db  # Access the database passed from app.py
    customers_collection = db['customers']  # Access the 'customers' collection

    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ['phone', 'email', 'name', 'password', 'number', 'street', 'city', 'supermarket']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        if customers_collection.find_one({"email": data['email']}):
            return jsonify({"error": "Email is already registered."}), 400

        hashed_password = generate_password_hash(data['password'])

        customer_data = {
            "phone": data['phone'],
            "email": data['email'],
            "name": data['name'],
            "password": hashed_password,
            "address": {
                "number": data['number'],
                "street": data['street'],
                "city": data['city']
            },
            "supermarket": data['supermarket']
        }

        result = customers_collection.insert_one(customer_data)

        # Log in the user automatically
        session['email'] = data['email']

        # Respond with success and redirect to index
        return jsonify({"success": "ההרשמה בוצעה בהצלחה", "redirect": "/"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
