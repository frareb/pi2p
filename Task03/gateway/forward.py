import digitalio
import board
import busio
import adafruit_rfm9x
import struct
import time
import requests

RADIO_FREQ_MHZ = 868.0
CS = digitalio.DigitalInOut(board.D5)
RESET = digitalio.DigitalInOut(board.D6)

BASE_URL = "http://192.168.2.107:3000/sensors/"
GW_KEY = "firstGatewayKey"
SENSOR_MAP = {
        b"T": 1
}

spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)

while True:
    packet = rfm9x.receive(with_header=True)

    if packet is not None:
        (s_type, s_val) = struct.unpack("<cfx", packet[4:])
        print(s_type)
        endpoint = BASE_URL + str(SENSOR_MAP[s_type]) + "/datas"
        headers = { "Authorization": "Bearer " + GW_KEY }
        req = requests.post(endpoint, headers = headers, json = { "value": s_val, "createdAt": round(time.time() * 1000) })
        print(req.status_code)
