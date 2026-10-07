import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsResponse, SortOrder } from './product.model';

const API_URL = 'https://dummyjson.com/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(limit: number, skip: number, order: SortOrder | null): Observable<ProductsResponse> {
    let params = new HttpParams()
      .set('limit', limit)
      .set('skip', skip)
      .set('select', 'title,price,thumbnail');
    if (order) {
      params = params.set('sortBy', 'price').set('order', order);
    }
    return this.http.get<ProductsResponse>(API_URL, { params });
  }
}

