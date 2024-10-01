import paho.mqtt.client as mqtt
import json

#broker = "192.168.31.26"
broker = "127.0.0.1"
port = 1883
topics = ["Light", "Fan", "TV", "Sound"]
ack = ["ACK"]
server = None

def on_connect(server, userdata, flags, rc):
    print("Server connected with result code:", rc)
    for topic in topics + ack:
        server.subscribe(topic)

def send_msg(topic, msg):
    print(f"send json msg: {msg}")
    server.publish(topic, msg)

def init_server():
    global server
    server = mqtt.Client()
    server.on_connect = on_connect
    server.connect(broker, port)
    server.loop_start()

