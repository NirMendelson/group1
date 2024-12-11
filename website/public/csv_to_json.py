import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    data = []

    # Open the CSV file and read it
    with open(csv_file_path, mode='r', encoding='utf-8-sig') as csv_file:  # Use utf-8-sig to handle BOM
        csv_reader = csv.DictReader(csv_file)

        # Debug: Print the headers to confirm them
        print("CSV Headers:", csv_reader.fieldnames)

        # Ensure the expected headers exist
        if "City" not in csv_reader.fieldnames:
            raise KeyError("Missing 'City' column in the CSV file.")
        if "Street" not in csv_reader.fieldnames:
            raise KeyError("Missing 'Street' column in the CSV file.")

        for row in csv_reader:
            city = row.get("City")
            street = row.get("Street")

            # Skip rows with missing data
            if city and street:
                data.append({
                    "city": city.strip(),
                    "street": street.strip()
                })

    # Write the list of dictionaries to a JSON file
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False, indent=4)

# Specify file paths
csv_file_path = "cities_and_streets.csv"  # Replace with your actual CSV file path
json_file_path = "cities_and_streets.json"  # Replace with desired output JSON file path

# Convert CSV to JSON
try:
    csv_to_json(csv_file_path, json_file_path)
    print(f"JSON file created at: {json_file_path}")
except KeyError as e:
    print(f"Error: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
