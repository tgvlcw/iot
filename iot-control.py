from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

devices = [
    {'id': 1, 'name': 'Light', 'status': 'OFF'},
    {'id': 2, 'name': 'Fan', 'status': 'ON'},
    {'id': 3, 'name': 'AC', 'status': 'OFF'},
    {'id': 4, 'name': 'TV', 'status': 'ON'},
    {'id': 5, 'name': 'Charger', 'status': 'OFF'},
    {'id': 6, 'name': 'Sound', 'status': 'OFF'}
]

@app.route('/api/toggle-device', methods=['POST'])
def toggle_device():
    data = request.json
    device_id = data.get('deviceId')
    new_status = data.get('status')
    for device in devices:
        if device['id'] == device_id:
            device['status'] = new_status
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

