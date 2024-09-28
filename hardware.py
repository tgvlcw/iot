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

def do_light(device, status):
    send_msg(status, device['name'])
    device['status'] = status
    print(device)
    return True

def do_fan(device, status):
    send_msg(status, device['name'])
    device['status'] = status
    print(device)
    return True

def do_tv(device, status):
    send_msg(status, device['name'])
    device['status'] = status
    print(device)
    return True

def do_sound(device, status):
    send_msg(status, device['name'])
    device['status'] = status
    print(device)
    return True
