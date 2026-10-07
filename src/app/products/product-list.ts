import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from './product.service';
import { Product, SortOrder } from './product.model';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private readonly productService = inject(ProductService);

  protected readonly products = signal<Product[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(1);
  protected readonly sortOrder = signal<SortOrder | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / PAGE_SIZE)));

  constructor() {
    this.load();
  }

  protected goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) return;
    this.page.set(page);
    this.load();
  }

  protected onSortChange(value: string): void {
    this.sortOrder.set(value === 'asc' || value === 'desc' ? value : null);
    this.page.set(1);
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productService.getProducts(PAGE_SIZE, (this.page() - 1) * PAGE_SIZE, this.sortOrder()).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products. Please try again.');
        this.loading.set(false);
      },
    });
  }
}

