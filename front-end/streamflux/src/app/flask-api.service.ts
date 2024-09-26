import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlaskApiService {

  private apiUrl = 'http://127.0.0.1:5000/'; // Replace with your Flask API URL

  constructor(private http: HttpClient) { }

  getData(deviceId: string,path:string ): Observable<any> {
    const params = { device_id: deviceId };
    // Send the deviceId as a query parameter in the GET request
    return this.http.post<any>(this.apiUrl+path,params);
  }
}
