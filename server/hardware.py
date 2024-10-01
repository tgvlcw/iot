from mqtt_server import send_msg
import json

def light_status(device):
    device['component']['switch'] = 'ON'
    device['component']['brightness'] = 80
    #recv_msg(device, json.dumps(data))

def fan_status(device):
    device['component']['switch'] = 'ON'
    device['component']['speed'] = 2

def tv_status(device):
    device['component']['switch'] = 'ON'

def sound_status(device):
    device['component']['switch'] = 'ON'
    device['component']['volume'] = 30

def do_device(device, msg):
    send_msg(device, json.dumps(msg))
    return True
