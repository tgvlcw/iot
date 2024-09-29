import paho.mqtt.client as mqtt
import time
import threading
import json

broker = "192.168.31.26"
port = 1883
topics = ["Light", "Fan", "TV", "Sound"]
ack = ["ACK"]

pending_messages = {}
feedback_event = threading.Event()
sending_msg = False

def init_server():
    server = mqtt.Client()
    server.on_connect = on_connect
    server.on_message = on_message
    server.on_publish = on_publish
    server.connect(broker, port)
    server.loop_start()
    return server

def on_connect(server, userdata, flags, rc):
    print("Server connected with result code:", rc)
    for topic in topics + ack:
        server.subscribe(topic)

def on_message(server, userdata, msg):
    global sending_msg

    if sending_msg == True:
        return

    print(f"Received message: {msg.payload.decode()}, topic: {msg.topic}, flag: {sending_msg}")
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

def on_publish(client, userdata, mid):
    global sending_msg
    sending_msg = False
    print(f"Message with ID {mid} has been published.")

def send_msg(server, topic, message):
    global sending_msg
    sending_msg = True

    print(f"Send message: {message}")
    server.publish(topic, message, qos=1)

def recv_msg(server, topic, message):
    global sending_msg
    send_msg(server, topic, message)

    print(f"Waiting for receive msg...")
    feedback_event.clear()
    feedback_event.wait(timeout = 5)

    if sending_msg:
        print("No feedback received for:", message)
    else:
        print("Feedback received successfully.")

def send_test():
    data = {
        "topic": "Light",
        "opt" : "set",
        "key": "brightness",
        "value": 61
    }
    send_msg(server, "Light", json.dumps(data))
    data['value'] = 68
    time.sleep(2)
    send_msg(server, "Light", json.dumps(data))
    data['value'] = 71
    time.sleep(2)
    send_msg(server, "Light", json.dumps(data))

def recv_test():
    data = {
        "topic": "Light",
        "opt" : "get",
        "key": "brightness",
        "value": None
    }
    recv_msg(server, "Light", json.dumps(data))

try:
    server = init_server()

    while True:
        send_test()
        recv_test()
        time.sleep(2)
except KeyboardInterrupt:
    print("Server shutting down.")
finally:
    server.disconnect()
