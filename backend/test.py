import requests

# The URL of the Flask server
url = 'http://127.0.0.1:5000/upload'

# Path to the CSV file you want to upload
csv_file_path = '/Users/nishaanth/Documents/work/mustard/southern-railways/backend/uploads/test.csv'

# Open the CSV file in binary mode and send the request
with open(csv_file_path, 'rb') as file:
    files = {'file': file}
    response = requests.post(url, files=files)

# Print the response from the server
print(response.status_code)
print(response.json())
