from flask import Flask, render_template, request, jsonify
from mqtt_server import init_mqtt_server, send_msg, recv_msg
import json

app = Flask(__name__)

devices = None

def start_device(data):
    data = request.json
    topic = data.get('deviceName')
    value = data.get('value')
    #print("Data:", data)

    for i in range(len(devices)):
        if topic == devices[i]['name']:
            devices[i]['component']['switch'] = value
            msg = {
                "topic": topic,
                "opt" : data.get('opt'),
                "key" : data.get('key'),
                "value": value
            }
            send_msg(topic, json.dumps(msg))
            return True

    return False

def read_device():
    for i in range(len(devices)):
        topic = devices[i]['name']
        msg = {
            "topic": topic,
            "opt" : "get",
            "key": "all",
            "value": None
        }

        tmp = recv_msg(topic, json.dumps(msg))
        if tmp != None:
            devices[i]['component'] = tmp
        #print(devices[i])

    return True

def update_device(data):
    topic = data.get('deviceName')
    opt = data.get('opt')
    key = data.get('key')
    value = data.get('value')
    #print("Control Data:", data)

    for i in range(len(devices)):
        if topic == devices[i]['name']:
            devices[i]['component'][key] = value
            msg = {
                "topic": topic,
                "opt" : data.get('opt'),
                "key" : key,
                "value": value
            }
            send_msg(topic, json.dumps(msg))
            return True

    return False

def init_server():
    global devices
    with open('devices.json', 'r') as file:
        devices = json.load(file)

    init_mqtt_server()

@app.route('/api/control-device', methods=['POST'])
def control_device():
    data = request.json
    if update_device(data):
        return jsonify({'success': True})

    return jsonify({'success': False}), 404

@app.route('/api/toggle-device', methods=['POST'])
def toggle_device():
    data = request.json
    if start_device(data):
        return jsonify({'success': True})

    return jsonify({'success': False}), 404

@app.route('/api/devices', methods=['GET'])
def get_devices():
    read_device()
    return jsonify(devices)

@app.route('/')
def index():
    return render_template('index.html', devices=devices)

def run_app():
    app.run(host='0.0.0.0', port=8000, debug=False)

if __name__ == '__main__':
    init_server()
    run_app()


