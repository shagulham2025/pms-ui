import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-profile',
  imports: [MatDialogModule],
  standalone: true,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  // sidebarshow = inject(Dashboard)
   constructor(private dialogRef:MatDialogRef<Profile>){
    // this.sidebarshow.checkUrl_('hide')
   }
   router = inject(Router)
   back_(){
     this.router.navigateByUrl('dashboard')
   }
   close_(){
    this.dialogRef.close()
   }
}
