from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
import smtplib

import requests

import pymongo

app = Flask(__name__)
CORS(app)

# MongoDB Atlas connection
client = MongoClient('mongodb+srv://spotoverflow:spotoverflow@devcluster.kd5d8.mongodb.net/?retryWrites=true&w=majority&appName=devCluster')
db = client['realtime-monitordb']
collection = db['realtime-monitor-cluster']
users={"Vaishnavi":"vaish"}

def send_email(sender_email, sender_password, recipient_emails, subject, message):
    try:
        # Set up the SMTP server and port (Gmail used as an example)
        smtp_server = "smtp.gmail.com"
        smtp_port = 587

        # Combine subject and message into a single email body
        email_body = f"Subject: {subject}\n\n{message}"

        # Ensure recipient_emails is a comma-separated string
        # Connect to the SMTP server and send the email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()  # Start TLS encryption
            server.login(sender_email, sender_password)  # Login to the email account
            server.sendmail(sender_email, recipient_emails, email_body)  # Send the email

        print(server)
        return "Email sent successfully to all recipients!"
    except Exception as e:
        return f"Failed to send email. Error: {e}"
        
@app.route('/alert',methods=['GET'])
def sendAlert():
    sender_email = "vs4345@srmist.edu.in"
    sender_password = "oxlicswwrzqdwnwu"

    # Recipient emails and email content
    result=[i['user'] for i in list(db['users'].find({},{'_id':0,'user':1}))]
    print(result)
    recipient_emails = result
    [ "vaishnavi.shukla567@gmail.com", "harsri1705@gmail.com"]
    subject = "ALERT!!!!"
    message = "Hello! This is an Alert email sent by the STREAMFLUX ADMIN."

    # Call the function
    return send_email(sender_email, sender_password, recipient_emails, subject, message)
     

@app.route('/users',methods=['GET'])
def getUsers():
    result=list(db['users'].find({},{'_id':0}))
    return jsonify(result),201

@app.route('/store', methods=['POST'])
def store_data():
    # Get data from request headers
    print("HEADERS****************")
    print(request.form)
    data = dict(request.form)
    
    # Insert data into MongoDB
    result = collection.insert_one(data)
    
    return jsonify({"message": "Data stored successfully", "id": str(result.inserted_id)}), 201

@app.route('/api/adduser',methods=['POST'])
def adduser():
    data = request.get_json()
    user = data.get('user')
    name=data.get('name')
    password=data.get('pass')
    query_params = dict({'name':name, 'user': user, 'pass':password})
    if db['users'].find_one({'user':user}):
        return jsonify({'message':'User Already Exists'}), 111
    db['users'].insert_one(query_params)
    return jsonify({'message':'User Added'}), 200

    

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
    print(username,password)
    user=db['users'].find_one({'user':username, 'pass': password})
    print(user)
    if user:
        return jsonify({'success': True, 'name':user['name'], 'message': 'Login successful'}), 200
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401


if __name__ == '__main__':
    app.run(host='0.0.0.0' ,debug=True)
    # app.run(debug=True)
