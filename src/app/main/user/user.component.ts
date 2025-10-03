import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogAddUserComponent } from '../user/dialog-add-user/dialog-add-user.component';


@Component({
  selector: 'app-user',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  constructor(private dialog: MatDialog) {}

  openUserDialog() {
    const dialogRef = this.dialog.open(DialogAddUserComponent, {
      width: '500px'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Neuer User erstellt:', result);
        // Hier können Sie später die User-Liste aktualisieren
      }
    });
  }
}