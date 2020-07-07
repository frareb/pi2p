import digitalio
import board
import busio
import adafruit_rfm9x
import struct
import time
import requests
import sit

RADIO_FREQ_MHZ = 868.0
CS = digitalio.DigitalInOut(board.D5)
RESET = digitalio.DigitalInOut(board.D6)

BASE_URL = "http://192.168.2.107:3000/sensors/"
GW_KEY = "firstGatewayKey"
SENSOR_MAP = {
        b"T": 1,
        b"H": 2,
        b"U": 3,
}
PKT_FORMAT = "<cfHb"

# Configure RFM95
spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
rfm9x = adafruit_rfm9x.RFM9x(spi, CS, RESET, RADIO_FREQ_MHZ)
rfm9x.enable_crc = True

# Forge ACK packet
ack_pkt = bytes(struct.pack(PKT_FORMAT, b"A", 0.0, 0, 0))
key = b'\x55\xBA\xBD\xCC\x41\x0C\x4C\x2F\xE5\x55'

while True:
    packet = rfm9x.receive(with_header=True)

    if packet is not None:
        # Extract data from packet
        raw_packet = bytes(packet[4:])
        decrypted_packet = sit.pydecrypt(key, raw_packet)
        (s_type, s_val, s_time, s_id) = struct.unpack(PKT_FORMAT, decrypted_packet)
        print(s_type, s_val)
        # Send ACK to sensor to prevent local data storage
        rfm9x.send(ack_pkt, keep_listening=True)

        # Send data to the server if valid
        if s_id == 0 and s_type in SENSOR_MAP:
            endpoint = BASE_URL + str(SENSOR_MAP[s_type]) + "/datas"
            headers = { "Authorization": "Bearer " + GW_KEY }
            data = {
                "value": s_val,
                "createdAt": round((time.time() - s_time) * 1000)
            }

            req = requests.post(endpoint, headers = headers, json = data)
            print(req.status_code)
        else:
            print("Malicious packet!")
