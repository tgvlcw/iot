import paho.mqtt.client as mqtt

broker = "192.168.31.26"
port = 1883
topics = ["Light", "Fan", "TV", "Sound"]

def send_msg(status, topic):
    print(f"status: {status}, topic: {topic}")
    client = mqtt.Client()
    client.connect(broker, port)
    client.publish(topic, f"Device: {topic}, new status: {status}")
    client.disconnect()


