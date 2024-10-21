
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <time.h>
#include <NTPClient.h>
#include "DHT.h"
#include <WiFiUdp.h>
// defines pins numbers
const int trigPin = 2;  //D4
const int echoPin = 0;  //D3
#define LED D0 


#define DHTPIN D7     // what pin we're connected to
#define DTYPE DHT11   // DHT 11
DHT dht(DHTPIN,DTYPE,15);


// defines variables
long duration;
int distance;
 const String ssid="Vaish ";
 const String password="rhyc0978";
 //const String ssid="Mayank's iPhone";
 //const String password="mayank123";

WiFiUDP ntpUDP;

// Create an NTPClient instance to get time from NTP server
NTPClient timeClient(ntpUDP, "pool.ntp.org", 19800, 60000);

// Days and months arrays for date formatting


void setupwifi()
{
 
  WiFi.begin(ssid,password);
  Serial.println("\nConnecting...");

  while(WiFi.status()!=WL_CONNECTED){
    Serial.println(".");
    delay(100);
  }
  Serial.println("Connected to Wifi");
  Serial.println("ESP8266 IP: ");
  Serial.println(WiFi.localIP());

}

void callApi(int distance, float temperature, float humidity, String timestamp) {
  if(WiFi.status() == WL_CONNECTED) {
    Serial.println("Calling API");
    WiFiClient client;
    HTTPClient http;

/********************************REPLACE IP HERE:**********************************************/
    String serverPath = "http:///192.168.225.218:5000/store";
    http.begin(client, serverPath);
     http.addHeader("Content-Type", "application/x-www-form-urlencoded");
    char distance_value[10];
    itoa(distance, distance_value, 10);
    char temperature_value[10];
    sprintf(temperature_value, "%f", temperature);
    char humidity_value[10];
    sprintf(humidity_value, "%f", humidity);
    // char timestamp_value[20];
    // sprintf(timestamp_value,"%s",timestamp);
    // Serial.println(timestamp);
    // Serial.println(timestamp_value);
    // time_t mytime = time(NULL);
    // char* time_str = ctime(&mytime);
    // time_str[strlen(time_str) - 1] = '\0';  // Remove newline character

const char* timestamp_value = timestamp.c_str();
    char httpRequestData[500] = "";  // Initialize the request data as an empty string
    strcat(httpRequestData, "device_id=1&water_level=");
    strcat(httpRequestData, distance_value);
    strcat(httpRequestData, "&temperature=");
    strcat(httpRequestData, temperature_value);
    strcat(httpRequestData, "&humidity=");
    strcat(httpRequestData, humidity_value);
    strcat(httpRequestData, "&timestamp=");
    strcat(httpRequestData, timestamp_value);

    int httpResponseCode = http.POST(httpRequestData);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    http.end();  // Free the resources
  } else {
    Serial.println("WiFi disconnected");
    setupwifi();  // Attempt to reconnect to WiFi
  }
  }
void setup() {
  pinMode(LED, OUTPUT);  
Serial.begin(9600); // Starts the Serial communication
Serial.print("Setting up");
pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
pinMode(echoPin, INPUT); // Sets the echoPin as an Input
setupwifi();
timeClient.begin();
timeClient.update();

Serial.print("Setup completed at:");
Serial.print(timeClient.getFormattedTime());
}

void loop() {
// Clears the trigPin
digitalWrite(LED, HIGH);
digitalWrite(trigPin, LOW);
delayMicroseconds(2);

// Sets the trigPin on HIGH state for 10 micro seconds
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);

// Reads the echoPin, returns the sound wave travel time in microseconds
duration = pulseIn(echoPin, HIGH);

// Calculating the distance
distance= duration*0.034/2;
float humidity = dht.readHumidity();
float temperature = dht.readTemperature();
 while (isnan(humidity) || isnan(temperature) || humidity>100.0 || temperature < 16.0) {
     humidity = dht.readHumidity();
 temperature = dht.readTemperature();
 Serial.print(temperature);
 Serial.print(humidity);
 delay(300);
 }
 timeClient.update();
  // Get the Unix epoch time (seconds since 1970)
 unsigned long epochTime = timeClient.getEpochTime();
  
  // Convert epoch time to a struct tm
  struct tm *ptm = gmtime((time_t *)&epochTime);

  // Adjust for IST (UTC +5:30)
  ptm->tm_hour += 5; // Add 5 hours
  if (ptm->tm_hour >= 24) { // Handle overflow
    ptm->tm_hour -= 24; // Subtract 24 hours
    ptm->tm_mday++; // Increment day
  }
  
  // Get formatted time (HH:MM:SS)
  String formattedTime = timeClient.getFormattedTime();
  
  // Create formatted date string (YYYY/MM/DD)
  String formattedDate = String(ptm->tm_year + 1900) + "/" + 
                         String(ptm->tm_mon + 1) + "/" + 
                         String(ptm->tm_mday);
  
  // Combine date and time into a single string
  String timestamp = formattedDate + " " + formattedTime;
 Serial.print(timestamp);
Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.print(" %\t");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" *C");
// Prints the distance on the Serial Monitor
Serial.print("Distance: ");
Serial.println(distance);
callApi(distance,temperature,humidity,timestamp);
digitalWrite(LED, LOW);
delay(5000);
}

