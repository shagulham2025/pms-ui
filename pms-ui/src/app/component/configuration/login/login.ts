import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

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

  error = '';

  async login_(){
    const emailEl = (document.querySelector('input[type="email"]') as HTMLInputElement);
    const passEl = (document.querySelector('input[type="password"]') as HTMLInputElement);
    const username = emailEl?.value || '';
    const password = passEl?.value || '';
    this.error = '';
    const ok = await this.auth.login(username, password);
    if (ok) {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home/dashboard';
      this.router.navigateByUrl(returnUrl);
    } else {
      this.error = 'Invalid credentials';
    }
  }
}
