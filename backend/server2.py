from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
import csv
from sqlalchemy import inspect

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class RequestTable(db.Model):
    __tablename__ = 'request_table'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50))
    dept = db.Column(db.String(100))
    block_section_yard = db.Column(db.String(100))
    line = db.Column(db.String(100))
    demanded_time_from = db.Column(db.String(50))
    demanded_time_to = db.Column(db.String(50))
    block_demanded_in_hrs = db.Column(db.Float)
    location_from = db.Column(db.String(100))
    location_to = db.Column(db.String(100))
    nature_of_work = db.Column(db.String(200))
    resources_needed = db.Column(db.String(200))
    supervisors_deputed = db.Column(db.String(200))

class OptimizedTable(db.Model):
    __tablename__ = 'optimized_table'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50))
    dept = db.Column(db.String(100))
    block_section_yard = db.Column(db.String(100))
    line = db.Column(db.String(100))
    demanded_time_from = db.Column(db.String(50))
    demanded_time_to = db.Column(db.String(50))
    block_demanded_in_hrs = db.Column(db.Float)
    location_from = db.Column(db.String(100))
    location_to = db.Column(db.String(100))
    nature_of_work = db.Column(db.String(200))
    resources_needed = db.Column(db.String(200))
    supervisors_deputed = db.Column(db.String(200))

class AdhocRequestTable(db.Model):
    __tablename__ = 'adhoc_request_table'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50))
    dept = db.Column(db.String(100))
    block_section_yard = db.Column(db.String(100))
    line = db.Column(db.String(100))
    demanded_time_from = db.Column(db.String(50))
    demanded_time_to = db.Column(db.String(50))
    block_demanded_in_hrs = db.Column(db.Float)
    location_from = db.Column(db.String(100))
    location_to = db.Column(db.String(100))
    nature_of_work = db.Column(db.String(200))
    resources_needed = db.Column(db.String(200))
    supervisors_deputed = db.Column(db.String(200))

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and file.filename.endswith('.csv'):
        filepath = os.path.join('uploads', file.filename)
        file.save(filepath)
        process_csv(filepath)
        return jsonify({'message': 'File successfully uploaded and processed'}), 200
    else:
        return jsonify({'error': 'Invalid file format'}), 400

def process_csv(filepath):
    with open(filepath, newline='') as csvfile:
        csvreader = csv.DictReader(csvfile)
        db.session.query(RequestTable).delete()  # Clear the table
        for row in csvreader:
            request_entry = RequestTable(
                date=row['DATE'],
                dept=row['DEPT'],
                block_section_yard=row['Block Section- Yard'],
                line=row['LINE'],
                demanded_time_from=row['DEMANDED TIME FROM'],
                demanded_time_to=row['DEMANDED TIME TO'],
                block_demanded_in_hrs=float(row['Block demanded in Hrs']),
                location_from=row['Location / FROM'],
                location_to=row['Location / TO'],
                nature_of_work=row['Nature of work & Quantum of Output Planned'],
                resources_needed=row['Resources needed (MM/C,ADEQUATE MANPOWER & SUPERVISORC, Manpower, Whether site preparation & resources ready)'],
                supervisors_deputed=row['Supervisors to be deputed (JEJE/SSESSE with section)']
            )
            db.session.add(request_entry)
        db.session.commit()
        # Sync AdhocRequestTable with the new data in RequestTable
        sync_adhoc_requests()

def parse_time(time_str):
    try:
        return datetime.strptime(time_str, "%H:%M")
    except ValueError:
        print(f"Error parsing time: {time_str}")
        return None

def is_clashing(requests):
    for i in range(len(requests)):
        for j in range(i + 1, len(requests)):
            start_i = parse_time(requests[i]['startHour'])
            end_i = parse_time(requests[i]['endHour'])
            start_j = parse_time(requests[j]['startHour'])
            end_j = parse_time(requests[j]['endHour'])
            if start_i and end_i and start_j and end_j:
                if (start_i < end_j and start_j < end_i):
                    requests[i]['clashed'] = True
                    requests[j]['clashed'] = True

