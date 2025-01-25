import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports:[CommonModule,FormsModule],
  standalone: true
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  name: string= ''; 
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  onLogin() {
    const credentials = {
      username: this.username,
      password: this.password
    };
    if(this.username=="admin" && this.password=="admin")
    {
        this.authService.login(this.username, this.password, true, 'admin');
        this.authService.setAdmin();
        this.router.navigate(['/admin']);

    }
    else{
    this.http.post<any>('https://streamflux.onrender.com/api/login', credentials)
    // this.http.post<any>('http://127.0.0.1:5000/api/login', credentials)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.authService.login(this.username, this.password,response.success, response.name); // Update the service
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = response.message;
          }
        },
        error: () => {
          this.errorMessage = 'Invalid credentials.';
        }
      });
  }
}
}
