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
      
      // ✅ Neue User-Instanz erstellen um Referenz-Probleme zu vermeiden
      this.user = new User(this.data.user.toJSON());
      
      console.log('Edit mode - loaded user:', this.user);
    }
  }

  get progressPercentage(): number {
    let filledFields = 0;
    const totalFields = 6;

    // ✅ Sichere String-Prüfung mit Optional Chaining
    if (this.user.firstName?.trim()) filledFields++;
    if (this.user.lastName?.trim()) filledFields++;
    if (this.user.birthDate) filledFields++;
    if (this.user.street?.trim()) filledFields++;
    if (this.user.zipCode?.trim()) filledFields++;
    if (this.user.city?.trim()) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  }

  get progressText(): string {
    const filled = this.getFilledFieldsCount();
    return `${filled}/6 fields completed`;
  }

  private getFilledFieldsCount(): number {
    let count = 0;
    // ✅ Sichere String-Prüfung mit Optional Chaining
    if (this.user.firstName?.trim()) count++;
    if (this.user.lastName?.trim()) count++;
    if (this.user.birthDate) count++;
    if (this.user.street?.trim()) count++;
    if (this.user.zipCode?.trim()) count++;
    if (this.user.city?.trim()) count++;
    return count;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // ✅ Sichere Validierung
    if (this.user.firstName?.trim() && this.user.lastName?.trim()) {
      this.dialogRef.close(this.user);
    }
  }
}
