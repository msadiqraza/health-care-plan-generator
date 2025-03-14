def extract_json_data(file_path):
    """
    Extracts data from a JSON file.

    Args:
        file_path (str): The path to the JSON file.

    Returns:
        dict: The extracted JSON data as a dictionary, or None if an error occurs.
    """
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        print(f"Error: File not found at {file_path}")
        return None
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in {file_path}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None