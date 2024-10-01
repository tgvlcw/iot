import paho.mqtt.client as mqtt
import json

#broker = "192.168.31.26"
broker = "127.0.0.1"
port = 1883
topics = ["Light", "Fan", "TV", "Sound"]

def send_msg(topic, msg):
    print(f"send json msg: {msg}")
    client = mqtt.Client()
    client.connect(broker, port)
    client.publish(topic, msg)
    client.disconnect()


