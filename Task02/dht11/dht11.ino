//CAPTEUR DHT11
//AGHILES LE 16/04/2020
//Vcc to 5V ; Gnd to ground ; S to digital pin 8
// lib from sketch / manage librairies "Adafruit dht sensor" (https://github.com/adafruit/DHT-sensor-library)



#include <LiquidCrystal.h>             
#include "DHT.h"                              

#define DHTPIN 8                       
#define DHTTYPE DHT11                  

LiquidCrystal lcd(1, 2, 4, 5, 6, 7);   
DHT dht(DHTPIN, DHTTYPE);              
               

void setup() {
  lcd.begin(16, 2);                    
  lcd.setCursor(0, 0);                 
          

  dht.begin();                         
          

  lcd.print("Temperature:");           
  
  lcd.setCursor(0, 1);                
  lcd.print("Humidity   :");          
}

void loop() {
  delay(500);     //ATTENDRE 0.5 secondes avant de charger les valeurs                
  float T = dht.readTemperature();    // lire la temperature en celsius
  float H = dht.readHumidity();       // lire l'humidité en pourcentage

  if (isnan(H) && isnan(T)) {          
    lcd.print("ERROR");               
    return;                           
  }

  lcd.setCursor(12, 0);               
  lcd.print(T);                       
  lcd.setCursor(12, 1);               
  lcd.print(H);                       
}
