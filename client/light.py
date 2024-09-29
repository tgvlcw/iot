import paho.mqtt.client as mqtt
import time
import json

broker = "192.168.31.26"
port = 1883
topic = "Light"
ack = "ACK"
sending_msg = False

device = {
    'name': 'Light',
    'status': {
        'name': 'switch',
        'value': 'OFF'
    },
    'brightness': {
        'name': 'brightness',
        'value': 33
    }
}

def init_client():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_publish = on_publish
    client.connect(broker, port)
    client.loop_start()
    return client

def on_connect(client, userdata, flags, rc):
    print("Client connected with result code:", rc)
    client.subscribe(topic)
    client.subscribe(ack)

def on_message(client, userdata, msg):
    global sending_msg

    if sending_msg == True:
        return

    print(f"Received message: {msg.payload.decode()}, topic: {msg.topic}, flag: {sending_msg}")

    handle_message(msg.payload.decode())

def on_publish(client, userdata, mid):
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
    elif opt == "get":
        get_device(key)
    else:
        print("Invalid operation type")

def send_msg(client, topic, message):
    global sending_msg
    sending_msg = True

    print(f"Send message: {message}")
    client.publish(topic, message, qos=1)

def set_device(key, value):
    #print(f"Before device: {device}")
    if key == "switch":
        device['status']['value'] = value
    elif key == "brightness":
        device['brightness']['value'] = value

    #print(f"After device: {device}")

def get_device(key):
    data = {
        "topic": topic,
        "opt": "set",
        "key": "brightness",
        "value": device['brightness']['value']
    }

    send_msg(client, topic, json.dumps(data))

def send_feedback(message):
    global sending_msg
    sending_msg = True
    print(f"ACK: {message}")
    client.publish(ack, message, qos=1)

client = init_client()

try:
    while True:
        time.sleep(2)
except KeyboardInterrupt:
    print("Client shutting down.")
