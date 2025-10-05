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

/**
 * Component for managing users in the CRM system
 * Provides functionality to view, add, edit, and delete users
 */
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
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit, OnDestroy {
  /** Array of all users to display */
  users: User[] = [];
  /** Subscription handler for managing observable subscriptions */
  private subscription: Subscription = new Subscription();

  /**
   * Creates an instance of UserComponent
   * @param dialog - Material Dialog service for opening dialogs
   * @param userService - Service for user CRUD operations
   * @param toastService - Service for displaying toast notifications
   * @param confirmDialog - Service for confirmation dialogs
   */
  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private toastService: ToastService,
    private confirmDialog: ConfirmDialogService
  ) {}

  /**
   * Angular lifecycle hook - initializes component and loads users
   */
  ngOnInit(): void {
    this.subscription.add(
      this.userService.getAllUsers().subscribe((users) => {
        this.users = users;
        console.log('Users from Firebase:', users);
      })
    );
  }

  /**
   * Angular lifecycle hook - cleans up subscriptions to prevent memory leaks
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Opens the dialog for adding a new user
   * Handles the creation process and displays success/error messages
   */
  openUserDialog(): void {
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Neuer User erstellt:', result);

        this.userService
          .createUser(result)
          .then((id) => {
            console.log('User in Firebase gespeichert mit ID:', id);
            this.toastService.showSuccess(
              `User "${result.getFullName()}" successfully added!`
            );
          })
          .catch((error) => {
            console.error('Fehler beim Speichern:', error);
            this.toastService.showError('Error adding user! Please try again.');
          });
      }
    });
  }

  /**
   * Opens the dialog for editing an existing user
   * @param user - The user object to edit
   */
  editUser(user: User): void {
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      width: '500px',
      data: { user: user, editMode: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && user.id) {
        console.log('User bearbeitet:', result);

        this.userService
          .updateUser(user.id, result)
          .then(() => {
            console.log('User erfolgreich aktualisiert');
            this.toastService.showSuccess(
              `User "${result.getFullName()}" successfully updated!`
            );
          })
          .catch((error) => {
            console.error('Fehler beim Aktualisieren:', error);
            this.toastService.showError(
              'Error updating user! Please try again.'
            );
          });
      }
    });
  }

  /**
   * Deletes a user after confirmation
   * Shows confirmation dialog and handles the deletion process
   * @param user - The user object to delete
   */
  deleteUser(user: User): void {
    if (!user.id) return;

    this.confirmDialog
      .confirmDelete(user.getFullName())
      .subscribe((confirmed) => {
        if (confirmed) {
          this.userService
            .deleteUser(user.id!)
            .then(() => {
              console.log('User erfolgreich gelöscht');
              this.toastService.showSuccess(
                `User "${user.getFullName()}" successfully deleted!`
              );
            })
            .catch((error) => {
              console.error('Fehler beim Löschen:', error);
              this.toastService.showError(
                'Error deleting user! Please try again.'
              );
            });
        }
      });
  }

  /**
   * Gets the initials for a user to display in the UI
   * @param user - The user object to get initials from
   * @returns Two-character initials string
   */
  getUserInitials(user: User): string {
    return user.getInitials();
  }
}
