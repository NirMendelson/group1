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
        if 'email' not in session:
            return jsonify({"error": "הירשם או התחבר כדי לבצע הזמנה"}), 401

        try:
            db = delivery_bp.db
            orders_col = db['orders']

            data = request.get_json()
            print("Received data:", data)

            required_fields = ('supermarket', 'date', 'time')
            if not all(k in data for k in required_fields):
                return jsonify({"error": "Missing required fields"}), 400

            try:
                delivery_date = datetime.strptime(data['date'], "%Y-%m-%d").date()
            except ValueError:
                return jsonify({"error": "Invalid date format. Please use YYYY-MM-DD."}), 400

            today = datetime.today().date()
            max_date = today + timedelta(days=30)
            if not (today <= delivery_date <= max_date):
                return jsonify({"error": "תאריך המשלוח חייב להיות בטווח של 30 הימים הקרובים."}), 400

            valid_times = [f"{h:02d}:{m:02d}" for h in range(8, 21) for m in [0, 15, 30, 45]]
            if data['time'] not in valid_times:
                return jsonify({"error": "שעת המשלוח חייבת להיות בין 08:00 ל-21:00 עם דקות 00, 15, 30 או 45 בלבד."}), 400

            user_email = session['email']

            # **Check if the user already has a future delivery**
            existing_order = orders_col.find_one({"email": user_email, "date": {"$gte": today.strftime("%Y-%m-%d")}})
            if existing_order:
                return jsonify({"error": "אתה יכול ליצור משלוח אחד בלבד בכל פעם. אם ברצונך לשנות את ההזמנה שלך, ניתן לעשות זאת בדף הפרופיל"}), 400

            data['email'] = user_email

            order_id = orders_col.insert_one(data).inserted_id

            return jsonify({"message": "המשלוח נוצר בהצלחה", "order_id": str(order_id)})
        
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"error": "אירעה שגיאה בשליחת הנתונים, אנא נסה שוב"}), 500
