import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../auth.service';
// import "leaflet/dist/images/marker-shadow.png";  
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  name!:string;
   defaultIcon =  L.icon({
    iconUrl: 'assets/marker.png', 
    
    iconSize: [30, 30],
    iconAnchor: [2, 2],
    popupAnchor: [0, -2]
  });

  map!: L.Map;
  
  // Sample pins with IDs and coordinates (Latitude, Longitude)
  pins = [
    { id: 1, name: 'Location 1', lat: 12.8230, lng: 80.0444 },  // Sample India coordinates
    { id: 2, name: 'Location 2', lat: 19.0760, lng: 72.8777 },
    { id: 3, name: 'Location 3', lat: 28.7041, lng: 77.1025 }
  ];

  constructor(private router: Router,    private authService: AuthService
  ) { }

  ngOnInit() {
   
    // this.map = L.map("map").setView([46.879966, -121.726909], 7);

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//           attribution:
//             '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     }).addTo(this.map);
}
  ngAfterViewInit(): void {
    this.initMap();
    this.name=this.authService.getname();
    alert("Hi "+this.name);
    // Call this method to force the map to resize correctly
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0); // Small timeout to ensure all DOM elements are rendered
    
    this.addPins();
  }

  initMap(): void {
    this.map = L.map('map').setView([20.5937, 78.9629], 5); // Center map on India

    // Load and display tile layer (OpenStreetMap here)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  addPins(): void {


    this.pins.forEach(pin => {
      const marker = L.marker([pin.lat, pin.lng], {icon:this.defaultIcon}).addTo(this.map)
        .bindPopup(pin.name)
        .on('click', () => this.onPinClick(pin.id));
    });
  }

  onPinClick(id: number): void {
    console.log(id);
    this.router.navigate(['/device', id]); // Navigate to the details page with pin ID
  }
}


