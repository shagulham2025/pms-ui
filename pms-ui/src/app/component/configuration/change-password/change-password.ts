import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
     constructor(private dialogRef:MatDialogRef<ChangePassword>){}
  router = inject(Router)
  back_() {
    this.router.navigateByUrl('dashboard')
  }
  old_show = false;
  new_show = false;
  confirm_show = false;

  toggle(type: number) {
    if (type == 1) {
      this.old_show = !this.old_show;
    } else if (type == 2) {
      this.new_show = !this.new_show;
    } else {
      this.confirm_show = !this.confirm_show;
    }
  }
   close_(){
    this.dialogRef.close()
   }
}
