/*
 * Program that read values from sensors, sends them using RFM95
 * and then goes to sleep for four seconds, and sends a new read.
 * 
 * Pinout:
 * 
 * | RFM95 | Arduino |
 *   3.3V ---> 3V3
 *   Gnd ----> Gnd
 *   MISO ---> D12
 *   MOSI ---> D11
 *   SCK ----> D13
 *   NSS ----> D4
 *   DIO0 ---> D3
 *   RESET --> D6
 * 
 * | Sensor | Arduino |
 *    3.3V ----> 3V3 --|
 *    Gnd -----> Gnd   | 10k resistor from Vcc to DATA
 *    DS18B20 -> D2 ---|
 *    DHT11 ---> D7
 */

#include <SPI.h>
#include <EEPROM.h>
#include <RH_RF95.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#include <avr/interrupt.h>
#include <avr/sleep.h>
#include <avr/power.h>

#include "sit.h"

#define RFM95_INT 3
#define RFM95_CS  4
#define RFM95_RST 6
#define TEMP_PIN  9
#define DHT_PIN   7

#define PKT_LENGTH    8
#define EE_COUNT_ADDR 0x00
#define EE_STORE_ADDR 0x01

// Setup oneWire instance & DallasTemperature library
OneWire oneWire(TEMP_PIN);  
DallasTemperature ds18b20(&oneWire);

// Singleton instance of the DHT11 sensor
DHT_Unified dht(DHT_PIN, DHT11);

// Singleton instance of the radio driver
RH_RF95 rf95(RFM95_CS, RFM95_INT);

// Create an union for data conversion
typedef union __RadioPacket {
  char raw[PKT_LENGTH];
  
  struct __HIPacket {
    char type;
    float value;
    unsigned short timeshift;
    char id;
  } hi;
} RadioPacket;

unsigned char sleep_cycles = 0;
unsigned long old_time;

// Key for packet encryption
uint16_t key[5] = { 0x55BA, 0xBDCC, 0x410C, 0x4C2F, 0xE555 };

void setup() {
  // Reset watchdog in case of brown-out during interrupt
  sleep_disable_wdt();
  
  Serial.begin(9600);
  while (!Serial); // Wait for serial port to be available

  // Init sensors
  ds18b20.begin();
  dht.begin();

  // Perform chip reset
  pinMode(RFM95_RST, OUTPUT);
  digitalWrite(RFM95_RST, HIGH);
  delay(100);
  digitalWrite(RFM95_RST, LOW);
  delay(10);
  digitalWrite(RFM95_RST, HIGH);
  delay(10);
  
  if(!rf95.init()) {
    Serial.println("init failed");
    while(1);
  }
  // Defaults after init are 434.0MHz, 13dBm, Bw = 125 kHz, Cr = 4/5, Sf = 128chips/symbol, CRC on

  if(!rf95.setFrequency(868.0)) {
    Serial.println("frequency set failed");
    while(1);
  }

  // Store initial timestamp
  old_time = millis();
}

void loop() {
  // Update timestamps in queue
  stored_pkts_refresh();
  
  // Read sensors values
  sensors_event_t humidity_results;
  ds18b20.requestTemperatures();
  dht.humidity().getEvent(&humidity_results);

  // Forge and send packets
  RadioPacket pkt;
  pkt.hi.type = 'T';
  pkt.hi.value = ds18b20.getTempCByIndex(0);
  pkt.hi.timeshift = 0;
  pkt.hi.id = 0;
  pkt_send_with_queue(&pkt);

  // Short sleep before packet resend
  delay(500);
  sleep_enter(1);

  pkt.hi.type = 'H';
  pkt.hi.value = humidity_results.relative_humidity;
  pkt.hi.timeshift = 0;
  pkt.hi.id = 0;
  pkt_send_with_queue(&pkt);

  // Sleep for a minute
  sleep_enter(6);
}

void pkt_send_with_queue(RadioPacket *pkt) {
  // Send current packet
  if(pkt_send(pkt)) {
    // Try to resend failing packets
    stored_pkts_send();
  } else {
    // If fail, append packet to queue
    stored_pkts_append(pkt);
  }
}

