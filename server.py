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
    
    return jsonify(data), 200

@app.route('/live', methods=['POST'])
def live_data():
    # Get filter parameters from request headers
    data = request.get_json()
    device_id = data.get('device_id')
    query_params = dict({'device_id': device_id})
    
    # Retrieve data from MongoDB
    data = list(collection.find(query_params, {'_id': 0}).sort("timestamp", pymongo.DESCENDING))  # Exclude the _id field in the response
    
    return jsonify(data[0]), 200


@app.route('/delete', methods=['POST'])
def delete():
    numbers=collection.delete_many({})
    return jsonify(numbers.deleted_count)

if __name__ == '__main__':
    app.run(host='0.0.0.0' ,debug=True)
    # app.run(debug=True)