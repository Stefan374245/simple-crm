import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../../shared/services/user.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { User } from '../../../shared/models/user.class';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { Subscription } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatMenuModule
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit, OnDestroy {
  user: User | null = null;
  isLoading = true;
  error = false;
  showMoreDetails = false; // Neue Property für Dropdown-Status
  private subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastService: ToastService,
    private confirmDialog: ConfirmDialogService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadUserDetails(): void {
    this.isLoading = true;
    this.error = false;

    const userId = this.route.snapshot.paramMap.get('id');
    if (!userId) {
      this.error = true;
      this.isLoading = false;
      return;
    }

    this.subscription.add(
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.user = user;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading user details:', error);
          this.error = true;
          this.isLoading = false;
        }
      })
    );
  }

  goBack(): void {
    this.router.navigate(['/user']);
  }

  editUser(): void {
    if (!this.user) return;

    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      width: '500px',
      data: { user: this.user, editMode: true },
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.user?.id) {
        console.log('User bearbeitet:', result);

        this.userService
          .updateUser(this.user.id, result)
          .then(() => {
            console.log('User erfolgreich aktualisiert');
            this.toastService.showSuccess(
              `User "${result.getFullName()}" successfully updated!`
            );
            this.loadUserDetails();
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

  deleteUser(): void {
    if (!this.user?.id) return;

    this.confirmDialog
      .confirmDelete(this.user.getFullName())
      .subscribe((confirmed) => {
        if (confirmed && this.user?.id) {
          this.userService
            .deleteUser(this.user.id)
            .then(() => {
              console.log('User erfolgreich gelöscht');
              this.toastService.showSuccess(
                `User "${this.user!.getFullName()}" successfully deleted!`
              );
              this.router.navigate(['/user']);
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

  getUserInitials(): string {
    return this.user?.getInitials() || 'UN';
  }

  getStatusColor(): string {
    if (!this.user) return 'grey';
    return this.user.isFullyValid() ? 'primary' : 'warn';
  }

  getStatusText(): string {
    if (!this.user) return 'Unknown';
    return this.user.isFullyValid() ? 'Complete Profile' : 'Incomplete Profile';
  }

  /**
   * Toggles the visibility of detailed user information
   */
  toggleMoreDetails(): void {
    this.showMoreDetails = !this.showMoreDetails;
  }
}