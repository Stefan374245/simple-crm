import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from '../app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from '../app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNativeDateAdapter()
  ]
}).catch(err => console.error(err));