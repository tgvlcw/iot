import paho.mqtt.client as mqtt
import time
import json

broker = "192.168.31.26"
port = 1883
topic = "Light"
ack = "ACK"
sending_msg = False

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

    if msg.topic == topic:
        handle_message(msg.payload.decode())

def on_publish(client, userdata, mid):
    global sending_msg
    sending_msg = False
    #print(f"Message with ID {mid} has been published.")

def handle_message(message):
    parsed_data = json.loads(message)
    if parsed_data["opt"] == "set":
        set_device(parsed_data["topic"], parsed_data["key"], parsed_data["value"])
    elif parsed_data["opt"] == "get":
        get_device_status(parsed_data["topic"])
    else:
        print("Invalid operation type")

def set_device(device_name, key, value):
    send_feedback(f"Success")

def get_device_status(device_name):
    status = "Device status: OK"
    print(status)
    send_feedback(status)

def send_feedback(message):
    global sending_msg
    sending_msg = True
    print(f"ACK: {message}")
    client.publish(ack, message, qos=1)

client = init_client()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Client shutting down.")
