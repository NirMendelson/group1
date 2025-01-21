from flask import Flask
from flask_cors import CORS
from pages.delivery.delivery import delivery_bp

app = Flask(__name__)
CORS(app)  # Enable CORS if needed

# Register the Blueprint for delivery
app.register_blueprint(delivery_bp, url_prefix='/delivery')

@app.route('/')
def index():
    return "Server is running!"

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
