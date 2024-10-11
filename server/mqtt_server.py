import paho.mqtt.client as mqtt
import json
import threading

#broker = "192.168.31.26"
broker = "127.0.0.1"
port = 1883
topics = None
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

def on_message(server, userdata, msg, devices_callback):
    global sending

    if sending == True:
        return

    print(f"Received msg: {msg.payload.decode()}, flag: {sending}")
    handle_message(msg.payload.decode(), devices_callback)

def handle_message(message, callback):
    msg = json.loads(message)

    if not msg or 'topic' not in msg or 'opt' not in msg:
        print("Invalid msg type")
        return

    opt = msg['opt']
    topic = msg['topic']
    if opt == "set":
        callback(topic, msg.get('data', None))
    else:
        print("Invalid operation type")

def send_msg(topic, msg):
    global sending
    sending = True

    print(f"Send msg: {msg}")
    server.publish(topic, msg, qos=1)

def init_mqtt_server(devices_callback, devices):
    global server
    global topics

    topics = {device['name'] for device in devices}
    server = mqtt.Client()
    server.on_connect = on_connect
    server.on_publish = on_publish
    server.on_message = lambda client, userdata, msg: on_message(client, userdata, msg, devices_callback)
    server.connect(broker, port)
    server.loop_start()

