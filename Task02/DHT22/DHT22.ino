// CAPTEUR DHT22 ; DFROBOT
// François le 14/04/2020
// Ceci est un fichier d'exemple pour le travail à venir : réflexion sur la
// vérification des données (outOfBounds), économie d'énergie, périodicité des
// mesures.

// [1] Vcc to 5V ; Gnd to ground ; S to digital pin 2

// [2] DHT22
// lib from sketch / manage librairies "Adafruit dht sensor" (https://github.com/adafruit/DHT-sensor-library)

// [4] sleep mode
// lib from https://github.com/rocketscream/Low-Power

// [5] watchdog
// A FAIRE ?

#include "DHT.h"
#include "LowPower.h" // sleep mode
#include "avr/wdt.h" // watchdog

#define DHTPIN 2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN,OUTPUT);
  digitalWrite(LED_BUILTIN,LOW); // LED 13 LOW
  Serial.println(F("----- DHT22 test! -----"));
  dht.begin();
}

float readFromDHT22_t(){
  float t = dht.readTemperature();
  if (isnan(t)) {
    Serial.println(F("Failed to read temperature from DHT sensor!"));
    return;
  }
  if(t < -40 || t > 100){ // temperature out of bounds
    t = sqrt(-1);
  }
  return t;
}

float readFromDHT22_h(){
  float h = dht.readHumidity();
  if (isnan(h)) {
    Serial.println(F("Failed to read humidity from DHT sensor!"));
    return;
  }
  if(h > 100 || h < 0){ // humidity out of bounds
    h = sqrt(-1);
  }
  return h;
}

void loop() {
  delay(2000); // 2s min between two DHT22 reads
  //digitalWrite(LED_BUILTIN,HIGH); // LED 13 HIGH
  float h = readFromDHT22_h();
  float t = readFromDHT22_t();
  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.println(F("°C "));
  // ------- sleep mode init. -------
  //Serial.println("Arduino in sleep mode");
  Serial.println("...");
  delay(1000);
  //digitalWrite(LED_BUILTIN,LOW); // LED 13 LOW
  int downTimeLoop = 0;
  while(downTimeLoop < 75){
    LowPower.idle(SLEEP_8S, ADC_OFF, TIMER2_OFF, TIMER1_OFF, TIMER0_OFF,
      SPI_OFF, USART0_OFF, TWI_OFF);
    downTimeLoop++;
  }
  //Serial.println("Arduino up");
  // ------- sleep mode end ---------
}
