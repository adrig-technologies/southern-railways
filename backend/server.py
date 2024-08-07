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

# List of block_section_yards
BLOCK_SECTION_YARDS = [
    "AJJ-AJJN", "MLPM-AJJN", "AJJN-TRT", "TRT-POI", "POI-VKZ", "VKZ-NG", 
    "NG-EKM", "EKM-VGA", "VGA-PUT", "PUT-TDK", "TDK-PUDI", "PUDI-RU"
]

def fetch_requests_from_db():
    requests = RequestTable.query.all()
    return [{
        'block_section_yard': request.block_section_yard,
        'date': request.date,
        'start_time': request.demanded_time_from,
        'end_time': request.demanded_time_to,
        'dept': request.dept
    } for request in requests]

def parse_time(time_str):
    return datetime.strptime(time_str, "%H:%M")

def merge_intervals(intervals):
    sorted_intervals = sorted(intervals, key=lambda x: x['start'])
    merged = []
    for interval in sorted_intervals:
        if not merged or merged[-1]['end'] < interval['start']:
            merged.append(interval)
        else:
            merged[-1]['end'] = max(merged[-1]['end'], interval['end'])
    return merged

def find_shadow_blocks(allocated_requests):
    shadow_blocks = {}

    for request in allocated_requests:
        block_section_yard_index = BLOCK_SECTION_YARDS.index(request['block_section_yard'])
        start_time = parse_time(request['start_time'])
        end_time = parse_time(request['end_time'])

        for i in range(len(BLOCK_SECTION_YARDS)):
            block_section_yard = BLOCK_SECTION_YARDS[i]
            if block_section_yard not in shadow_blocks:
                shadow_blocks[block_section_yard] = {}
            if request['date'] not in shadow_blocks[block_section_yard]:
                shadow_blocks[block_section_yard][request['date']] = []

            if i == block_section_yard_index:
                shadow_blocks[block_section_yard][request['date']].append({'start': start_time, 'end': end_time})
            else:
                if block_section_yard_index < i:
                    shadow_blocks[block_section_yard][request['date']].append({'start': start_time, 'end': end_time})
                else:
                    overlap_intervals = [interval for interval in shadow_blocks[block_section_yard][request['date']] if not (interval['end'] <= start_time or interval['start'] >= end_time)]
                    if not overlap_intervals:
                        shadow_blocks[block_section_yard][request['date']].append({'start': start_time, 'end': end_time})

    for block_section_yard in shadow_blocks:
        for date in shadow_blocks[block_section_yard]:
            shadow_blocks[block_section_yard][date] = merge_intervals(shadow_blocks[block_section_yard][date])

    return shadow_blocks

def allocate_non_engg_requests(non_engg_requests, shadow_blocks, sorted_dates):
    allocated_non_engg_requests = []

    for request in non_engg_requests:
        for date in sorted_dates:
            if date >= request['date']:
                if request['block_section_yard'] in shadow_blocks and date in shadow_blocks[request['block_section_yard']]:
                    for block in shadow_blocks[request['block_section_yard']][date]:
                        block_duration = (block['end'] - block['start']).seconds / 3600
                        requested_duration = (parse_time(request['end_time']) - parse_time(request['start_time'])).seconds / 3600
                        
                        if requested_duration <= block_duration:
                            allocated_non_engg_requests.append({
                                'block_section_yard': request['block_section_yard'],
                                'date': date,
                                'start_time': block['start'].strftime("%H:%M"),
                                'end_time': (block['start'] + timedelta(hours=requested_duration)).strftime("%H:%M"),
                                'dept': request['dept']
                            })
                            # Update shadow block to reflect allocated request
                            block['start'] = block['start'] + timedelta(hours=requested_duration)
                            break
                if allocated_non_engg_requests and allocated_non_engg_requests[-1]['date'] == date and allocated_non_engg_requests[-1]['block_section_yard'] == request['block_section_yard']:
                    break

    return allocated_non_engg_requests