@app.route('/read_requests', methods=['GET'])
def read_requests():
    requests = AdhocRequestTable.query.all()
    request_list = []
    start_date = None
    end_date = None

    for request in requests:
        date_obj = datetime.strptime(request.date, '%m/%d/%Y')
        if start_date is None or date_obj < start_date:
            start_date = date_obj
        if end_date is None or date_obj > end_date:
            end_date = date_obj
        request_data = {
            'id': request.id,
            'date': request.date,
            'dept': request.dept,
            'block_section_yard': request.block_section_yard,
            'line': request.line,
            'demanded_time_from': request.demanded_time_from,
            'demanded_time_to': request.demanded_time_to,
            'block_demanded_in_hrs': request.block_demanded_in_hrs,
            'location_from': request.location_from,
            'location_to': request.location_to,
            'nature_of_work': request.nature_of_work,
            'resources_needed': request.resources_needed,
            'supervisors_deputed': request.supervisors_deputed
        }
        request_list.append(request_data)
    
    # Group by weeks and then by date and station
    weeks = {}
    current_date = start_date
    while current_date <= end_date:
        week_start = current_date - timedelta(days=current_date.weekday())
        week_end = week_start + timedelta(days=6)
        week_key = (week_start.strftime('%m/%d/%Y'), week_end.strftime('%m/%d/%Y'))
        if week_key not in weeks:
            weeks[week_key] = {}
        current_date += timedelta(days=1)

    for request in request_list:
        date = request['date']
        station = request['block_section_yard']
        date_obj = datetime.strptime(date, '%m/%d/%Y')
        week_start = date_obj - timedelta(days=date_obj.weekday())
        week_end = week_start + timedelta(days=6)
        week_key = (week_start.strftime('%m/%d/%Y'), week_end.strftime('%m/%d/%Y'))

        if date not in weeks[week_key]:
            weeks[week_key][date] = {}

        if station not in weeks[week_key][date]:
            weeks[week_key][date][station] = {'stationName': station, 'requests': []}

        weeks[week_key][date][station]['requests'].append({
            'startHour': request['demanded_time_from'],
            'endHour': request['demanded_time_to'],
            'clashed': False,
            'dept': request['dept']  # Add department name
        })

    for week in weeks.values():
        for day in week.values():
            for station in day.values():
                is_clashing(station['requests'])

    # Create final response
    response = {
        'startDate': start_date.strftime('%m/%d/%Y'),
        'endDate': end_date.strftime('%m/%d/%Y'),
        'week': []
    }

    for week_key, days in weeks.items():
        week_data = {'startDate': week_key[0], 'endDate': week_key[1], 'days': []}
        for date, stations in days.items():
            day_data = {'date': date, 'stations': []}
            for station, data in stations.items():
                day_data['stations'].append(data)
            week_data['days'].append(day_data)
        response['week'].append(week_data)

    return jsonify(response)

@app.route('/check_request_table', methods=['GET'])
def check_table():
    inspector = inspect(db.engine)
    table_exists = inspector.has_table('request_table')
    return jsonify({'exists': table_exists})

@app.route('/optimize', methods=['GET'])
def optimize_table():
    # Placeholder: Read request_table and perform optimization (currently just loading a local CSV)
    # Read the request_table
    requests = RequestTable.query.all()
    
    # Process data from request_table (currently not implemented)
    # Placeholder for optimization logic
    
    # Load optimized data from a local CSV file
    optimized_filepath = '/Users/apple/Downloads/Optimised table.csv'
    if os.path.exists(optimized_filepath):
        process_optimized_csv(optimized_filepath)
        return jsonify({'message': 'Optimized table created successfully'}), 200
    else:
        return jsonify({'error': 'Optimized file not found'}), 400

def process_optimized_csv(filepath):
    with open(filepath, newline='') as csvfile:
        csvreader = csv.DictReader(csvfile)
        db.session.query(OptimizedTable).delete()  # Clear the table
        for row in csvreader:
            optimized_entry = OptimizedTable(
                date=row['DATE'],
                dept=row['DEPT'],
                block_section_yard=row['Block Section- Yard'],
                line=row['LINE'],
                demanded_time_from=row['DEMANDED TIME FROM'],
                demanded_time_to=row['DEMANDED TIME TO'],
                block_demanded_in_hrs=float(row['Block demanded in Hrs']),
                location_from=row['Location / FROM'],
                location_to=row['Location / TO'],
                nature_of_work=row['Nature of work & Quantum of Output Planned'],
                resources_needed=row['Resources needed (MM/C,ADEQUATE MANPOWER & SUPERVISORC, Manpower, Whether site preparation & resources ready)'],
                supervisors_deputed=row['Supervisors to be deputed (JEJE/SSESSE with section)']
            )
            db.session.add(optimized_entry)
        db.session.commit()

@app.route('/check_optimized_table', methods=['GET'])
def check_otable():
    inspector = inspect(db.engine)
    table_exists = inspector.has_table('optimized_table')
    return jsonify({'exists': table_exists})

