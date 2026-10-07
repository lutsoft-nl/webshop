import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { ProductDetails } from './pages/product-details/product-details';
import { ProductList } from './pages/product-list/product-list';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'login', component: Login },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetails },
];
