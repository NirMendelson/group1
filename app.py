from utilities.db_connector import get_db

def test_connection():
    db = get_db()
    # Test by listing collections
    print("Collections:", db.list_collection_names())

if __name__ == "__main__":
    test_connection()
