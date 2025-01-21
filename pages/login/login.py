from flask import Blueprint, render_template

login_bp = Blueprint('login', __name__, template_folder='templates', static_folder='static')

@login_bp.route('/', methods=['GET'])
def create_login_page():
    return render_template('login.html')
