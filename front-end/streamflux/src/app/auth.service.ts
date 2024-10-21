import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor() {}

  login(username: string, password: string): boolean {
    // You would normally make a request to your API here
    // Simulating a login with hardcoded values
    if (username === 'Vaishnavi' && password === 'vaish') {
      this.loggedIn = true;
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }
}
