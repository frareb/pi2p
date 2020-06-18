/*
 * Program that read a value in °C from DS18B20, sends it using RFM95
 * and then goes to sleep for a four seconds, and sends a new read
 * 
 * This demo was made to test electrical consumption
 * when sending something every regularly.
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
 * | DS18B20 | Arduino |
 *    3.3V ----> 3V3 --|
 *    Gnd -----> Gnd   | 10k resistor from Vcc to DATA
 *    DATA ----> D2 ---|
 * 
 * To measure consumption, transfer the program,
 * and power the Arduino standalone using power supply
 * connected to 1 Ohm resistor going to Arduino.
 * 
 * Visualize the potential between the resistor's pins
 * to see current shape (1 V / A).
 */

#include <SPI.h>
#include <RH_RF95.h>
#include <OneWire.h>
#include <DallasTemperature.h>

#include <avr/interrupt.h>
#include <avr/sleep.h>
#include <avr/power.h>

#define RFM95_INT 3
#define RFM95_CS  4
#define RFM95_RST 6
#define TEMP_PIN  2

// Setup oneWire instance & DallasTemperature library
OneWire oneWire(TEMP_PIN);  
DallasTemperature temp_sensor(&oneWire);

// Singleton instance of the radio driver
RH_RF95 rf95(RFM95_CS, RFM95_INT);

// Create an union for data conversion
typedef union __RadioPacket {
  char raw[6];
  
  struct __HIPacket {
    char type;
    float value;
    char __padding;
  } hi;
} RadioPacket;

unsigned char sleep_count = 0;

void setup() {
  // Reset watchdog in case of brown-out during interrupt
  wdt_rst();
  
  Serial.begin(9600);
  while (!Serial); // Wait for serial port to be available

  // Init DS18B20
  temp_sensor.begin();

  // Perform chip reset
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
}

void loop() {
  // Get temperature and forge packet
  temp_sensor.requestTemperatures();

  RadioPacket pkt;
  pkt.hi.type = 'T';
  pkt.hi.value = temp_sensor.getTempCByIndex(0);

  // Send the packet  
  if(!rf95.send(pkt.raw, sizeof(pkt.raw))) {
    Serial.println("unable to send message");
    while(1);
  }
  rf95.waitPacketSent();

  // Wait for a reply
  uint8_t rcv_buf[RH_RF95_MAX_MESSAGE_LEN];
  uint8_t rcv_len = sizeof(rcv_buf);
  
  if(rf95.waitAvailableTimeout(3000)) {
    if(rf95.recv(rcv_buf, &rcv_len)) {
      Serial.print("got reply!");
    }
  }

  deepsleep();
}

void wdt_rst(void) {
  cli();
  __asm__("wdr");
  
  // Clear WDRF & WDE bits
  MCUSR &= ~0x08;
  WDTCSR |= 0x18;
  __asm__("nop");
  WDTCSR = 0x00;

  sei();
}

void deepsleep(void) {
  cli();
  
  // Enable watchdog interrupt
  WDTCSR |= 0x18;
  __asm__("nop");
  WDTCSR |= 0x4E;

  // Set sleep for LoRa module
  if(!rf95.sleep()) {
    Serial.println("could not go to sleep");
    while(1);
  }

  // Go to sleep
  set_sleep_mode(SLEEP_MODE_PWR_SAVE);
  sleep_enable();
  sei();
  sleep_mode();

  // On deepsleep end, restart from here: reenable power
  sleep_disable();
  power_all_enable();
}

// Interrupt on watchdog restore (end of sleep)
ISR(WDT_vect) {
  wdt_rst();
}
