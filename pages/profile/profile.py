from flask import Blueprint, render_template, session, request, jsonify, redirect, url_for

profile_bp = Blueprint('profile', __name__, template_folder='templates', static_folder='static')

@profile_bp.route('/', methods=['GET'])
def create_profile_page():
    """Render the profile page with user details."""
    if 'email' not in session:
        return redirect(url_for('login.create_login_page'))

    db = profile_bp.db
    customers_collection = db['customers']
    supermarkets_collection = db['supermarkets']

    # Fetch the logged-in customer's data
    customer = customers_collection.find_one({"email": session['email']})
    if not customer:
        return redirect(url_for('login.create_login_page'))

    # Fetch all supermarkets and extract their names
    supermarkets = supermarkets_collection.find({}, {"name": 1, "_id": 0})
    supermarket_names = [supermarket["name"] for supermarket in supermarkets]

    # Pass `is_logged_in` to the template
    is_logged_in = 'email' in session
    return render_template('profile.html', customer=customer, supermarkets=supermarket_names, is_logged_in=is_logged_in)



@profile_bp.route('/update', methods=['POST'])
def update_profile():
    """Update the user's profile."""
    if 'email' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    db = profile_bp.db
    customers_collection = db['customers']
    data = request.json

    # Update the customer's information
    update_result = customers_collection.update_one(
        {"email": session['email']},
        {"$set": {
            "name": data.get("name"),
            "phone": data.get("phone"),
            "address.number": data.get("number"),
            "address.street": data.get("street"),
            "address.city": data.get("city"),
            "supermarket": data.get("supermarket"),
        }}
    )

    if update_result.modified_count == 1:
        return jsonify({"success": "Profile updated successfully."}), 200
    return jsonify({"error": "Failed to update profile."}), 400

@profile_bp.route('/delete', methods=['POST'])
def delete_profile():
    """Delete the user's profile."""
    if 'email' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    db = profile_bp.db
    customers_collection = db['customers']

    # Delete the customer record
    delete_result = customers_collection.delete_one({"email": session['email']})

    if delete_result.deleted_count == 1:
        # Clear the session
        session.pop('email', None)
        return jsonify({"success": "User deleted successfully."}), 200
    return jsonify({"error": "Failed to delete user."}), 400
