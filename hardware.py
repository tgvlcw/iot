from mqtt_conf import send_msg

def do_light(device, status):
    send_msg(status, device['name'])
    device['status'] = status
    return True

def do_fan(device, status):
    send_msg(status, device['name'])
    device['status'] = status
    return True

def do_tv(device, status):
    send_msg(status, device['name'])
    device['status'] = status
    return True

def do_sound(device, status):
    send_msg(status, device['name'])
    device['status'] = status
    return True
