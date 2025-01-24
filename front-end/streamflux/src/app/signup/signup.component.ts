


import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports:[CommonModule,FormsModule],
  standalone: true
})
export class SignupComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  name: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  onLogin() {
    const credentials = {
      user: this.username,
      pass: this.password,
      name: this.name
    };
  
    // this.http.post<any>('https://streamflux.onrender.com/api/adduser', credentials)
    this.http.post<any>('http://127.0.0.1:5000/api/adduser', credentials)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = response.message;
            alert(this.errorMessage);
            this.router.navigate(['/home']);

          }
        },
        error: () => {
          this.errorMessage = 'User already exists';
        }
      }); 
    }
}
