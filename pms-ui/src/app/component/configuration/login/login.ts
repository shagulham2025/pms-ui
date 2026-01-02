import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { NotificationService } from '../../../core/notification.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  router = inject(Router)
  private route = inject(ActivatedRoute)
  private auth = inject(AuthService)
  private notify = inject(NotificationService)

  error = '';

  login_(){
    const emailEl = (document.querySelector('input[type="email"]') as HTMLInputElement);
    const passEl = (document.querySelector('input[type="password"]') as HTMLInputElement);
    const username = emailEl?.value || '';
    const password = passEl?.value || '';
    this.error = '';
    this.auth.login(username, password).subscribe({
      next: (data) => {
        if (data) {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home/dashboard';
          this.router.navigateByUrl(returnUrl);
          } else {
          this.error = 'Invalid credentials';
          this.notify.showError(this.error, 3000);
        }
      },
      error: (err) => {
        const msg = (err && err.message) ? err.message : 'Login failed';
        this.error = msg;
        this.notify.showError(msg, 4000);
      }
    });
  }
}
