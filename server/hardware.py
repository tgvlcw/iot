from mqtt_server import send_msg
import json

def light_status(device):
    device['status'] = 'ON'
    device['brightness'] = 80

def fan_status(device):
    device['status'] = 'ON'
    device['speed'] = 2

def tv_status(device):
    device['status'] = 'ON'

def sound_status(device):
    device['status'] = 'ON'
    device['volume'] = 30

def do_device(device, msg):
    send_msg(device, json.dumps(msg))
    return True
