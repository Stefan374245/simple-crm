import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration: number = 4000): void {
    this.showToast(message, 'success-toast', duration);
  }

  showError(message: string, duration: number = 5000): void {
    this.showToast(message, 'error-toast', duration);
  }

  showInfo(message: string, duration: number = 4000): void {
    this.showToast(message, 'info-toast', duration);
  }

  showWarning(message: string, duration: number = 4000): void {
    this.showToast(message, 'warning-toast', duration);
  }

  private showToast(message: string, panelClass: string, duration: number): void {
    const config: MatSnackBarConfig = {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass]
    };

    this.snackBar.open(message, 'Close', config);
  }
}
