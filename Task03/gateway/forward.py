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
        b"T": 1,
        b"H": 2,
}
PKT_FORMAT = "<cfHx"

# Configure RFM95
spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)
rfm9x.enable_crc = True

# Forge ACK packet
ack_pkt = bytes(struct.pack(PKT_FORMAT, b"A", 0, 0x0000))

while True:
    packet = rfm9x.receive(with_header=True)

    if packet is not None:
        # Extract data from packet
        (s_type, s_val, s_time) = struct.unpack(PKT_FORMAT, packet[4:])
        print(s_type, s_val)
        # Send ACK to sensor to prevent local data storage
        rfm9x.send(ack_pkt, keep_listening=True)
        # Send data to the server
        endpoint = BASE_URL + str(SENSOR_MAP[s_type]) + "/datas"
        headers = { "Authorization": "Bearer " + GW_KEY }
        req = requests.post(endpoint, headers = headers, json = { "value": s_val, "createdAt": round((time.time() - s_time) * 1000) })
        print(req.status_code)
