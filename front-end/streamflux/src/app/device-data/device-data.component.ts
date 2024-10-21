import { Component, OnInit } from '@angular/core';
import { FlaskApiService } from '../flask-api.service';
import { ActivatedRoute } from '@angular/router';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin);
import 'chartjs-plugin-crosshair';


@Component({
  selector: 'app-device-data',
  templateUrl: './device-data.component.html',
  styleUrls: ['./device-data.component.css'],
  standalone: true,
  imports: [CommonModule, NgChartsModule]
})
export class DeviceDataComponent implements OnInit {
  deviceId: string = 'ABC123';  // Temporary device ID for testing
  data: any[] = [];  // Array to store the historical response data
  errorMessage: string | null = null;
  isUsingMockData: boolean = true;  // Flag to toggle between mock and real data
  showTable = true; // Toggle between table and graph
  live_data: any = {};  // Store live data
  public scatterChartType: any = 'line';
  // Mock Data for testing purposes (70-80 entries)
  mockData = Array.from({ length: 75 }, (_, i) => ({
    device_id: `ABC123`,
    water_level: Math.floor(Math.random() * 50) + 20,  // Random water level between 20 and 70
    timestamp: new Date().getTime() + i * 60000  // Simulate timestamp data (every minute)
  }));
  
  // Data for the chart
  public chartData: ChartData = {
    labels: [],  // Dynamically updated
    datasets: [
      {
        label: 'Water Level Over Time',
        data: [],  // Dynamically updated
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(255,99,132,0.5)',
        fill: true,
      }
    ]
  };
  
  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {reverse:true},
      y: { beginAtZero: true }
    },
    maintainAspectRatio:false,
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
          
        }
      }
    }
  };

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
    this.getLiveData();  // Start fetching live data
  }

  // Switch between table and graph views
  toggleView(): void {
    this.showTable = !this.showTable;
    if (!this.showTable) {
      this.updateChartData();  // Update chart when switching to graph
    }
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
    this.updateChartData();  // Update chart with mock data
    this.errorMessage = null;  // Clear any error messages
  }

  // Fetch the live data and add it to the graph and table
  getLiveData(): void {
    this.flaskApiService.getData(this.deviceId, "live").subscribe(
      response => {
        this.live_data = response;  // Assign live data
        this.errorMessage = null;  // Clear any previous errors
        this.updateChartData();  // Update the chart with the live data
      },
      error => {
        console.error('Error fetching data', error);
        this.errorMessage = 'An error occurred while fetching live data. Please try again.';
      }
    );
  }

  // Function to fetch real data from the API
  getData(): void {
    this.flaskApiService.getData(this.deviceId, "retrieve").subscribe(
      response => {
        this.data = response;  // Assign response to data array
        this.errorMessage = null;  // Clear any previous errors
        this.updateChartData();  // Update chart with real data
      },
      error => {
        console.error('Error fetching data', error);
        this.errorMessage = 'An error occurred while fetching historical data. Please try again.';
      }
    );
  }

  // Function to update chart data from table data and live data
  updateChartData(): void {
    // Combine historical and live data for the graph
    const historicalLabels = this.data.map(item => new Date(item.timestamp).toLocaleTimeString());
    const historicalWaterLevels = this.data.map(item => item.water_level);

    // Add the live data to the labels and dataset if available
    const liveLabel = this.live_data.timestamp ? new Date(this.live_data.timestamp).toLocaleTimeString() : null;
    const liveWaterLevel = this.live_data.water_level;

    // Update the chart
    this.chartData.labels = [...historicalLabels, liveLabel].filter(Boolean);  // Remove null values
    this.chartData.datasets[0].data = [...historicalWaterLevels, liveWaterLevel].filter(Boolean);  // Remove null values
  }
}