@app.route('/optimize', methods=['GET'])
def optimize_requests():
    all_requests = fetch_requests_from_db()

    engg_requests = [req for req in all_requests if req['dept'] == 'ENGG']
    non_engg_requests = [req for req in all_requests if req['dept'] != 'ENGG']

    # Create a hierarchy of dates based on the number of ENGG requests
    date_hierarchy = {}
    for req in engg_requests:
        date = req['date']
        if date not in date_hierarchy:
            date_hierarchy[date] = 0
        date_hierarchy[date] += 1

    # Sort dates by the number of ENGG requests (descending)
    sorted_dates = sorted(date_hierarchy.keys(), key=lambda x: -date_hierarchy[x])

    # Allocate ENGG requests according to the hierarchy
    allocated_requests = []
    for date in sorted_dates:
        allocated_requests.extend([req for req in engg_requests if req['date'] == date])

    # Calculate shadow blocks based on allocated ENGG requests
    shadow_blocks = find_shadow_blocks(allocated_requests)

    # Allocate Non-ENGG requests within the shadow blocks
    allocated_non_engg_requests = allocate_non_engg_requests(non_engg_requests, shadow_blocks, sorted_dates)

    # Combine all allocated requests
    all_allocated_requests = allocated_requests + allocated_non_engg_requests

    # Clear the existing optimized table and add the optimized requests
    db.session.query(OptimizedTable).delete()
    for req in all_allocated_requests:
        optimized_entry = OptimizedTable(
            date=req['date'],
            dept=req['dept'],
            block_section_yard=req['block_section_yard'],
            line='0',
            demanded_time_from=req['start_time'],
            demanded_time_to=req['end_time'],
            block_demanded_in_hrs=(parse_time(req['end_time']) - parse_time(req['start_time'])).seconds / 3600,
            location_from='0',
            location_to='0',
            nature_of_work='0',
            resources_needed='0',
            supervisors_deputed='0'
        )
        db.session.add(optimized_entry)
    db.session.commit()
    
    return jsonify({'message': 'Optimized table created successfully'}), 200

from datetime import datetime

# Parse the time to convert from HH:MM:SS to HH:MM
def convert_time_format(time_str):
    try:
        return datetime.strptime(time_str, "%H:%M:%S").strftime("%H:%M")
    except ValueError:
        return time_str  # If the time is already in HH:MM format or invalid

def parse_time(time_str):
    return datetime.strptime(time_str, "%H:%M")

def is_overlapping(time1_start, time1_end, time2_start, time2_end):
    return max(time1_start, time2_start) < min(time1_end, time2_end)

def find_new_shadow_blocks(allocated_requests):
    # Define the station sequence
    stations = [
        "AJJ-AJJN", "MLPM-AJJN", "AJJN-TRT", "TRT-POI", "POI-VKZ", "VKZ-NG",
        "NG-EKM", "EKM-VGA", "VGA-PUT", "PUT-TDK", "TDK-PUDI", "PUDI-RU"
    ]
    
    # Initialize shadow blocks dictionary
    shadow_blocks = {}

    # Group requests by date
    requests_by_date = {}
    for req in allocated_requests:
        if req['date'] not in requests_by_date:
            requests_by_date[req['date']] = []
        requests_by_date[req['date']].append(req)

    # Calculate shadow blocks for each date
    for date, requests in requests_by_date.items():
        shadow_blocks[date] = {}

        # For each station, initialize the shadow block as the entire day
        for station in stations:
            shadow_blocks[date][station] = [{'start': parse_time('00:00'), 'end': parse_time('23:59')}]

        # Adjust shadow blocks based on allocated requests
        for req in requests:
            start_time = parse_time(req['demanded_time_from'])
            end_time = parse_time(req['demanded_time_to'])
            station_index = stations.index(req['block_section_yard'])

            # Update shadow blocks for all stations except the one with the request
            for i in range(len(stations)):
                if i == station_index:
                    continue
                
                # Adjust the shadow blocks by excluding the time of the allocated request
                updated_blocks = []
                for block in shadow_blocks[date][stations[i]]:
                    if is_overlapping(block['start'], block['end'], start_time, end_time):
                        if block['start'] < start_time:
                            updated_blocks.append({'start': block['start'], 'end': start_time})
                        if block['end'] > end_time:
                            updated_blocks.append({'start': end_time, 'end': block['end']})
                    else:
                        updated_blocks.append(block)
                shadow_blocks[date][stations[i]] = updated_blocks

    return shadow_blocks

