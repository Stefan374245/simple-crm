import { Routes } from '@angular/router';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { UserComponent } from './main/user/user.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'user', component: UserComponent },
];