bool pkt_send(RadioPacket *pkt) {
  uint8_t encrypted_pkt[8];
  
  sit_encrypt(key, (uint8_t *) pkt->raw, encrypted_pkt);
  
  // Send the packet  
  if(!rf95.send(encrypted_pkt, sizeof(encrypted_pkt))) {
    Serial.println("unable to send message");
    while(1);
  }
  
  rf95.waitPacketSent();

  // Wait for a reply
  uint8_t rcv_buf[RH_RF95_MAX_MESSAGE_LEN];
  uint8_t rcv_len = sizeof(rcv_buf);
  
  if(rf95.waitAvailableTimeout(1000)) {
    if(rf95.recv(rcv_buf, &rcv_len)) {
      return true;
    }
  }

  // No reply: send failure
  return false;
}

void stored_pkts_send(void) {
  // Get current packet count
  unsigned char remaining_pkts = EEPROM.read(EE_COUNT_ADDR);
  
  RadioPacket current_pkt;

  while(remaining_pkts > 0) {
    remaining_pkts--;

    // Reassemble the data packet bytes
    for(char frag = 0; frag < PKT_LENGTH; frag++) {
      current_pkt.raw[frag] = EEPROM.read(EE_STORE_ADDR + PKT_LENGTH * remaining_pkts + frag);
    }

    // Try to send packet
    if(!pkt_send(&current_pkt)) break;
    EEPROM.write(EE_COUNT_ADDR, remaining_pkts);
  }
}

void stored_pkts_append(RadioPacket *pkt) {
  // Get current packet count
  unsigned char queue_pkts = EEPROM.read(EE_COUNT_ADDR);

  // Dissassemble the data packet bytes
  for(char frag = 0; frag < PKT_LENGTH; frag++) {
    EEPROM.write(EE_STORE_ADDR + PKT_LENGTH * queue_pkts + frag, pkt->raw[frag]);
  }

  // Increment the packet queue count
  EEPROM.write(EE_COUNT_ADDR, queue_pkts + 1);
}

void stored_pkts_refresh(void) {
  // Get current packet count
  unsigned char remaining_pkts = EEPROM.read(EE_COUNT_ADDR);
  unsigned long current_time = millis();
  
  RadioPacket current_pkt;

  while(remaining_pkts > 0) {
    remaining_pkts--;

    // Reassemble the data packet bytes
    for(char frag = 0; frag < PKT_LENGTH; frag++) {
      current_pkt.raw[frag] = EEPROM.read(EE_STORE_ADDR + PKT_LENGTH * remaining_pkts + frag);
    }

    // Update time shift (stored in seconds)
    // Current method is quite meh... Millis doesn't work when sleeping, so I manually add 60 second
    current_pkt.hi.timeshift += 60 + ((current_time - old_time) / 1000);

    // Restore the packet in EEPROM
    for(char frag = 0; frag < PKT_LENGTH; frag++) {
      EEPROM.write(EE_STORE_ADDR + PKT_LENGTH * remaining_pkts + frag, current_pkt.raw[frag]);
    }
  }

  // Update local timestamp
  old_time = current_time;
}

void sleep_disable_wdt(void) {
  cli();
  __asm__("wdr");
  
  // Clear WDRF & WDE bits
  MCUSR &= ~(1 << WDRF);
  WDTCSR |= (1 << WDCE) | (1 << WDE);
  WDTCSR = 0x00;

  sei();
}

void sleep_enable_wdt(void) {
  cli();
  __asm__("wdr");

  // Enable watchdog interrupt at 8s rate
  WDTCSR |= (1 << WDCE) | (1 << WDE);
  WDTCSR = (1 << WDP0) | (1 << WDP3);
  WDTCSR |= _BV(WDIE);

  sei();
}

void sleep_enter(unsigned char cycles) {
  if(!rf95.sleep()) {
    Serial.println("could not go to sleep");
    while(1);
  }

  // Do not remove this delay or sleep will not work
  delay(100);
  
  sleep_cycles = 0;
  sleep_enable_wdt();

  // Go to sleep
  set_sleep_mode(SLEEP_MODE_PWR_DOWN);
  while(sleep_cycles++ < cycles) {
    sleep_enable();
    sleep_mode();
  }

  // On sleep end, restart from here: reenable power
  sleep_disable();
  power_all_enable();
}

// Interrupt on watchdog restore (end of sleep)
ISR(WDT_vect) {}
