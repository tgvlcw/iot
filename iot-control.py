from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

devices = [
    {'id': 1, 'name': 'Light', 'status': 'OFF'},
    {'id': 2, 'name': 'Fan', 'status': 'ON'},
    {'id': 3, 'name': 'TV', 'status': 'ON'},
    {'id': 4, 'name': 'Sound', 'status': 'OFF'}
]

def operate_device(device_name, new_status):
    for device in devices:
        if device['name'] == device_name:
            if device_name == 'Light':
                device['status'] = new_status
                return True
            elif device_name == 'Fan':
                device['status'] = new_status
                return True
            elif device_name == 'TV':
                device['status'] = new_status
                return True
            elif device_name == 'Sound':
                device['status'] = new_status
                return True

    return False

@app.route('/api/toggle-device', methods=['POST'])
def toggle_device():
    data = request.json
    device_name = data.get('deviceName')
    new_status = data.get('status')
    #print("Data:", data)
    if operate_device(device_name, new_status):
        return jsonify({'success': True})

    return jsonify({'success': False}), 404

@app.route('/api/devices', methods=['GET'])
def get_devices():
    return jsonify(devices)

@app.route('/')
def index():
    return render_template('index.html', devices=devices)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

