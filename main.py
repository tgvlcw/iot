from flask import Flask, render_template, request, jsonify
import hardware as hd

app = Flask(__name__)

devices = [
    {'id': 1, 'name': 'Light', 'status': None, 'brightness': None},
    {'id': 2, 'name': 'Fan', 'status': None, 'speed': None},
    {'id': 3, 'name': 'TV', 'status': None},
    {'id': 4, 'name': 'Sound', 'status': None, 'volume': None}
]

def init_device(device_name, new_status):
    for device in devices:
        if device['name'] == device_name:
            if device_name == 'Light':
                return hd.do_light(device, new_status)
            elif device_name == 'Fan':
                return hd.do_fan(device, new_status)
            elif device_name == 'TV':
                return hd.do_tv(device, new_status)
            elif device_name == 'Sound':
                return hd.do_sound(device, new_status)

    return False

def get_status():
    for device in devices:
        if device['name'] == 'Light':
            hd.light_status(device)
        elif device['name'] == 'Fan':
            hd.fan_status(device)
        elif device['name'] == 'TV':
            hd.tv_status(device)
        elif device['name'] == 'Sound':
            hd.sound_status(device)

    print(devices)
    return True

@app.route('/api/toggle-device', methods=['POST'])
def toggle_device():
    data = request.json
    device_name = data.get('deviceName')
    new_status = data.get('status')
    #print("Data:", data)
    if init_device(device_name, new_status):
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