@app.route('/read_optimized_requests', methods=['GET'])
def read_optimized_requests():
    requests = OptimizedTable.query.all()
    request_list = []
    start_date = None
    end_date = None

    for request in requests:
        date_obj = datetime.strptime(request.date, '%m/%d/%Y')
        if start_date is None or date_obj < start_date:
            start_date = date_obj
        if end_date is None or date_obj > end_date:
            end_date = date_obj
        request_data = {
            'id': request.id,
            'date': request.date,
            'dept': request.dept,
            'block_section_yard': request.block_section_yard,
            'line': request.line,
            'demanded_time_from': request.demanded_time_from,
            'demanded_time_to': request.demanded_time_to,
            'block_demanded_in_hrs': request.block_demanded_in_hrs,
            'location_from': request.location_from,
            'location_to': request.location_to,
            'nature_of_work': request.nature_of_work,
            'resources_needed': request.resources_needed,
            'supervisors_deputed': request.supervisors_deputed
        }
        request_list.append(request_data)
    
    # Group by weeks and then by date and station
    weeks = {}
    current_date = start_date
    while current_date <= end_date:
        week_start = current_date - timedelta(days=current_date.weekday())
        week_end = week_start + timedelta(days=6)
        week_key = (week_start.strftime('%m/%d/%Y'), week_end.strftime('%m/%d/%Y'))
        if week_key not in weeks:
            weeks[week_key] = {}
        current_date += timedelta(days=1)

    for request in request_list:
        date = request['date']
        station = request['block_section_yard']
        date_obj = datetime.strptime(date, '%m/%d/%Y')
        week_start = date_obj - timedelta(days=date_obj.weekday())
        week_end = week_start + timedelta(days=6)
        week_key = (week_start.strftime('%m/%d/%Y'), week_end.strftime('%m/%d/%Y'))

        if date not in weeks[week_key]:
            weeks[week_key][date] = {}

        if station not in weeks[week_key][date]:
            weeks[week_key][date][station] = {'stationName': station, 'requests': []}

        weeks[week_key][date][station]['requests'].append({
            'startHour': request['demanded_time_from'],
            'endHour': request['demanded_time_to'],
            'clashed': False,
            'dept': request['dept']  # Add department name
        })

    for week in weeks.values():
        for day in week.values():
            for station in day.values():
                is_clashing(station['requests'])

    # Create final response
    response = {
        'startDate': start_date.strftime('%m/%d/%Y'),
        'endDate': end_date.strftime('%m/%d/%Y'),
        'week': []
    }

    for week_key, days in weeks.items():
        week_data = {'startDate': week_key[0], 'endDate': week_key[1], 'days': []}
        for date, stations in days.items():
            day_data = {'date': date, 'stations': []}
            for station, data in stations.items():
                day_data['stations'].append(data)
            week_data['days'].append(day_data)
        response['week'].append(week_data)

    return jsonify(response)

@app.route('/add_adhoc_request', methods=['POST'])
def add_adhoc_request():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        new_request = AdhocRequestTable(
            date=data['date'],
            dept=data['dept'],
            block_section_yard=data['block_section_yard'],
            line=data['line'],
            demanded_time_from=data['demanded_time_from'],
            demanded_time_to=data['demanded_time_to'],
            block_demanded_in_hrs=data['block_demanded_in_hrs'],
            location_from=data['location_from'],
            location_to=data['location_to'],
            nature_of_work=data['nature_of_work'],
            resources_needed=data['resources_needed'],
            supervisors_deputed=data['supervisors_deputed']
        )
        db.session.add(new_request)
        db.session.commit()
        return jsonify({'message': 'Adhoc request added successfully'}), 200
    except KeyError as e:
        return jsonify({'error': f'Missing field {e.args[0]}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def sync_adhoc_requests():
    db.session.query(AdhocRequestTable).delete()  # Clear the table
    requests = RequestTable.query.all()
    for request in requests:
        adhoc_entry = AdhocRequestTable(
            date=request.date,
            dept=request.dept,
            block_section_yard=request.block_section_yard,
            line=request.line,
            demanded_time_from=request.demanded_time_from,
            demanded_time_to=request.demanded_time_to,
            block_demanded_in_hrs=request.block_demanded_in_hrs,
            location_from=request.location_from,
            location_to=request.location_to,
            nature_of_work=request.nature_of_work,
            resources_needed=request.resources_needed,
            supervisors_deputed=request.supervisors_deputed
        )
        db.session.add(adhoc_entry)
    db.session.commit()

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    with app.app_context():
        db.create_all()
        sync_adhoc_requests()  # Populate adhoc_request_table with initial data
    app.run(debug=True)
