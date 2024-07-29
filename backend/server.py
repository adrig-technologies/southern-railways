from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
import csv
from sqlalchemy import inspect
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

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
    requests = RequestTable.query.all()
    request_list = []
    start_date = None
    end_date = None

    for req in requests:
        date_obj = datetime.strptime(req.date, '%m/%d/%Y')
        if start_date is None or date_obj < start_date:
            start_date = date_obj
        if end_date is None or date_obj > end_date:
            end_date = date_obj
        request_data = {
            'id': req.id,
            'date': req.date,
            'dept': req.dept,
            'block_section_yard': req.block_section_yard,
            'line': req.line,
            'demanded_time_from': req.demanded_time_from,
            'demanded_time_to': req.demanded_time_to,
            'block_demanded_in_hrs': req.block_demanded_in_hrs,
            'location_from': req.location_from,
            'location_to': req.location_to,
            'nature_of_work': req.nature_of_work,
            'resources_needed': req.resources_needed,
            'supervisors_deputed': req.supervisors_deputed
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

    for req in request_list:
        date = req['date']
        station = req['block_section_yard']
        date_obj = datetime.strptime(date, '%m/%d/%Y')
        week_start = date_obj - timedelta(days=date_obj.weekday())
        week_end = week_start + timedelta(days=6)
        week_key = (week_start.strftime('%m/%d/%Y'), week_end.strftime('%m/%d/%Y'))

        if date not in weeks[week_key]:
            weeks[week_key][date] = {}

        if station not in weeks[week_key][date]:
            weeks[week_key][date][station] = {'stationName': station, 'requests': []}

        weeks[week_key][date][station]['requests'].append({
            'startHour': req['demanded_time_from'],
            'endHour': req['demanded_time_to'],
            'clashed': False,
            'dept': req['dept']  # Add department name
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
    row_count = db.session.query(RequestTable).count()
    table_has_rows = row_count > 0
    return jsonify({'has_rows': table_has_rows})

@app.route('/optimize', methods=['GET'])
def optimize_table():
    requests = RequestTable.query.all()
    request_list = []
    for req in requests:
        request_data = {
            'id': req.id,
            'date': req.date,
            'dept': req.dept,
            'block_section_yard': req.block_section_yard,
            'line': req.line,
            'demanded_time_from': req.demanded_time_from,
            'demanded_time_to': req.demanded_time_to,
            'block_demanded_in_hrs': req.block_demanded_in_hrs,
            'location_from': req.location_from,
            'location_to': req.location_to,
            'nature_of_work': req.nature_of_work,
            'resources_needed': req.resources_needed,
            'supervisors_deputed': req.supervisors_deputed
        }
        request_list.append(request_data)

    optimized_requests = optimize_requests(request_list)

    # Clear the existing optimized table and add the optimized requests
    db.session.query(OptimizedTable).delete()
    for req in optimized_requests:
        optimized_entry = OptimizedTable(
            date=req['date'],
            dept=req['dept'],
            block_section_yard=req['block_section_yard'],
            line=req['line'],
            demanded_time_from=req['demanded_time_from'],
            demanded_time_to=req['demanded_time_to'],
            block_demanded_in_hrs=req['block_demanded_in_hrs'],
            location_from=req['location_from'],
            location_to=req['location_to'],
            nature_of_work=req['nature_of_work'],
            resources_needed=req['resources_needed'],
            supervisors_deputed=req['supervisors_deputed']
        )
        db.session.add(optimized_entry)
    db.session.commit()
    
    return jsonify({'message': 'Optimized table created successfully'}), 200

@app.route('/add_request', methods=['POST'])
def add_request():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        new_request = RequestTable(
            date=data.get('date', '0'),
            dept=data.get('dept', '0'),
            block_section_yard=data.get('blocksectionyard', '0'),
            line=data.get('line', '0'),
            demanded_time_from=data.get('demandfrom', '0'),
            demanded_time_to=data.get('demandto', '0'),
            block_demanded_in_hrs=float(data.get('duration', '0').replace('hr', '').strip()) if 'duration' in data else 0,
            location_from='0',
            location_to='0',
            nature_of_work='0',
            resources_needed='0',
            supervisors_deputed='0'
        )
        db.session.add(new_request)
        db.session.commit()

        # Optimize the new request with the existing ones
        requests = RequestTable.query.all()
        request_list = []
        for req in requests:
            request_data = {
                'id': req.id,
                'date': req.date,
                'dept': req.dept,
                'block_section_yard': req.block_section_yard,
                'line': req.line,
                'demanded_time_from': req.demanded_time_from,
                'demanded_time_to': req.demanded_time_to,
                'block_demanded_in_hrs': req.block_demanded_in_hrs,
                'location_from': req.location_from,
                'location_to': req.location_to,
                'nature_of_work': req.nature_of_work,
                'resources_needed': req.resources_needed,
                'supervisors_deputed': req.supervisors_deputed
            }
            request_list.append(request_data)

        optimized_requests = optimize_requests(request_list)

        # Find the optimized allocation for the new request
        original_request = {
            'date': data.get('date', '0'),
            'dept': data.get('dept', '0'),
            'block_section_yard': data.get('blocksectionyard', '0'),
            'line': data.get('line', '0'),
            'demanded_time_from': data.get('demandfrom', '0'),
            'demanded_time_to': data.get('demandto', '0'),
            'block_demanded_in_hrs': float(data.get('duration', '0').replace('hr', '').strip()) if 'duration' in data else 0
        }

        optimized_request = None
        for req in optimized_requests:
            if req['dept'] == original_request['dept'] and \
               req['block_section_yard'] == original_request['block_section_yard'] and \
               req['block_demanded_in_hrs'] == original_request['block_demanded_in_hrs']:
                optimized_request = req
                break

        response = {
            'original_request': original_request,
            'optimized_request': {
                'date': optimized_request['date'],
                'block_section_yard': optimized_request['block_section_yard'],
                'demanded_time_from': optimized_request['demanded_time_from'],
                'demanded_time_to': optimized_request['demanded_time_to']
            }
        }

        return jsonify(response), 200
    except KeyError as e:
        return jsonify({'error': f'Missing field {e.args[0]}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def optimize_requests(requests):
    # Placeholder for the optimization logic
    # Sort by requested date and block section yard
    requests.sort(key=lambda x: (x['date'], x['block_section_yard'], parse_time(x['demanded_time_from'])))
    return requests

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
    row_count = db.session.query(OptimizedTable).count()
    table_has_rows = row_count > 0
    return jsonify({'has_rows': table_has_rows})

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


if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    with app.app_context():
        db.create_all()
    app.run(debug=True)