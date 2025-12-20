import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'pms_token';

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(username: string, password: string): Promise<boolean> {
    // NOTE: Replace this with a real HTTP request to your auth backend.
    return new Promise((resolve) => {
      // simple mock: accept any non-empty credentials; create a fake token
      setTimeout(() => {
        if (username && password) {
          localStorage.setItem(this.TOKEN_KEY, 'FAKE_TOKEN_' + Date.now());
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
