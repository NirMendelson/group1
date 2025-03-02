from flask import Blueprint, render_template, session

index_bp = Blueprint(
    'index',
    __name__,
    template_folder='templates',
    static_folder='static',
    static_url_path='/index/static'  # You can choose a path name you like
)

@index_bp.route('/', methods=['GET'])
def create_index_page():
    """Render the index page with the logged-in state."""
    # Check if the user is logged in
    is_logged_in = 'email' in session
    return render_template('index.html', is_logged_in=is_logged_in)

@index_bp.route('/debug-url')
def debug_url():
    from flask import url_for
    return url_for('index.static', filename='css/index.css')
