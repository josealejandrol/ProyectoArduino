#include <SoftwareSerial.h>
SoftwareSerial BT(1,0);

void setup() {
  pinMode(13, OUTPUT);
  BT.begin(9600);
}
char led;

void loop() {
  led=(BT.read());
  switch(led){
    case 'a': 
      digitalWrite(13,HIGH);
      delay(2000);
      digitalWrite(13,LOW); 
    break;
    case 'b': 
      digitalWrite(12,HIGH); 
      delay(2000);
      digitalWrite(12,LOW);
    break;
    default: 
      digitalWrite(11,HIGH);
      delay(2000);
      digitalWrite(11,LOW);
    break;
  }
}
