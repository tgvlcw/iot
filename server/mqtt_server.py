import paho.mqtt.client as mqtt
import json
import threading

#broker = "192.168.31.26"
broker = "127.0.0.1"
port = 1883
topics = ["Light", "Fan", "TV", "Sound"]
ack = ["ACK"]

server = None
feedback_event = threading.Event()
sending = False

def on_connect(server, userdata, flags, rc):
    print("Server connected with result code:", rc)
    for topic in topics + ack:
        server.subscribe(topic)

def on_publish(client, userdata, mid):
    global sending
    sending = False
    print(f"Message with ID {mid} has been published.")

def on_message(server, userdata, msg):
    global sending

    if sending == True:
        return

    print(f"Received message: {msg.payload.decode()}, topic: {msg.topic}, flag: {sending}")
    handle_message(msg.payload.decode())

def handle_message(message):
    parsed_data = json.loads(message)
    opt = parsed_data["opt"]
    key = parsed_data["key"]
    value = parsed_data["value"]

    if opt == "set":
        print(f"key: {key}, value: {value}")
        feedback_event.set()
    else:
        print("Invalid operation type")

def send_msg(topic, msg):
    global sending
    sending = True

    print(f"send json msg: {msg}")
    server.publish(topic, msg)

def recv_msg(topic, msg):
    global sending
    send_msg(topic, msg)

    print(f"Waiting for receive msg...")
    feedback_event.clear()
    feedback_event.wait(timeout = 5)

    if sending_msg:
        print("No feedback received for:", message)
    else:
        print("Feedback received successfully.")


def init_server():
    global server
    server = mqtt.Client()
    server.on_connect = on_connect
    server.on_publish = on_publish
    server.connect(broker, port)
    server.loop_start()

