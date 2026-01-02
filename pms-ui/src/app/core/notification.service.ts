import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snack: MatSnackBar) {}

  showError(message: string, duration = 4000) {
    this.snack.open(message, 'Close', { duration, panelClass: ['snack-error'] });
  }

  showInfo(message: string, duration = 3000) {
    this.snack.open(message, 'Close', { duration });
  }
}
