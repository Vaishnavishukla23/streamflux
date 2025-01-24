import { Component } from '@angular/core';
import { FlaskApiService } from '../flask-api.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  sending!:boolean;
  users!: any;
  alert!:any;
  errorMessage!: String;
  constructor(
    private flaskApiService: FlaskApiService,
    private router: Router,
    private authService: AuthService
  ){};
      ngOnInit():void{
        this.sending=false;
        if(!this.authService.isAdmin())
        this.router.navigate(['/home']);

  this.flaskApiService.getUsers().subscribe(
    response => {
      this.users = response;  // Assign live data
      console.log(this.users)
    },
    error => {
      console.error('Error fetching data', error);
      this.errorMessage = 'An error occurred while fetching User data. Please try again.';
    }
  );
}
sendAlert():void{
  this.sending=true;
  const confirmation= confirm("Send Email?");
  // const confirmation=false;
  if(confirmation)

  this.flaskApiService.sendAlertAPI().subscribe(
    response => {
      
      this.alert = response;  // Assign live data
      this.sending=false;

    },
    error => {
      if(error.status==200)
        this.alert="Alert sent successfully";
      else
      this.alert='Error sending alert';
      console.log(this.alert, error.status);
      alert(this.alert);
      this.sending=false;

    }
  );

  this.sending=false;

}

}
