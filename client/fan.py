import paho.mqtt.client as mqtt

broker = "192.168.31.26"
port = 1883
topic = "Fan"

def on_connect(client, userdata, flags, rc):
    print("Connected with result code:", rc)
    client.subscribe(topic)

def on_message(client, userdata, msg):
    print(f"Received message: {msg.payload.decode()} on topic: {msg.topic}")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(broker, port)

client.loop_forever()

