from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os

import pymongo

app = Flask(__name__)
CORS(app)

# MongoDB Atlas connection
client = MongoClient('mongodb+srv://spotoverflow:spotoverflow@devcluster.kd5d8.mongodb.net/?retryWrites=true&w=majority&appName=devCluster')
db = client['realtime-monitordb']
collection = db['realtime-monitor-cluster']
users={"Vaishnavi": "vaish", "testUser": "password"}

@app.route('/store', methods=['POST'])
def store_data():
    # Get data from request headers
    print("HEADERS****************")
    print(request.form)
    data = dict(request.form)
    
    # Insert data into MongoDB
    result = collection.insert_one(data)
    
    return jsonify({"message": "Data stored successfully", "id": str(result.inserted_id)}), 201

@app.route('/retrieve', methods=['POST'])
def retrieve_data():
    # Get filter parameters from request headers
    data = request.get_json()
    device_id = data.get('device_id')
    query_params = dict({'device_id': device_id})
    
    # Retrieve data from MongoDB
    data = list(collection.find(query_params, {'_id': 0}))  # Exclude the _id field in the response
    # sorted(data,key=lambda x: datetime.strptime(x['timestamp'], '%Y/%m/%d %H:%M:%S'))

    return jsonify(data[::-1]), 200

@app.route('/live', methods=['POST'])
def live_data():
    # Get filter parameters from request headers
    data = request.get_json()
    device_id = data.get('device_id')
    query_params = dict({'device_id': device_id})
    
    # Retrieve data from MongoDB
    data = list(collection.find(query_params, {'_id': 0}))  # Exclude the _id field in the response
    sorted(data,key=lambda x: datetime.strptime(x['timestamp'], '%Y/%m/%d %H:%M:%S'))
    print(data[-1])
    return jsonify(data[-1]), 200


@app.route('/delete', methods=['POST'])
def delete():
    numbers=collection.delete_many({})
    return jsonify(numbers.deleted_count)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json

    username = data.get('username')
    password = data.get('password')

    print(username)
    print(password)
    print(users)
    if username in users and users[username] == password:
        return jsonify({'success': True, 'message': 'Login successful'}), 200
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401


if __name__ == '__main__':
    app.run(host='0.0.0.0' ,debug=True)
    # app.run(debug=True)
