from flask import Flask, render_template, request, jsonify
import hardware as hd

app = Flask(__name__)

devices = [
    {'id': 1, 'name': 'Light', 'status': '', 'value': 0},
    {'id': 2, 'name': 'Fan', 'status': '', 'value': 0},
    {'id': 3, 'name': 'TV', 'status': '', 'value': 0},
    {'id': 4, 'name': 'Sound', 'status': '', 'value': 0}
]

dev_func = [
    {'name': 'Light', 'set': hd.do_device, 'dev_st': hd.light_status},
    {'name': 'Fan', 'set': hd.do_device, 'dev_st': hd.fan_status},
    {'name': 'TV', 'set': hd.do_device, 'dev_st': hd.tv_status},
    {'name': 'Sound', 'set': hd.do_device, 'dev_st': hd.sound_status},
]

def change_status(data):
    if len(devices) != len(dev_func):
        print("Error: The length of devices and dev_func lists do not match.")
        return False

    print("Data:", data)
    data = request.json
    device_name = data.get('deviceName')
    opt = data.get('opt')
    new_status = data.get('status')
    for i in range(len(dev_func)):
        if device_name == dev_func[i]['name']:
                devices[i]['status'] = new_status
                return dev_func[i]['set'](device_name, opt, new_status)

    return False

def get_status():
    if len(devices) != len(dev_func):
        print("Error: The length of devices and dev_func lists do not match.")
        return False

    for i in range(len(devices)):
        dev_func[i]['dev_st'](devices[i])

    return True

@app.route('/api/control-device', methods=['POST'])
def control_device():
    if len(devices) != len(dev_func):
        print("Error: The length of devices and dev_func lists do not match.")
        return jsonify({'success': False}), 404

    data = request.json
    print("Control Data:", data)
    device_name = data.get('deviceName')
    opt = data.get('opt')
    value = data.get('value')
    for i in range(len(dev_func)):
        if device_name == dev_func[i]['name']:
            devices[i]['value'] = value
            dev_func[i]['set'](device_name, opt, value)
            break

    return jsonify({'success': True})

@app.route('/api/toggle-device', methods=['POST'])
def toggle_device():
    data = request.json
    if change_status(data):
        return jsonify({'success': True})

    return jsonify({'success': False}), 404

@app.route('/api/devices', methods=['GET'])
def get_devices():
    return jsonify(devices)

@app.route('/')
def index():
    get_status()
    return render_template('index.html', devices=devices)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

