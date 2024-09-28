from mqtt_conf import send_msg

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

def do_device(device_name, opt, value):
    send_msg(device_name, opt, value)
    return True
