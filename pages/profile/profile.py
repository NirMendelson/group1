from flask import Blueprint, render_template, session, request, jsonify, redirect, url_for
from datetime import datetime
from bson import ObjectId  # Import ObjectId to handle MongoDB IDs

profile_bp = Blueprint('profile', __name__, template_folder='templates', static_folder='static')

@profile_bp.route('/', methods=['GET'])
def create_profile_page():
    """Render the profile page with user details and order history."""
    if 'email' not in session:
        return redirect(url_for('login.create_login_page'))

    db = profile_bp.db
    customers_collection = db['customers']
    supermarkets_collection = db['supermarkets']
    orders_collection = db['orders']

    # Fetch the logged-in customer's data
    customer = customers_collection.find_one({"email": session['email']})
    if not customer:
        return redirect(url_for('login.create_login_page'))

    # Fetch all supermarkets and extract their names
    supermarkets = supermarkets_collection.find({}, {"name": 1, "_id": 0})
    supermarket_names = [supermarket["name"] for supermarket in supermarkets]

    today = datetime.today().strftime("%Y-%m-%d")

    # Fetch the user's active order (order with a future delivery date)
    active_order = orders_collection.find_one(
        {"email": session['email'], "date": {"$gte": today}},
        sort=[("date", 1)]  # Sort by date ascending, to get the closest upcoming order
    )

    # Fetch past orders (orders with a date before today)
    past_orders = orders_collection.find(
        {"email": session['email'], "date": {"$lt": today}},
        sort=[("date", -1)]  # Sort by date descending, to show recent past orders first
    )

    return render_template(
        'profile.html',
        customer=customer,
        supermarkets=supermarket_names,
        is_logged_in=True,
        active_order=active_order,
        past_orders=list(past_orders)  # Convert cursor to a list
    )


@profile_bp.route('/delete_order/<order_id>', methods=['DELETE'])
def delete_order(order_id):
    """Deletes an active order."""
    if 'email' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    db = profile_bp.db
    orders_collection = db['orders']

    try:
        result = orders_collection.delete_one({"_id": ObjectId(order_id), "email": session['email']})
        if result.deleted_count == 1:
            return jsonify({"success": "Order deleted successfully."}), 200
        else:
            return jsonify({"error": "Order not found or not authorized to delete."}), 404
    except Exception as e:
        print(f"Error deleting order: {e}")
        return jsonify({"error": "Failed to delete order."}), 500
