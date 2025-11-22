import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, NO_ERRORS_SCHEMA, signal, ViewChild, AfterViewInit } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { ConfigurationModule } from './component/configuration/configuration.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
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
export class App implements AfterViewInit {
  isSidebarOpen = true;
  isMobile = false;
  private lastToggle = 0;

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

  @ViewChild('drawer') drawer?: MatSidenav;

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      // sync drawer state with current screen size
      if (this.drawer) {
        if (this.isMobile) {
          this.drawer.close();
          this.isSidebarOpen = false;
        } else {
          this.drawer.open();
          this.isSidebarOpen = true;
        }
      }
    }
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  ngAfterViewInit(): void {
    // ensure drawer initial state matches screen size
    if (this.drawer) {
      if (this.isMobile) {
        this.drawer.close();
        this.isSidebarOpen = false;
      } else {
        this.drawer.open();
        this.isSidebarOpen = true;
      }
    }

    // close the sidenav on navigation for mobile devices
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd && this.isMobile) {
        this.drawer?.close();
        this.isSidebarOpen = false;
      }
    });
  }

  isRouteActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }


  checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
      // on mobile devices keep sidebar closed by default, open on larger screens
      this.isSidebarOpen = !this.isMobile;
    }
  }

  toggleSidebar() {
    const now = Date.now();
    // ignore double clicks/taps within 300ms
    if (now - this.lastToggle < 300) {
      this.lastToggle = now;
      return;
    }
    this.lastToggle = now;

    if (this.isMobile) {
      if (this.drawer) {
        this.drawer.toggle();
        // MatSidenav.opened is a getter; ensure our flag follows
        // set a small timeout to allow MatSidenav to update its opened state
        setTimeout(() => (this.isSidebarOpen = !!this.drawer?.opened), 0);
      } else {
        this.isSidebarOpen = !this.isSidebarOpen;
      }
    } else {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }

  onMenuItemClick() {
    if (this.isMobile) {
      this.drawer?.close();
      this.isSidebarOpen = false;
    }
  }

  logout() {
    console.log('Logging out...');
  }


}
