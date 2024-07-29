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

def parse_time(time_str):
    try:
        return datetime.strptime(time_str, "%H:%M")
    except ValueError:
        print(f"Error parsing time: {time_str}")
        return None

def calculate_shadow_blocks(engineering_blocks):
    shadow_blocks = []
    for block in engineering_blocks:
        start_time = parse_time(block['demanded_time_from'])
        end_time = parse_time(block['demanded_time_to'])
        shadow_blocks.append({
            'start_time': start_time,
            'end_time': end_time,
            'block_section_yard': block['block_section_yard']
        })
    return shadow_blocks

def fit_non_engineering_blocks(non_eng_blocks, shadow_blocks):
    optimized_non_eng_blocks = []
    for block in non_eng_blocks:
        block_fitted = False
        for shadow in shadow_blocks:
            if shadow['block_section_yard'] != block['block_section_yard']:
                continue
            block_start = parse_time(block['demanded_time_from'])
            block_end = parse_time(block['demanded_time_to'])
            if shadow['start_time'] <= block_start and shadow['end_time'] >= block_end:
                optimized_non_eng_blocks.append(block)
                block_fitted = True
                break
        if not block_fitted:
            optimized_non_eng_blocks.append(block)  # For now, add to the same list; in practice, handle corridor blocks
    return optimized_non_eng_blocks

def optimize_requests(requests):
    # Sort by engineering request count per day
    date_engineering_count = {}
    for request in requests:
        if request['dept'] == 'ENGG':
            if request['date'] not in date_engineering_count:
                date_engineering_count[request['date']] = 0
            date_engineering_count[request['date']] += 1

    sorted_dates = sorted(date_engineering_count.items(), key=lambda x: x[1], reverse=True)
    sorted_dates = [date for date, count in sorted_dates]

    # Assign requests
    optimized_requests = []
    remaining_non_eng_blocks = []

    for date in sorted_dates:
        day_requests = [req for req in requests if req['date'] == date]
        eng_blocks = [req for req in day_requests if req['dept'] == 'ENGG']
        non_eng_blocks = [req for req in day_requests if req['dept'] != 'ENGG']

        optimized_requests.extend(eng_blocks)  # Add all engineering blocks as is
        shadow_blocks = calculate_shadow_blocks(eng_blocks)
        optimized_non_eng_blocks = fit_non_engineering_blocks(non_eng_blocks, shadow_blocks)

        optimized_requests.extend(optimized_non_eng_blocks)

        # For now, if not fitting, add to remaining non-eng blocks
        for block in non_eng_blocks:
            if block not in optimized_non_eng_blocks:
                remaining_non_eng_blocks.append(block)

    # Process remaining non-engineering blocks for corridor blocks if needed (for simplicity, not implemented here)
    optimized_requests.extend(remaining_non_eng_blocks)

    return optimized_requests

@app.route('/optimize', methods=['GET'])
def optimize_table():
    requests = RequestTable.query.all()
    request_list = []
    for request in requests:
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

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)
    with app.app_context():
        db.create_all()
    app.run(debug=True)
