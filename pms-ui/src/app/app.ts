import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ConfigurationModule } from './component/configuration/configuration.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    CommonModule,
    RouterOutlet,
    RouterLink,
    ConfigurationModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class App {
  isSidebarOpen = true;
  isMobile = false;

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

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  isRouteActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }


  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    console.log('Logging out...');
  }


}
