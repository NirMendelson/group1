from db_connector import get_db
import json
from bson import ObjectId  # Import ObjectId for custom serialization


class JSONEncoder(json.JSONEncoder):
    """Custom JSON Encoder to handle ObjectId."""
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)  # Convert ObjectId to string
        return super().default(obj)


def reverse_hebrew_text(text):
    """Reverse Hebrew text for proper console display."""
    return text[::-1]


def process_document(document):
    """Recursively reverse Hebrew text in a MongoDB document."""
    if isinstance(document, dict):
        return {key: process_document(value) for key, value in document.items()}
    elif isinstance(document, list):
        return [process_document(item) for item in document]
    elif isinstance(document, str):
        # Reverse the string if it contains Hebrew characters
        if any("\u0590" <= char <= "\u05FF" for char in document):
            return reverse_hebrew_text(document)
    return document


def list_collections_and_data():
    """List all collections and their data in the database."""
    try:
        # Get the database connection
        db = get_db()
        db_name = db.name

        # Fetch all collections in the database
        collections = db.list_collection_names()

        if not collections:
            print(f"No collections found in the '{db_name}' database.")
            return

        print(f"Collections and data in the '{db_name}' database:")

        for collection_name in collections:
            print(f"\n--- Collection: {collection_name} ---")
            collection = db[collection_name]
            documents = collection.find()

            # Check if the collection is empty
            if collection.count_documents({}) == 0:
                print("This collection is empty.")
                continue

            # Print all documents in the collection
            for document in documents:
                # Process document to reverse Hebrew text
                processed_document = process_document(document)
                formatted_doc = json.dumps(processed_document, cls=JSONEncoder, ensure_ascii=False, indent=4)
                print(formatted_doc)

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    list_collections_and_data()
