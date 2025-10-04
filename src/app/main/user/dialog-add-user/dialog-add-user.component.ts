import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../shared/models/user.class';

@Component({
  selector: 'app-dialog-add-user',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    FormsModule,
    CommonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss'
})
export class DialogAddUserComponent implements OnInit {
  user = new User();
  editMode = false;
  dialogTitle = 'Add User';

  constructor(
    public dialogRef: MatDialogRef<DialogAddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // Prüfen ob Edit-Modus
    if (this.data?.editMode && this.data?.user) {
      this.editMode = true;
      this.dialogTitle = 'Edit User';
      
      // ✅ User-Objekt direkt verwenden, nicht neu erstellen
      this.user = this.data.user;
      
      console.log('Edit mode - loaded user:', this.user);
    }
  }

  get progressPercentage(): number {
    let filledFields = 0;
    const totalFields = 6;

    if (this.user.firstName && this.user.firstName.trim()) filledFields++;
    if (this.user.lastName && this.user.lastName.trim()) filledFields++;
    if (this.user.birthdate) filledFields++;
    if (this.user.street && this.user.street.trim()) filledFields++;
    if (this.user.zipCode && this.user.zipCode.trim()) filledFields++;
    if (this.user.city && this.user.city.trim()) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  }

  get progressText(): string {
    const filled = this.getFilledFieldsCount();
    return `${filled}/6 fields completed`;
  }

  private getFilledFieldsCount(): number {
    let count = 0;
    if (this.user.firstName && this.user.firstName.trim()) count++;
    if (this.user.lastName && this.user.lastName.trim()) count++;
    if (this.user.birthdate) count++;
    if (this.user.street && this.user.street.trim()) count++;
    if (this.user.zipCode && this.user.zipCode.trim()) count++;
    if (this.user.city && this.user.city.trim()) count++;
    return count;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // ✅ Direktes Speichern ohne Confirm Dialog
  onSave(): void {
    if (this.user.firstName && this.user.lastName) {
      this.dialogRef.close(this.user);
    }
  }
}
