import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { DialogAddUserComponent } from '../user/dialog-add-user/dialog-add-user.component';
import { User } from '../../shared/models/user.class';
import { UserService } from '../../shared/services/user.service';
import { ToastService } from '../../shared/services/toast.service';
import { ConfirmDialogService } from '../../shared/services/confirm-dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private toastService: ToastService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.userService.getAllUsers().subscribe(users => {
        this.users = users;
        console.log('Users from Firebase:', users);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openUserDialog(): void {
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      width: '500px'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Neuer User erstellt:', result);
        
        // User zu Firebase hinzufügen
        this.userService.addUser(result).then(id => {
          console.log('User in Firebase gespeichert mit ID:', id);
          // ✅ Success Toast für neuen User
          this.toastService.showSuccess(
            `🎉 User "${result.getFullName()}" was successfully added!`
          );
        }).catch(error => {
          console.error('Fehler beim Speichern:', error);
          // ❌ Error Toast
          this.toastService.showError(
            '❌ Error adding user! Please try again.'
          );
        });
      }
    });
  }

  editUser(user: User): void {
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      width: '500px',
      data: { user: user, editMode: true }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && user.id) {
        console.log('User bearbeitet:', result);
        
        // User in Firebase aktualisieren
        this.userService.updateUser(user.id, result).then(() => {
          console.log('User erfolgreich aktualisiert');
          // ✅ Success Toast für Edit
          this.toastService.showSuccess(
            `✏️ User "${result.getFullName()}" was successfully updated!`
          );
        }).catch(error => {
          console.error('Fehler beim Aktualisieren:', error);
          // ❌ Error Toast
          this.toastService.showError(
            '❌ Error updating user! Please try again.'
          );
        });
      }
    });
  }

  deleteUser(user: User): void {
    if (!user.id) return;

    // Schöner Bestätigungs-Dialog
    this.confirmDialog.confirmDelete(user.getFullName()).subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteUser(user.id!).then(() => {
          console.log('User erfolgreich gelöscht');
          // ✅ Success Toast für Delete
          this.toastService.showSuccess(
            `🗑️ User "${user.getFullName()}" was successfully deleted!`
          );
        }).catch(error => {
          console.error('Fehler beim Löschen:', error);
          // ❌ Error Toast
          this.toastService.showError(
            '❌ Error deleting user! Please try again.'
          );
        });
      } else {
        // ℹ️ Info Toast wenn abgebrochen
        this.toastService.showInfo(
          `ℹ️ Delete cancelled. User "${user.getFullName()}" was not deleted.`
        );
      }
    });
  }
}