import { Injectable } from '@angular/core';
import { FlaskApiService } from './flask-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private name='';
  private admin=false;
  flaskApiService!: FlaskApiService
  constructor(flaskApiService: FlaskApiService) {}

  setAdmin(){
    this.admin=true;
  }
  isAdmin()
  {
    return this.admin;
  }
  login(username: string, password: string, success: boolean, name:string): boolean {
    // let responseObj= JSON.parse(response)
    if (success){
      this.loggedIn = true;
      this.name=name;

return true
    }
    else
    this.loggedIn=false;
  return false;
  }
  getname(): string{
    return this.name;
  }

  logout(): void {
    this.loggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }
}
