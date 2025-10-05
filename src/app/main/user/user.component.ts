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
  styleUrl: './user.component.scss',
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
      this.userService.getAllUsers().subscribe((users) => {
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
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Neuer User erstellt:', result);

        this.userService
          .addUser(result)
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

  getUserInitials(user: User): string {
    return user.getInitials();
  }
}
