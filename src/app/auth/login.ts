import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/products">&larr; Back to products</a>
    <h1>Admin login</h1>
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <label>
        Username
        <input type="text" formControlName="username" autocomplete="username" />
      </label>
      <label>
        Password
        <input type="password" formControlName="password" autocomplete="current-password" />
      </label>
      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }
      <button type="submit" [disabled]="loading()">{{ loading() ? 'Logging in...' : 'Log in' }}</button>
    </form>
  `,
  styles: `
    form { display: flex; flex-direction: column; gap: 0.75rem; max-width: 20rem; }
    label { display: flex; flex-direction: column; gap: 0.25rem; }
    .error { color: #b00020; }
  `,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Username and password are required.');
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const { username, password } = this.form.getRawValue();
    this.auth.login(username, password).subscribe({
      next: () => this.router.navigateByUrl('/products'),
      error: () => {
        this.error.set('Invalid username or password.');
        this.loading.set(false);
      },
    });
  }
}
