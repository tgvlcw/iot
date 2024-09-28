import paho.mqtt.client as mqtt

broker = "192.168.31.26"
port = 1883
topics = ["Light", "Fan", "TV", "Sound"]

def send_msg(topic, opt, value):
    #print(f"topic: {topic}, opt: {opt}, value: {value}")
    client = mqtt.Client()
    client.connect(broker, port)
    client.publish(topic, f"Device: {topic}, opt: {opt}, value: {value}")
    client.disconnect()


