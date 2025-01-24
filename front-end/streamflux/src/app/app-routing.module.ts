import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceDataComponent } from './device-data/device-data.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin', component: AdminComponent , canActivate: [AuthGuard]},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'device/:id', component: DeviceDataComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
