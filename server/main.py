from flask import Flask, render_template, request, jsonify
from mqtt_server import init_mqtt_server, send_msg, exit_mqtt_server
import json
import threading

app = Flask(__name__)

devices = None
devices_locks = None

def update_device(data):
    topic = data.get('deviceName')
    opt = data.get('opt')
    key = data.get('key')
    value = data.get('value')
    index = data.get('id')
    #print("Control Data:", data)

    lock = device_locks[topic]
    with lock:
        device = devices[index]
        msg = {
            "topic": topic,
            "opt" : opt,
            "key" : key,
            "value": value
        }
        send_msg(topic, json.dumps(msg))
        device['component'][key] = value

    return True

def update_devices_callback(topic, data):
    global devices

    if data is None:
        print("Data is null")
        return

    lock = device_locks[topic]
    for device in devices:
        if device['name'] == topic:
            with lock:
                device['component'] = data
                break

def create_device_locks(devices):
    return {device['name']: threading.Lock() for device in devices}

def init_server():
    global devices
    global device_locks
    with open('devices.json', 'r') as file:
        devices = json.load(file)

    device_locks = create_device_locks(devices)
    init_mqtt_server(update_devices_callback, devices)

def exit_server():
    print("exit_server!!!!!!")
    exit_mqtt_server()

@app.route('/api/toggle-device', methods=['POST'])
@app.route('/api/control-device', methods=['POST'])
def toggle_device():
    data = request.json

    if not data or 'deviceName' not in data or 'id' not in data:
        return jsonify({'success': False, 'error': 'Invalid input'}), 400

    if update_device(data):
        return jsonify({'success': True})

    return jsonify({'success': False}), 404

@app.route('/api/devices', methods=['GET'])
def get_devices():
    return jsonify(devices)

@app.route('/')
def index():
    return render_template('index.html', devices=devices)

def run_app():
    app.run(host='0.0.0.0', port=8000, debug=False)

if __name__ == '__main__':
    try:
        init_server()
        run_app()
    except KeyboardInterrupt:
        print("Exiting...")
    finally:
        exit_server()
