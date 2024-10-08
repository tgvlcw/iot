from flask import Flask, render_template, request, jsonify
from mqtt_server import init_mqtt_server
import hardware as hd
import json

app = Flask(__name__)

devices = None

dev_func = [
    {'name': 'Light', 'set': hd.do_device, 'dev_st': hd.light_status},
    {'name': 'Fan', 'set': hd.do_device, 'dev_st': hd.fan_status},
    {'name': 'TV', 'set': hd.do_device, 'dev_st': hd.tv_status},
    {'name': 'Sound', 'set': hd.do_device, 'dev_st': hd.sound_status},
]

def start_device(data):
    if len(devices) != len(dev_func):
        print("Error: The length of devices and dev_func lists do not match.")
        return False

    #print("Data:", data)
    data = request.json
    topic = data.get('deviceName')
    value = data.get('value')
    for i in range(len(dev_func)):
        if topic == dev_func[i]['name']:
            devices[i]['component']['switch'] = value
            msg = {
                "topic": topic,
                "opt" : data.get('opt'),
                "key" : data.get('key'),
                "value": value
            }
            return dev_func[i]['set'](topic, msg)

    return False

def read_device():
    if len(devices) != len(dev_func):
        print("Error: The length of devices and dev_func lists do not match.")
        return False

    for i in range(len(devices)):
        topic = devices[i]['name']
        msg = {
            "topic": topic,
            "opt" : "get",
            "key": "all",
            "value": None
        }

        tmp = dev_func[i]['dev_st'](topic, msg)
        if tmp != None:
            devices[i]['component'] = tmp
        #print(devices[i])

    return True

def update_device(data):
    if len(devices) != len(dev_func):
        print("Error: The length of devices and dev_func lists do not match.")
        return False

    #print("Control Data:", data)
    device = data.get('deviceName')
    opt = data.get('opt')
    key = data.get('key')
    value = data.get('value')
    for i in range(len(dev_func)):
        if device == dev_func[i]['name']:
            devices[i]['component'][key] = value
            msg = {
                "topic": device,
                "opt" : data.get('opt'),
                "key" : key,
                "value": value
            }
            return dev_func[i]['set'](device, msg)

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
    return jsonify(devices)

@app.route('/')
def index():
    read_device()
    return render_template('index.html', devices=devices)

if __name__ == '__main__':
    init_server()
    app.run(host='0.0.0.0', port=8000, debug=True)

