import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ConfigurationModule } from './component/configuration/configuration.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ConfigurationModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class App {
  protected readonly title = signal('pms-ui');

  menuItems = [
  { label: 'Dashboard', icon: 'fa fa-bar-chart', route: '/home/dashboard' },
  { label: 'Appointments', icon: 'fa fa-calendar', route: '/appointment/all-appointment' },
  { label: 'Doctor', icon: 'fa fa-user-md', route: '/doctor/all-doctor' },
  { label: 'Patients', icon: 'fa fa-bed', route: '/patient/all-patient' },
  { label: 'User', icon: 'fa fa-user', route: '/configuration/users' },
  { label: 'Properties', icon: 'fa fa-building', route: '/configuration/properties' },
  { label: 'Pharmacy', icon: 'fa fa-medkit', route: '/pharmacy' }
];

  isSidebarVisible = true;

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
