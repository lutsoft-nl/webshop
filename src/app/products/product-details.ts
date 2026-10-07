import { Component, OnInit, inject, input, numberAttribute, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ProductUpdate } from './product.model';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product-details',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  private readonly productService = inject(ProductService);
  protected readonly auth = inject(AuthService);

  // Bound from the :id route param.
  readonly id = input.required({ transform: numberAttribute });

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly editing = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly imageUrl = signal<string | null>(null);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
  });

  private saved: ProductUpdate | null = null;

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productService.getProduct(this.id()).subscribe({
      next: (product) => {
        this.imageUrl.set(product.thumbnail);
        const { title, description, price } = product;
        this.showSaved({ title, description, price });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load product.');
        this.loading.set(false);
      },
    });
  }

  protected edit(): void {
    this.editing.set(true);
    this.form.enable();
  }

  protected cancel(): void {
    if (this.saved) this.showSaved(this.saved);
    this.error.set(null);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    this.productService.updateProduct(this.id(), this.form.getRawValue()).subscribe({
      next: ({ title, description, price }) => {
        this.showSaved({ title, description, price });
        this.saving.set(false);
      },
      error: () => {
        this.error.set('Failed to save product. Please try again.');
        this.saving.set(false);
      },
    });
  }

  // Resets the form to the given values and leaves edit mode.
  private showSaved(values: ProductUpdate): void {
    this.saved = values;
    this.form.reset(values);
    this.form.disable();
    this.editing.set(false);
  }
}