def find_shadow_blocks_for_new_request(optimized_requests):
    shadow_blocks = find_new_shadow_blocks(optimized_requests)
    return shadow_blocks

def optimize_new_request(new_request, optimized_requests):
    new_request_start = parse_time(new_request['demanded_time_from'])
    new_request_end = parse_time(new_request['demanded_time_to'])
    new_request_duration = (new_request_end - new_request_start).seconds / 3600

    # Check if the requested slot is available as is
    conflicts = [req for req in optimized_requests if req['date'] == new_request['date'] and req['block_section_yard'] == new_request['block_section_yard']]
    
    slot_available = True
    for conflict in conflicts:
        conflict_start = parse_time(conflict['demanded_time_from'])
        conflict_end = parse_time(conflict['demanded_time_to'])
        if is_overlapping(new_request_start, new_request_end, conflict_start, conflict_end):
            slot_available = False
            break
    
    if slot_available:
        return new_request  # No conflict, return the original request

    # If not available, find a suitable shadow block
    shadow_blocks = find_shadow_blocks_for_new_request(optimized_requests)
    for date, stations in shadow_blocks.items():
        for station, blocks in stations.items():
            if station == new_request['block_section_yard']:
                for block in blocks:
                    block_duration = (block['end'] - block['start']).seconds / 3600
                    if block_duration >= new_request_duration:
                        # Allocate this shadow block to the new request
                        new_request['date'] = date
                        new_request['demanded_time_from'] = block['start'].strftime("%H:%M")
                        new_request['demanded_time_to'] = (block['start'] + timedelta(hours=new_request_duration)).strftime("%H:%M")
                        return new_request
    
    # If no shadow block is available, move to the next day with no conflicts
    next_available_date = sorted(list(set([req['date'] for req in optimized_requests])))[-1]
    new_request['date'] = (datetime.strptime(next_available_date, '%m/%d/%Y') + timedelta(days=1)).strftime('%m/%d/%Y')
    new_request['demanded_time_from'] = "00:00"
    new_request['demanded_time_to'] = (parse_time("00:00") + timedelta(hours=new_request_duration)).strftime("%H:%M")
    return new_request

@app.route('/add_request', methods=['POST'])
def add_request():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        new_request = {
            'date': data.get('date', '0'),
            'dept': data.get('dept', '0'),
            'block_section_yard': data.get('blocksectionyard', '0'),
            'line': data.get('line', '0'),
            'demanded_time_from': convert_time_format(data.get('demandfrom', '0')),
            'demanded_time_to': convert_time_format(data.get('demandto', '0')),
            'block_demanded_in_hrs': float(data.get('duration', '0').replace('hr', '').strip()) if 'duration' in data else 0,
            'location_from': '0',
            'location_to': '0',
            'nature_of_work': '0',
            'resources_needed': '0',
            'supervisors_deputed': '0'
        }

        # Optimize the new request with the existing ones
        optimized_requests = [{
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
        } for req in OptimizedTable.query.all()]

        optimized_request = optimize_new_request(new_request, optimized_requests)

        # Save the optimized request
        optimized_entry = OptimizedTable(
            date=optimized_request['date'],
            dept=optimized_request['dept'],
            block_section_yard=optimized_request['block_section_yard'],
            line=optimized_request['line'],
            demanded_time_from=optimized_request['demanded_time_from'],
            demanded_time_to=optimized_request['demanded_time_to'],
            block_demanded_in_hrs=optimized_request['block_demanded_in_hrs'],
            location_from=optimized_request['location_from'],
            location_to=optimized_request['location_to'],
            nature_of_work=optimized_request['nature_of_work'],
            resources_needed=optimized_request['resources_needed'],
            supervisors_deputed=optimized_request['supervisors_deputed']
        )
        db.session.add(optimized_entry)
        db.session.commit()

        response = {
            'original_request': new_request,
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
