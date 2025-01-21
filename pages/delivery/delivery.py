from flask import Blueprint, request, jsonify, render_template, session
# We will NOT directly import get_db if we attach it in app.py:
# from utilities.db_connector import get_db

delivery_bp = Blueprint('delivery', __name__, template_folder='templates', static_folder='static')

@delivery_bp.route('/', methods=['GET'])
def create_delivery_page():
    # Check if the user is logged in
    is_logged_in = 'email' in session
    return render_template('create-delivery.html', is_logged_in=is_logged_in)


@delivery_bp.route('/', methods=['POST'])
def create_delivery():
    """
    Create a new delivery (order). Requires the user to be logged in (session['email'])
    to associate the order with the customer.
    """
    # 1) Check if the user is logged in
    if 'email' not in session:
        return jsonify({"error": "הירשם או התחבר כדי לבצע הזמנה"}), 401

    try:
        # 2) Access the database from the blueprint
        db = delivery_bp.db
        orders_col = db['orders']

        # 3) Get the data from the request
        data = request.get_json()
        print("Received data:", data)  # Debugging log

        # 4) Validate the required fields
        required_fields = ('supermarket', 'date', 'time')
        if not all(k in data for k in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # 5) Add the user's email (foreign key) to the order data
        data['email'] = session['email']

        # 6) Insert the data into the orders collection
        order_id = orders_col.insert_one(data).inserted_id

        return jsonify({"message": "המשלוח נוצר בהצלחה", "order_id": str(order_id)})
    except Exception as e:
        print(f"Error: {e}")  # Log the error for debugging
        return jsonify({"error": "Failed to create delivery"}), 500
