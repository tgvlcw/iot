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

def do_device(device, opt, value):
    if opt == 'change':
        send_msg(value, device['name'])
        device['status'] = value
    print(device)
    return True
