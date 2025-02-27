from flask import Blueprint, request, jsonify, render_template, session
from datetime import datetime, timedelta

delivery_bp = Blueprint('delivery', __name__, template_folder='templates', static_folder='static')

@delivery_bp.route('/', methods=['GET', 'POST'])
def create_delivery_page():
    if request.method == 'GET':
        # Check if the user is logged in
        is_logged_in = 'email' in session
        return render_template('create-delivery.html', is_logged_in=is_logged_in)
    
    elif request.method == 'POST':
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

            # 5) Validate that the date is within the next 30 days
            try:
                delivery_date = datetime.strptime(data['date'], "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "Invalid date format. Please use YYYY-MM-DD."}), 400

            today = datetime.today().date()
            max_date = today + timedelta(days=30)
            if not (today <= delivery_date <= max_date):
                return jsonify({"error": "תאריך המשלוח חייב להיות בטווח של 30 הימים הקרובים."}), 400

            # 6) Validate the time format
            valid_times = [f"{h:02d}:{m:02d}" for h in range(8, 21) for m in [0, 15, 30, 45]]
            if data['time'] not in valid_times:
                return jsonify({"error": "שעת המשלוח חייבת להיות בין 08:00 ל-21:00 עם דקות 00, 15, 30 או 45 בלבד."}), 400

            # 7) Add the user's email (foreign key) to the order data
            data['email'] = session['email']

            # 8) Insert the data into the orders collection
            order_id = orders_col.insert_one(data).inserted_id

            return jsonify({"message": "המשלוח נוצר בהצלחה", "order_id": str(order_id)})
        
        except Exception as e:
            print(f"Error: {e}")  # Log the error for debugging
            return jsonify({"error": "אירעה שגיאה בשליחת הנתונים, אנא נסה שוב"}), 500
