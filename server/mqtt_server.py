import paho.mqtt.client as mqtt
import json
import threading

#broker = "192.168.31.26"
broker = "127.0.0.1"
port = 1883
topics = ["Light", "Fan", "TV", "Sound"]

recv_data = {
    "Light": None,
    "Fan": None,
    "TV": None,
    "Sound": None
}

server = None
sending = False

def on_connect(server, userdata, flags, rc):
    print("Server connected with result code:", rc)
    for topic in topics:
        server.subscribe(topic)

def on_publish(server, userdata, mid):
    global sending

    sending = False
    #print(f"Message with ID {mid} has been published, flag: {sending}")

def on_message(server, userdata, msg):
    global sending

    if sending == True:
        return

    print(f"Received msg: {msg.payload.decode()}, flag: {sending}")
    handle_message(msg.payload.decode())

def handle_message(message):
    msg = json.loads(message)
    opt = msg['opt']
    topic = msg['topic']

    if opt == "set":
        recv_data[topic] = msg.get('data', None)
    else:
        print("Invalid operation type")

def send_msg(topic, msg):
    global sending
    sending = True

    print(f"Send msg: {msg}")
    server.publish(topic, msg, qos=1)

def recv_msg(topic, msg):
    return recv_data[topic]

def init_mqtt_server():
    global server
    server = mqtt.Client()
    server.on_connect = on_connect
    server.on_publish = on_publish
    server.on_message = on_message
    server.connect(broker, port)
    server.loop_start()

