import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DeviceDataComponent } from './device-data/device-data.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NgChartsModule } from 'ng2-charts';  // <-- Importing NgChartsModule
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'details/:id', component: DeviceDataComponent }, // This is the route for pin details page
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent // Create this component separately for pin details
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    NgChartsModule,
    NgxPaginationModule ,
    DeviceDataComponent
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
