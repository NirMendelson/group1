from flask import Blueprint, request, jsonify, render_template
from utilities.db_connector import get_db

# Define the Blueprint for the delivery module
delivery_bp = Blueprint('delivery', __name__, template_folder='templates', static_folder='static')

@delivery_bp.route('/create-delivery', methods=['GET'])
def create_delivery_page():
    return render_template('create-delivery.html')

@delivery_bp.route('/create-delivery', methods=['POST'])
def create_delivery():
    try:
        # Connect to the database
        db = get_db()
        orders_col = db['orders']

        # Get the data from the request
        data = request.get_json()
        print("Received data:", data)  # Debugging log

        # Validate the required fields
        if not all(k in data for k in ('supermarket', 'date', 'time')):
            return jsonify({"error": "Missing required fields"}), 400

        # Insert the data into the orders collection
        order_id = orders_col.insert_one(data).inserted_id

        return jsonify({"message": "המשלוח נוצר בהצלחה", "order_id": str(order_id)})
    except Exception as e:
        print(f"Error: {e}")  # Log the error for debugging
        return jsonify({"error": "Failed to create delivery"}), 500
