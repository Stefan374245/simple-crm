import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalUsers = 0;
  recentUsers: User[] = [];
  averageAge = 0;
  usersThisMonth = 0;
  usersThisWeek = 0;
  private subscription = new Subscription();
  isLoading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    
    this.subscription.add(
      this.userService.getAllUsers().subscribe({
        next: (users) => {
          this.totalUsers = users.length;
          this.recentUsers = users.slice(-3); // Letzte 3 User
          this.calculateAverageAge(users);
          this.calculateUsersThisMonth(users);
          this.calculateUsersThisWeek(users);
          this.isLoading = false;
          console.log('Dashboard data loaded:', { 
            totalUsers: this.totalUsers, 
            recentUsers: this.recentUsers,
            averageAge: this.averageAge,
            usersThisMonth: this.usersThisMonth 
          });
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          this.isLoading = false;
        }
      })
    );
  }

  private calculateAverageAge(users: User[]): void {
    const usersWithAge = users.filter(user => user.getAge() !== null);
    if (usersWithAge.length === 0) {
      this.averageAge = 0;
      return;
    }
    
    const totalAge = usersWithAge.reduce((sum, user) => sum + (user.getAge() || 0), 0);
    this.averageAge = Math.round(totalAge / usersWithAge.length);
  }

  private calculateUsersThisMonth(users: User[]): void {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    this.usersThisMonth = users.filter(user => {
      if (!user.birthdate) return false;
      const userDate = new Date(user.birthdate);
      return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
    }).length;
  }

  private calculateUsersThisWeek(users: User[]): void {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    this.usersThisWeek = users.filter(user => {
      if (!user.birthdate) return false;
      const userDate = new Date(user.birthdate);
      return userDate >= oneWeekAgo;
    }).length;
  }

  // Hilfsmethode für bessere UX
  getUserInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  // ✅ Fehlende trackBy-Methode hinzufügen
  trackByUserId(index: number, user: User): string {
    return user.id || index.toString();
  }
}
