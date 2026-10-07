import { Routes } from '@angular/router';
import { ProductDetails } from './products/product-details';
import { ProductList } from './products/product-list';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetails },
];
