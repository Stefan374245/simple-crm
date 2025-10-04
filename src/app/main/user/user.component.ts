import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { DialogAddUserComponent } from '../user/dialog-add-user/dialog-add-user.component';
import { User } from '../../shared/models/user.class';
import { UserService } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
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
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // User-Liste aus Firebase laden
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
          console.log('Full Name:', result.getFullName());
          console.log('Age:', result.getAge());
        }).catch(error => {
          console.error('Fehler beim Speichern:', error);
        });
      }
    });
  }
}