#include <LiquidCrystal.h>             
#include "DHT.h"                       

#define DHTPIN 8                       
#define DHTTYPE DHT11                  

LiquidCrystal lcd(1, 2, 4, 5, 6, 7);   
DHT dht(DHTPIN, DHTTYPE);              

const int yellowLED = 9;               
const int blueLED = 10;                
const int whiteLED = 11;               

void setup() {
  lcd.begin(16, 2);                    
  lcd.setCursor(0, 0);                 
  pinMode(blueLED, OUTPUT);            
  pinMode(yellowLED, OUTPUT);          
  pinMode(whiteLED, OUTPUT);           

  dht.begin();                         
  digitalWrite(blueLED,LOW);           
  digitalWrite(yellowLED,LOW);         
  digitalWrite(whiteLED, LOW);         

  lcd.print("Temperature:");           
  
  lcd.setCursor(0, 1);                
  lcd.print("Humidity   :");          
}

void loop() {
  delay(500);                         
  float T = dht.readTemperature();    
  float H = dht.readHumidity();       

  if (isnan(H) && isnan(T)) {          
    lcd.print("ERROR");               
    return;                           
  }

  if(T>22){                           
    digitalWrite(yellowLED, HIGH);    
    digitalWrite(blueLED, LOW);       
    digitalWrite(whiteLED, LOW);      
    
  }
  else if(T<22){                      
    digitalWrite(blueLED, HIGH);      
    digitalWrite(yellowLED, LOW);     
    digitalWrite(whiteLED, LOW);      
  }

  else if(T=22){                      
    digitalWrite(whiteLED, HIGH);     
    digitalWrite(yellowLED, LOW);     
    digitalWrite(blueLED, LOW);       
  }

  lcd.setCursor(12, 0);               
  lcd.print(T);                       
  lcd.setCursor(12, 1);               
  lcd.print(H);                       
}
