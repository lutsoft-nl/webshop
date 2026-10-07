import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  template: `
    <header class="navbar navbar-expand bg-white border-bottom">
      <div class="container">
        <a class="navbar-brand" routerLink="/products">Everyday products</a>
        <nav class="d-flex align-items-center gap-3" aria-label="Main navigation">
          @if (auth.isLoggedIn()) {
            <button class="btn btn-outline-secondary btn-sm" type="button" (click)="auth.logout()">Log out</button>
          } @else {
            <a class="btn btn-primary btn-sm" routerLink="/login">Admin login</a>
          }
        </nav>
      </div>
    </header>
    <main class="container py-4 py-lg-5">
      <router-outlet />
    </main>
  `,
})
export class App {
  protected readonly auth = inject(AuthService);
}
