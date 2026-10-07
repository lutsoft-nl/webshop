import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsResponse } from './product.model';

const API_URL = 'https://dummyjson.com/products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(limit: number, skip: number): Observable<ProductsResponse> {
    const params = new HttpParams()
      .set('limit', limit)
      .set('skip', skip)
      .set('select', 'title,price,thumbnail');
    return this.http.get<ProductsResponse>(API_URL, { params });
  }
}
