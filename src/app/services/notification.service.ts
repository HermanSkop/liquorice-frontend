import {Inject} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

Inject({ providedIn: 'root' })
export class NotificationService{
  constructor(private snackBar: MatSnackBar) {}

  showNotification(message: string, action: string, duration: number): void {
    this.snackBar.open(message, action, {
      duration,
    });
  }
}
