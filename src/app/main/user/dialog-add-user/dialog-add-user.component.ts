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
    if (this.data?.editMode && this.data?.user) {
      this.editMode = true;
      this.dialogTitle = 'Edit User';
      
      // ✅ Debug: Schauen wir uns die Original-Daten an
      console.log('Original user data:', this.data.user);
      console.log('ZipCode original:', this.data.user.zipCode, 'Type:', typeof this.data.user.zipCode);
      
      this.user = new User(this.data.user);
      
      // ✅ Debug: Nach der Konvertierung
      console.log('Converted user:', this.user);
      console.log('ZipCode converted:', this.user.zipCode, 'Type:', typeof this.user.zipCode);
      
      // ✅ FALLBACK: Alle String-Felder explizit zu Strings konvertieren
      this.sanitizeUserData();
    }
  }

  // ✅ Alle Properties zu sauberen Strings konvertieren
  private sanitizeUserData(): void {
    this.user.firstName = this.toSafeString(this.user.firstName);
    this.user.lastName = this.toSafeString(this.user.lastName);
    this.user.street = this.toSafeString(this.user.street);
    this.user.zipCode = this.toSafeString(this.user.zipCode);
    this.user.city = this.toSafeString(this.user.city);
    
    console.log('After sanitization:', {
      firstName: `"${this.user.firstName}" (${typeof this.user.firstName})`,
      lastName: `"${this.user.lastName}" (${typeof this.user.lastName})`,
      street: `"${this.user.street}" (${typeof this.user.street})`,
      zipCode: `"${this.user.zipCode}" (${typeof this.user.zipCode})`,
      city: `"${this.user.city}" (${typeof this.user.city})`
    });
  }

  // ✅ Sichere String-Konvertierung
  private toSafeString(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    // Wenn es bereits ein String ist, zurückgeben
    if (typeof value === 'string') {
      return value;
    }
    
    // Alles andere zu String konvertieren
    return String(value);
  }

  // ✅ Sichere String-Validierung
  private hasValidString(value: any): boolean {
    // Erst zu String konvertieren, dann prüfen
    const stringValue = this.toSafeString(value);
    return stringValue.trim().length > 0;
  }

  get progressPercentage(): number {
    let filledFields = 0;
    const totalFields = 6;

    if (this.hasValidString(this.user.firstName)) filledFields++;
    if (this.hasValidString(this.user.lastName)) filledFields++;
    if (this.user.birthDate) filledFields++;
    if (this.hasValidString(this.user.street)) filledFields++;
    if (this.hasValidString(this.user.zipCode)) filledFields++;
    if (this.hasValidString(this.user.city)) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  }

  get progressText(): string {
    const filled = this.getFilledFieldsCount();
    return `${filled}/6 fields completed`;
  }

  private getFilledFieldsCount(): number {
    let count = 0;
    if (this.hasValidString(this.user.firstName)) count++;
    if (this.hasValidString(this.user.lastName)) count++;
    if (this.user.birthDate) count++;
    if (this.hasValidString(this.user.street)) count++;
    if (this.hasValidString(this.user.zipCode)) count++;
    if (this.hasValidString(this.user.city)) count++;
    return count;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.hasValidString(this.user.firstName) && this.hasValidString(this.user.lastName)) {
      console.log('Saving user:', this.user);
      this.dialogRef.close(this.user);
    }
  }
}
