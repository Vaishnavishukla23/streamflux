import { Component, OnInit } from '@angular/core';
import { FlaskApiService } from '../flask-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-device-data',
  templateUrl: './device-data.component.html',
  styleUrls: ['./device-data.component.css']
})
export class DeviceDataComponent implements OnInit {
  deviceId: string = 'ABC123';  // Temporary device ID for testing
  data: any[] = [];  // Array to store the response data
  errorMessage: string | null = null;
  isUsingMockData: boolean = true;  // Flag to toggle between mock and real data

  // Mock Data for testing purposes (70-80 entries)
  mockData = Array.from({ length: 75 }, (_, i) => ({
    device_id: `ABC123`,
    water_level: Math.floor(Math.random() * 50) + 20  // Random water level between 20 and 70
  }));

  constructor(
    private flaskApiService: FlaskApiService, 
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.deviceId = params['id'];
    });

    // Initially load mock data
    this.loadMockData();
  }

  // Switch between mock data and real data
  toggleData(): void {
    if (this.isUsingMockData) {
      this.getData();  // Fetch real data from API
    } else {
      this.loadMockData();  // Load mock data
    }
    this.isUsingMockData = !this.isUsingMockData;  // Toggle the flag
  }

  // Function to load mock data
  loadMockData(): void {
    this.data = this.mockData;
    this.errorMessage = null;  // Clear any error messages
  }

  // Function to fetch real data from the API
  getData(): void {
    this.flaskApiService.getData(this.deviceId).subscribe(
      response => {
        this.data = response;  // Assign response to data array
        this.errorMessage = null;  // Clear any previous errors
      },
      error => {
        console.error('Error fetching data', error);
        this.errorMessage = 'An error occurred while fetching data. Please try again.';
      }
    );
  }
}
