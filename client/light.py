import paho.mqtt.client as mqtt
import time
import json

#broker = "192.168.31.26"
broker = "127.0.0.1"
port = 1883
topic = "Light"
sending_msg = False
client = None

device = {
    'name': 'Light',
    'component': {
        'switch': 'ON',
        'brightness':  43
    }
}

def init_client():
    print("Starting Light device")
    client = mqtt.Client(protocol=mqtt.MQTTv5, callback_api_version=mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_publish = on_publish
    client.connect(broker, port)
    client.loop_start()
    return client

def on_connect(client, userdata, flags, rc, properties=None):
    print("Client connected with result code:", rc)
    client.subscribe(topic)

def on_message(client, userdata, msg):
    if sending_msg == True:
        return

    print(f"Received message: {msg.payload.decode()}, topic: {msg.topic}, flag: {sending_msg}")

    handle_message(msg.payload.decode())

def on_publish(client, userdata, mid, rc=0, properties=None):
    global sending_msg
    sending_msg = False
    #print(f"Message with ID {mid} has been published.")

def handle_message(message):
    parsed_data = json.loads(message)
    opt = parsed_data["opt"]
    key = parsed_data["key"]

    if opt == "set":
        value = parsed_data["value"]
        set_device(key, value)
    else:
        print("Invalid operation type")

def send_msg(client, topic, message):
    global sending_msg
    sending_msg = True

    print(f"Send message: {message}")
    client.publish(topic, message, qos=1)

def set_device(key, value):
    #set light brightness
    device['component'][key] = value

def read_status(key):
    if key == "all":
        data = device['component']
    else:
        data = device['component'][key]

    msg = {
        "topic": topic,
        "opt": "set",
        "key": key,
        "data": data
    }

    send_msg(client, topic, json.dumps(msg))

def loop_update():
    status = device['component']['switch']

    if status == 'ON':
        read_status('all')

def exit_client():
    set_device("switch", "OFF")
    read_status('all')
    client.loop_stop()
    client.disconnect()

if __name__ == '__main__':
    client = init_client()

    try:
        while True:
            loop_update()
            time.sleep(5)
    except KeyboardInterrupt:
        print("Client shutting down.")
        exit_client()
