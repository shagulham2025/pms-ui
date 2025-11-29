import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  // sidebarshow = inject(Dashboard)
   constructor(){
    // this.sidebarshow.checkUrl_('hide')
   }
   router = inject(Router)
   back_(){
     this.router.navigateByUrl('dashboard')
   }
}
