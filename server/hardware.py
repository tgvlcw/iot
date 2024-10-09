from mqtt_server import send_msg, recv_msg
import json

def __read_device(topic, msg):
    return recv_msg(device, json.dumps(msg))

def __update_device(topic, msg):
    send_msg(topic, json.dumps(msg))
    return True

def light_status(device, msg):
    data = {
        "switch": "ON",
        "brightness": 80
    }
    return recv_msg(device, json.dumps(msg))

def fan_status(device, msg):
    data = {
        "switch": "ON",
        "speed": 2
    }

    #return recv_msg(device, json.dumps(msg))
    return data

def tv_status(device, msg):
    data = {
        "switch": "ON",
        "event": None,
    }
    return data

def sound_status(device, msg):
    data = {
        "switch": "ON",
        "volume": 30
    }
    return data

def do_device(topic, msg):
    send_msg(topic, json.dumps(msg))
    return True
