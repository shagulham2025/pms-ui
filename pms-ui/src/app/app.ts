import { Component, CUSTOM_ELEMENTS_SCHEMA,  Inject,  NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ConfigurationModule } from './component/configuration/configuration.module';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ConfigurationModule
    ,MatMenuModule
    ,MatButtonModule,
    RouterModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class App {

  sidebarOpen = false;
  
  menuItems = [
    { label: 'Dashboard', icon: 'fa fa-bar-chart', route: '/home/dashboard' },
    { label: 'Appointments', icon: 'fa fa-calendar', route: '/appointment/all-appointment' },
    { label: 'Doctor', icon: 'fa fa-user-md', route: '/doctor/all-doctor' },
    { label: 'Patients', icon: 'fa fa-bed', route: '/patient/all-patient' },
    { label: 'User', icon: 'fa fa-user', route: '/configuration/users' },
    { label: 'Properties', icon: 'fa fa-building', route: '/configuration/properties' },
    { label: 'Pharmacy', icon: 'fa fa-medkit', route: '/pharmacy' }
  ];

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }
  
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout_() {
    this.router.navigateByUrl("login")
  }



}
