import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-root',
  template: `
    <main>
      <nav>
        @if (auth.isLoggedIn()) {
          <button type="button" (click)="auth.logout()">Log out</button>
        } @else {
          <a routerLink="/login">Admin login</a>
        }
      </nav>
      <router-outlet />
    </main>
  `,
  styles: `
    main { max-width: 960px; margin: 0 auto; padding: 1rem; font-family: sans-serif; }
    nav { text-align: right; }
  `,
})
export class App {
  protected readonly auth = inject(AuthService);
}
