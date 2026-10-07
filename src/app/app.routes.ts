import { Routes } from '@angular/router';
import { Login } from './auth/login';
import { ProductDetails } from './products/product-details';
import { ProductList } from './products/product-list';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'login', component: Login },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetails },
];
