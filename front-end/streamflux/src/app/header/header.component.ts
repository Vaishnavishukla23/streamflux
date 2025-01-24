import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  name!:string;
  constructor( private authService: AuthService){}
  ngOnInit(){
    this.name=this.authService.getname();
  }

}
