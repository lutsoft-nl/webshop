import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <a class="link-secondary text-decoration-none" routerLink="/products">&larr; Back to shop</a>
    <div class="row justify-content-center mt-3">
      <div class="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
        <section class="bg-white border rounded-3 p-4 p-sm-5">
          <p class="text-uppercase small fw-semibold text-secondary mb-1">Store administration</p>
          <h1 class="h2 mb-4">Admin login</h1>
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="mb-3">
              <label class="form-label" for="username">Username</label>
              <input id="username" class="form-control" type="text" formControlName="username" autocomplete="username" />
            </div>
            <div class="mb-3">
              <label class="form-label" for="password">Password</label>
              <input id="password" class="form-control" type="password" formControlName="password" autocomplete="current-password" />
            </div>
            @if (error()) {
              <div class="alert alert-danger py-2" role="alert">{{ error() }}</div>
            }
            <button class="btn btn-primary w-100" type="submit" [disabled]="loading()">
              @if (loading()) {
                <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
              }
              {{ loading() ? 'Logging in...' : 'Log in' }}
            </button>
          </form>
        </section>
      </div>
    </div>
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
